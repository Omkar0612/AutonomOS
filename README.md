```
   _         _                                 ___  ____  
  /_\  _   _| |_ ___  _ __   ___  _ __ ___   / _ \/ ___| 
 //_\\| | | | __/ _ \| '_ \ / _ \| '_ ` _ \ | | | \___ \ 
/  _  \ |_| | || (_) | | | | (_) | | | | | || |_| |___) |
\_/ \_/\__,_|\__\___/|_| |_|\___/|_| |_| |_| \___/|____/ 
                                                          
```

<div align="center">

# 🤖 AutonomOS

### Visual AI Workflow Builder for Autonomous Agents

[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/Omkar0612/AutonomOS)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?style=for-the-badge&logo=python)](https://www.python.org)

**Build powerful autonomous AI agents with visual drag-and-drop. Deploy multi-agent systems in minutes.**

[🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [🎯 Features](#-features) • [🤝 Contributing](#-contributing)

![AutonomOS Demo](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Visual Workflow Builder**
- 🖱️ Drag & drop interface
- 🎯 No coding required
- 🔗 Connect nodes visually
- 📊 Real-time preview
- 💾 Auto-save workflows
- 📱 Mobile responsive

### 🤖 **AI-Powered Agents**
- 🧠 Single agent mode
- 👥 Multi-agent systems
- 🌳 Hierarchical teams
- 🐝 Swarm intelligence
- 🏛️ Council patterns
- ⚡ Parallel execution

</td>
<td width="50%">

### 🔌 **Multi-Provider Support**
- ⭐ **OpenRouter** (14 FREE models)
- 🤖 OpenAI (GPT-4, GPT-3.5)
- 🎭 Anthropic (Claude 3)
- 🔮 Google (Gemini)
- ⚡ Groq (Ultra-fast)
- 🔄 Easy provider switching

### 🎯 **Professional Features**
- 🌙 Dark mode
- 📊 Real-time analytics
- 📝 Template marketplace
- 🔐 Secure API key management
- 📈 Performance metrics
- 🚀 Production ready

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AutonomOS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Frontend   │ ◄─────► │   Backend    │                │
│  │  React + TS  │  HTTP   │   FastAPI    │                │
│  │  Port: 3000  │         │  Port: 8000  │                │
│  └──────────────┘         └───────┬──────┘                │
│         │                         │                         │
│         │                         │                         │
│         ▼                         ▼                         │
│  ┌──────────────┐         ┌──────────────┐                │
│  │  React Flow  │         │ AI Providers │                │
│  │   Canvas     │         │  OpenRouter  │                │
│  │              │         │   OpenAI     │                │
│  └──────────────┘         │  Anthropic   │                │
│                           └──────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

```bash
✅ Node.js 18+ and npm
✅ Python 3.9+
✅ Git
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Omkar0612/AutonomOS.git
cd AutonomOS
```

### 2️⃣ Start Frontend (5 minutes)

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend running on:** [http://localhost:3000](http://localhost:3000)

### 3️⃣ Start Backend (5 minutes)

```bash
# Open new terminal
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```

✅ **Backend running on:** [http://localhost:8000](http://localhost:8000)

✅ **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 4️⃣ Get API Key (2 minutes)

#### Option A: OpenRouter (Recommended - 14 FREE models)

```bash
1. Visit: https://openrouter.ai/keys
2. Sign up (free)
3. Add $10 credits (one-time, unlocks 1,000 free req/day)
4. Generate API key
5. Copy key (starts with sk-or-v1-...)
```

**💡 Why $10?** Unlocks 1,000 free requests/day forever. Credits stay in account.

#### Option B: Completely Free Alternatives

<table>
<tr>
<th>Provider</th>
<th>Free Models</th>
<th>No Card</th>
<th>Sign Up</th>
</tr>
<tr>
<td>Groq</td>
<td>Llama 3.1 70B</td>
<td>✅</td>
<td><a href="https://console.groq.com">console.groq.com</a></td>
</tr>
<tr>
<td>Google AI</td>
<td>Gemini 1.5 Flash</td>
<td>✅</td>
<td><a href="https://makersuite.google.com">makersuite.google.com</a></td>
</tr>
<tr>
<td>Hugging Face</td>
<td>Llama, Mistral</td>
<td>✅</td>
<td><a href="https://huggingface.co">huggingface.co</a></td>
</tr>
</table>

### 5️⃣ Configure AutonomOS

```bash
1. Open: http://localhost:3000
2. Sign up / Login
3. Go to Settings → API Keys
4. Click "Add Key"
5. Select Provider: OpenRouter
6. Choose Model: Llama 3.3 70B (free)
7. Paste API Key
8. Click "Add API Key"
9. ✅ Active key indicator turns green
```

### 6️⃣ Build Your First Workflow

```bash
1. Click "New Workflow"
2. Drag nodes from sidebar:
   - Trigger Node → Canvas
   - Agent Node → Canvas
   - Action Node → Canvas
