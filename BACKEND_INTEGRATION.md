# 🔌 Backend Integration Guide

Complete guide for connecting the frontend to the backend and executing workflows.

---

## 🚀 Quick Start

### 1. Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your editor
```

### 2. Configure Environment

**backend/.env:**
```bash
PORT=8000
ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
```

### 3. Start Backend Server

```bash
cd backend
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 4. Setup Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**frontend/.env:**
```bash
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 💡 Testing the Connection

### Backend Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "AutonomOS API"
}
```

### From Frontend

Open browser console and run:
```javascript
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🔑 API Key Configuration

### Get API Keys

**OpenRouter (Recommended):**
1. Visit: https://openrouter.ai/
2. Sign up and get API key
3. Free models available (e.g., `meta-llama/llama-3.3-70b-instruct:free`)

**OpenAI:**
1. Visit: https://platform.openai.com/
2. Get API key

**Anthropic:**
1. Visit: https://console.anthropic.com/
2. Get API key

### Configure in Frontend

1. Go to Settings page
2. Click "API Keys" tab
3. Click "Add Key"
4. Fill in:
   - **Name:** Production Key
   - **Provider:** openrouter
   - **API Key:** sk-or-v1-...
   - **Model:** meta-llama/llama-3.3-70b-instruct:free
5. Click "Test Key" to verify
6. Click "Save"

---

## 🔄 Workflow Execution

### Step-by-Step Process

**1. Create Workflow:**
- Go to Workflows page
- Click "New Workflow"
- Add nodes (Trigger, Agent, Action, Logic)
- Connect nodes with edges
- Configure each node

**2. Validate:**
- Click "Validate" button
- Check for errors
- Fix any issues

**3. Execute:**
- Ensure backend is running
- Ensure API key is configured
- Click "Run" button
- Watch execution in real-time

**4. View Results:**
- Results appear below canvas
- Each node shows output
- Success/Error status displayed

**5. Export Results:**
- Click "Export" dropdown
- Choose format:
  - ✅ JSON (structured data)
  - ✅ CSV (spreadsheet)
  - ✅ Markdown (documentation)
  - ✅ HTML (printable report)

---

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "AutonomOS API"
}
```

### Execute Workflow
```bash
POST /api/workflows/execute
```

**Headers:**
```
Content-Type: application/json
X-API-Provider: openrouter
X-API-Key: sk-or-v1-...
X-Model: meta-llama/llama-3.3-70b-instruct:free
```

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "trigger",
      "data": { "label": "Start" },
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "2",
      "type": "agent",
      "data": { 
        "label": "Writer",
        "task": "Write a short story",
        "agentType": "single"
      },
      "position": { "x": 200, "y": 0 }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}
```

**Response:**
```json
{
  "status": "completed",
  "nodes_executed": 2,
  "provider": "openrouter",
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "results": {
    "1": {
      "status": "success",
      "type": "trigger",
      "output": "Triggered: Start"
    },
    "2": {
      "status": "success",
      "type": "agent",
      "task": "Write a short story",
      "output": "Once upon a time..."
    }
  }
}
```

### Test API Key
```bash
POST /api/test-key
```

**Request:**
```json
{
  "provider": "openrouter",
  "apiKey": "sk-or-v1-...",
  "model": "meta-llama/llama-3.3-70b-instruct:free"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key is valid",
  "response": "Hello! I can hear you loud and clear."
}
```

### Get Models
```bash
GET /api/models/{provider}
```

**Example:**
```bash
GET /api/models/openrouter
```

**Response:**
```json
{
  "provider": "openrouter",
  "models": [
    "openai/gpt-4-turbo",
    "anthropic/claude-3-opus",
    "meta-llama/llama-3-70b"
  ]
}
```

---

## 💾 Export Formats

### JSON Export
```json
{
  "status": "completed",
  "nodes_executed": 2,
  "results": { ... },
  "provider": "openrouter",
  "model": "meta-llama/llama-3.3-70b-instruct:free"
}
```

**Use Cases:**
- ✅ API integration
- ✅ Data processing
- ✅ Import to other tools
- ✅ Structured storage

### CSV Export
```csv
Node ID,Type,Status,Output/Error
"1","trigger","success","Triggered: Start"
"2","agent","success","Once upon a time..."
```

**Use Cases:**
- ✅ Excel analysis
- ✅ Google Sheets
- ✅ Data visualization
- ✅ Reporting

### Markdown Export
```markdown
# Workflow Execution Results

**Workflow:** My Workflow
**Date:** Mar 5, 2026
**Provider:** openrouter
**Model:** meta-llama/llama-3.3-70b-instruct:free

