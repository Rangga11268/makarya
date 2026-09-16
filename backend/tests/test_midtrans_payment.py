import hashlib
import uuid
from app.services.midtrans import verify_midtrans_signature
from app.core.config import settings


def test_midtrans_signature_verification():
    """
    Memverifikasi bahwa algoritma SHA512 signature Midtrans berfungsi dengan benar.
    Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
    """
    order_id = "TOPUP-a1b2c3d4e5f6-123456"
    status_code = "200"
    gross_amount = "500000.00"
    server_key = settings.MIDTRANS_SERVER_KEY or "dummy_server_key"

    raw_str = f"{order_id}{status_code}{gross_amount}{settings.MIDTRANS_SERVER_KEY}"
    expected_hash = hashlib.sha512(raw_str.encode("utf-8")).hexdigest()

    # Valid signature
    assert verify_midtrans_signature(order_id, status_code, gross_amount, expected_hash) is True

    # Tampered / Fake signature
    tampered_hash = hashlib.sha512(b"invalid_signature_data").hexdigest()
    assert verify_midtrans_signature(order_id, status_code, gross_amount, tampered_hash) is False


def test_order_id_user_hex_parsing():
    """
    Memastikan order_id yang dibuat dari UUID hex dapat diparse kembali dengan presisi tanpa kehilangan data.
    """
    original_uuid = uuid.uuid4()
    order_id = f"TOPUP-{original_uuid.hex}-{uuid.uuid4().hex[:6].upper()}"

    parts = order_id.split("-")
    assert parts[0] == "TOPUP"
    parsed_uuid = uuid.UUID(hex=parts[1])
    assert parsed_uuid == original_uuid
