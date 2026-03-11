<div align="center">

# AutonomOS

### *The operating system for autonomous AI agents*

[![Stars](https://img.shields.io/github/stars/Omkar0612/AutonomOS?style=for-the-badge&color=FFD700&logo=github)](https://github.com/Omkar0612/AutonomOS/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/Omkar0612/AutonomOS/ci.yml?style=for-the-badge&label=CI)](https://github.com/Omkar0612/AutonomOS/actions)

**What if your computer could think, plan, and execute tasks — without you lifting a finger?**

[Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Discord](https://github.com/Omkar0612/AutonomOS/discussions)

</div>

---

## The Problem With AI Today

Every AI tool today is a **chatbot dressed up as a product**.

You prompt it. It responds. You copy the output. You paste it somewhere else. You prompt again.

**That's not intelligence. That's a very fast secretary.**

AutonomOS is built on a different premise:

> *What if AI agents could boot up like an OS, own their own processes, coordinate with each other, and actually finish work — autonomously?*

That's what we're building.

---

## What is AutonomOS?

**AutonomOS** is an open-source **AI-native operating system layer** — a visual runtime where you design multi-agent workflows and watch them execute in real time.

Think of it like this:

- **Linux** is an OS for computers
- **AutonomOS** is an OS for AI agents

You design the pipeline. The agents take over.

```
┌─────────────────────────────────────────────────────────┐
│                    AutonomOS Runtime                    │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Trigger    │  Agent Pool  │  Execution   │   Output   │
│    Layer     │  (40+ LLMs)  │   Engine     │   Layer    │
│              │              │              │            │
│  Schedule /  │    GPT-4o    │  DAG-based   │    PDF     │
│  Webhook /   │   Claude 3   │   parallel   │   Notion   │
│  Manual /    │  Llama 3.3   │  execution   │   Slack    │
│     API      │    Gemini    │  w/ retries  │    API     │
└──────────────┴──────────────┴──────────────┴────────────┘
```

---

## Why This Is Different

| Feature | n8n / Zapier | LangChain | AutoGPT | **AutonomOS** |
|---|---|---|---|---|
| Visual workflow builder | ✅ | ❌ | ❌ | ✅ |
| Multi-agent coordination | ⚠️ limited | ⚠️ complex setup | ✅ | ✅ |
| Real-time execution view | ⚠️ partial | ❌ | ❌ | ✅ |
| Works with FREE LLMs | ⚠️ limited | ⚠️ self-configure | ❌ | ✅ 40+ models |
| Self-hostable, no vendor lock | ⚠️ | ✅ | ✅ | ✅ |
| One-command Docker deploy | ⚠️ | ❌ | ❌ | ✅ |
| Agent memory + state | ⚠️ via plugins | ⚠️ manual setup | ✅ | ✅ |
| Export results (7 formats) | ❌ | ❌ | ❌ | ✅ |

> **Note:** n8n has grown significantly and supports some agent/memory features via community nodes. The comparison above reflects default out-of-the-box capabilities.

**AutonomOS uniquely combines the visual simplicity of n8n with deep multi-agent orchestration and free-first LLM access — all in one self-hostable package.**

---

## Demo

> 🎬 *Building a market research agent that scrapes, analyzes, and exports a report — in 3 minutes, zero code.*

**[📹 Watch Demo Video](https://github.com/Omkar0612/AutonomOS/discussions)** — *(video coming soon — star the repo to be notified)*

```bash
# Clone and run in 60 seconds
git clone https://github.com/Omkar0612/AutonomOS
cd AutonomOS
make dev
# → Open http://localhost:5173
```

**Example: Autonomous Research Workflow**

```
[Schedule: 9am daily]
        ↓
[Agent: Search web for topic X]
        ↓
[Agent: Summarize + extract insights]
        ↓
[Agent: Write report draft]
        ↓
[Action: Export to PDF + send to Slack]
```

Runs every morning. Zero human input. Done.

---

## Screenshots

> *UI screenshots and GIF walkthrough coming soon. Run locally to see the visual canvas in action.*

```bash
git clone https://github.com/Omkar0612/AutonomOS && cd AutonomOS && make dev
```

---

## Architecture

```
autonomos/
├── frontend/          # React 18 + TypeScript + React Flow canvas
│   ├── nodes/         # Draggable: Trigger, Agent, Action, Logic nodes
│   ├── execution/     # Live execution visualizer
│   └── export/        # PDF, DOCX, Excel, PPT, JSON, CSV, Markdown
│
├── backend/           # FastAPI + Python 3.10+
│   ├── agents/        # Multi-agent orchestration engine
│   ├── execution/     # DAG executor with parallelism + retries
│   ├── providers/     # OpenRouter, OpenAI, Anthropic, Ollama
│   └── marketplace/   # Workflow template marketplace
│
├── src/               # Core AutonomOS kernel
│   ├── scheduler.py   # Cron + webhook trigger engine
│   ├── memory.py      # Agent memory + context store
│   └── config.py      # Unified config management
│
└── .github/workflows/ # CI/CD: Lint, Test, Security, Build
```

### Performance (v2.2.0)

> ⚠️ **Benchmark context:** These figures are measured on a local machine (8-core CPU, 16GB RAM) running 3 concurrent workflows with Llama 3.3 70B via OpenRouter. Results will vary based on hardware, LLM provider latency, and workflow complexity. See [`benchmarks/`](benchmarks/) for reproducible scripts *(coming soon)*.

| Metric | Before (v2.1.0) | Now (v2.2.0) | Delta |
|---|---|---|---|
| API Response | 800-1200ms | 200-400ms | **↓ 65%** |
| Concurrent Agents | 5 | 80+ | **↑ 16x** |
| Memory Usage | 400MB | 150MB | **↓ 62%** |
| Workflow Throughput | 20 req/s | 80 req/s | **↑ 4x** |

Powered by: `uvloop` • `orjson` • `Redis` • Connection pooling

---

## Quick Start

### 1-minute setup (Docker)

```bash
git clone https://github.com/Omkar0612/AutonomOS
cd AutonomOS
docker compose up
# → http://localhost:5173
```

### Manual setup

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your API key
python main.py

# Frontend (new terminal)
cd frontend
npm install && npm run dev
```

### Get a FREE API Key (no credit card)

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create account → copy key
3. In AutonomOS: Settings → API Key → paste
4. Select model: `meta-llama/llama-3.3-70b-instruct:free`

**40+ free models available.** Start building without spending a dollar.

---

## Key Features

### Visual Workflow Builder

Drag-and-drop canvas built on React Flow. Connect agents, triggers, logic, and actions in any topology — linear chains, parallel branches, feedback loops.

### Multi-Agent Orchestration

Run multiple AI agents in coordinated pipelines. Each agent has its own context, memory, and task. Agents can pass data, collaborate, or operate in parallel.

### 40+ LLM Providers (Free Tier First)

OpenRouter integration gives you access to GPT-4o, Claude 3, Llama 3.3 70B, Gemini, Mistral, and 35+ more — many completely free.

### Real-Time Execution View

Watch your workflow execute node by node. See agent thinking, intermediate outputs, and results live — no black box.

### Agent Memory

Agents remember previous steps within a workflow run. Cross-workflow memory coming in v3.0.

### 7 Export Formats

PDF • Word (DOCX) • Excel (XLSX) • PowerPoint (PPTX) • JSON • CSV • Markdown

### One-Command Docker Deploy

Full-stack deployment in one command. Production-ready out of the box.

---

## Roadmap

```
v2.2.0 (Current)
──────────────────
✅ SHIPPED
  Multi-agent orchestration
  40+ LLM support via OpenRouter
  7-format export engine
  Performance: 4x throughput

v3.0 (Q2 2026)
───────────────────
🔨 IN PROGRESS
  [ ] Persistent agent memory across runs
  [ ] Agent Marketplace (share/sell workflows)
  [ ] Voice trigger support
  [ ] Browser-use agent (web automation)
  [ ] Mobile companion app

v4.0 (Q4 2026)
───────────────────
🧠 PLANNED
  [ ] AutonomOS Kernel — OS-level agent runtime
  [ ] Agent-to-agent communication protocol
  [ ] Autonomous self-improvement loop
  [ ] Plugin SDK for custom node types
  [ ] Enterprise SSO + RBAC
```

**The long-term vision:** An OS-level agent runtime where AI processes are first-class citizens — just like Linux processes, but intelligent.

---

## Tech Stack

**Backend:** FastAPI • Python 3.10+ • uvloop • orjson • Redis • Prometheus

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • React Flow • Framer Motion

**AI:** OpenRouter • OpenAI • Anthropic • Ollama (local models)

**DevOps:** Docker • GitHub Actions • Pytest • Vitest

---

## Contributing

AutonomOS is early-stage and moving fast. Contributions are extremely welcome.

```bash
# Fork → clone → branch → PR
git checkout -b feat/your-feature
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Check [open issues](https://github.com/Omkar0612/AutonomOS/issues) for good first tasks.

**High-priority contributions:**

- New node types (database, email, browser-use)
- New LLM provider integrations
- Workflow templates for the marketplace
- Performance benchmarks (reproducible scripts in `benchmarks/`)
- Documentation improvements
- UI screenshots and GIF demos

---

## Star History

> If AutonomOS saves you time or sparks an idea, a ⭐ goes a long way. It helps other builders find this project.

[![Star History Chart](https://api.star-history.com/svg?repos=Omkar0612/AutonomOS&type=Date)](https://star-history.com/#Omkar0612/AutonomOS&Date)

---

## License

MIT © [Omkar Parab](https://github.com/Omkar0612)

Free forever. Build what you want. Own what you build.

---

**Built by one person. Powered by open-source. Designed to replace entire teams.**

*AutonomOS — because the future of work is agents, not apps.*
