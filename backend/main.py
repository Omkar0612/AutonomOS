from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import logging
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
import time
import uuid

from validators import (
    sanitize_html,
    validate_workflow_node,
    validate_workflow_structure
)

# Import new execution engine
from execution import WorkflowExecutor, TriggerManager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize execution components
workflow_executor = WorkflowExecutor()
trigger_manager = TriggerManager()

# Create FastAPI app
app = FastAPI(
    title="AutonomOS API",
    description="AI Workflow Execution Engine with Enhanced Control Flow",
    version="2.1.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware with strict validation
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Models with Pydantic v2 validation
class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]
    
    @field_validator('data')
    @classmethod
    def validate_node_data(cls, v: Dict[str, Any]) -> Dict[str, Any]:
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
    
    @field_validator('nodes')
    @classmethod
    def validate_nodes(cls, v: List[WorkflowNode]) -> List[WorkflowNode]:
        if not v:
            raise ValueError("Workflow must contain at least one node")
        return v

class TestKeyRequest(BaseModel):
    provider: str
    apiKey: str
    model: str

class TriggerRegistrationRequest(BaseModel):
    workflow_id: str
    trigger_type: str
    config: Dict[str, Any]

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

# API Routes
@app.get("/")
async def root():
    return {
        "name": "AutonomOS API",
        "version": "2.1.0",
        "status": "running",
        "features": [
            "Enhanced execution engine",
            "Data flow management",
            "Logic execution (if/else, loops, parallel)",
            "Trigger system",
            "Context management"
        ]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AutonomOS API",
        "active_triggers": len(trigger_manager.active_triggers)
    }

@app.post("/api/workflows/execute")
@limiter.limit("10/minute")
async def execute_workflow_endpoint(
    request: Request,
    x_api_provider: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    x_model: Optional[str] = Header(None)
):
    """Execute a workflow with enhanced execution engine."""
    
    if not x_api_provider or not x_api_key or not x_model:
        raise HTTPException(
            status_code=400,
            detail="Missing required headers: X-API-Provider, X-API-Key, X-Model"
        )
    
    try:
        body = await request.json()
        request_data = WorkflowExecutionRequest(**body)
        
        # Validate workflow structure
        validate_workflow_structure(
            [node.model_dump() for node in request_data.nodes],
            [edge.model_dump() for edge in request_data.edges]
        )
        
        # Build workflow object
        workflow = {
            'id': str(uuid.uuid4()),
            'nodes': [node.model_dump() for node in request_data.nodes],
            'edges': [edge.model_dump() for edge in request_data.edges]
        }
        
        # AI configuration
        ai_config = {
            'provider': x_api_provider,
            'apiKey': x_api_key,
            'model': x_model
        }
        
        # Execute with new engine
        result = await workflow_executor.execute(workflow, ai_config)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

@app.post("/api/triggers/register")
@limiter.limit("5/minute")
async def register_trigger(
    request: Request,
    trigger_req: TriggerRegistrationRequest
):
    """Register a trigger for automated workflow execution."""
    trigger_id = f"{trigger_req.workflow_id}_{trigger_req.trigger_type}"
    
    async def trigger_callback(tid: str, data: Dict[str, Any]):
        logger.info(f"Trigger {tid} fired with data: {data}")
        # Would execute workflow here
    
    success = await trigger_manager.register_trigger(
        trigger_id,
        trigger_req.trigger_type,
        trigger_req.config,
        trigger_callback
    )
    
    if success:
        return {
            "status": "success",
            "trigger_id": trigger_id,
            "message": "Trigger registered successfully"
        }
    else:
        raise HTTPException(status_code=400, detail="Failed to register trigger")

@app.delete("/api/triggers/{trigger_id}")
async def unregister_trigger(trigger_id: str):
    """Unregister a trigger."""
    success = await trigger_manager.unregister_trigger(trigger_id)
    
    if success:
        return {"status": "success", "message": "Trigger unregistered"}
    else:
        raise HTTPException(status_code=404, detail="Trigger not found")

@app.get("/api/triggers")
async def list_triggers():
    """List all active triggers."""
    return {
        "triggers": [
            {
                "id": tid,
                "running": t.running,
                "config": t.config
            }
            for tid, t in trigger_manager.active_triggers.items()
        ]
    }

@app.post("/api/test-key")
@limiter.limit("3/minute")
async def test_api_key(
    request: Request
):
    """Test if an API key is valid (rate limited)."""
    try:
        body = await request.json()
        request_data = TestKeyRequest(**body)
        
        response = await call_ai_api(
            request_data.provider,
            request_data.apiKey,
            request_data.model,
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

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown."""
    logger.info("Shutting down, stopping all triggers...")
    await trigger_manager.stop_all()

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
