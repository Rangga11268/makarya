def test_root_health_check(client):
    """
    Test 1: Memverifikasi endpoint root '/' merespons status 200 dan 'healthy'.
    """
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app" in data

def test_docs_accessible(client):
    """
    Test 2: Memverifikasi Swagger UI OpenAPI Documentation (/docs) dapat diakses.
    """
    response = client.get("/docs")
    assert response.status_code == 200