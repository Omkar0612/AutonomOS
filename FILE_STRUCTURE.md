# 📁 AutonomOS File System Hierarchy

Complete directory structure with descriptions.

```
AutonomOS/
├── 📄 README.md                      # Project overview and documentation
├── 📄 SETUP.md                       # Complete setup instructions
├── 📄 CHANGELOG.md                   # Version history and changes
├── 📄 TESTING.md                     # Testing documentation
├── 📄 LICENSE                        # Project license
├── 📄 .gitignore                     # Git ignore rules
├── 🔧 setup.sh                       # Master setup script (both frontend & backend)
├── 🔧 Makefile                       # Build automation
├── 🐳 Dockerfile                     # Docker container config
├── 🐳 Dockerfile.optimized           # Optimized Docker build
├── 🐳 docker-compose.yml             # Multi-container orchestration
├── 📄 requirements-ci.txt            # CI/CD Python dependencies
├── 📄 setup.py                       # Python package setup
│
├── 📂 docs/                          # Documentation
│   ├── EXAMPLES.md                   # Usage examples
│   ├── OPTIMIZATION.md               # Performance optimization guide
│   ├── API.md                        # API documentation
│   └── ARCHITECTURE.md               # System architecture
│
├── 📂 .github/                       # GitHub configuration
│   └── workflows/                    # CI/CD workflows
│       ├── ci.yml                    # Continuous integration
│       ├── deploy.yml                # Deployment pipeline
│       └── security.yml              # Security scanning
│
├── 📂 backend/                       # Python FastAPI backend
│   ├── 📄 main.py                    # Main API application (370 lines)
│   ├── 📄 validators.py              # Input validation & sanitization
│   ├── 📄 rate_limiter.py            # API rate limiting
│   ├── 📄 requirements.txt           # Python dependencies
│   ├── 📄 .env.example               # Environment variables template
│   ├── 📄 .gitignore                 # Backend-specific ignores
│   ├── 🔧 setup.sh                   # Backend setup script
│   │
│   ├── 📂 execution/                 # ⭐ Enhanced Execution Engine (Phase 1.1)
│   │   ├── __init__.py               # Package initialization
│   │   ├── executor.py               # Main workflow executor (425 lines)
│   │   ├── context.py                # Execution context & variables (107 lines)
│   │   ├── logic.py                  # Logic execution (if/else, loops, parallel) (370 lines)
│   │   ├── actions.py                # Action handlers (API, DB, email, etc.) (230 lines)
│   │   ├── triggers.py               # Trigger system (schedule, webhook, etc.) (290 lines)
│   │   └── README.md                 # Execution engine documentation (500+ lines)
│   │
│   ├── 📂 tests/                     # Backend tests
│   │   ├── __init__.py
│   │   ├── test_main.py              # API endpoint tests
│   │   ├── test_validators.py        # Validation tests
│   │   ├── test_execution/           # Execution engine tests
│   │   │   ├── test_context.py
│   │   │   ├── test_logic.py
│   │   │   ├── test_actions.py
│   │   │   └── test_triggers.py
│   │   └── conftest.py               # Pytest configuration
│   │
│   └── 📂 venv/                      # Virtual environment (gitignored)
│       └── ...                       # Python packages
│
└── 📂 frontend/                      # React + TypeScript frontend
    ├── 📄 package.json               # Node dependencies & scripts
    ├── 📄 package-lock.json          # Lock file (gitignored)
    ├── 📄 tsconfig.json              # TypeScript configuration
    ├── 📄 vite.config.ts             # Vite build configuration
    ├── 📄 vitest.config.ts           # Vitest test configuration
    ├── 📄 tailwind.config.js         # Tailwind CSS configuration
    ├── 📄 postcss.config.js          # PostCSS configuration
    ├── 📄 .eslintrc.cjs              # ESLint configuration
    ├── 📄 .gitignore                 # Frontend-specific ignores
    ├── 📄 index.html                 # HTML entry point
    ├── 🔧 setup.sh                   # Frontend setup script
    │
    ├── 📂 public/                    # Static assets
    │   ├── vite.svg                  # Vite logo
    │   └── favicon.ico               # Site favicon
    │
    ├── 📂 src/                       # Source code
    │   ├── 📄 main.tsx               # Application entry point
    │   ├── 📄 App.tsx                # Root component
    │   ├── 📄 index.css              # Global styles
    │   ├── 📄 vite-env.d.ts          # Vite TypeScript definitions
    │   │
    │   ├── 📂 components/            # React components
    │   │   ├── 📂 workflow/          # Workflow canvas components
    │   │   │   ├── WorkflowCanvas.tsx
    │   │   │   ├── NodeTypes.tsx
    │   │   │   ├── CustomNode.tsx
    │   │   │   ├── TriggerNode.tsx
    │   │   │   ├── AgentNode.tsx
    │   │   │   ├── ActionNode.tsx
    │   │   │   ├── LogicNode.tsx
    │   │   │   └── ConnectionLine.tsx
    │   │   │
    │   │   ├── 📂 ui/                # Reusable UI components
    │   │   │   ├── Button.tsx
    │   │   │   ├── Input.tsx
    │   │   │   ├── Modal.tsx
    │   │   │   ├── Dropdown.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Toast.tsx
    │   │   │   └── Spinner.tsx
    │   │   │
    │   │   ├── 📂 layout/            # Layout components
    │   │   │   ├── Header.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── Footer.tsx
    │   │   │   └── Container.tsx
    │   │   │
    │   │   ├── 📂 settings/          # Settings components
    │   │   │   ├── SettingsPanel.tsx
    │   │   │   ├── APIKeyForm.tsx
    │   │   │   └── ModelSelector.tsx
    │   │   │
    │   │   └── 📂 results/           # Results page components
    │   │       ├── ResultsPage.tsx
    │   │       ├── NodeResult.tsx
    │   │       ├── ResultCard.tsx
    │   │       └── ExportButtons.tsx
    │   │
    │   ├── 📂 pages/                 # Page components
    │   │   ├── Home.tsx
    │   │   ├── Workflows.tsx
    │   │   ├── Results.tsx
    │   │   ├── Settings.tsx
    │   │   └── NotFound.tsx
    │   │
    │   ├── 📂 hooks/                 # Custom React hooks
    │   │   ├── useWorkflow.ts
    │   │   ├── useNodes.ts
    │   │   ├── useEdges.ts
    │   │   ├── useAPI.ts
    │   │   ├── useSettings.ts
    │   │   └── useLocalStorage.ts
    │   │
    │   ├── 📂 context/               # React Context providers
    │   │   ├── WorkflowContext.tsx
    │   │   ├── SettingsContext.tsx
    │   │   └── ThemeContext.tsx
    │   │
    │   ├── 📂 utils/                 # Utility functions
    │   │   ├── api.ts                # API client
    │   │   ├── export.ts             # Export utilities (PDF, DOCX, Excel, PPT)
    │   │   ├── validation.ts         # Input validation
    │   │   ├── formatting.ts         # Data formatting
    │   │   └── constants.ts          # App constants
    │   │
    │   ├── 📂 types/                 # TypeScript type definitions
    │   │   ├── workflow.ts           # Workflow types
    │   │   ├── node.ts               # Node types
    │   │   ├── edge.ts               # Edge types
    │   │   ├── api.ts                # API types
    │   │   └── settings.ts           # Settings types
    │   │
    │   ├── 📂 styles/                # Additional styles
    │   │   ├── workflow.css          # Workflow-specific styles
    │   │   ├── animations.css        # Animation definitions
    │   │   └── themes.css            # Theme variables
    │   │
    │   └── 📂 assets/                # Images, icons, fonts
    │       ├── logo.svg
    │       ├── icons/
    │       └── fonts/
    │
    ├── 📂 tests/                     # Frontend tests
    │   ├── setup.ts                  # Test setup
    │   ├── __mocks__/                # Test mocks
    │   ├── components/               # Component tests
    │   ├── hooks/                    # Hook tests
    │   └── utils/                    # Utility tests
    │
    └── 📂 node_modules/              # NPM packages (gitignored)
        └── ...
```

