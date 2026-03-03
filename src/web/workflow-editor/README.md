# AutonomOS Visual Workflow Editor

Production-ready drag-and-drop workflow builder for AutonomOS.

## Features

✅ **Visual Node Editor** - Drag and drop interface powered by React Flow  
✅ **Multi-Agent Support** - Create hierarchical, swarm, and council workflows  
✅ **Real-time Execution** - Execute workflows and see results live  
✅ **Save/Load** - Persist workflows to localStorage or backend  
✅ **Auto-Layout** - Automatic node arrangement with ELK  
✅ **Custom Nodes** - Trigger, Agent, Action, Logic nodes  
✅ **Properties Panel** - Configure node parameters  
✅ **Export/Import** - JSON workflow format  

## Quick Start

### Frontend

```bash
cd src/web/workflow-editor
npm install
npm run dev
```

Open http://localhost:5173

### Backend

```bash
cd ../../..
python src/api/workflow_api.py
```

API available at http://localhost:8000

## Node Types

### 1. Trigger Nodes
- **Schedule**: Cron-based scheduling
- **Webhook**: HTTP webhook triggers
- **Event**: System event triggers

### 2. Agent Nodes
- **Single Agent**: Individual AI agent
- **Multi-Agent Team**: Hierarchical/Swarm/Council patterns

### 3. Action Nodes
- **API Call**: HTTP requests
- **Send Email**: Email automation
- **Code Execution**: Run custom code

### 4. Logic Nodes
- **If/Else**: Conditional branching
- **Loop**: Iteration logic
- **Transform**: Data transformation

## Usage

1. **Drag nodes** from palette to canvas
2. **Connect nodes** by dragging between handles
3. **Configure** nodes using properties panel
4. **Save** workflow (Ctrl+S)
5. **Execute** workflow to run

## Architecture

```
src/web/workflow-editor/
├── src/
│   ├── App.tsx               # Main React Flow app
│   ├── components/
│   │   ├── NodePalette.tsx   # Drag-and-drop palette
│   │   ├── PropertiesPanel.tsx  # Node configuration
│   │   └── Toolbar.tsx       # Actions toolbar
│   ├── nodes/
│   │   ├── TriggerNode.tsx   # Trigger node component
│   │   ├── AgentNode.tsx     # Agent node component
│   │   ├── ActionNode.tsx    # Action node component
│   │   └── LogicNode.tsx     # Logic node component
│   ├── store/
│   │   └── workflowStore.ts  # Zustand state management
│   └── types/
│       └── workflow.ts       # TypeScript types

src/api/
└── workflow_api.py           # FastAPI backend
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Node editor
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **FastAPI** - Backend API
- **WebSocket** - Real-time updates

## API Endpoints

### Execute Workflow
```bash
POST /api/workflow/execute
```

### Get Templates
```bash
GET /api/workflow/templates
```

### Save Workflow
```bash
POST /api/workflow/save
```

## Keyboard Shortcuts

- **Ctrl+S** - Save workflow
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Delete** - Remove selected nodes
- **Ctrl+A** - Select all nodes

## Workflow JSON Format

```json
{
  "nodes": [
    {
      "id": "trigger-1",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Daily Schedule",
        "triggerType": "schedule",
        "cron": "0 9 * * *"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "trigger-1",
      "target": "agent-1"
    }
  ]
}
```

## Performance

- **60 FPS** rendering with virtual canvas
- **1000+ nodes** supported
- **Real-time** collaboration ready
- **Auto-save** every 30 seconds

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## Contributing

See main [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../../LICENSE)
