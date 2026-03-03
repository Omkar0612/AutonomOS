#!/usr/bin/env python3
"""
AutonomOS - 24/7 Autonomous AI Agent
Main entry point for the agent
"""

import asyncio
import signal
import sys
from pathlib import Path

from loguru import logger
from src.agent.brain import AgentBrain
from src.agent.scheduler import TaskScheduler
from src.ui.backend.api import create_app
from src.utils.config import load_config

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>"
)
logger.add(
    "data/logs/agent.log",
    rotation="100 MB",
    retention="30 days",
    compression="zip"
)


class AutonomOS:
    """Main application class"""

    def __init__(self):
        self.config = load_config()
        self.brain = AgentBrain(self.config)
        self.scheduler = TaskScheduler(self.brain)
        self.app = create_app(self.brain)
        self.running = False

    async def start(self):
        """Start the agent"""
        logger.info("🚀 Starting AutonomOS...")

        # Initialize components
        await self.brain.initialize()

        # Start scheduler if enabled
        if self.config.get("ENABLE_SCHEDULER", True):
            self.scheduler.start()
            logger.info("⏰ Task scheduler started")

        # Start API server
        import uvicorn
        config = uvicorn.Config(
            self.app,
            host="0.0.0.0",
            port=8080,
            log_level="info"
        )
        server = uvicorn.Server(config)

        self.running = True
        logger.success("✅ AutonomOS is running!")
        logger.info("📊 Web interface: http://localhost:8080")
        logger.info("📚 API docs: http://localhost:8080/docs")

        # Run server
        await server.serve()

    async def stop(self):
        """Stop the agent gracefully"""
        logger.info("🛑 Stopping AutonomOS...")
        self.running = False

        # Stop scheduler
        if self.scheduler.is_running():
            self.scheduler.stop()

        # Save state
        await self.brain.save_state()

        logger.success("✅ AutonomOS stopped gracefully")

    def handle_signal(self, sig, frame):
        """Handle shutdown signals"""
        logger.warning(f"Received signal {sig}")
        asyncio.create_task(self.stop())


async def main():
    """Main entry point"""
    agent = AutonomOS()

    # Setup signal handlers
    signal.signal(signal.SIGINT, agent.handle_signal)
    signal.signal(signal.SIGTERM, agent.handle_signal)

    try:
        await agent.start()
    except KeyboardInterrupt:
        await agent.stop()
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
        await agent.stop()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
