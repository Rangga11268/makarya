import hashlib
import logging
from typing import Dict, Any, Optional
import midtransclient
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_snap_client() -> midtransclient.Snap:
    """
    Mengembalikan instance Midtrans Snap Client yang terkonfigurasi.
    """
    if not settings.MIDTRANS_SERVER_KEY:
        raise ValueError(
            "MIDTRANS_SERVER_KEY belum dikonfigurasi di file .env. Silakan periksa file .env Anda."
        )
    return midtransclient.Snap(
        is_production=bool(settings.MIDTRANS_IS_PRODUCTION),
        server_key=settings.MIDTRANS_SERVER_KEY,
        client_key=settings.MIDTRANS_CLIENT_KEY,
    )


def get_core_api_client() -> midtransclient.CoreApi:
    """
    Mengembalikan instance Midtrans Core API Client untuk pengecekan status transaksi.
    """
    if not settings.MIDTRANS_SERVER_KEY:
        raise ValueError(
            "MIDTRANS_SERVER_KEY belum dikonfigurasi di file .env. Silakan periksa file .env Anda."
        )
    return midtransclient.CoreApi(
        is_production=bool(settings.MIDTRANS_IS_PRODUCTION),
        server_key=settings.MIDTRANS_SERVER_KEY,
        client_key=settings.MIDTRANS_CLIENT_KEY,
    )


def create_snap_transaction(
    order_id: str,
    gross_amount: int,
    customer_email: str,
    customer_name: str,
    item_name: str = "Deposit Saldo Dompet Makarya",
) -> Dict[str, Any]:
    """
    Meminta Snap Token dari Midtrans untuk menampilkan antarmuka pembayaran pop-up / redirect.
    """
    snap = get_snap_client()

    first_name = customer_name.strip() if customer_name else "Pengguna"
    email = customer_email.strip() if customer_email else "user@makarya.id"

    param = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": int(gross_amount),
        },
        "item_details": [
            {
                "id": order_id,
                "price": int(gross_amount),
                "quantity": 1,
                "name": item_name[:50],
            }
        ],
        "customer_details": {
            "first_name": first_name,
            "email": email,
        },
        "credit_card": {
            "secure": True,
        },
    }

    try:
        transaction = snap.create_transaction(param)
        return transaction
    except Exception as e:
        logger.error(f"Error creating Midtrans transaction for {order_id}: {str(e)}")
        raise


def check_transaction_status(order_id: str) -> Dict[str, Any]:
    """
    Mengecek status transaksi secara langsung ke server Midtrans (Core API).
    Berguna untuk verifikasi instan dari frontend atau pengecekan manual.
    """
    core_api = get_core_api_client()
    try:
        status_res = core_api.transactions.status(order_id)
        return status_res
    except Exception as e:
        logger.error(f"Error checking status for {order_id}: {str(e)}")
        raise


def verify_midtrans_signature(
    order_id: str,
    status_code: str,
    gross_amount: str,
    signature_key: str,
) -> bool:
    """
    Memverifikasi keaslian webhook dari Midtrans menggunakan SHA512 Checksum:
    SHA512(order_id + status_code + gross_amount + ServerKey)
    """
    if not signature_key or not settings.MIDTRANS_SERVER_KEY:
        return False

    raw_str = f"{order_id}{status_code}{gross_amount}{settings.MIDTRANS_SERVER_KEY}"
    expected_hash = hashlib.sha512(raw_str.encode("utf-8")).hexdigest()
    return expected_hash == signature_key