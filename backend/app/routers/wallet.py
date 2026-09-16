import uuid
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.dependencies import get_current_user
from app.models.user import User
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.models.escrow import Escrow
from app.schemas.wallet import (
    WalletResponse,
    TopUpRequest,
    TopUpResponse,
    WithdrawRequest,
    LedgerLogResponse,
    MidtransConfigResponse,
    SyncStatusResponse,
)
from app.schemas.escrow import EscrowResponse
from app.services.midtrans import (
    create_snap_transaction,
    verify_midtrans_signature,
    check_transaction_status,
)


router = APIRouter(prefix="/wallet", tags=["Wallet & Escrow"])


@router.get("/config", response_model=MidtransConfigResponse)
def get_midtrans_config():
    """Mendapatkan Konfigurasi Publik Midtrans untuk Frontend"""
    is_configured = bool(
        settings.MIDTRANS_SERVER_KEY
        and not settings.MIDTRANS_SERVER_KEY.startswith("your_")
    )
    return MidtransConfigResponse(
        client_key=settings.MIDTRANS_CLIENT_KEY or "",
        is_production=bool(settings.MIDTRANS_IS_PRODUCTION),
        is_configured=is_configured,
    )


@router.get("/me", response_model=WalletResponse)
def get_my_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Informasi Saldo Dompet yang Sedang Login"""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


@router.get("/history", response_model=List[LedgerLogResponse])
def get_wallet_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Seluruh Riwayat Mutasi Saldo (Audit Trail Immutable)"""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan"
        )

    logs = (
        db.query(LedgerLog)
        .filter(LedgerLog.wallet_id == wallet.id)
        .order_by(LedgerLog.created_at.desc())
        .all()
    )
    return logs


@router.post("/topup", response_model=TopUpResponse)
def request_topup(
    body: TopUpRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Memulai Proses Top-Up Saldo Melalui Midtrans Snap.
    Format Order ID: TOPUP-<user_id_hex>-<unique_hash>
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    order_id = f"TOPUP-{current_user.id.hex}-{uuid.uuid4().hex[:6].upper()}"
    gross_amount = int(body.nominal)

    customer_name = (
        getattr(current_user, "nama_lengkap", None)
        or getattr(current_user, "nama_usaha", None)
        or current_user.email.split("@")[0]
    )

    try:
        snap_res = create_snap_transaction(
            order_id=order_id,
            gross_amount=gross_amount,
            customer_email=current_user.email,
            customer_name=customer_name,
            item_name=f"Top-Up Saldo Makarya - {customer_name}",
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghubungi Midtrans Payment Gateway: {str(e)}",
        )

    return TopUpResponse(
        order_id=order_id,
        snap_token=snap_res.get("token", ""),
        redirect_url=snap_res.get("redirect_url", ""),
        nominal=body.nominal,
        client_key=settings.MIDTRANS_CLIENT_KEY,
        is_production=bool(settings.MIDTRANS_IS_PRODUCTION),
    )


@router.post("/webhook/midtrans")
async def midtrans_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook Endpoint untuk Midtrans (Idempotent & Anti-Fraud Signature Verification).
    Dipanggil otomatis oleh server Midtrans ketika user menyelesaikan pembayaran.
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload"
        )

    order_id = payload.get("order_id", "")
    status_code = str(payload.get("status_code", ""))
    gross_amount = str(payload.get("gross_amount", ""))
    signature_key = payload.get("signature_key", "")
    transaction_status = payload.get("transaction_status", "")
    fraud_status = payload.get("fraud_status", "accept")

    # 1. 🛡️ Security Check: Verifikasi Signature SHA512
    if not verify_midtrans_signature(
        order_id, status_code, gross_amount, signature_key
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signature Midtrans tidak valid / upaya fraud terdeteksi",
        )

    # 2. 🛡️ Idempotency Check: Pastikan Order ID ini belum pernah diproses sebelumnya
    existing_log = (
        db.query(LedgerLog)
        .filter(
            (LedgerLog.referensi_gateway == order_id)
            | (LedgerLog.keterangan.ilike(f"%{order_id}%"))
        )
        .first()
    )
    if existing_log:
        return {
            "status": "success",
            "message": "Transaksi ini sudah pernah diproses sebelumnya (Idempotent)",
        }

    # 3. Proses jika status pembayaran berhasil (Settlement atau Capture)
    if transaction_status in ["settlement", "capture"] and fraud_status == "accept":
        # Format Order ID: TOPUP-<user_id_hex>-<hash>
        parts = order_id.split("-")
        target_user_id = None
        if len(parts) >= 2:
            try:
                target_user_id = uuid.UUID(hex=parts[1])
            except Exception:
                target_user_id = None

        if not target_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Format Order ID tidak valid",
            )

        wallet = (
            db.query(Wallet)
            .filter(Wallet.user_id == target_user_id)
            .with_for_update()
            .first()
        )
        if not wallet:
            wallet = Wallet(user_id=target_user_id, saldo_aktif=0.0, saldo_escrow=0.0)
            db.add(wallet)
            db.flush()

        nominal = Decimal(gross_amount.split(".")[0]) if gross_amount else Decimal(0)
        if nominal > 0:
            wallet.saldo_aktif += nominal

            log = LedgerLog(
                wallet_id=wallet.id,
                tipe=TransactionType.TOPUP,
                nominal=nominal,
                referensi_gateway=order_id,
                keterangan=f"Top-Up berhasil via Midtrans (Order ID: {order_id})",
            )
            db.add(log)
            db.commit()

    return {"status": "success", "order_id": order_id}


