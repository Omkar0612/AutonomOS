from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
from src.multi_agent import Agent, AgentConfig, HierarchicalTeam, SwarmSystem, CouncilSystem

app = FastAPI(title="AutonomOS Workflow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class Workflow(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class WorkflowExecutor:
    """Execute workflows created in the visual editor"""
    
    def __init__(self):
        self.agents_cache = {}
    
    async def execute(self, workflow: Workflow) -> Dict[str, Any]:
        """Execute workflow by processing nodes in order"""
        results = {}
        
        # Build execution graph
        execution_order = self._topological_sort(workflow)
        
        # Execute each node
        for node_id in execution_order:
            node = next(n for n in workflow.nodes if n.id == node_id)
            result = await self._execute_node(node, results)
            results[node_id] = result
        
        return results
    
    async def _execute_node(self, node: WorkflowNode, context: Dict) -> Any:
        """Execute a single node based on its type"""
        
        if node.type == "trigger":
            return {"status": "triggered", "data": node.data}
        
        elif node.type == "agent":
            agent_type = node.data.get("agentType", "single")
            
            if agent_type == "single":
                agent = Agent(AgentConfig(
                    name=node.data.get("label", "Agent"),
                    model=node.data.get("model", "gpt-4")
                ))
                result = await agent.execute_task({"description": "Execute workflow task"})
                return {"status": "completed", "result": result}
            
            elif agent_type == "multi":
                pattern = node.data.get("pattern", "hierarchical")
                agents = [Agent(AgentConfig(name=f"Agent-{i}")) for i in range(3)]
                
                if pattern == "hierarchical":
                    team = HierarchicalTeam(
                        name="WorkflowTeam",
                        manager=agents[0],
                        workers=agents[1:]
                    )
                    result = await team.execute("Complete workflow task")
                
                elif pattern == "swarm":
                    swarm = SwarmSystem(name="WorkflowSwarm", agents=agents)
                    result = await swarm.execute("Research and complete task")
                
                elif pattern == "council":
                    council = CouncilSystem(name="WorkflowCouncil", agents=agents)
                    result = await council.decide("Evaluate workflow decision")
                
                return {"status": "completed", "result": result}
        
        elif node.type == "action":
            # Execute action (API call, email, etc.)
            return {"status": "action_executed", "data": node.data}
        
        elif node.type == "logic":
            # Execute logic (if/else, transform, etc.)
            return {"status": "logic_processed", "data": node.data}
        
        return {"status": "unknown_type"}
    
    def _topological_sort(self, workflow: Workflow) -> List[str]:
        """Sort nodes in execution order based on edges"""
        # Build adjacency list
        graph = {node.id: [] for node in workflow.nodes}
        for edge in workflow.edges:
            graph[edge.source].append(edge.target)
        
        # Simple topological sort (for demo)
        visited = set()
        order = []
        
        def dfs(node_id: str):
            if node_id in visited:
                return
            visited.add(node_id)
            for neighbor in graph[node_id]:
                dfs(neighbor)
            order.append(node_id)
        
        for node in workflow.nodes:
            dfs(node.id)
        
        return list(reversed(order))

executor = WorkflowExecutor()

@app.post("/api/workflow/execute")
async def execute_workflow(workflow: Workflow):
    """Execute a visual workflow"""
    try:
        results = await executor.execute(workflow)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/workflow/templates")
async def get_templates():
    """Get workflow templates"""
    return {
        "templates": [
            {
                "name": "Email Automation",
                "description": "Automated email processing workflow",
                "nodes": 3,
                "category": "productivity"
            },
            {
                "name": "Multi-Agent Research",
                "description": "Collaborative research with swarm intelligence",
                "nodes": 5,
                "category": "research"
            },
            {
                "name": "Customer Support",
                "description": "24/7 autonomous customer support",
                "nodes": 4,
                "category": "business"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
