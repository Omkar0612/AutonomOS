from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AutonomOS API",
    description="AI Workflow Execution Engine",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class WorkflowExecutionRequest(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class TestKeyRequest(BaseModel):
    provider: str
    apiKey: str
    model: str

# AI Provider configurations
AI_PROVIDERS = {
    "openrouter": {
        "base_url": "https://openrouter.ai/api/v1",
        "chat_endpoint": "/chat/completions",
    },
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "chat_endpoint": "/chat/completions",
    },
    "anthropic": {
        "base_url": "https://api.anthropic.com/v1",
        "chat_endpoint": "/messages",
    },
}

# Helper function to call AI API
async def call_ai_api(
    provider: str,
    api_key: str,
    model: str,
    prompt: str,
    system_prompt: Optional[str] = None
) -> str:
    """Call AI provider API"""
    
    if provider not in AI_PROVIDERS:
        raise ValueError(f"Unknown provider: {provider}")
    
    config = AI_PROVIDERS[provider]
    url = f"{config['base_url']}{config['chat_endpoint']}"
    
    headers = {
        "Content-Type": "application/json",
    }
    
    # Provider-specific headers
    if provider == "openrouter":
        headers["Authorization"] = f"Bearer {api_key}"
        headers["HTTP-Referer"] = "https://autonomos.ai"
        headers["X-Title"] = "AutonomOS"
    elif provider == "openai":
        headers["Authorization"] = f"Bearer {api_key}"
    elif provider == "anthropic":
        headers["x-api-key"] = api_key
        headers["anthropic-version"] = "2023-06-01"
    
    # Build request payload
    if provider == "anthropic":
        payload = {
            "model": model,
            "max_tokens": 4096,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        if system_prompt:
            payload["system"] = system_prompt
    else:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 4096,
        }
    
    # Make API request
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Extract response based on provider
            if provider == "anthropic":
                return data["content"][0]["text"]
            else:
                return data["choices"][0]["message"]["content"]
                
        except httpx.HTTPError as e:
            logger.error(f"API error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"AI API error: {str(e)}")

# Workflow execution engine
async def execute_workflow(
    nodes: List[WorkflowNode],
    edges: List[WorkflowEdge],
    provider: str,
    api_key: str,
    model: str
) -> Dict[str, Any]:
    """Execute workflow nodes in order"""
    
    results = {}
    node_map = {node.id: node for node in nodes}
    
    # Build execution order based on edges
    execution_order = []
    executed = set()
    
    # Start with trigger nodes (no incoming edges)
    incoming = {edge.target for edge in edges}
    trigger_nodes = [node for node in nodes if node.id not in incoming]
    
    if not trigger_nodes:
        # If no clear triggers, execute in order
        trigger_nodes = nodes[:1] if nodes else []
    
    # Simple sequential execution for now
    for node in nodes:
        node_id = node.id
        node_type = node.type
        node_data = node.data
        
        logger.info(f"Executing node: {node_id} ({node_type})")
        
        try:
            if node_type == "trigger":
                # Trigger nodes just pass through
                results[node_id] = {
                    "status": "success",
                    "type": "trigger",
                    "output": f"Triggered: {node_data.get('label', 'Unknown')}"
                }
                
            elif node_type == "agent":
                # Agent nodes call AI
                task = node_data.get("task", "Process input")
                agent_type = node_data.get("agentType", "single")
                
                # Get previous results as context
                context = "\n".join([r["output"] for r in results.values() if "output" in r])
                
                prompt = f"Task: {task}\n\nContext: {context}" if context else task
                system_prompt = f"You are an AI agent in a workflow. Agent type: {agent_type}"
                
                response = await call_ai_api(provider, api_key, model, prompt, system_prompt)
                
                results[node_id] = {
                    "status": "success",
                    "type": "agent",
                    "task": task,
                    "output": response
                }
                
            elif node_type == "action":
                # Action nodes perform operations
                results[node_id] = {
                    "status": "success",
                    "type": "action",
                    "output": f"Action executed: {node_data.get('label', 'Unknown')}"
                }
                
            elif node_type == "logic":
                # Logic nodes handle branching
                results[node_id] = {
                    "status": "success",
                    "type": "logic",
                    "output": f"Logic evaluated: {node_data.get('label', 'Unknown')}"
                }
            
        except Exception as e:
            logger.error(f"Error executing node {node_id}: {str(e)}")
            results[node_id] = {
                "status": "error",
                "type": node_type,
                "error": str(e)
            }
    
    return {
        "status": "completed",
        "nodes_executed": len(nodes),
        "results": results,
        "provider": provider,
        "model": model
    }

# API Routes
@app.get("/")
async def root():
    return {
        "name": "AutonomOS API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AutonomOS API"
    }

@app.post("/api/workflows/execute")
async def execute_workflow_endpoint(
    request: WorkflowExecutionRequest,
    x_api_provider: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    x_model: Optional[str] = Header(None)
):
    """
    Execute a workflow with the provided nodes and edges.
    Requires API key information in headers.
    """
    
    # Validate inputs
    if not x_api_provider or not x_api_key or not x_model:
        raise HTTPException(
            status_code=400,
            detail="Missing required headers: X-API-Provider, X-API-Key, X-Model"
        )
    
    if not request.nodes:
        raise HTTPException(status_code=400, detail="No nodes provided")
    
    try:
        result = await execute_workflow(
            request.nodes,
            request.edges,
            x_api_provider,
            x_api_key,
            x_model
        )
        return result
        
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test-key")
async def test_api_key(request: TestKeyRequest):
    """
    Test if an API key is valid by making a simple request.
    """
    try:
        response = await call_ai_api(
            request.provider,
            request.apiKey,
            request.model,
            "Say 'Hello' if you can hear me.",
            "You are a test assistant."
        )
        return {
            "success": True,
            "message": "API key is valid",
            "response": response[:100]  # First 100 chars
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.get("/api/models/{provider}")
async def get_available_models(provider: str):
    """
    Get available models for a provider.
    """
    # This would typically fetch from provider API
    # For now, return static list
    models = {
        "openrouter": [
            "openai/gpt-4-turbo",
            "anthropic/claude-3-opus",
            "meta-llama/llama-3-70b"
        ],
        "openai": [
            "gpt-4-turbo",
            "gpt-4",
            "gpt-3.5-turbo"
        ],
        "anthropic": [
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229"
        ]
    }
    
    return {
        "provider": provider,
        "models": models.get(provider, [])
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
