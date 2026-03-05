"""Comprehensive test suite for backend API."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from main import app
from auth import create_access_token, store_user_credentials, UserCredentials

client = TestClient(app)

# Test data
TEST_USER_ID = "test_user_123"
TEST_CREDENTIALS = {
    "provider": "openai",
    "apiKey": "sk-test123",
    "model": "gpt-4"
}

class TestBasicEndpoints:
    """Test basic API endpoints."""
    
    def test_root_endpoint(self):
        """Test root endpoint returns correct information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "AutonomOS API"
        assert data["version"] == "2.0.0"
        assert data["security"] == "enabled"
    
    def test_health_check(self):
        """Test health check endpoint."""
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "healthy",
            "service": "AutonomOS API"
        }
    
    def test_get_models(self):
        """Test models endpoint returns provider models."""
        response = client.get("/api/models/openai")
        assert response.status_code == 200
        data = response.json()
        assert data["provider"] == "openai"
        assert "gpt-4" in data["models"]

class TestAuthentication:
    """Test authentication and authorization."""
    
    def test_login_success(self):
        """Test successful login returns JWT token."""
        response = client.post("/api/auth/login", json={
            "user_id": TEST_USER_ID,
            **TEST_CREDENTIALS
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] == 1800
    
    def test_workflow_execution_without_auth(self):
        """Test workflow execution fails without authentication."""
        response = client.post("/api/workflows/execute", json={
            "nodes": [{"id": "1", "type": "trigger", "data": {}, "position": {"x": 0, "y": 0}}],
            "edges": []
        })
        assert response.status_code == 403  # No Authorization header
    
    def test_workflow_execution_with_invalid_token(self):
        """Test workflow execution fails with invalid token."""
        response = client.post(
            "/api/workflows/execute",
            json={
                "nodes": [{"id": "1", "type": "trigger", "data": {}, "position": {"x": 0, "y": 0}}],
                "edges": []
            },
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401

class TestWorkflowValidation:
    """Test workflow validation logic."""
    
    def test_empty_workflow_rejected(self):
        """Test that empty workflows are rejected."""
        # First login to get token
        login_response = client.post("/api/auth/login", json={
            "user_id": TEST_USER_ID,
            **TEST_CREDENTIALS
        })
        token = login_response.json()["access_token"]
        
        response = client.post(
            "/api/workflows/execute",
            json={"nodes": [], "edges": []},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_cycle_detection(self):
        """Test that circular workflows are rejected."""
        login_response = client.post("/api/auth/login", json={
            "user_id": TEST_USER_ID,
            "provider": "openai",
            "apiKey": "sk-test",
            "model": "gpt-4"
        })
        token = login_response.json()["access_token"]
        
        # Create circular workflow: A -> B -> A
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
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 400
        assert "circular" in response.json()["detail"].lower()
    
    def test_xss_prevention(self):
        """Test that XSS attempts are blocked."""
        login_response = client.post("/api/auth/login", json={
            "user_id": TEST_USER_ID,
            **TEST_CREDENTIALS
        })
        token = login_response.json()["access_token"]
        
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
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 400
        assert "dangerous" in response.json()["detail"].lower()

class TestRateLimiting:
    """Test rate limiting functionality."""
    
    def test_test_key_rate_limit(self):
        """Test that API key testing is rate limited."""
        # Make 4 requests (limit is 3/minute)
        for i in range(4):
            response = client.post("/api/test-key", json=TEST_CREDENTIALS)
            if i < 3:
                assert response.status_code in [200, 500]  # May fail due to mock
            else:
                assert response.status_code == 429  # Rate limited
                assert "rate limit" in response.json()["error"].lower()

@pytest.mark.asyncio
class TestWorkflowExecution:
    """Test workflow execution with mocked AI calls."""
    
    @patch('main.call_ai_api', new_callable=AsyncMock)
    async def test_successful_workflow_execution(self, mock_ai_call):
        """Test successful workflow execution end-to-end."""
        mock_ai_call.return_value = "Test response from AI"
        
        # Login
        login_response = client.post("/api/auth/login", json={
            "user_id": TEST_USER_ID,
            **TEST_CREDENTIALS
        })
        token = login_response.json()["access_token"]
        
        # Execute workflow
        response = client.post(
            "/api/workflows/execute",
            json={
                "nodes": [
                    {"id": "1", "type": "trigger", "data": {"label": "Start"}, "position": {"x": 0, "y": 0}},
                    {"id": "2", "type": "agent", "data": {"task": "Process data"}, "position": {"x": 100, "y": 0}}
                ],
                "edges": [{"id": "e1", "source": "1", "target": "2"}]
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["nodes_executed"] == 2
        assert "1" in data["results"]
        assert "2" in data["results"]

class TestInputSanitization:
    """Test input sanitization and validation."""
    
    def test_html_sanitization(self):
        """Test that HTML is sanitized from inputs."""
        from validators import sanitize_html
        
        dangerous_input = "<script>alert('xss')</script>Hello"
        sanitized = sanitize_html(dangerous_input)
        
        assert "<script>" not in sanitized
        assert "Hello" in sanitized
    
    def test_cycle_detection_utility(self):
        """Test cycle detection utility function."""
        from validators import detect_workflow_cycles
        
        # No cycle
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"source": "A", "target": "B"}]
        assert detect_workflow_cycles(nodes, edges) == False
        
        # With cycle
        edges_with_cycle = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "A"}
        ]
        assert detect_workflow_cycles(nodes, edges_with_cycle) == True

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
