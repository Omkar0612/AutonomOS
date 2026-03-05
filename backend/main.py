from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import logging
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from slowapi.util import get_remote_address

from validators import (
    sanitize_html,
    validate_workflow_node,
    validate_workflow_structure
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AutonomOS API",
    description="AI Workflow Execution Engine with Security",
    version="2.0.0"
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Rate limit handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "Too many requests. Please try again later."
        }
    )

# CORS middleware with strict validation
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Models with validation
class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]
    
    @validator('data')
    def validate_node_data(cls, v, values):
        """Validate and sanitize node data."""
        if 'task' in v:
            v['task'] = sanitize_html(v['task'])
        if 'label' in v:
            v['label'] = sanitize_html(v['label'])
        return v

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class WorkflowExecutionRequest(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    
    @validator('nodes')
    def validate_nodes(cls, v, values):
        if not v:
            raise ValueError("Workflow must contain at least one node")
        return v

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

async def call_ai_api(
    provider: str,
    api_key: str,
    model: str,
    prompt: str,
    system_prompt: Optional[str] = None
) -> str:
    """Call AI provider API with error handling."""
    
    if provider not in AI_PROVIDERS:
        raise ValueError(f"Unknown provider: {provider}")
    
    config = AI_PROVIDERS[provider]
    url = f"{config['base_url']}{config['chat_endpoint']}"
    
    headers = {"Content-Type": "application/json"}
    
    if provider == "openrouter":
        headers["Authorization"] = f"Bearer {api_key}"
        headers["HTTP-Referer"] = "https://autonomos.ai"
        headers["X-Title"] = "AutonomOS"
    elif provider == "openai":
        headers["Authorization"] = f"Bearer {api_key}"
    elif provider == "anthropic":
        headers["x-api-key"] = api_key
        headers["anthropic-version"] = "2023-06-01"
    
    if provider == "anthropic":
        payload = {
            "model": model,
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}]
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
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            if provider == "anthropic":
                return data["content"][0]["text"]
            else:
                return data["choices"][0]["message"]["content"]
                
        except httpx.HTTPStatusError as e:
            logger.error(f"API error for provider {provider}: {e.response.status_code}")
            error_detail = f"AI provider returned error: {e.response.status_code}"
            try:
                error_data = e.response.json()
                if 'error' in error_data:
                    error_detail = f"{error_detail} - {error_data['error'].get('message', '')}"
            except:
                pass
            raise HTTPException(status_code=500, detail=error_detail)
        except httpx.TimeoutException:
            logger.error(f"Timeout calling {provider} API")
            raise HTTPException(status_code=504, detail="AI provider request timed out")
        except Exception as e:
            logger.error(f"Unexpected error calling {provider}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to communicate with AI provider: {str(e)}")

async def execute_workflow(
    nodes: List[WorkflowNode],
    edges: List[WorkflowEdge],
    provider: str,
    api_key: str,
    model: str
) -> Dict[str, Any]:
    """Execute workflow nodes with cycle detection and validation."""
    
    # Validate workflow structure (includes cycle detection)
    validate_workflow_structure(
        [node.dict() for node in nodes],
        [edge.dict() for edge in edges]
    )
    
    results = {}
    
    for node in nodes:
        node_id = node.id
        node_type = node.type
        node_data = node.data
        
        logger.info(f"Executing node: {node_id} ({node_type})")
        
        try:
            if node_type == "trigger":
                results[node_id] = {
                    "status": "success",
                    "type": "trigger",
                    "output": f"Triggered: {node_data.get('label', 'Unknown')}"
                }
                
            elif node_type == "agent":
                task = node_data.get("task", "Process input")
                agent_type = node_data.get("agentType", "single")
                
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
                results[node_id] = {
                    "status": "success",
                    "type": "action",
                    "output": f"Action executed: {node_data.get('label', 'Unknown')}"
                }
                
            elif node_type == "logic":
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
        "version": "2.0.0",
        "status": "running",
        "security": "enhanced"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AutonomOS API"
    }

@app.post("/api/workflows/execute")
@limiter.limit("10/minute")
async def execute_workflow_endpoint(
    request: WorkflowExecutionRequest,
    x_api_provider: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    x_model: Optional[str] = Header(None)
):
    """Execute a workflow with header-based API credentials."""
    
    if not x_api_provider or not x_api_key or not x_model:
        raise HTTPException(
            status_code=400,
            detail="Missing required headers: X-API-Provider, X-API-Key, X-Model. Please configure your API credentials in Settings."
        )
    
    try:
        result = await execute_workflow(
            request.nodes,
            request.edges,
            x_api_provider,
            x_api_key,
            x_model
        )
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

@app.post("/api/test-key")
@limiter.limit("3/minute")
async def test_api_key(request: TestKeyRequest):
    """Test if an API key is valid (rate limited)."""
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
            "response": response[:100]
        }
    except HTTPException as e:
        return {
            "success": False,
            "message": f"API key validation failed: {e.detail}"
        }
    except Exception as e:
        logger.error(f"Key test error: {str(e)}")
        return {
            "success": False,
            "message": f"Validation error: {str(e)}"
        }

@app.get("/api/models/{provider}")
async def get_available_models(provider: str):
    """Get available models for a provider."""
    models = {
        "openrouter": [
            "google/gemini-2.0-flash-exp:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "microsoft/phi-3-medium-128k-instruct:free",
            "openai/gpt-4-turbo",
            "anthropic/claude-3-opus"
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
