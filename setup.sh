#!/bin/bash
# AutonomOS Master Setup Script
# Sets up both frontend and backend

echo ""
echo "═══════════════════════════════════════════════"
echo "   🚀 AutonomOS Complete Setup"
echo "═══════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "setup.sh" ]; then
    echo -e "${RED}❌ Please run this script from the AutonomOS root directory${NC}"
    exit 1
fi

# Setup Backend
echo -e "${BLUE}───────────────────────────────────────────────${NC}"
echo -e "${BLUE}   🐍 BACKEND SETUP${NC}"
echo -e "${BLUE}───────────────────────────────────────────────${NC}"
echo ""

cd backend
if [ -f "setup.sh" ]; then
    chmod +x setup.sh
    ./setup.sh
    BACKEND_STATUS=$?
else
    echo -e "${RED}❌ Backend setup script not found${NC}"
    BACKEND_STATUS=1
fi
cd ..

echo ""

# Setup Frontend
echo -e "${BLUE}───────────────────────────────────────────────${NC}"
echo -e "${BLUE}   ⚛️  FRONTEND SETUP${NC}"
echo -e "${BLUE}───────────────────────────────────────────────${NC}"
echo ""

cd frontend
if [ -f "setup.sh" ]; then
    chmod +x setup.sh
    ./setup.sh
    FRONTEND_STATUS=$?
else
    echo -e "${RED}❌ Frontend setup script not found${NC}"
    FRONTEND_STATUS=1
fi
cd ..

echo ""
echo "═══════════════════════════════════════════════"
echo -e "   ${GREEN}Setup Summary${NC}"
echo "═══════════════════════════════════════════════"
echo ""

if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ Backend:  Setup successful${NC}"
else
    echo -e "${RED}❌ Backend:  Setup failed${NC}"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend: Setup successful${NC}"
else
    echo -e "${RED}❌ Frontend: Setup failed${NC}"
fi

echo ""

if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ All components set up successfully!${NC}"
    echo ""
    echo "═══════════════════════════════════════════════"
    echo -e "   ${BLUE}Quick Start Guide${NC}"
    echo "═══════════════════════════════════════════════"
    echo ""
    echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  python main.py"
    echo ""
    echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "Then open: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some components failed to set up. Please check errors above.${NC}"
    exit 1
fi
