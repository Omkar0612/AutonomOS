# 🎨 AutonomOS Web UI Setup Guide

## Prerequisites

- Node.js 18+ and npm installed
- AutonomOS backend running

## Quick Setup (5 minutes)

### Step 1: Install Node.js (if not installed)

#### On WSL/Ubuntu:
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x
npm --version   # Should show 10.x
```

#### On Windows:
Download from: https://nodejs.org/ (LTS version)

### Step 2: Install Frontend Dependencies

```bash
# Navigate to AutonomOS directory
cd ~/AutonomOS

# Go to frontend folder
cd frontend

# Install dependencies
npm install
```

### Step 3: Configure API URL

```bash
# Create .env file
cp .env.example .env

# Edit if needed (default should work)
nano .env
```

Default configuration:
```bash
VITE_API_URL=http://localhost:8000
```

### Step 4: Start the Frontend

```bash
# Start development server
npm run dev
```

You should see:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://172.25.165.251:3000/
```

### Step 5: Open in Browser

**From Windows**: Open http://localhost:3000
**From WSL IP**: Open http://172.25.165.251:3000

## Complete Setup Script

```bash
#!/bin/bash
# Save as: setup-frontend.sh

echo "🚀 Setting up AutonomOS Web UI..."

# Navigate to project
cd ~/AutonomOS

# Pull latest changes
git pull origin main

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Go to frontend
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

# Get WSL IP
WSL_IP=$(ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1)

echo ""
echo "✅ Setup complete!"
echo ""
echo "========================================"
echo "🎨 Start the frontend:"
echo "========================================"
echo "cd ~/AutonomOS/frontend"
echo "npm run dev"
echo ""
echo "📱 Access URLs:"
echo "From Windows: http://localhost:3000"
echo "From Network: http://$WSL_IP:3000"
echo "========================================"
```

Make executable and run:
```bash
chmod +x setup-frontend.sh
./setup-frontend.sh
```

## Running Both Backend and Frontend

### Terminal 1 (Backend):
```bash
cd ~/AutonomOS
source venv/bin/activate
python -m uvicorn src.api.workflow_api:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 (Frontend):
```bash
cd ~/AutonomOS/frontend
npm run dev
```

## One-Command Startup

Create `start-all.sh`:
```bash
#!/bin/bash

# Start backend in background
cd ~/AutonomOS
source venv/bin/activate
python -m uvicorn src.api.workflow_api:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ~/AutonomOS/frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Run with:
```bash
chmod +x start-all.sh
./start-all.sh
```

## Building for Production

```bash
cd ~/AutonomOS/frontend
npm run build

# Files will be in dist/ folder
# Serve with any static file server
npx serve dist
```

## Troubleshooting

### Port 3000 already in use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
VITE_PORT=3001 npm run dev
```

### Can't access from Windows:
```bash
# Get WSL IP
ip addr show eth0 | grep "inet "

# Use that IP in browser
# Example: http://172.25.165.251:3000
```

### Dependencies installation failed:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Features

✅ Drag-and-drop workflow builder
✅ Visual node connections
✅ Node configuration panel
✅ Pre-built templates
✅ Real-time workflow execution
✅ Save/load workflows
✅ Responsive design
✅ No coding required!

## Next Steps

1. Open the UI at http://localhost:3000
2. Browse templates or drag nodes to canvas
3. Connect nodes by clicking and dragging
4. Configure nodes by clicking them
5. Click Execute to run your workflow!

Enjoy building AI workflows visually! 🎉
