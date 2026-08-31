def test_login_invalid_credentials(client):
    """
    Memverifikasi login dengan akun yang tidak ada / password salah menghasilkan respons 400 / 401.
    """
    response = client.post(
        "/v1/auth/login",
        json={"email": "nonexistent@user.com", "password": "wrongpassword999"}
    )
    assert response.status_code in [400, 401, 404]

def test_register_mhs_rejects_non_campus_email(client):
    """
    Memverifikasi pendaftaran mahasiswa menolak email umum (non .ac.id / .edu).
    """
    response = client.post(
        "/v1/auth/register/mahasiswa",
        json={
            "nama_lengkap": "Testing User",
            "email": "testing@gmail.com",
            "password": "password123",
            "prodi_id": 1
        }
    )
    assert response.status_code in [400, 422]