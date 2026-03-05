"""Input validation and sanitization utilities."""
import re
from typing import Dict, Any
from fastapi import HTTPException
import html

def sanitize_html(text: str) -> str:
    """Remove HTML tags and escape special characters."""
    # Remove any HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Escape HTML entities
    text = html.escape(text)
    return text

def validate_workflow_node(node_data: Dict[str, Any]) -> None:
    """Validate workflow node data."""
    # Check for required fields
    if 'type' not in node_data:
        raise HTTPException(status_code=400, detail="Node type is required")
    
    # Validate task field for agent nodes
    if node_data.get('type') == 'agent':
        task = node_data.get('data', {}).get('task', '')
        if not task or not task.strip():
            raise HTTPException(status_code=400, detail="Agent node requires a non-empty task")
        
        # Sanitize task content
        if len(task) > 5000:
            raise HTTPException(status_code=400, detail="Task description too long (max 5000 characters)")
        
        # Check for potential XSS patterns
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe[^>]*>'
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, task, re.IGNORECASE):
                raise HTTPException(
                    status_code=400,
                    detail="Task contains potentially dangerous content"
                )

def detect_workflow_cycles(nodes: list, edges: list) -> bool:
    """Detect cycles in workflow graph using DFS.
    
    Returns:
        True if cycle detected, False otherwise
    """
    # Build adjacency list
    graph = {node['id']: [] for node in nodes}
    for edge in edges:
        if edge['source'] in graph:
            graph[edge['source']].append(edge['target'])
    
    # Track visited nodes and recursion stack
    visited = set()
    rec_stack = set()
    
    def has_cycle_util(node_id: str) -> bool:
        """DFS helper to detect cycles."""
        visited.add(node_id)
        rec_stack.add(node_id)
        
        # Check all neighbors
        for neighbor in graph.get(node_id, []):
            if neighbor not in visited:
                if has_cycle_util(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        
        rec_stack.remove(node_id)
        return False
    
    # Check all nodes
    for node in nodes:
        node_id = node['id']
        if node_id not in visited:
            if has_cycle_util(node_id):
                return True
    
    return False

def validate_workflow_structure(nodes: list, edges: list) -> None:
    """Validate workflow structure for cycles and invalid connections."""
    if not nodes:
        raise HTTPException(status_code=400, detail="Workflow must contain at least one node")
    
    # Check for cycles
    if detect_workflow_cycles(nodes, edges):
        raise HTTPException(
            status_code=400,
            detail="Workflow contains circular dependencies. Infinite loops are not allowed."
        )
    
    # Validate node references in edges
    node_ids = {node['id'] for node in nodes}
    for edge in edges:
        if edge['source'] not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge references non-existent source node: {edge['source']}"
            )
        if edge['target'] not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge references non-existent target node: {edge['target']}"
            )