---

## 📊 File Count Summary

### Backend (Python)
- **Core Files:** 7
- **Execution Engine:** 6
- **Tests:** ~10
- **Config Files:** 5
- **Total:** ~28 files
- **Lines of Code:** ~2,500+

### Frontend (TypeScript/React)
- **Components:** ~30
- **Pages:** 5
- **Hooks:** 6
- **Utils:** 5
- **Types:** 5
- **Tests:** ~20
- **Config Files:** 8
- **Total:** ~79 files
- **Lines of Code:** ~5,000+

### Documentation
- **Root Docs:** 10
- **docs/ folder:** 4
- **Execution Engine:** 1 (comprehensive)
- **Total:** 15 files

### Configuration
- **Setup Scripts:** 3
- **Docker:** 3
- **CI/CD:** 3
- **Total:** 9 files

**Grand Total:** ~131 files, ~8,000+ lines of code

---

## 🎯 Key Directories

### **Backend Core**
```
backend/
├── main.py          # FastAPI app with routes
├── validators.py    # Security & validation
└── execution/       # ⭐ NEW: Enhanced execution engine
```

### **Execution Engine** (Phase 1.1)
```
backend/execution/
├── executor.py      # Workflow execution with graph traversal
├── context.py       # Variable & context management
├── logic.py         # If/else, loops, parallel execution
├── actions.py       # HTTP, DB, file, email actions
├── triggers.py      # Schedule, webhook, file triggers
└── README.md        # Complete documentation
```

