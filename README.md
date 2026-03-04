# 🤖 AutonomOS - Visual AI Workflow Builder

> Build powerful autonomous AI agents with visual drag-and-drop. Deploy multi-agent systems in minutes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6)

## ✨ Features

- 🤖 **AI-Powered Agents** - Deploy intelligent agents that work autonomously 24/7
- 🎨 **Visual Workflow Builder** - Drag-and-drop interface, no coding required
- 👥 **Multi-Agent Systems** - Hierarchical teams, swarms, and councils
- 📊 **Real-time Analytics** - Track performance and optimize workflows
- 🔑 **Multi-Provider Support** - OpenRouter, OpenAI, Anthropic, Google, Groq
- 🌙 **Dark Mode** - Beautiful UI with light and dark themes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Omkar0612/AutonomOS.git
cd AutonomOS

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📚 Documentation

### Getting Your First API Key

1. **OpenRouter (Recommended)**
   - Visit [openrouter.ai/keys](https://openrouter.ai/keys)
   - Sign up and create API key
   - Access 50+ models with one key

2. **Add Key in AutonomOS**
   - Go to Settings → API Keys
   - Click "Add Key"
   - Select OpenRouter
   - Choose your preferred model
   - Paste API key and save

### Building Your First Workflow

1. **Create Workflow**
   - Click "New Workflow" from dashboard
   - Drag nodes from sidebar to canvas

2. **Connect Nodes**
   - Drag from output handle to input handle
   - Nodes execute in connected order

3. **Configure Nodes**
   - Click node to open settings panel
   - Set agent type, model, and task
   - Save changes

4. **Execute**
   - Click "Execute" button
   - View results in real-time

## 🏛️ Architecture

```
AutonomOS/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Global state (Auth, Theme, Workflow, ApiKey)
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API service layer
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/             # FastAPI backend (coming soon)
├── TESTING.md           # E2E testing guide
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 5.1** - Build tool
- **Tailwind CSS 3.4** - Styling
- **React Flow 11.10** - Workflow canvas
- **Framer Motion 11.0** - Animations
- **React Router 6.22** - Routing
- **Axios 1.6** - HTTP client

### Backend (Coming Soon)
- **FastAPI** - Python API framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Database
- **Redis** - Caching
- **Celery** - Task queue

## 🧰 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 📋 Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=AutonomOS
VITE_APP_VERSION=1.0.0
```

## 🧹 Testing

See [TESTING.md](./TESTING.md) for comprehensive E2E testing guide.

```bash
# Run tests
npm test

# E2E tests
npm run test:e2e
```

## 🐛 Known Issues

- Backend integration pending
- Real-time collaboration coming soon
- Advanced analytics in development

## 🛣️ Roadmap

### Q2 2026
- [ ] Backend API integration
- [ ] Real authentication
- [ ] Database persistence
- [ ] Workflow versioning

### Q3 2026
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Marketplace for workflows
- [ ] API monetization

### Q4 2026
- [ ] Mobile apps (iOS/Android)
- [ ] On-premise deployment
- [ ] Enterprise features

## 👥 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](./LICENSE) file

## 👏 Credits

Built with ❤️ by [Omkar Parab](https://github.com/Omkar0612)

- Design inspiration: Linear, Vercel, Stripe
- Icons: Lucide React
- Fonts: Inter (Google Fonts)

## 📧 Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/Omkar0612/AutonomOS/issues)
- 💬 Discord: [Join Community](https://discord.gg/autonomos)
- 📧 Email: omkar@autonomos.ai

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ♥️ for AI developers**

© 2026 AutonomOS. All rights reserved.
