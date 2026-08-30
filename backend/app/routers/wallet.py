import uuid
from typing import List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.schemas.wallet import (
    WalletResponse,
    TopUpRequest,
    TopUpResponse,
    WithdrawRequest,
    LedgerLogResponse,
)
from app.services.midtrans import create_snap_transaction, verify_midtrans_signature

router = APIRouter(prefix="/wallet", tags=["Wallet & Escrow"])


@router.get("/me", response_model=WalletResponse)
def get_my_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Informasi Saldo Dompet yang Sedang Login"""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan")
    return wallet


@router.get("/history", response_model=List[LedgerLogResponse])
def get_wallet_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Seluruh Riwayat Mutasi Saldo (Audit Trail Immutable)"""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan")

    logs = db.query(LedgerLog).filter(LedgerLog.wallet_id == wallet.id).order_by(LedgerLog.created_at.desc()).all()
    return logs


@router.post("/topup", response_model=TopUpResponse)
def request_topup(
    body: TopUpRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Memulai Proses Top-Up Saldo Melalui Midtrans Snap.
    Format Order ID: TOPUP-<user_id_short>-<timestamp>
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan")

    order_id = f"TOPUP-{str(current_user.id)[:8]}-{uuid.uuid4().hex[:8].upper()}"
    gross_amount = int(body.nominal)

    try:
        snap_res = create_snap_transaction(
            order_id=order_id,
            gross_amount=gross_amount,
            customer_email=current_user.email,
            customer_name=current_user.email.split("@")[0],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghubungi Midtrans Payment Gateway: {str(e)}",
        )

    return TopUpResponse(
        order_id=order_id,
        snap_token=snap_res["token"],
        redirect_url=snap_res["redirect_url"],
        nominal=body.nominal,
    )


@router.post("/webhook/midtrans")
async def midtrans_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook Endpoint untuk Midtrans (Idempotent & Anti-Fraud Signature Verification).
    Dipanggil otomatis oleh server Midtrans ketika user selesai membayar.
    """
    payload = await request.json()

    order_id = payload.get("order_id")
    status_code = payload.get("status_code")
    gross_amount = payload.get("gross_amount")
    signature_key = payload.get("signature_key")
    transaction_status = payload.get("transaction_status")
    fraud_status = payload.get("fraud_status", "accept")

    # 1. 🛡️ Security Check: Verifikasi Signature SHA512
    if not verify_midtrans_signature(order_id, status_code, gross_amount, signature_key):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signature Midtrans tidak valid / upaya fraud terdeteksi",
        )

    # 2. 🛡️ Idempotency Check: Pastikan Order ID ini belum pernah diproses sebelumnya
    existing_log = db.query(LedgerLog).filter(LedgerLog.keterangan.ilike(f"%{order_id}%")).first()
    if existing_log:
        return {"status": "success", "message": "Transaksi ini sudah pernah diproses sebelumnya (Idempotent)"}

    # 3. Proses jika status pembayaran berhasil (Settlement atau Capture)
    if transaction_status in ["settlement", "capture"] and fraud_status == "accept":
        # Ekstrak user_id_short dari order_id: TOPUP-<user_id_short>-<hash>
        parts = order_id.split("-")
        if len(parts) >= 2:
            user_prefix = parts[1]
            user = db.query(User).filter(User.id.cast(db.bind.dialect.type_descriptor(db.query(User).column_descriptions[0]['type'])).ilike(f"{user_prefix}%")).first() if False else None

        # Cari wallet penerima
        # Cara paling aman: ambil dari prefix UUID user
        nominal = Decimal(gross_amount)
        wallet = None

        # Cari user berdasarkan prefix ID
        all_users = db.query(User).all()
        for u in all_users:
            if str(u.id).startswith(parts[1]):
                wallet = db.query(Wallet).filter(Wallet.user_id == u.id).with_for_update().first()
                break

        if wallet:
            # Tambahkan Saldo Aktif
            wallet.saldo_aktif += nominal

            # Catat ke Ledger Log
            log = LedgerLog(
                wallet_id=wallet.id,
                tipe=TransactionType.TOPUP,
                nominal=nominal,
                keterangan=f"Top-Up berhasil via Midtrans (Order ID: {order_id})",
            )
            db.add(log)
            db.commit()

    return {"status": "success", "order_id": order_id}


@router.post("/withdraw", response_model=WalletResponse)
def withdraw_balance(
    body: WithdrawRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Penarikan Saldo Aktif ke Rekening Bank (Mahasiswa / UMKM).
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).with_for_update().first()
    if not wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan")

    if wallet.saldo_aktif < body.nominal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo aktif Anda (Rp {wallet.saldo_aktif:,.0f}) tidak mencukupi untuk penarikan sebesar Rp {body.nominal:,.0f}",
        )

    # 1. Kurangi Saldo Aktif
    wallet.saldo_aktif -= body.nominal

    # 2. Catat ke Ledger Log
    log = LedgerLog(
        wallet_id=wallet.id,
        tipe=TransactionType.WITHDRAW,
        nominal=body.nominal,
        keterangan=f"Penarikan dana ke {body.nama_bank} No. Rek: {body.nomor_rekening} a.n {body.nama_pemilik}",
    )
    db.add(log)
    db.commit()
    db.refresh(wallet)

    return wallet