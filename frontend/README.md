# AutonomOS Web UI

🎨 Beautiful drag-and-drop visual workflow builder for AutonomOS

## Features

- 🎯 **Drag-and-Drop Interface** - Intuitive visual workflow building
- 🤖 **Multi-Agent Support** - Hierarchical, Swarm, and Council patterns
- 📚 **Template Library** - Pre-built workflows for common use cases
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- ⚡ **Real-time Execution** - Execute workflows and see results instantly
- 💾 **Save/Load** - Save workflows and load them later
- 📱 **Responsive** - Works on desktop and tablet

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- AutonomOS backend running on port 8000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser

## Usage

### 1. Drag Nodes

Drag node types from the left sidebar onto the canvas:
- **Trigger** - Start workflow execution
- **AI Agent** - Configure AI agents (single or multi-agent)
- **Action** - Perform actions
- **Logic** - Add conditional logic

### 2. Connect Nodes

Click and drag from one node to another to create connections

### 3. Configure Nodes

Click any node to open the settings panel:
- Set node label
- Configure agent type (single/multi)
- Choose multi-agent pattern (hierarchical/swarm/council)
- Select AI model
- Define task description

### 4. Execute Workflow

Click the "Execute" button to run your workflow

### 5. Use Templates

Click "Browse Templates" to load pre-built workflows:
- AI Market Research
- Council Decision System
- Business Process Automation

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:8000
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Visual workflow builder
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - API client
- **Zustand** - State management
- **React Hot Toast** - Notifications

## License

MIT
