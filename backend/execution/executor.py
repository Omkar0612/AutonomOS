"""Main workflow executor with graph traversal and data flow."""

from typing import Any, Dict, List, Optional, Set
import asyncio
import logging
from datetime import datetime
import uuid

from .context import ExecutionContext
from .logic import LogicEngine

logger = logging.getLogger(__name__)


class WorkflowExecutor:
    """Executes workflows with proper node ordering and data flow."""
    
    def __init__(self):
        self.logic_engine = LogicEngine()
        
    async def execute(self, workflow: Dict[str, Any], ai_config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a complete workflow."""
        workflow_id = workflow.get('id', str(uuid.uuid4()))
        execution_id = str(uuid.uuid4())
        
        context = ExecutionContext(workflow_id, execution_id)
        nodes = workflow.get('nodes', [])
        edges = workflow.get('edges', [])
        
        logger.info(f"Starting workflow execution: {execution_id}")
        
        # Build execution graph
        graph = self._build_graph(nodes, edges)
        
        # Find entry points (nodes with no incoming edges)
        entry_nodes = self._find_entry_nodes(graph)
        
        if not entry_nodes:
            return {
                'status': 'error',
                'error': 'No entry nodes found in workflow',
                'execution_id': execution_id
            }
        
        # Execute workflow starting from entry nodes
        try:
            await self._execute_graph(graph, entry_nodes, context, ai_config)
            
            return {
                'status': 'completed',
                'execution_id': execution_id,
                'workflow_id': workflow_id,
                **context.get_summary()
            }
        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'execution_id': execution_id,
                **context.get_summary()
            }
    
    def _build_graph(self, nodes: List[Dict], edges: List[Dict]) -> Dict[str, Dict]:
        """Build adjacency graph from nodes and edges."""
        graph = {}
        
        # Initialize nodes
        for node in nodes:
            node_id = node['id']
            graph[node_id] = {
                'node': node,
                'incoming': [],
                'outgoing': [],
                'dependencies': set()
            }
        
        # Add edges
        for edge in edges:
            source = edge['source']
            target = edge['target']
            
            if source in graph and target in graph:
                graph[source]['outgoing'].append(target)
                graph[target]['incoming'].append(source)
                graph[target]['dependencies'].add(source)
        
        return graph
    
    def _find_entry_nodes(self, graph: Dict[str, Dict]) -> List[str]:
        """Find nodes with no dependencies (entry points)."""
        return [node_id for node_id, data in graph.items() 
                if not data['incoming']]
    
    async def _execute_graph(self, graph: Dict[str, Dict], entry_nodes: List[str], 
                            context: ExecutionContext, ai_config: Dict[str, Any]) -> None:
        """Execute workflow graph with proper dependency management."""
        executed: Set[str] = set()
        in_progress: Set[str] = set()
        queue = list(entry_nodes)
        
        while queue:
            node_id = queue.pop(0)
            
            if node_id in executed or node_id in in_progress:
                continue
            
            node_data = graph[node_id]
            
            # Check if all dependencies are met
            if not node_data['dependencies'].issubset(executed):
                queue.append(node_id)  # Re-queue for later
                continue
            
            in_progress.add(node_id)
            
            # Execute node
            try:
                await self._execute_node(node_data['node'], context, ai_config)
                executed.add(node_id)
                in_progress.remove(node_id)
                
                # Queue dependent nodes
                for target in node_data['outgoing']:
                    if target not in executed and target not in queue:
                        queue.append(target)
                        
            except Exception as e:
                logger.error(f"Node {node_id} execution failed: {e}")
                context.set_node_error(node_id, e)
                in_progress.remove(node_id)
                raise
    
    async def _execute_node(self, node: Dict[str, Any], context: ExecutionContext,
                           ai_config: Dict[str, Any]) -> None:
        """Execute a single node based on its type."""
        node_id = node['id']
        node_type = node['type']
        node_data = node['data']
        
        logger.info(f"Executing node {node_id} (type: {node_type})")
        
        if node_type == 'trigger':
            result = await self._execute_trigger(node_data, context)
        elif node_type == 'agent':
            result = await self._execute_agent(node_data, context, ai_config)
        elif node_type == 'action':
            result = await self._execute_action(node_data, context)
        elif node_type == 'logic':
            result = await self._execute_logic(node_data, context)
        else:
            result = {'error': f'Unknown node type: {node_type}'}
        
        context.set_node_output(node_id, result)
    
    async def _execute_trigger(self, node_data: Dict[str, Any], 
                              context: ExecutionContext) -> Dict[str, Any]:
        """Execute trigger node."""
        trigger_type = node_data.get('triggerType', 'manual')
        trigger_config = node_data.get('triggerConfig', {})
        
        # Set trigger context variables
        context.set_variable('trigger_type', trigger_type)
        context.set_variable('trigger_time', datetime.now().isoformat())
        
        return {
            'type': 'trigger',
            'trigger_type': trigger_type,
            'status': 'triggered',
            'config': trigger_config
        }
    
    async def _execute_agent(self, node_data: Dict[str, Any], context: ExecutionContext,
                            ai_config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent node with AI."""
        task = node_data.get('task', '')
        agent_type = node_data.get('agentType', 'single')
        
        # Resolve variables in task
        resolved_task = context.resolve_value(task)
        
        # Build context from previous outputs
        previous_outputs = []
        for node_id, output in context.node_outputs.items():
            if isinstance(output, dict) and 'output' in output:
                previous_outputs.append(output['output'])
        
        prompt = resolved_task
        if previous_outputs:
            prompt = f"Previous context:\n" + "\n".join(previous_outputs[-3:]) + f"\n\nTask: {resolved_task}"
        
        # Call AI (imported from main.py)
        from main import call_ai_api
        
        response = await call_ai_api(
            provider=ai_config['provider'],
            api_key=ai_config['apiKey'],
            model=ai_config['model'],
            prompt=prompt,
            system_prompt=f"You are an AI agent. Type: {agent_type}"
        )
        
        return {
            'type': 'agent',
            'agent_type': agent_type,
            'output': response,
            'task': resolved_task
        }
    
    async def _execute_action(self, node_data: Dict[str, Any],
                             context: ExecutionContext) -> Dict[str, Any]:
        """Execute action node."""
        action_type = node_data.get('actionType', 'custom')
        action_config = node_data.get('actionConfig', {})
        
        # Import action handlers
        from .actions import ActionHandler
        handler = ActionHandler()
        
        result = await handler.execute(action_type, action_config, context)
        
        return {
            'type': 'action',
            'action_type': action_type,
            **result
        }
    
    async def _execute_logic(self, node_data: Dict[str, Any],
                            context: ExecutionContext) -> Dict[str, Any]:
        """Execute logic node."""
        logic_type = node_data.get('logicType', 'if_else')
        
        if logic_type == 'if_else':
            result = await self.logic_engine.execute_if_else(node_data, context)
        elif logic_type == 'switch':
            result = await self.logic_engine.execute_switch(node_data, context)
        elif logic_type == 'loop':
            result = await self.logic_engine.execute_loop(node_data, context, None)
        elif logic_type == 'foreach':
            result = await self.logic_engine.execute_foreach(node_data, context)
        elif logic_type == 'parallel':
            result = await self.logic_engine.execute_parallel(node_data, context, [])
        elif logic_type == 'delay':
            result = await self.logic_engine.execute_delay(node_data, context)
        else:
            result = {'error': f'Unknown logic type: {logic_type}'}
        
        return {
            'type': 'logic',
            'logic_type': logic_type,
            **result
        }
