# 🚀 AutonomOS

**The Ultimate AI Agent Workflow Builder** - Build, execute, and export AI workflows with a beautiful visual interface.

![AutonomOS](https://img.shields.io/badge/version-2.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab)
![Performance](https://img.shields.io/badge/performance-optimized-brightgreen)

**NEW v2.2.0:** ⚡ **40-70% performance boost** | 📊 Real-time metrics | 💾 30-40% less memory

---

## ✨ Features

### 🎯 Core Features
- 📏 **Visual Workflow Builder** - Drag-and-drop interface with React Flow
- 🤖 **AI Agent Orchestration** - Connect multiple AI agents in workflows
- 🔗 **Multi-Model Support** - 40+ FREE models via OpenRouter (no credit card!)
- 🎯 **Node Types** - Triggers, Agents, Actions, Logic nodes
- 💾 **Templates** - Pre-built workflow templates
- 💡 **Real-time Execution** - Watch your workflows run live

### ⚡ Performance (NEW v2.2.0)
- 🚀 **40-70% faster** API responses
- 💾 **30-40% less** memory usage
- 📊 **4x throughput** improvement
- 🔄 **Connection pooling** for AI APIs
- 💬 **Redis caching** (95% faster repeated requests)
- 📈 **Real-time monitoring** at `/api/metrics`

### 📥 Export Formats
Export your workflow results in **7 professional formats**:

1. **📝 PDF** - Professional reports with formatting
2. **📝 Word (DOCX)** - Editable Microsoft Word documents
3. **📚 Excel (XLSX)** - Spreadsheets with multiple worksheets
4. **📊 PowerPoint (PPTX)** - Presentation slides
5. **📦 JSON** - Raw data for API integration
6. **📊 CSV** - Simple spreadsheet format
7. **📝 Markdown** - GitHub-flavored documentation

[Learn more about export features →](./EXPORT_FEATURES.md)

### 🎨 Beautiful UI
- ✨ Glassmorphic design
- 🌚 Dark mode support
- 💠 Smooth animations with Framer Motion
- 🎨 Color-coded node types
- 📱 Responsive layout

---

## 🚀 Quick Start

### Option 1: Optimized (Recommended)
```bash
# Clone repository
git clone https://github.com/Omkar0612/AutonomOS.git
cd AutonomOS

# Install with optimizations
make install-optimized

# Start development servers
make dev

# Open http://localhost:5173
```

### Option 2: Manual Setup
```bash
# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-optimized.txt
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
cp .env.example .env

# Run (2 terminals)
# Terminal 1: Backend
cd backend && source venv/bin/activate && python main.py

# Terminal 2: Frontend
cd frontend && npm run dev

# Open http://localhost:5173
```

### Get Free API Key
1. Go to [OpenRouter.ai/keys](https://openrouter.ai/keys)
2. Create account (no card needed)
3. In app: Settings → Add API Key
4. Choose FREE model: `meta-llama/llama-3.3-70b-instruct:free`

---

## 📊 Performance Comparison

| Metric | Before | After v2.2.0 | Improvement |
|--------|--------|--------------|-------------|
| **API Response** | 800-1200ms | 200-400ms | ⬇️ **60-70%** |
| **Workflow Execution** | 3-5s | 1-2s | ⬇️ **60-70%** |
| **Memory Usage** | 250-400MB | 150-250MB | ⬇️ **30-40%** |
| **Throughput** | ~20 req/s | ~80 req/s | ⬆️ **4x** |
| **Bundle Size** | 2.5MB | 1.5MB | ⬇️ **40%** |

**Quick Optimization Guide:** [15-minute setup →](./OPTIMIZATION_QUICKSTART.md)

---

## 📚 Documentation

### Getting Started
- 🚀 [Quick Start Guide](./SETUP.md) - Complete installation
- ⚡ [Optimization Quick Start](./OPTIMIZATION_QUICKSTART.md) - 15-min performance boost
- 📋 [File Structure](./FILE_STRUCTURE.md) - Project hierarchy

### Features
- 📥 [Export Features](./EXPORT_FEATURES.md) - PDF, DOCX, Excel, PPT
- 🔧 [Execution Engine](./backend/execution/README.md) - Workflow engine docs
- 📄 [Examples](./docs/EXAMPLES.md) - Usage examples

### Performance
- 📊 [Optimization Summary](./OPTIMIZATION_SUMMARY.md) - What was optimized
- 📈 [Full Optimization Report](./OPTIMIZATION_REPORT.md) - Technical details
- 🛠️ [Testing Guide](./TESTING.md) - Test & benchmark

### Development
- 🔧 [Architecture](./docs/ARCHITECTURE.md) - System design
- 📝 [Changelog](./CHANGELOG.md) - Version history
- 🐛 [Contributing](./CONTRIBUTING.md) - How to contribute

---

## 🔧 Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Async:** uvloop (2-4x faster)
- **JSON:** orjson (2-3x faster)
- **Caching:** Redis + in-memory fallback
- **AI Providers:** OpenRouter, OpenAI, Anthropic

### Frontend
- **Framework:** React 18.2 + TypeScript
- **Build Tool:** Vite (optimized)
- **UI Library:** Tailwind CSS
- **Workflow Canvas:** React Flow
- **Animations:** Framer Motion
- **Export:** jsPDF, docx, ExcelJS, pptxgenjs

### DevOps
- **Container:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus metrics
- **Testing:** Pytest + Vitest

---

## 🔥 New in v2.2.0

### ⚡ Performance Optimizations
- ✅ Connection pooling for AI APIs (40-50% faster)
- ✅ Redis/memory caching (95% faster repeated requests)
- ✅ Gzip compression (70% smaller responses)
- ✅ uvloop integration (2-4x faster event loop)
- ✅ orjson integration (2-3x faster JSON)

### 📊 Monitoring & Observability
- ✅ Performance metrics endpoint (`/api/metrics`)
- ✅ Request tracking and timing
- ✅ Error rate monitoring
- ✅ Latency percentiles (p50, p95, p99)

### 🔧 Developer Experience
- ✅ Enhanced Makefile with optimization commands
- ✅ Benchmark script for performance testing
- ✅ Centralized error handling
- ✅ Comprehensive optimization docs

### 📚 Documentation
- ✅ 15-minute quick-start guide
- ✅ Full optimization report (16KB)
- ✅ Performance comparison tables
- ✅ Complete file structure map

---

## 🛠️ Make Commands

```bash
make help                 # Show all commands
make install-optimized   # Install with optimizations
make dev                 # Start development servers
make test                # Run tests
make benchmark           # Run performance benchmarks
make metrics             # Fetch current metrics
make clean               # Clean build artifacts
make docker-up           # Start with Docker
```

---

## 📊 Monitoring

### Metrics Endpoint
```bash
curl http://localhost:8000/api/metrics
```

**Response:**
```json
{
  "uptime_seconds": 1250.3,
  "total_requests": 532,
  "total_errors": 8,
  "endpoints": {
    "workflow_execute": {
      "count": 425,
      "avg_duration": 0.42,
      "p95_duration": 0.85
    }
  }
}
```

---

## 💻 Usage Example

### Create a Simple Workflow
```javascript
const workflow = {
  nodes: [
    { id: '1', type: 'trigger', data: { triggerType: 'manual' } },
    { id: '2', type: 'agent', data: { task: 'Analyze this data' } },
    { id: '3', type: 'action', data: { actionType: 'export_pdf' } }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' }
  ]
}
```

### Execute via API
```bash
curl -X POST http://localhost:8000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Provider: openrouter" \
  -H "X-API-Key: your-key" \
  -H "X-Model: meta-llama/llama-3.3-70b-instruct:free" \
  -d '{"nodes": [...], "edges": [...]}'
```

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 👏 Contributors

Thanks to all contributors who have helped make AutonomOS better!

<a href="https://github.com/Omkar0612/AutonomOS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Omkar0612/AutonomOS" />
</a>

---

## 🔗 Links

- **Repository:** [github.com/Omkar0612/AutonomOS](https://github.com/Omkar0612/AutonomOS)
- **Issues:** [Report a bug](https://github.com/Omkar0612/AutonomOS/issues)
- **Documentation:** [Full docs](./docs/)
- **Optimization Guide:** [15-min quick start](./OPTIMIZATION_QUICKSTART.md)

---

**Made with ❤️ by [Omkar Parab](https://github.com/Omkar0612) | Powered by 40+ FREE AI models ⭐**

**v2.2.0** - Now with ⚡ 40-70% performance boost!
