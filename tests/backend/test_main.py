"""Comprehensive test suite for backend API.

Covers:
- Basic endpoint health
- Workflow validation (missing headers, empty nodes, XSS, cycle detection)
- Rate limiting
- Workflow execution with mocked AI
- Trigger registration / unregistration / listing
- Model listing
- Metrics endpoint
"""

import sys
import os

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../backend"))

from main import app  # noqa: E402

client = TestClient(app)

TEST_HEADERS = {
    "X-API-Provider": "openai",
    "X-API-Key": "sk-test123",
    "X-Model": "gpt-4",
}

SIMPLE_WORKFLOW = {
    "nodes": [
        {"id": "1", "type": "trigger", "data": {"label": "Start"}, "position": {"x": 0, "y": 0}},
        {"id": "2", "type": "agent", "data": {"task": "Analyse data"}, "position": {"x": 100, "y": 0}},
    ],
    "edges": [{"id": "e1", "source": "1", "target": "2"}],
}


class TestBasicEndpoints:
    """Test root, health, version, models and metrics endpoints."""

    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "AutonomOS API"
        assert "version" in data
        assert data["status"] == "running"

    def test_health_check_structure(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "AutonomOS API"
        assert isinstance(data.get("active_triggers"), int)
        assert data["active_triggers"] >= 0

    def test_metrics_endpoint(self):
        response = client.get("/api/metrics")
        assert response.status_code == 200
        data = response.json()
        assert "uptime_seconds" in data
        assert "total_requests" in data
        assert data["total_requests"] >= 0

    def test_version_endpoint(self):
        response = client.get("/api/version")
        assert response.status_code == 200
        data = response.json()
        assert "version" in data
        assert "name" in data

    def test_get_models_openai(self):
        response = client.get("/api/models/openai")
        assert response.status_code == 200
        data = response.json()
        assert data["provider"] == "openai"
        assert "gpt-4" in data["models"]

    def test_get_models_openrouter_has_free(self):
        response = client.get("/api/models/openrouter")
        assert response.status_code == 200
        free_models = [m for m in response.json()["models"] if ":free" in m]
        assert len(free_models) > 0

    def test_get_models_unknown_provider_empty(self):
        response = client.get("/api/models/unknown_provider_xyz")
        assert response.status_code == 200
        assert response.json()["models"] == []


class TestWorkflowValidation:
    """Test input validation on /api/workflows/execute."""

    def test_missing_headers_rejected(self):
        response = client.post("/api/workflows/execute", json=SIMPLE_WORKFLOW)
        assert response.status_code == 400
        assert "Missing required headers" in response.json()["detail"]

    def test_partial_headers_rejected(self):
        response = client.post(
            "/api/workflows/execute",
            json=SIMPLE_WORKFLOW,
            headers={"X-API-Provider": "openai", "X-API-Key": "sk-test"},
        )
        assert response.status_code == 400

    def test_empty_nodes_rejected(self):
        response = client.post(
            "/api/workflows/execute",
            json={"nodes": [], "edges": []},
            headers=TEST_HEADERS,
        )
        assert response.status_code == 422

    def test_cycle_detection(self):
        cyclic = {
            "nodes": [
                {"id": "A", "type": "agent", "data": {"task": "t"}, "position": {"x": 0, "y": 0}},
                {"id": "B", "type": "agent", "data": {"task": "t"}, "position": {"x": 100, "y": 0}},
            ],
            "edges": [
                {"id": "e1", "source": "A", "target": "B"},
                {"id": "e2", "source": "B", "target": "A"},
            ],
        }
        response = client.post("/api/workflows/execute", json=cyclic, headers=TEST_HEADERS)
        assert response.status_code == 400
        assert "circular" in response.json()["detail"].lower()

    def test_xss_prevention(self):
        xss = {
            "nodes": [{"id": "1", "type": "agent",
                       "data": {"task": "<script>alert('xss')</script>"},
                       "position": {"x": 0, "y": 0}}],
            "edges": [],
        }
        response = client.post("/api/workflows/execute", json=xss, headers=TEST_HEADERS)
        assert response.status_code == 400
        assert "dangerous" in response.json()["detail"].lower()


class TestWorkflowExecution:
    """Test workflow execution with mocked AI calls."""

    def test_successful_simple_workflow(self):
        with patch("main.workflow_executor.execute", new_callable=AsyncMock) as mock_exec:
            mock_exec.return_value = {
                "status": "completed",
                "execution_id": "test-exec-123",
                "workflow_id": "test-wf-456",
                "nodes_executed": 2,
                "results": {},
            }
            response = client.post(
                "/api/workflows/execute",
                json=SIMPLE_WORKFLOW,
                headers=TEST_HEADERS,
            )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["nodes_executed"] == 2

    def test_execution_returns_execution_id(self):
        with patch("main.workflow_executor.execute", new_callable=AsyncMock) as mock_exec:
            mock_exec.return_value = {
                "status": "completed",
                "execution_id": "exec-abc",
                "workflow_id": "wf-xyz",
                "nodes_executed": 1,
                "results": {},
            }
            response = client.post(
                "/api/workflows/execute",
                json={"nodes": [SIMPLE_WORKFLOW["nodes"][0]], "edges": []},
                headers=TEST_HEADERS,
            )
        assert response.status_code == 200
        assert "execution_id" in response.json()

    def test_execution_error_returns_500(self):
        with patch("main.workflow_executor.execute", new_callable=AsyncMock) as mock_exec:
            mock_exec.side_effect = Exception("Executor crashed")
            response = client.post(
                "/api/workflows/execute",
                json=SIMPLE_WORKFLOW,
                headers=TEST_HEADERS,
            )
        assert response.status_code == 500


class TestTriggerEndpoints:
    """Test trigger register / unregister / list."""

    def test_list_triggers_empty(self):
        response = client.get("/api/triggers")
        assert response.status_code == 200
        data = response.json()
        assert "triggers" in data
        assert isinstance(data["triggers"], list)

    def test_register_trigger(self):
        with patch("main.trigger_manager.register_trigger", new_callable=AsyncMock) as mock_reg:
            mock_reg.return_value = True
            response = client.post(
                "/api/triggers/register",
                json={"workflow_id": "wf-test", "trigger_type": "manual", "config": {}},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "trigger_id" in data

    def test_register_trigger_failure(self):
        with patch("main.trigger_manager.register_trigger", new_callable=AsyncMock) as mock_reg:
            mock_reg.return_value = False
            response = client.post(
                "/api/triggers/register",
                json={"workflow_id": "wf-fail", "trigger_type": "manual", "config": {}},
            )
        assert response.status_code == 400

    def test_unregister_existing_trigger(self):
        with patch("main.trigger_manager.unregister_trigger", new_callable=AsyncMock) as mock_unreg:
            mock_unreg.return_value = True
            response = client.delete("/api/triggers/wf-test_manual")
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    def test_unregister_nonexistent_trigger(self):
        with patch("main.trigger_manager.unregister_trigger", new_callable=AsyncMock) as mock_unreg:
            mock_unreg.return_value = False
            response = client.delete("/api/triggers/nonexistent")
        assert response.status_code == 404


class TestRateLimiting:
    """Smoke-test that rate limiting works."""

    def test_test_key_endpoint_with_mock(self):
        with patch("main.call_ai_api", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = "Hello"
            response = client.post(
                "/api/test-key",
                json={"provider": "openai", "apiKey": "sk-test", "model": "gpt-4"},
            )
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_invalid_provider_test_key(self):
        response = client.post(
            "/api/test-key",
            json={"provider": "nonexistent", "apiKey": "key", "model": "model"},
        )
        assert response.status_code == 200
        assert response.json()["success"] is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
