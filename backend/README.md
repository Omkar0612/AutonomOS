# AutonomOS Backend

> FastAPI-based AI workflow execution engine

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- pip

### Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. (Optional) Add API keys to `.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENAI_API_KEY=sk-...
```

**Note:** API keys can also be provided via the frontend UI.

### Run Server

```bash
python main.py
```

Server runs on: http://localhost:8000

API docs: http://localhost:8000/docs

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
```

### Execute Workflow
```bash
POST /api/workflows/execute
Headers:
  X-API-Provider: openrouter
  X-API-Key: sk-or-v1-...
  X-Model: openai/gpt-4-turbo

Body:
{
  "nodes": [...],
  "edges": [...]
}
```

### Test API Key
```bash
POST /api/test-key
Body:
{
  "provider": "openrouter",
  "apiKey": "sk-or-v1-...",
  "model": "openai/gpt-4-turbo"
}
```

### Get Models
```bash
GET /api/models/{provider}
```

## 🏗️ Architecture

```
backend/
├── main.py              # FastAPI app & routes
├── requirements.txt     # Python dependencies
├── .env.example        # Environment template
├── .env                # Your config (create this)
└── README.md           # This file
```

## 🔧 Features

- ✅ FastAPI REST API
- ✅ Async/await support
- ✅ CORS enabled
- ✅ OpenRouter integration
- ✅ OpenAI integration
- ✅ Anthropic integration
- ✅ Multi-node workflow execution
- ✅ Error handling
- ✅ Logging
- ✅ Auto-reload in dev mode

## 🤖 Workflow Execution

The backend processes workflows as follows:

1. **Receive workflow** - Nodes and edges from frontend
2. **Validate** - Check API key and model
3. **Execute nodes** - Process in order:
   - Trigger nodes → Initialize
   - Agent nodes → Call AI API
   - Action nodes → Perform actions
   - Logic nodes → Handle branching
4. **Return results** - Aggregated output

## 🔐 Security

- API keys sent in headers (not stored)
- CORS configured for frontend
- Environment variables for secrets
- Input validation with Pydantic

## 📊 Supported AI Providers

| Provider | Status | Free Models |
|----------|--------|-------------|
| OpenRouter | ✅ | Yes (14 models) |
| OpenAI | ✅ | No |
| Anthropic | ✅ | No |
| Google | 🔜 | Coming soon |
| Groq | 🔜 | Coming soon |

## 🐛 Debugging

### View logs:
```bash
# Logs are printed to console
python main.py
```

### Test with curl:
```bash
curl http://localhost:8000/api/health
```

### Interactive API docs:
Open: http://localhost:8000/docs

## 🚢 Production Deployment

### Using Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Using Gunicorn:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 License

MIT
