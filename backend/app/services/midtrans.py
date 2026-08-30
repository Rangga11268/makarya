import hashlib
import midtransclient
from app.core.config import settings

# inisialisasi midtrans client
snap = midtransclient.Snap(
    is_production=False,
    server_key=settings.MIDTRANS_SERVER_KEY,
    client_key=settings.MIDTRANS_CLIENT_KEY
)

def create_snap_transaction(order_id: str, gross_amount: int, customer_email: str, customer_name: str) -> dict:
    """
    Meminta Snap Token dari Midtrans untuk menampilkan antarmuka pembayaran.
    """
    param = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": gross_amount
        },
        "customer_details": {
            "first_name": customer_name,
            "email": customer_email
        },
        "credit_card": {
            "secure": True
        }
    }
    transaction = snap.create_transaction(param)
    return transaction

def verify_midtrans_signature(order_id: str, status_code: str, gross_amount: str, signature_key: str) -> bool:
    """
    Memverifikasi keaslian webhook dari Midtrans menggunakan SHA512 Checksum:
    SHA512(order_id + status_code + gross_amount + ServerKey)
    """

    raw_str = f"{order_id}{status_code}{gross_amount}{settings.MIDTRANS_SERVER_KEY}"
    expected_hash = hashlib.sha512(raw_str.encode('utf-8')).hexdigest()
    return expected_hash == signature_key

    