## Results

### Node: 1
- **Type:** trigger
- **Status:** success
...
```

**Use Cases:**
- ✅ Documentation
- ✅ GitHub/GitLab
- ✅ Notion/Obsidian
- ✅ README files

### HTML Export
```html
<!DOCTYPE html>
<html>
<head>
  <title>Workflow Results</title>
  <style>/* Beautiful styling */</style>
</head>
<body>
  <h1>🚀 Workflow Execution Results</h1>
  <!-- Pretty formatted results -->
</body>
</html>
```

**Use Cases:**
- ✅ Print to PDF
- ✅ Email reports
- ✅ Web publishing
- ✅ Presentations

---

## ⚠️ Error Handling

### Common Errors

**1. Backend Not Connected**
```
Error: Network Error
Solution: Start backend server (python main.py)
```

**2. CORS Error**
```
Error: CORS policy blocked
Solution: Add frontend URL to backend/.env CORS_ORIGINS
```

**3. Invalid API Key**
```
Error: 401 Unauthorized
Solution: Check API key is correct in Settings
```

**4. Rate Limited**
```
Error: 429 Too Many Requests
Solution: Wait or upgrade API plan
```

**5. Model Not Available**
```
Error: Model not found
Solution: Check model name is correct
```

### Error Display

Frontend shows errors as:
- 🔴 Red toast notification
- ❌ Error icon on failed nodes
- 📝 Detailed error message
- 🔄 Retry button

---

## 🧪 Testing

### Manual Testing

**1. Test Backend:**
```bash
# Health check
curl http://localhost:8000/api/health

# Test workflow execution
curl -X POST http://localhost:8000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Provider: openrouter" \
  -H "X-API-Key: YOUR_KEY" \
  -H "X-Model: meta-llama/llama-3.3-70b-instruct:free" \
  -d '{
    "nodes": [{"id": "1", "type": "trigger", "data": {}, "position": {"x": 0, "y": 0}}],
    "edges": []
  }'
```

**2. Test Frontend:**
- Open browser DevTools (F12)
- Go to Network tab
- Execute workflow
- Check requests/responses

### Automated Testing

**Backend Tests:**
```bash
cd backend
pytest tests/
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

---

## 📊 Monitoring

### Backend Logs

```bash
cd backend
python main.py

# You'll see:
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Executing node: 1 (trigger)
INFO:     Executing node: 2 (agent)
```

### Frontend Logs

Open browser console:
```javascript
// API calls
API Request: POST /api/workflows/execute
API Response: {status: "completed", ...}

// Errors
API Error: Network timeout
```

---

## 🚀 Production Deployment

### Backend (Railway/Render/Fly.io)

**1. Set Environment Variables:**
```bash
PORT=8000
ENV=production
CORS_ORIGINS=https://yourdomain.com
```

**2. Deploy:**
```bash
git push origin main
```

### Frontend (Vercel/Netlify)

**1. Set Environment Variables:**
```bash
VITE_API_URL=https://your-backend.com
VITE_ENV=production
```

**2. Deploy:**
```bash
npm run build
vercel deploy
```

---

## 📝 Example Workflows

### Simple Story Generator

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "trigger",
      "data": { "label": "Start" }
    },
    {
      "id": "2",
      "type": "agent",
      "data": {
        "label": "Story Writer",
        "task": "Write a short sci-fi story",
        "agentType": "single"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "1", "target": "2" }
  ]
}
```

### Multi-Agent Pipeline

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "trigger",
      "data": { "label": "Start Research" }
    },
    {
      "id": "2",
      "type": "agent",
      "data": {
        "label": "Researcher",
        "task": "Research AI trends",
        "agentType": "single"
      }
    },
    {
      "id": "3",
      "type": "agent",
      "data": {
        "label": "Summarizer",
        "task": "Summarize research findings",
        "agentType": "single"
      }
    },
    {
      "id": "4",
      "type": "agent",
      "data": {
        "label": "Writer",
        "task": "Write blog post from summary",
        "agentType": "single"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "1", "target": "2" },
    { "id": "e2", "source": "2", "target": "3" },
    { "id": "e3", "source": "3", "target": "4" }
  ]
}
```

---

## 🔧 Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port availability
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend Can't Connect

```bash
# Check .env file
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:8000

# Restart dev server
npm run dev

# Clear cache
rm -rf node_modules/.vite
```

### CORS Issues

```bash
# Backend .env should include:
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Restart backend
python main.py
```

---

## 📚 Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [OpenRouter API](https://openrouter.ai/docs)

---

© 2026 AutonomOS - Backend Integration Guide
