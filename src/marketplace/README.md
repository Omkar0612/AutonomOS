# 🏪 AutonomOS Skills Marketplace

**Production-ready marketplace for discovering, sharing, and installing AI agent skills**

![Marketplace](https://img.shields.io/badge/status-production--ready-green)
![Skills](https://img.shields.io/badge/skills-1000%2B-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## ✨ Features

### 🔍 **Discovery**
- Browse 1000+ community skills
- Search by name, description, tags
- Filter by category
- Featured & verified skills
- Popularity rankings

### 📦 **Installation**
- One-command install via CLI
- Automatic dependency management
- Version tracking
- Update notifications
- Rollback support

### 🚀 **Publishing**
- Easy skill publishing workflow
- Automated validation
- Security scanning
- Version management
- Analytics dashboard

### ⭐ **Community**
- Ratings and reviews
- Download statistics
- Author profiles
- Skill discussions
- Contribution tracking

---

## 🚀 Quick Start

### 1. Start the Marketplace API

```bash
cd src/marketplace/backend
pip install fastapi sqlalchemy pydantic uvicorn semver
python marketplace_api.py
```

API runs at `http://localhost:8001`

### 2. Start the Frontend

```bash
cd src/marketplace/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 3. Use the CLI

```bash
# Install CLI dependencies
pip install click rich requests

# Make executable
chmod +x src/marketplace/cli/autonomos-skills

# List skills
./src/marketplace/cli/autonomos-skills list

# Search skills
./src/marketplace/cli/autonomos-skills search "email"

# Install a skill
./src/marketplace/cli/autonomos-skills install email-summarizer
```

---

## 📋 Skill Manifest Format

Every skill requires a `skill.json` manifest. See [examples/email-summarizer/skill.json](examples/email-summarizer/skill.json) for a complete example.

---

## 🎯 CLI Commands

```bash
# List all skills
autonomos-skills list

# List by category
autonomos-skills list --category productivity

# Search skills
autonomos-skills search "email summarization"

# Show skill info
autonomos-skills info email-summarizer

# Install a skill
autonomos-skills install email-summarizer

# Uninstall a skill
autonomos-skills uninstall email-summarizer

# List installed skills
autonomos-skills installed

# List categories
autonomos-skills categories
```

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  ← Users browse & install
└────────┬────────┘
         │
    ┌────▼────┐
    │   API   │  ← FastAPI + SQLAlchemy
    └────┬────┘
         │
    ┌────▼─────────────┐
    │  PostgreSQL/     │  ← Skill metadata
    │  SQLite          │
    └──────────────────┘
         │
    ┌────▼────────┐
    │   GitHub    │  ← Skill repositories
    └─────────────┘
```

---

## 📚 Documentation

See the main [AutonomOS README](../../README.md) for more information.

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE)
