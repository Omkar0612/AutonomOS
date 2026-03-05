"""Comprehensive test suite for backend API (header-based auth)."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from main import app

client = TestClient(app)

# Test credentials
TEST_HEADERS = {
    "X-API-Provider": "openai",
    "X-API-Key": "sk-test123",
    "X-Model": "gpt-4"
}

class TestBasicEndpoints:
    """Test basic API endpoints."""
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "AutonomOS API"
        assert data["version"] == "2.0.0"
    
    def test_health_check(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "healthy",
            "service": "AutonomOS API"
        }
    
    def test_get_models(self):
        response = client.get("/api/models/openai")
        assert response.status_code == 200
        data = response.json()
        assert data["provider"] == "openai"
        assert "gpt-4" in data["models"]

class TestWorkflowValidation:
    """Test workflow validation logic."""
    
    def test_workflow_without_headers_rejected(self):
        response = client.post("/api/workflows/execute", json={
            "nodes": [{"id": "1", "type": "trigger", "data": {}, "position": {"x": 0, "y": 0}}],
            "edges": []
        })
        assert response.status_code == 400
        assert "Missing required headers" in response.json()["detail"]
    
    def test_empty_workflow_rejected(self):
        response = client.post(
            "/api/workflows/execute",
            json={"nodes": [], "edges": []},
            headers=TEST_HEADERS
        )
        assert response.status_code == 422
    
    def test_cycle_detection(self):
        response = client.post(
            "/api/workflows/execute",
            json={
                "nodes": [
                    {"id": "A", "type": "agent", "data": {"task": "test"}, "position": {"x": 0, "y": 0}},
                    {"id": "B", "type": "agent", "data": {"task": "test"}, "position": {"x": 100, "y": 0}}
                ],
                "edges": [
                    {"id": "e1", "source": "A", "target": "B"},
                    {"id": "e2", "source": "B", "target": "A"}
                ]
            },
            headers=TEST_HEADERS
        )
        assert response.status_code == 400
        assert "circular" in response.json()["detail"].lower()
    
    def test_xss_prevention(self):
        response = client.post(
            "/api/workflows/execute",
            json={
                "nodes": [{
                    "id": "1",
                    "type": "agent",
                    "data": {"task": "<script>alert('xss')</script>"},
                    "position": {"x": 0, "y": 0}
                }],
                "edges": []
            },
            headers=TEST_HEADERS
        )
        assert response.status_code == 400
        assert "dangerous" in response.json()["detail"].lower()

class TestRateLimiting:
    """Test rate limiting functionality."""
    
    def test_test_key_rate_limit(self):
        for i in range(4):
            response = client.post("/api/test-key", json={
                "provider": "openai",
                "apiKey": "sk-test",
                "model": "gpt-4"
            })
            if i < 3:
                assert response.status_code in [200, 500]
            else:
                assert response.status_code == 429

@pytest.mark.asyncio
class TestWorkflowExecution:
    """Test workflow execution with mocked AI calls."""
    
    @patch('main.call_ai_api', new_callable=AsyncMock)
    async def test_successful_workflow_execution(self, mock_ai_call):
        mock_ai_call.return_value = "Test response from AI"
        
        response = client.post(
            "/api/workflows/execute",
            json={
                "nodes": [
                    {"id": "1", "type": "trigger", "data": {"label": "Start"}, "position": {"x": 0, "y": 0}},
                    {"id": "2", "type": "agent", "data": {"task": "Process data"}, "position": {"x": 100, "y": 0}}
                ],
                "edges": [{"id": "e1", "source": "1", "target": "2"}]
            },
            headers=TEST_HEADERS
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["nodes_executed"] == 2

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