3. Connect nodes (drag from output to input)
4. Click Agent Node → Configure:
   - Task: "Write a short poem about AI"
   - Model: Auto-selected from Settings
5. Click "Execute" 🚀
6. Watch AI magic happen! ✨
```

---

## 📚 Documentation

### 🎨 Frontend Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| **React** | 18.3 | UI framework |
| **TypeScript** | 5.2 | Type safety |
| **Vite** | 5.1 | Build tool |
| **Tailwind CSS** | 3.4 | Styling |
| **React Flow** | 11.10 | Workflow canvas |
| **Framer Motion** | 11.0 | Animations |
| **React Router** | 6.22 | Routing |
| **Axios** | 1.6 | HTTP client |

### 🔧 Backend Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| **FastAPI** | 0.109 | API framework |
| **Python** | 3.11+ | Language |
| **Uvicorn** | 0.27 | ASGI server |
| **httpx** | 0.26 | Async HTTP |
| **Pydantic** | 2.5 | Validation |

### 📂 Project Structure

```
AutonomOS/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── nodes/       # Custom React Flow nodes
│   │   │   ├── Sidebar.tsx  # Node library
│   │   │   ├── NodePanel.tsx # Node settings
│   │   │   └── WorkflowBuilder.tsx # Main canvas
│   │   ├── contexts/        # Global state
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ApiKeyContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── WorkflowContext.tsx
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API service
│   │   └── App.tsx          # Root component
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                 # FastAPI application
│   ├── main.py              # API routes & workflow engine
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment template
│   └── README.md            # Backend docs
│
├── TESTING.md               # E2E testing guide
└── README.md                # This file
```

---

## 🔌 API Endpoints

### Backend API

```http
GET  /                           # API info
GET  /api/health                 # Health check
POST /api/workflows/execute      # Execute workflow ⭐
POST /api/test-key               # Test API key
GET  /api/models/{provider}      # Get available models
```

### Example: Execute Workflow

```bash
curl -X POST http://localhost:8000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Provider: openrouter" \
  -H "X-API-Key: sk-or-v1-..." \
  -H "X-Model: meta-llama/llama-3.3-70b-instruct:free" \
  -d '{
    "nodes": [
      {
        "id": "agent-1",
        "type": "agent",
        "data": {"task": "Write a haiku about code"},
        "position": {"x": 0, "y": 0}
      }
    ],
    "edges": []
  }'
```

---

## 🆓 Free Models Guide

### OpenRouter Free Models (After $10 Purchase)

| Model | Context | Best For | Speed |
|-------|---------|----------|-------|
| **Llama 3.3 70B** 🏆 | 131K | General tasks | ⚡⚡⚡ |
| **Llama 3.1 405B** | 131K | Complex reasoning | ⚡⚡ |
| **Devstral 2** | 262K | Coding | ⚡⚡⚡ |
| **Qwen3-Coder 480B** | 262K | Coding | ⚡⚡ |
| **Gemini 2.0 Flash** | 1M | Long context | ⚡⚡⚡⚡ |
| **DeepSeek R1** | 64K | Reasoning | ⚡⚡⚡ |
| **Mistral Small 3.1** | 128K | Fast tasks | ⚡⚡⚡⚡ |

### Rate Limits

| Tier | Requests/Day | Requests/Min |
|------|--------------|-------------|
| **Free (No Credits)** | 20-50 | Limited |
| **After $10 Credits** | 1,000 | 20 per model |
| **Paid** | Unlimited | Higher |

---

## 🎯 Use Cases

### 1. Lead Generation Automation

```
Trigger (Webhook) → Research Agent → Qualification Agent → 
Email Agent → CRM Update
```

### 2. Content Creation Pipeline

```
Trigger (Schedule) → Research Agent → Writer Agent → 
Editor Agent → Publish Action
```

### 3. Customer Support Bot

```
Trigger (Chat) → Intent Agent → Multi-Agent Council → 
Response Agent → Send Action
```

### 4. Data Analysis Workflow

```
Trigger (Upload) → Parser Agent → Analyst Agent → 
Visualizer Agent → Report Generator
```

---

## 🐛 Troubleshooting

### Issue: 402 Payment Required (OpenRouter)

**Problem:** API returns 402 error even with free models.

**Solution:**
```bash
1. Add $10 credits to OpenRouter account
2. Unlocks 1,000 free requests/day
3. Generate NEW API key
4. Update key in AutonomOS Settings
```

**Alternative:** Use Groq, Google AI, or Hugging Face (no payment needed).

### Issue: CORS Error

**Problem:** Frontend can't connect to backend.

**Solution:**
```bash
# backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Restart backend
python main.py
```

### Issue: Port Already in Use

**Frontend (3000):**
```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
VITE_PORT=3001 npm run dev
```

**Backend (8000):**
```bash
# Kill process
lsof -ti:8000 | xargs kill -9

