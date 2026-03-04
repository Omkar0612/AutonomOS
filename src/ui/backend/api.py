"""FastAPI Application - Web Interface and API"""

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger


def create_app(agent_brain: Any) -> FastAPI:
    """Create and configure FastAPI application"""

    app = FastAPI(
        title="AutonomOS API",
        description="24/7 Autonomous AI Agent Framework",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Store agent brain reference
    app.state.agent_brain = agent_brain

    # Routes
    @app.get("/")
    async def root() -> dict[str, str]:
        """Root endpoint"""
        return {
            "message": "Welcome to AutonomOS API",
            "version": "1.0.0",
            "docs": "/docs",
        }

    @app.get("/health")
    async def health() -> dict[str, Any]:
        """Health check endpoint"""
        return {
            "status": "healthy",
            "agent": app.state.agent_brain.get_stats(),
        }

    @app.get("/metrics")
    async def metrics() -> dict[str, Any]:
        """Metrics endpoint"""
        return {
            "agent_stats": app.state.agent_brain.get_stats(),
            "api_version": "1.0.0",
        }

    @app.post("/api/chat")
    async def chat(message: dict[str, str]) -> dict[str, Any]:
        """Chat with the agent"""
        try:
            user_message = message.get("message", "")
            if not user_message:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Message is required"},
                )

            response = await app.state.agent_brain.process_message(user_message)
            return response

        except Exception as e:
            logger.error(f"Chat error: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": str(e)},
            )

    @app.get("/api/stats")
    async def stats() -> dict[str, Any]:
        """Get agent statistics"""
        return app.state.agent_brain.get_stats()

    logger.info("FastAPI application created")
    return app
