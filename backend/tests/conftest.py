import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture(scope="session")
def client():
    """
    TestClient fixture using FastAPI's TestClient powered by HTTPX.
    """
    with TestClient(app) as test_client:
        yield test_client