#!/usr/bin/env python3
"""AutonomOS - 24/7 Autonomous AI Agent

Main entry point for the agent.
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
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
)
logger.add(
    "data/logs/agent.log",
    rotation="100 MB",
    retention="30 days",
    compression="zip",
)


class AutonomOS:
    """Main application class"""

    def __init__(self):
        self.config = load_config()
        self.brain = AgentBrain(self.config)
        self.scheduler = TaskScheduler(self.brain)
        self.app = create_app(self.brain)
        self.running = False
        self.shutdown_event = asyncio.Event()

    async def start(self) -> None:
        """Start the agent"""
        logger.info("🚀 Starting AutonomOS...")

        try:
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
                host=self.config.get("API_HOST", "0.0.0.0"),
                port=self.config.get("API_PORT", 8080),
                log_level="info",
                access_log=True,
            )
            server = uvicorn.Server(config)

            self.running = True
            logger.success("✅ AutonomOS is running!")
            logger.info(f"📊Web interface: http://localhost:{self.config.get('API_PORT', 8080)}")
            logger.info(f"📚 API docs: http://localhost:{self.config.get('API_PORT', 8080)}/docs")

            # Run server with shutdown event
            await server.serve()

        except Exception as e:
            logger.exception(f"❌ Fatal error during startup: {e}")
            raise

    async def stop(self) -> None:
        """Stop the agent gracefully"""
        if not self.running:
            return

        logger.info("🛑 Stopping AutonomOS...")
        self.running = False

        try:
            # Stop scheduler
            if self.scheduler.is_running():
                self.scheduler.stop()
                logger.info("⏰ Task scheduler stopped")

            # Save state
            await self.brain.save_state()

            logger.success("✅ AutonomOS stopped gracefully")

        except Exception as e:
            logger.error(f"⚠️ Error during shutdown: {e}")

    def setup_signal_handlers(self, loop: asyncio.AbstractEventLoop) -> None:
        """Setup signal handlers for graceful shutdown"""

        def signal_handler(sig: int) -> None:
            logger.warning(f"🚨 Received signal {signal.Signals(sig).name}")
            loop.create_task(self.stop())
            self.shutdown_event.set()

        # Register signal handlers
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, lambda s=sig: signal_handler(s))


async def main() -> None:
    """Main entry point"""
    agent = AutonomOS()
    loop = asyncio.get_event_loop()

    # Setup signal handlers
    agent.setup_signal_handlers(loop)

    try:
        await agent.start()
    except KeyboardInterrupt:
        logger.warning("⏹️ Keyboard interrupt received")
        await agent.stop()
    except Exception as e:
        logger.exception(f"❌ Fatal error: {e}")
        await agent.stop()
        sys.exit(1)


if __name__ == "__main__":
    # Check Python version
    if sys.version_info < (3, 10):
        logger.error("❌ Python 3.10+ required")
        sys.exit(1)

    try:
        # Run with uvloop on Unix systems for better performance
        if sys.platform != "win32":
            try:
                import uvloop

                uvloop.install()
                logger.info("⚡ uvloop installed for faster async performance")
            except ImportError:
                logger.debug("uvloop not available, using default asyncio")

        # Run the application
        asyncio.run(main())

    except KeyboardInterrupt:
        logger.info("👋 Goodbye!")
    except Exception as e:
        logger.exception(f"❌ Unhandled exception: {e}")
        sys.exit(1)
