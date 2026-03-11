"""Execution context management for workflow runs."""

from typing import Any, Dict, Optional, List
from datetime import datetime
import copy
import logging

logger = logging.getLogger(__name__)


class ExecutionContext:
    """Manages execution context including variables, outputs, and state."""
    
    def __init__(self, workflow_id: str, execution_id: str):
        self.workflow_id = workflow_id
        self.execution_id = execution_id
        self.variables: Dict[str, Any] = {}
        self.node_outputs: Dict[str, Any] = {}
        self.node_status: Dict[str, str] = {}
        self.errors: List[Dict[str, Any]] = []
        self.start_time = datetime.now()
        self.metadata: Dict[str, Any] = {}
        
    def set_variable(self, name: str, value: Any) -> None:
        """Set a workflow variable."""
        self.variables[name] = value
        logger.debug(f"Set variable '{name}' = {value}")
        
    def get_variable(self, name: str, default: Any = None) -> Any:
        """Get a workflow variable."""
        return self.variables.get(name, default)
    
    def has_variable(self, name: str) -> bool:
        """Check if variable exists."""
        return name in self.variables
    
    def set_node_output(self, node_id: str, output: Any) -> None:
        """Store output from a node execution."""
        self.node_outputs[node_id] = output
        self.node_status[node_id] = 'completed'
        logger.info(f"Node {node_id} completed with output")
        
    def get_node_output(self, node_id: str, default: Any = None) -> Any:
        """Get output from a previously executed node."""
        return self.node_outputs.get(node_id, default)
    
    def set_node_error(self, node_id: str, error: Exception) -> None:
        """Record node execution error."""
        self.node_status[node_id] = 'error'
        error_info = {
            'node_id': node_id,
            'error': str(error),
            'type': type(error).__name__,
            'timestamp': datetime.now().isoformat()
        }
        self.errors.append(error_info)
        logger.error(f"Node {node_id} failed: {error}")
        
    def get_node_status(self, node_id: str) -> Optional[str]:
        """Get execution status of a node."""
        return self.node_status.get(node_id)
    
    def evaluate_expression(self, expression: str) -> Any:
        """Safely evaluate expression with current context."""
        # Create safe evaluation context
        safe_vars = {
            'variables': self.variables,
            'outputs': self.node_outputs,
            **self.variables  # Allow direct variable access
        }
        
        try:
            # Simple expression evaluation (extend for production)
            return eval(expression, {"__builtins__": {}}, safe_vars)
        except Exception as e:
            logger.error(f"Expression evaluation failed: {expression} - {e}")
            return None
    
    def resolve_value(self, value: Any) -> Any:
        """Resolve value that might contain variable references."""
        if isinstance(value, str):
            # Handle {{variable}} syntax
            if value.startswith('{{') and value.endswith('}}'):
                var_name = value[2:-2].strip()
                return self.get_variable(var_name, value)
            # Handle ${node.output} syntax
            elif value.startswith('${') and value.endswith('}'):
                expr = value[2:-1].strip()
                return self.evaluate_expression(expr)
        return value
    
    def get_summary(self) -> Dict[str, Any]:
        """Get execution context summary."""
        return {
            'workflow_id': self.workflow_id,
            'execution_id': self.execution_id,
            'variables': copy.deepcopy(self.variables),
            'node_status': copy.deepcopy(self.node_status),
            'errors': copy.deepcopy(self.errors),
            'duration': (datetime.now() - self.start_time).total_seconds()
        }
