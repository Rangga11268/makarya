def test_browse_projects_public(client):
    """
    Memverifikasi endpoint publik browse proyek (/v1/projects) dapat diakses.
    """
    response = client.get("/v1/projects?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        first_project = data[0]
        assert "id" in first_project
        assert "judul" in first_project
        assert "budget_max" in first_project

def test_browse_projects_filter_category(client):
    """
    Memverifikasi filter kategori proyek berjalan dengan benar.
    """
    response = client.get("/v1/projects?kategori=DESIGN")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for p in data:
        assert p.get("kategori") in ["DESIGN", "DESAIN"]