@router.post("/sync-status/{order_id}", response_model=SyncStatusResponse)
def sync_midtrans_status(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Sinkronisasi Status Transaksi Pembayaran Langsung ke Midtrans (Core API).
    Sangat bermanfaat saat local development / instant update setelah Snap popup selesai.
    """
    parts = order_id.split("-")
    if len(parts) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Format Order ID tidak valid"
        )

    try:
        order_user_id = uuid.UUID(hex=parts[1])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Format UUID pengguna tidak valid"
        )

    # Hanya pemilik transaksi atau ADMIN yang boleh sinkronisasi
    if order_user_id != current_user.id and current_user.role.value != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk mensinkronkan transaksi ini",
        )

    # 1. Tanya status langsung ke Midtrans Core API
    try:
        midtrans_status = check_transaction_status(order_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gagal menghubungi server Midtrans: {str(e)}",
        )

    tx_status = midtrans_status.get("transaction_status", "")
    fraud_status = midtrans_status.get("fraud_status", "accept")
    gross_amount = midtrans_status.get("gross_amount", "0")
    nominal = Decimal(str(gross_amount).split(".")[0])

    wallet = (
        db.query(Wallet)
        .filter(Wallet.user_id == current_user.id)
        .with_for_update()
        .first()
    )
    if not wallet:
        wallet = Wallet(user_id=current_user.id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(wallet)
        db.flush()

    is_settled = tx_status in ["settlement", "capture"] and fraud_status == "accept"

    if is_settled:
        # Cek apakah sudah pernah dikreditkan
        existing_log = (
            db.query(LedgerLog)
            .filter(
                (LedgerLog.referensi_gateway == order_id)
                | (LedgerLog.keterangan.ilike(f"%{order_id}%"))
            )
            .first()
        )

        if not existing_log and nominal > 0:
            wallet.saldo_aktif += nominal
            log = LedgerLog(
                wallet_id=wallet.id,
                tipe=TransactionType.TOPUP,
                nominal=nominal,
                referensi_gateway=order_id,
                keterangan=f"Top-Up berhasil via Midtrans (Order ID: {order_id})",
            )
            db.add(log)
            db.commit()
            db.refresh(wallet)

            return SyncStatusResponse(
                order_id=order_id,
                transaction_status=tx_status,
                is_settled=True,
                credited_amount=nominal,
                saldo_aktif_sekarang=wallet.saldo_aktif,
                message=f"Pembayaran berhasil! Saldo Rp {nominal:,.0f} telah ditambahkan ke akun Anda.",
            )

        return SyncStatusResponse(
            order_id=order_id,
            transaction_status=tx_status,
            is_settled=True,
            credited_amount=None,
            saldo_aktif_sekarang=wallet.saldo_aktif,
            message="Pembayaran sudah diverifikasi dan saldo sudah tercatat sebelumnya.",
        )

    return SyncStatusResponse(
        order_id=order_id,
        transaction_status=tx_status or "pending",
        is_settled=False,
        credited_amount=None,
        saldo_aktif_sekarang=wallet.saldo_aktif,
        message=f"Status transaksi saat ini: {tx_status or 'menunggu pembayaran'}.",
    )


@router.post("/withdraw", response_model=WalletResponse)
def withdraw_balance(
    body: WithdrawRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Penarikan Saldo Aktif ke Rekening Bank (Mahasiswa / UMKM).
    """
    wallet = (
        db.query(Wallet)
        .filter(Wallet.user_id == current_user.id)
        .with_for_update()
        .first()
    )
    if not wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Dompet tidak ditemukan"
        )

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


@router.get("/escrow/project/{project_id}", response_model=Optional[EscrowResponse])
def get_project_escrow(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Detail Kontrak Escrow untuk Proyek Tertentu"""
    escrow = (
        db.query(Escrow)
        .filter(Escrow.project_id == project_id)
        .order_by(Escrow.created_at.desc())
        .first()
    )
    if not escrow:
        return None
    if (
        escrow.client_id != current_user.id
        and escrow.talent_id != current_user.id
        and current_user.role.value != "ADMIN"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin melihat data escrow ini",
        )
    return escrow