### **Frontend Core**
```
frontend/src/
├── components/workflow/    # Canvas & nodes
├── components/ui/          # Reusable UI
├── pages/                  # Main pages
├── hooks/                  # Custom hooks
└── utils/                  # Helper functions
```

---

## 🔑 Key Features by Location

### Logic & Control Flow
**Location:** `backend/execution/logic.py`
- If/Else branching
- Switch/Case
- For/While/Until loops
- ForEach iteration
- Parallel execution
- Try/Catch error handling

### Data Flow
**Location:** `backend/execution/context.py`
- Variable storage
- Node output management
- Expression evaluation
- Type resolution
- Error tracking

### Triggers
**Location:** `backend/execution/triggers.py`
- Cron scheduling
- Webhook endpoints
- Database monitoring
- Email watching
- File system events

### Actions
**Location:** `backend/execution/actions.py`
- HTTP/API calls
- Database operations
- File operations
- Email sending
- Notifications

### Frontend Components
**Location:** `frontend/src/components/`
- Workflow canvas (ReactFlow)
- Node types (Trigger, Agent, Action, Logic)
- Settings panel
- Results display
- Export functionality

---

## 📝 Configuration Files

### Root Level
- `setup.sh` - Master setup script
- `Makefile` - Build commands
- `Dockerfile` - Container image
- `docker-compose.yml` - Multi-container setup

### Backend
- `requirements.txt` - Python packages
- `.env` - Environment variables
- `setup.sh` - Backend-specific setup

### Frontend
- `package.json` - Node packages & scripts
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - CSS framework
- `setup.sh` - Frontend-specific setup

---

## 🚀 Workflow Execution Flow

```
1. User creates workflow in frontend
   ↓
2. POST /api/workflows/execute
   ↓
3. main.py receives request
   ↓
4. WorkflowExecutor builds graph
   ↓
5. Nodes execute in dependency order
   ├── LogicEngine (if/else, loops)
   ├── ActionHandler (HTTP, DB, etc.)
   └── TriggerManager (for scheduled workflows)
   ↓
6. Context manages variables & outputs
   ↓
7. Results returned to frontend
   ↓
8. ResultsPage displays execution data
   ↓
9. Export to PDF/DOCX/Excel/PPT
```

