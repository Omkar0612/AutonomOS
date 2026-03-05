from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv
import logging
from slowapi.errors import RateLimitExceeded

# Import security modules
from auth import (
    get_current_user,
    TokenData,
    UserCredentials,
    store_user_credentials,
    get_user_credentials
)
from rate_limiter import limiter, rate_limit_exceeded_handler
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

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS middleware with strict validation
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
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
        # Sanitize text fields
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
        """Validate workflow structure."""
        if not v:
            raise ValueError("Workflow must contain at least one node")
        return v

class TestKeyRequest(BaseModel):
    provider: str
    apiKey: str
    model: str

class AuthRequest(BaseModel):
    """Authentication request with user credentials."""
    user_id: str
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
    """Call AI provider API with error handling."""
    
    if provider not in AI_PROVIDERS:
        raise ValueError(f"Unknown provider: {provider}")
    
    config = AI_PROVIDERS[provider]
    url = f"{config['base_url']}{config['chat_endpoint']}"
    
    headers = {"Content-Type": "application/json"}
    
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
    
    # Make API request with timeout
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
                
        except httpx.HTTPStatusError as e:
            # Don't expose API keys in error messages
            logger.error(f"API error for provider {provider}: {e.response.status_code}")
            raise HTTPException(
                status_code=500,
                detail=f"AI provider returned error: {e.response.status_code}"
            )
        except httpx.TimeoutException:
            logger.error(f"Timeout calling {provider} API")
            raise HTTPException(status_code=504, detail="AI provider request timed out")
        except Exception as e:
            logger.error(f"Unexpected error calling {provider}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to communicate with AI provider")

# Workflow execution engine
async def execute_workflow(
    nodes: List[WorkflowNode],
    edges: List[WorkflowEdge],
    provider: str,
    api_key: str,
    model: str
) -> Dict[str, Any]:
    """Execute workflow nodes in order with cycle detection."""
    
    # Validate workflow structure (includes cycle detection)
    validate_workflow_structure(
        [node.dict() for node in nodes],
        [edge.dict() for edge in edges]
    )
    
    results = {}
    node_map = {node.id: node for node in nodes}
    
    # Build execution order based on edges
    incoming = {edge.target for edge in edges}
    trigger_nodes = [node for node in nodes if node.id not in incoming]
    
    if not trigger_nodes:
        trigger_nodes = nodes[:1] if nodes else []
    
    # Execute nodes sequentially (can be optimized with async tasks)
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
                "error": "Execution failed"
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
        "security": "enabled"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AutonomOS API"
    }

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(request: AuthRequest):
    """Authenticate user and return JWT token."""
    try:
        # Store credentials securely and get token
        credentials = UserCredentials(
            provider=request.provider,
            api_key=request.apiKey,
            model=request.model
        )
        
        token = store_user_credentials(request.user_id, credentials)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": 1800
        }
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@app.post("/api/workflows/execute")
@limiter.limit("10/minute")
async def execute_workflow_endpoint(
    request: WorkflowExecutionRequest,
    current_user: TokenData = Depends(get_current_user)
):
    """Execute a workflow with JWT authentication."""
    
    # Get user credentials from secure store
    credentials = get_user_credentials(current_user.user_id)
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="User credentials not found. Please login again."
        )
    
    try:
        result = await execute_workflow(
            request.nodes,
            request.edges,
            credentials.provider,
            credentials.api_key,
            credentials.model
        )
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")
        raise HTTPException(status_code=500, detail="Workflow execution failed")

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
            "message": "API key validation failed"
        }
    except Exception as e:
        logger.error(f"Key test error: {str(e)}")
        return {
            "success": False,
            "message": "Validation error occurred"
        }

@app.get("/api/models/{provider}")
async def get_available_models(provider: str):
    """Get available models for a provider."""
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