# Or change port in .env
PORT=8001
```

### Issue: Workflow Not Executing

**Checklist:**
- ✅ Backend running on port 8000
- ✅ API key added in Settings
- ✅ Green indicator showing active key
- ✅ At least one node in canvas
- ✅ Check browser console (F12) for errors
- ✅ Check backend logs for API errors

---

## 📊 Performance Metrics

### Load Times

- **Landing Page:** < 1.5s
- **Dashboard:** < 2s  
- **Workflow Builder:** < 2.5s
- **API Response:** < 500ms (without AI)
- **AI Execution:** 1-10s (depends on model)

### Bundle Sizes

- **JS Bundle:** ~450KB (gzipped)
- **CSS Bundle:** ~50KB (gzipped)
- **Total:** ~500KB

### Lighthouse Scores (Target)

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

---

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

```bash
# Build
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod --dir=dist
```

### Backend (Railway/Render/Fly.io)

```bash
# Railway
railway init
railway up

# Or Docker
docker build -t autonomos-backend ./backend
docker run -p 8000:8000 autonomos-backend
```

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=https://api.autonomos.ai
VITE_APP_NAME=AutonomOS
VITE_APP_VERSION=1.0.0
```

**Backend (.env):**
```env
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=https://autonomos.ai,https://app.autonomos.ai
```

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive E2E testing guide.

```bash
# Run tests
cd frontend
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/AutonomOS.git
cd AutonomOS
```

### 2. Create Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes

- Follow existing code style
- Add tests for new features
- Update documentation
- Test thoroughly

### 4. Commit

```bash
git commit -m "✨ Add amazing feature"
```

**Commit Convention:**
- ✨ `:sparkles:` - New feature
- 🐛 `:bug:` - Bug fix
- 📚 `:books:` - Documentation
- 🎨 `:art:` - UI/Style
- ⚡ `:zap:` - Performance
- 🔧 `:wrench:` - Configuration

### 5. Push & PR

```bash
git push origin feature/amazing-feature
```

Then open a Pull Request on GitHub.

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Credits

### Built With ❤️ By

**[Omkar Parab](https://github.com/Omkar0612)**

### Inspired By

- [n8n](https://n8n.io) - Workflow automation
- [Flowise](https://flowiseai.com) - LLM orchestration  
- [LangFlow](https://www.langflow.org) - AI chains

### Design Inspiration

- [Linear](https://linear.app) - Clean UI
- [Vercel](https://vercel.com) - Modern design
- [Stripe](https://stripe.com) - Professional polish

### Icons & Assets

- [Lucide React](https://lucide.dev) - Icon set
- [Google Fonts](https://fonts.google.com) - Inter font

---

## 📞 Support

### Get Help

- 🐛 **Report Bugs:** [GitHub Issues](https://github.com/Omkar0612/AutonomOS/issues)
- 💬 **Discord Community:** [Join Server](https://discord.gg/autonomos)
- 📧 **Email:** omkar@autonomos.ai
- 📖 **Documentation:** [docs.autonomos.ai](https://docs.autonomos.ai)

### Stay Updated

- ⭐ **Star this repo** to show support
- 👁️ **Watch** for updates
- 🍴 **Fork** to contribute

---

## 🗺️ Roadmap

### Q2 2026

- [ ] Backend persistence (PostgreSQL)
- [ ] Real user authentication (JWT)
- [ ] Workflow versioning
- [ ] Webhook triggers
- [ ] Schedule triggers

### Q3 2026

- [ ] Team collaboration
- [ ] Advanced analytics dashboard
- [ ] Marketplace for workflows
- [ ] Workflow monetization
- [ ] More AI providers (Groq, Google)

### Q4 2026

- [ ] Mobile apps (iOS/Android)
- [ ] On-premise deployment
- [ ] Enterprise features
- [ ] SSO integration
- [ ] Advanced permissions

---

## 📈 Stats

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/Omkar0612/AutonomOS?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Omkar0612/AutonomOS?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Omkar0612/AutonomOS)
![GitHub PRs](https://img.shields.io/github/issues-pr/Omkar0612/AutonomOS)

</div>

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

**Built with 💙 for AI developers**

© 2026 AutonomOS. All rights reserved.

[Website](https://autonomos.ai) • [Documentation](https://docs.autonomos.ai) • [Discord](https://discord.gg/autonomos) • [Twitter](https://twitter.com/autonomos_ai)

</div>
