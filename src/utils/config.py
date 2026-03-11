"""Configuration management"""

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from loguru import logger


def load_config() -> dict[str, Any]:
    """Load configuration from environment variables"""

    # Load .env file if it exists
    env_file = Path(".env")
    if env_file.exists():
        load_dotenv(env_file)
        logger.info(f"Loaded configuration from {env_file}")
    else:
        logger.warning(".env file not found, using environment variables only")

    config = {
        # LLM Configuration
        "LLM_PROVIDER": os.getenv("LLM_PROVIDER", "ollama"),
        "LLM_MODEL": os.getenv("LLM_MODEL", "llama3.2"),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
        "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
        "GOOGLE_API_KEY": os.getenv("GOOGLE_API_KEY"),
        # Memory Configuration
        "MEMORY_BACKEND": os.getenv("MEMORY_BACKEND", "chromadb"),
        "MEMORY_PERSIST_DIR": os.getenv("MEMORY_PERSIST_DIR", "./data/memory"),
        # Scheduler Configuration
        "ENABLE_SCHEDULER": os.getenv("ENABLE_SCHEDULER", "true").lower() == "true",
        "TIMEZONE": os.getenv("TIMEZONE", "UTC"),
        # Multi-Agent Configuration
        "ENABLE_MULTI_AGENT": os.getenv("ENABLE_MULTI_AGENT", "false").lower()
        == "true",
        "DEFAULT_AGENT_COUNT": int(os.getenv("DEFAULT_AGENT_COUNT", "3")),
        # Integration Tokens
        "TELEGRAM_TOKEN": os.getenv("TELEGRAM_TOKEN"),
        "DISCORD_TOKEN": os.getenv("DISCORD_TOKEN"),
        "SLACK_TOKEN": os.getenv("SLACK_TOKEN"),
        # Security
        "ENABLE_SANDBOX": os.getenv("ENABLE_SANDBOX", "true").lower() == "true",
        "MAX_EXECUTION_TIME": int(os.getenv("MAX_EXECUTION_TIME", "300")),
        # API Configuration
        "API_HOST": os.getenv("API_HOST", "0.0.0.0"),  # noqa: S104
        "API_PORT": int(os.getenv("API_PORT", "8080")),
    }

    # Create data directories
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    (data_dir / "logs").mkdir(exist_ok=True)
    (data_dir / "memory").mkdir(exist_ok=True)

    logger.info(f"Configuration loaded: LLM={config['LLM_PROVIDER']}, Scheduler={config['ENABLE_SCHEDULER']}")

    return config
