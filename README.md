# AutonomOS 🤖

> Your personal 24/7 autonomous AI agent. Private, efficient, secure, and completely free.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

**AutonomOS** is an independent, open-source project for building autonomous AI agents. It draws inspiration from various open-source frameworks in the agentic AI ecosystem while maintaining its own unique architecture and implementation.

## ⚠️ Legal Notice

AutonomOS is an independent project. It is NOT affiliated with, endorsed by, or connected to:
- Perplexity AI or any of its products
- Anthropic or Claude
- OpenAI or ChatGPT  
- Any specific commercial AI product or service

All trademarks and product names belong to their respective owners. AutonomOS is released under the MIT License as a community-driven, educational project.

## 🌟 Features

- **🔄 24/7 Operation**: Runs continuously with scheduled tasks and persistent memory
- **🔒 Privacy First**: Self-hosted, all data stays on your machine
- **🎯 Multi-Platform**: Integrates with Discord, Slack, Telegram, WhatsApp, Email
- **🧠 Long-Term Memory**: Maintains context across sessions using vector databases
- **🛠️ Extensible Skills**: Plugin system for custom capabilities
- **📊 Visual Workflows**: Drag-and-drop interface for building agent logic
- **🐳 Docker Ready**: One-command deployment with Docker Compose
- **💰 Cost Efficient**: Works with local LLMs (Ollama) or bring your own API keys

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.10+ (for local development)
- 8GB RAM minimum (16GB recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/autonomos.git
cd autonomos

# Copy environment template
cp .env.example .env

# Edit .env with your API keys (optional - works with Ollama by default)
nano .env

# Start with Docker Compose
docker-compose up -d

# Access the web interface
open http://localhost:8080
```

### Manual Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts/init_db.py

# Start the agent
python main.py
```

## 📁 Project Structure

```
autonomos/
├── src/
│   ├── agent/              # Core agent logic
│   │   ├── brain.py        # Main agent orchestrator
│   │   ├── memory.py       # Long-term memory system
│   │   ├── scheduler.py    # Task scheduling
│   │   └── executor.py     # Action execution
│   ├── skills/             # Extensible skills/plugins
│   │   ├── browser/        # Browser automation
│   │   ├── messaging/      # Multi-platform messaging
│   │   ├── coding/         # Code generation & execution
│   │   ├── files/          # File management
│   │   └── research/       # Web research & summarization
│   ├── integrations/       # Platform integrations
│   │   ├── discord/
│   │   ├── slack/
│   │   ├── telegram/
│   │   └── email/
│   ├── ui/                 # Web interface
│   │   ├── frontend/       # React frontend
│   │   └── backend/        # FastAPI backend
│   └── utils/              # Utilities
├── data/                   # Persistent data
│   ├── memory/             # Vector database
│   ├── logs/               # Agent logs
│   └── workflows/          # Saved workflows
├── config/                 # Configuration files
├── docker/                 # Docker configurations
├── scripts/                # Utility scripts
├── tests/                  # Test suite
├── docs/                   # Documentation
├── .env.example            # Environment template
├── docker-compose.yml      # Docker Compose config
├── requirements.txt        # Python dependencies
└── README.md
```

## 🧠 Core Capabilities

### 1. Autonomous Task Execution
```python
# Example: Schedule daily email summaries
from autonomos import Agent

agent = Agent()
agent.schedule_task(
    name="morning_briefing",
    cron="0 7 * * *",  # Every day at 7 AM
    skill="email.summarize",
    params={"inbox": "primary", "send_to": "telegram"}
)
```

### 2. Memory System
- **Short-term memory**: Current conversation context
- **Long-term memory**: Vector database (ChromaDB) with embeddings
- **Episodic memory**: Daily logs with semantic search
- **Persistent state**: Continues where it left off after restarts

### 3. Multi-Modal Skills

#### Browser Automation
```python
# Automated web research
agent.research(
    topic="Latest AI developments",
    depth="detailed",
    save_to="notion"
)
```

#### Messaging Integration
```python
# Cross-platform messaging
agent.send_message(
    platform="telegram",
    recipient="@username",
    message="Task completed!"
)
```

#### Code Generation & Execution
```python
# Generate and run code
agent.code(
    task="Analyze CSV file and create visualization",
    input_file="data.csv",
    output="chart.png"
)
```

## 🔧 Configuration

### Environment Variables

```env
# LLM Configuration
LLM_PROVIDER=ollama  # or openai, anthropic, gemini
LLM_MODEL=llama3.2
LLM_API_KEY=your-key-here  # Not needed for Ollama

# Memory Configuration
MEMORY_BACKEND=chromadb
MEMORY_COLLECTION=agent_memory

# Scheduler Configuration
ENABLE_SCHEDULER=true
TIMEZONE=Asia/Dubai

# Integration Keys
DISCORD_TOKEN=your-discord-token
SLACK_TOKEN=your-slack-token
TELEGRAM_TOKEN=your-telegram-token
EMAIL_ADDRESS=your-email@domain.com
EMAIL_PASSWORD=your-app-password

# Security
ENABLE_SANDBOX=true  # Run code in isolated containers
MAX_EXECUTION_TIME=300  # 5 minutes
```

### Skills Configuration

Create custom skills by adding Python modules to `src/skills/`:

```python
# src/skills/custom/my_skill.py
from autonomos.skill import Skill

class MyCustomSkill(Skill):
    name = "my_custom_skill"
    description = "Does something amazing"

    def execute(self, **kwargs):
        # Your skill logic here
        return {"success": True, "data": "result"}
```

## 📊 Monitoring & Logs

### Web Dashboard
Access the dashboard at `http://localhost:8080` to:
- Monitor agent activity in real-time
- View memory contents and conversations
- Edit scheduled tasks
- Test skills interactively
- Review execution logs

### CLI Monitoring
```bash
# Follow agent logs
docker-compose logs -f agent

# Check scheduled tasks
python scripts/list_tasks.py

# Query memory
python scripts/query_memory.py "what did I ask yesterday?"
```

## 🎯 Use Cases

### Personal Automation
- Daily email summaries sent to Telegram
- Automated calendar management
- Flight check-ins and travel reminders
- Bill payment reminders
- Social media post scheduling

### Development Workflow
- Code review automation
- GitHub PR summaries
- Documentation generation
- Test coverage monitoring
- Deployment notifications

### Research & Content
- Daily news digests on specific topics
- Reddit/Twitter trend analysis
- Content aggregation and summarization
- Competitive intelligence gathering

### Business Operations
- Customer support ticket triage
- Lead qualification from forms
- Meeting notes and action items
- Expense report processing

## 🔒 Security & Privacy

- **Sandboxed Execution**: All code runs in isolated Docker containers
- **Local-First**: Works completely offline with local LLMs
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Access Control**: Token-based authentication for web interface
- **Audit Logs**: Complete activity logging for compliance

## 🚢 Deployment Options

### Local Machine
Best for personal use and development
```bash
docker-compose up -d
```

### Self-Hosted Server
Deploy to your VPS/cloud instance
```bash
# Using docker-compose with production config
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
For scalable enterprise deployments
```bash
kubectl apply -f k8s/
```

### One-Click Deployment
- **Umbrel**: Available in the Umbrel App Store
- **1Panel**: One-click install from 1Panel marketplace
- **Railway**: Deploy with Railway.app
- **Render**: Deploy with Render.com

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Clone and setup
git clone https://github.com/yourusername/autonomos.git
cd autonomos

# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Code formatting
black src/
ruff check src/
```

## 📚 Documentation

- [Full Documentation](docs/README.md)
- [API Reference](docs/api.md)
- [Skills Development Guide](docs/skills.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🌟 Inspiration & Credits

This project stands on the shoulders of giants:

- [OpenClaw](https://github.com/openclaw/openclaw) - Personal AI assistant framework
- [Langflow](https://github.com/langflow-ai/langflow) - Visual workflow builder
- [Dify](https://github.com/langgenius/dify) - Agentic workflow platform
- [Superpowers](https://github.com/obra/superpowers) - Agentic skills framework
- [AgentScope](https://github.com/agentscope-ai/agentscope) - Multi-agent platform
- [Awesome OpenClaw Use Cases](https://github.com/hesamsheikh/awesome-openclaw-usecases)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

Special thanks to the OpenClaw community and all the developers building the future of autonomous AI agents.

## ⚠️ Disclaimer

This software is provided as-is. Always review and test automation workflows before deploying in production. The authors are not responsible for any actions taken by the agent.

---

**Built with ❤️ by the community, for the community**

[Report Bug](https://github.com/yourusername/autonomos/issues) · [Request Feature](https://github.com/yourusername/autonomos/issues) · [Discord Community](https://discord.gg/your-server)