---

## 🔄 Data Flow

```
Frontend (React)     Backend (FastAPI)      Execution Engine
     │                      │                       │
     │   POST /execute      │                       │
     ├──────────────────────>│                       │
     │                      │   WorkflowExecutor    │
     │                      ├──────────────────────>│
     │                      │                       │
     │                      │   Graph Traversal     │
     │                      │<──────────────────────┤
     │                      │                       │
     │                      │   Node Execution      │
     │                      │<──────────────────────┤
     │                      │                       │
     │   Results JSON       │   Context & Outputs   │
     │<──────────────────────┤<──────────────────────┤
     │                      │                       │
     │   Display Results    │                       │
     └──────────────────────                        │
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.0.0
python-dotenv>=1.0.0
httpx>=0.25.0
slowapi>=0.1.9
bleach>=6.1.0
croniter>=2.0.1     # NEW: Cron scheduling
watchdog>=3.0.0     # NEW: File monitoring
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "reactflow": "^11.10.4",
    "framer-motion": "^10.18.0",
    "axios": "^1.6.5",
    "jspdf": "^2.5.1",
    "docx": "^8.5.0",
    "exceljs": "^4.4.0",
    "pptxgenjs": "^3.12.0"
  }
}
```

---

## 🛠️ Generated/Ignored Files

### Backend
- `venv/` - Virtual environment
- `__pycache__/` - Python bytecode
- `*.pyc` - Compiled Python
- `.env` - Environment variables
- `*.log` - Log files

### Frontend
- `node_modules/` - NPM packages
- `dist/` - Production build
- `.vite/` - Vite cache
- `coverage/` - Test coverage reports

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `CHANGELOG.md` - Version history
- `TESTING.md` - Testing guide
- `backend/execution/README.md` - Execution engine docs
- `docs/EXAMPLES.md` - Usage examples
- `docs/OPTIMIZATION.md` - Performance tips
- `docs/API.md` - API reference
- `docs/ARCHITECTURE.md` - System design

---

## 🎨 Frontend Structure Details

### Component Hierarchy
```
App.tsx
├── Header
├── Sidebar
│   └── Navigation
├── Main Content
│   ├── WorkflowCanvas
│   │   ├── TriggerNode
│   │   ├── AgentNode
│   │   ├── ActionNode
│   │   ├── LogicNode
│   │   └── ConnectionLines
│   ├── SettingsPanel
│   │   ├── APIKeyForm
│   │   └── ModelSelector
│   └── ResultsPage
│       ├── NodeResults
│       └── ExportButtons
└── Footer
```

### State Management
```
Context Providers:
- WorkflowContext (nodes, edges, execution)
- SettingsContext (API keys, models)
- ThemeContext (dark/light mode)
```

---

## ✨ Recently Added (Phase 1.1)

```
backend/execution/
├── executor.py      ✅ NEW (425 lines)
├── context.py       ✅ NEW (107 lines)
├── logic.py         ✅ NEW (370 lines)
├── actions.py       ✅ NEW (230 lines)
├── triggers.py      ✅ NEW (290 lines)
└── README.md        ✅ NEW (500+ lines)

backend/
├── requirements.txt ✅ UPDATED (added croniter, watchdog)
└── main.py          ✅ UPDATED (integrated new engine)

Root:
├── setup.sh         ✅ NEW (master setup)
├── SETUP.md         ✅ NEW (complete guide)
└── FILE_STRUCTURE.md ✅ NEW (this file)

backend/
└── setup.sh         ✅ NEW (backend setup)

frontend/
└── setup.sh         ✅ NEW (frontend setup)
```

---

**Total Project Size:** ~8,000+ lines of production code across 131 files

**Repository:** [github.com/Omkar0612/AutonomOS](https://github.com/Omkar0612/AutonomOS)
