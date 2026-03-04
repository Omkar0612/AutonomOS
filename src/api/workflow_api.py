import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.multi_agent import (
    Agent,
    AgentConfig,
    CouncilSystem,
    HierarchicalTeam,
    SwarmSystem,
)

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
    data: dict[str, Any]
    position: dict[str, float]


class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str


class Workflow(BaseModel):
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]


class WorkflowExecutor:
    """Execute workflows created in the visual editor."""

    def __init__(self) -> None:
        self.agents_cache: dict[str, Any] = {}

    async def execute(self, workflow: Workflow) -> dict[str, Any]:
        """Execute workflow by processing nodes in order."""
        results: dict[str, Any] = {}

        execution_order = self._topological_sort(workflow)

        for node_id in execution_order:
            node = next(n for n in workflow.nodes if n.id == node_id)
            result = await self._execute_node(node, results)
            results[node_id] = result

        return results

    async def _execute_node(self, node: WorkflowNode, context: dict[str, Any]) -> Any:
        """Execute a single node based on its type."""
        if node.type == "trigger":
            return {"status": "triggered", "data": node.data}

        if node.type == "agent":
            agent_type = node.data.get("agentType", "single")

            if agent_type == "single":
                agent = Agent(
                    AgentConfig(
                        name=node.data.get("label", "Agent"),
                        llm_model=node.data.get("model", "gpt-4"),
                    )
                )
                result = await agent.execute_task({"description": "Execute workflow task"})
                return {"status": "completed", "result": result}

            if agent_type == "multi":
                pattern = node.data.get("pattern", "hierarchical")
                agents = [Agent(AgentConfig(name=f"Agent-{i}")) for i in range(3)]

                if pattern == "hierarchical":
                    team = HierarchicalTeam(
                        name="WorkflowTeam",
                        manager=agents[0],
                        workers=agents[1:],
                    )
                    result = await team.execute("Complete workflow task")

                elif pattern == "swarm":
                    swarm = SwarmSystem(agents=agents)
                    result = swarm.execute()  # SwarmSystem is synchronous in this demo

                elif pattern == "council":
                    council = CouncilSystem(name="WorkflowCouncil", agents=agents)
                    result = await council.decide("Evaluate workflow decision")

                else:
                    msg = f"Unknown pattern: {pattern}"
                    raise HTTPException(status_code=400, detail=msg)

                return {"status": "completed", "result": result, "context": context}

        if node.type == "action":
            return {"status": "action_executed", "data": node.data}

        if node.type == "logic":
            return {"status": "logic_processed", "data": node.data}

        return {"status": "unknown_type"}

    def _topological_sort(self, workflow: Workflow) -> list[str]:
        """Sort nodes in execution order based on edges."""
        graph: dict[str, list[str]] = {node.id: [] for node in workflow.nodes}
        for edge in workflow.edges:
            graph[edge.source].append(edge.target)

        visited: set[str] = set()
        order: list[str] = []

        def dfs(node_id: str) -> None:
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
async def execute_workflow(workflow: Workflow) -> dict[str, Any]:
    """Execute a visual workflow."""
    try:
        results = await executor.execute(workflow)
        return {"status": "success", "results": results}
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err)) from err


@app.get("/api/workflow/templates")
async def get_templates() -> dict[str, Any]:
    """Get workflow templates."""
    return {
        "templates": [
            {
                "name": "Email Automation",
                "description": "Automated email processing workflow",
                "nodes": 3,
                "category": "productivity",
            },
            {
                "name": "Multi-Agent Research",
                "description": "Collaborative research with swarm intelligence",
                "nodes": 5,
                "category": "research",
            },
            {
                "name": "Customer Support",
                "description": "24/7 autonomous customer support",
                "nodes": 4,
                "category": "business",
            },
        ]
    }


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("AUTONOMOS_WORKFLOW_API_HOST", "127.0.0.1")
    port = int(os.getenv("AUTONOMOS_WORKFLOW_API_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
