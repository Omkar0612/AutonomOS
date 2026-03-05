"""Test validation utilities."""
import pytest
from fastapi import HTTPException
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from validators import (
    sanitize_html,
    validate_workflow_node,
    detect_workflow_cycles,
    validate_workflow_structure
)

class TestSanitization:
    """Test HTML sanitization."""
    
    def test_remove_script_tags(self):
        input_text = "Hello <script>alert('xss')</script> World"
        result = sanitize_html(input_text)
        assert "<script>" not in result
        assert "alert" not in result
        assert "Hello" in result
        assert "World" in result
    
    def test_escape_html_entities(self):
        input_text = "<div>Test</div>"
        result = sanitize_html(input_text)
        assert "&lt;" in result or "<div>" not in result
    
    def test_normal_text_unchanged(self):
        input_text = "This is normal text"
        result = sanitize_html(input_text)
        assert "This is normal text" in result

class TestCycleDetection:
    """Test cycle detection in workflows."""
    
    def test_no_cycle_linear(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "C"}
        ]
        assert detect_workflow_cycles(nodes, edges) == False
    
    def test_simple_cycle(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "A"}
        ]
        assert detect_workflow_cycles(nodes, edges) == True
    
    def test_self_loop(self):
        nodes = [{"id": "A"}]
        edges = [{"source": "A", "target": "A"}]
        assert detect_workflow_cycles(nodes, edges) == True
    
    def test_complex_cycle(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}, {"id": "D"}]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "C"},
            {"source": "C", "target": "D"},
            {"source": "D", "target": "B"}  # Cycle: B -> C -> D -> B
        ]
        assert detect_workflow_cycles(nodes, edges) == True
    
    def test_empty_workflow(self):
        nodes = []
        edges = []
        assert detect_workflow_cycles(nodes, edges) == False

class TestWorkflowStructureValidation:
    """Test complete workflow structure validation."""
    
    def test_empty_workflow_raises_error(self):
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_structure([], [])
        assert exc_info.value.status_code == 400
        assert "at least one node" in str(exc_info.value.detail)
    
    def test_cycle_raises_error(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [
            {"source": "A", "target": "B"},
            {"source": "B", "target": "A"}
        ]
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_structure(nodes, edges)
        assert exc_info.value.status_code == 400
        assert "circular" in str(exc_info.value.detail).lower()
    
    def test_invalid_edge_source(self):
        nodes = [{"id": "A"}]
        edges = [{"source": "B", "target": "A"}]  # B doesn't exist
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_structure(nodes, edges)
        assert exc_info.value.status_code == 400
        assert "non-existent" in str(exc_info.value.detail).lower()
    
    def test_invalid_edge_target(self):
        nodes = [{"id": "A"}]
        edges = [{"source": "A", "target": "B"}]  # B doesn't exist
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_structure(nodes, edges)
        assert exc_info.value.status_code == 400
    
    def test_valid_workflow_passes(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"source": "A", "target": "B"}]
        # Should not raise
        validate_workflow_structure(nodes, edges)

class TestNodeValidation:
    """Test individual node validation."""
    
    def test_missing_type_raises_error(self):
        with pytest.raises(HTTPException):
            validate_workflow_node({"id": "1"})
    
    def test_agent_node_missing_task(self):
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_node({
                "type": "agent",
                "data": {}
            })
        assert "task" in str(exc_info.value.detail).lower()
    
    def test_agent_node_empty_task(self):
        with pytest.raises(HTTPException):
            validate_workflow_node({
                "type": "agent",
                "data": {"task": "   "}
            })
    
    def test_task_too_long(self):
        with pytest.raises(HTTPException) as exc_info:
            validate_workflow_node({
                "type": "agent",
                "data": {"task": "a" * 6000}
            })
        assert "too long" in str(exc_info.value.detail).lower()
    
    def test_xss_detection(self):
        dangerous_patterns = [
            "<script>alert('xss')</script>",
            "javascript:void(0)",
            "<iframe src='evil.com'></iframe>",
            "<div onclick='alert(1)'>Click</div>"
        ]
        
        for pattern in dangerous_patterns:
            with pytest.raises(HTTPException) as exc_info:
                validate_workflow_node({
                    "type": "agent",
                    "data": {"task": pattern}
                })
            assert "dangerous" in str(exc_info.value.detail).lower()
    
    def test_valid_agent_node(self):
        # Should not raise
        validate_workflow_node({
            "type": "agent",
            "data": {"task": "This is a valid task"}
        })

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
