# 🚀 AutonomOS Setup Guide

Complete setup instructions for both frontend and backend.

---

## 📋 Prerequisites

### Backend (Python)
- **Python 3.8+** (3.10+ recommended)
- **pip** (Python package manager)
- **python3-venv** (for virtual environments)

### Frontend (Node.js)
- **Node.js 18+** (LTS recommended)
- **npm 9+** (comes with Node.js)

---

## 🎯 Quick Setup (Recommended)

### One-Command Setup

Run this from the project root to set up everything:

```bash
cd ~/AutonomOS
git pull origin main
chmod +x setup.sh
./setup.sh
```

This will:
1. ✅ Set up backend with virtual environment
2. ✅ Install all Python dependencies
3. ✅ Set up frontend with npm
4. ✅ Install all Node.js dependencies
5. ✅ Show you how to start both servers

---

## 🔧 Manual Setup

If you prefer to set up components individually:

### Backend Setup

```bash
cd ~/AutonomOS/backend

# Option 1: Use setup script
chmod +x setup.sh
./setup.sh

# Option 2: Manual setup
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd ~/AutonomOS/frontend

# Option 1: Use setup script
chmod +x setup.sh
./setup.sh

# Option 2: Manual setup
npm install
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd ~/AutonomOS/backend
source venv/bin/activate  # Activate virtual environment
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Start Frontend (Terminal 2)

```bash
cd ~/AutonomOS/frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in 162 ms

➜  Local:   http://localhost:3000/
➜  Network: http://172.18.113.190:3000/
```

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🔍 Verifying Installation

### Test Backend

```bash
# Check API is running
curl http://localhost:8000/

# Check health endpoint
curl http://localhost:8000/api/health
```

**Expected response:**
```json
{
  "name": "AutonomOS API",
  "version": "2.1.0",
  "status": "running",
  "features": [
    "Enhanced execution engine",
    "Data flow management",
    "Logic execution (if/else, loops, parallel)",
    "Trigger system",
    "Context management"
  ]
}
```

### Test Frontend

Simply open http://localhost:3000 in your browser. You should see the AutonomOS dashboard.

---

## 🛠️ Common Issues & Solutions

### Backend Issues

#### Issue 1: `externally-managed-environment` error

**Problem:**
```
error: externally-managed-environment
```

**Solution:**
```bash
# You MUST use a virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Issue 2: `python3-venv` not found

**Problem:**
```
The virtual environment was not created successfully
```

**Solution:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3-venv python3-full

# Then try again
python3 -m venv venv
```

#### Issue 3: Port 8000 already in use

**Problem:**
```
Address already in use
```

**Solution:**
```bash
# Find and kill the process
lsof -i :8000
kill -9 <PID>

# Or use a different port
PORT=8001 python main.py
```

#### Issue 4: Import errors

**Problem:**
```
ModuleNotFoundError: No module named 'xxx'
```

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

---

### Frontend Issues

#### Issue 1: Node.js version too old

**Problem:**
```
Error: The engine "node" is incompatible
```

**Solution:**
```bash
# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 18
nvm use 18

# Verify
node --version  # Should be v18.x.x or higher
```

#### Issue 2: Port 3000 already in use

**Problem:**
```
Port 3000 is in use
```

**Solution:**
```bash
# Kill the process
lsof -i :3000
kill -9 <PID>

# Or Vite will automatically use the next available port
# Just use the URL it shows (e.g., 3001)
```

#### Issue 3: `EACCES` permission errors

**Problem:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Don't use sudo with npm!
# Instead, fix npm permissions:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Add to ~/.bashrc or ~/.zshrc to make permanent
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
```

#### Issue 4: Module resolution errors

**Problem:**
```
Failed to resolve import
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# If still issues, clear npm cache
npm cache clean --force
npm install
```

---

## 🔄 Daily Workflow

### Starting Work

**Terminal 1 - Backend:**
```bash
cd ~/AutonomOS/backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd ~/AutonomOS/frontend
npm run dev
```

### Stopping Servers

- Press `Ctrl+C` in each terminal
- In backend terminal: `deactivate` to exit virtual environment

### Pulling Latest Changes

```bash
cd ~/AutonomOS
git pull origin main

# If there are new dependencies:
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate

cd ../frontend
npm install
```

---

## 📦 What Gets Installed

### Backend Dependencies (requirements.txt)

```
fastapi>=0.104.0           # Web framework
uvicorn[standard]>=0.24.0  # ASGI server
pydantic>=2.0.0            # Data validation
python-dotenv>=1.0.0       # Environment variables
httpx>=0.25.0              # Async HTTP client
slowapi>=0.1.9             # Rate limiting
bleach>=6.1.0              # HTML sanitization
croniter>=2.0.1            # Cron parsing
watchdog>=3.0.0            # File system monitoring
```

### Frontend Dependencies (package.json)

**Main:**
- React 18.2
- React Router 6.21
- ReactFlow 11.10 (workflow canvas)
- Framer Motion 10.18 (animations)
- Lucide React (icons)
- Axios (HTTP client)
- Tailwind CSS (styling)

**Dev:**
- Vite (build tool)
- TypeScript
- Vitest (testing)
- ESLint (linting)

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
source venv/bin/activate

# Run tests (when implemented)
pytest
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

---

## 🏗️ Building for Production

### Backend

```bash
cd backend
source venv/bin/activate

# No build step needed for Python
# Just deploy with:
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
cd frontend

# Build optimized production bundle
npm run build

# Output will be in frontend/dist/
# Serve with any static server:
npm run preview
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
cd backend
cp .env.example .env

# Edit .env with your settings:
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)

Create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=AutonomOS
```

---

## 📚 Additional Resources

- **Backend Execution Engine:** [backend/execution/README.md](backend/execution/README.md)
- **API Documentation:** http://localhost:8000/docs (when running)
- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **FastAPI Documentation:** https://fastapi.tiangolo.com

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the terminal output for specific error messages
2. Review the [execution engine documentation](backend/execution/README.md)
3. Check Node.js and Python versions
4. Try clean reinstall (delete `venv`, `node_modules` and start over)
5. Check if ports 3000 and 8000 are available

---

## ✅ Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Code pulled from GitHub
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000
- [ ] API health check responds

---

**Ready to build workflows! 🎉**
