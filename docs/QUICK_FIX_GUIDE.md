# Quick Fix Guide - Common CI Issues

## 🚨 Current CI Status

**Latest Fixes Applied**: March 4, 2026
- ✅ Import sorting fixed in `marketplace_api.py`
- ✅ Ruff configuration added
- ✅ All test dependencies updated

---

## 🔧 Import Sorting Errors (Ruff I001)

### Quick Fix (One Command)
```bash
# Auto-fix all import issues
ruff check --select I --fix src/ tests/

# Or use the Makefile
make format
```

### Manual Fix
If you see:
```
src/some_file.py:1:1: I001 Import block is un-sorted or un-formatted
```

**Solution**: Organize imports in this order:
1. Standard library imports
2. Third-party imports  
3. Local application imports

**Example**:
```python
# ✅ Correct
import os
from datetime import datetime
from typing import Any

import fastapi
from pydantic import BaseModel

from src.utils import helper

# ❌ Wrong - mixed order
import fastapi
import os
from src.utils import helper
```

---

## 🛡️ Security Scan Failures

### pip-audit Exit Code 1
**Expected Behavior**: Security scans are **non-blocking** (`continue-on-error: true`)  
**Action**: Review warnings, but CI will pass

### If You Want to Fix Warnings:
```bash
# Show vulnerabilities
pip-audit --requirement requirements-ci.txt

# Fix by upgrading specific packages
pip install --upgrade <package-name>

# Update requirements file
pip freeze > requirements-ci.txt
```

### Safety Scan
```bash
# Run locally
safety scan --file requirements-ci.txt

# Safety v3 uses 'scan' not 'check'
```

---

## ✅ Pre-Commit Setup (Prevent Issues Before Push)

### Install Pre-Commit Hooks
```bash
# One-time setup
make install

# Or manually
pip install pre-commit
pre-commit install
```

### What Pre-Commit Does:
- ✅ Auto-formats code with Ruff
- ✅ Sorts imports automatically
- ✅ Runs linting checks
- ✅ Prevents committing broken code

### Skip Pre-Commit (Emergency Only)
```bash
git commit --no-verify -m "Emergency fix"
```

---

## 🧪 Test Failures

### Run Tests Locally (Exactly as CI Does)
```bash
# Full CI simulation
make test-ci

# With coverage report
make test

# Fast parallel tests
make test-fast
```

### Common Test Issues

**Import Errors**:
```bash
# Reinstall dependencies
pip install -r requirements-ci.txt

# Verify Python version (need 3.10+)
python --version
```

**Missing Packages**:
```bash
# Check if package is installed
python -c "import fastapi; print('OK')"

# Install missing package
pip install <package-name>
```

---

## 🐳 Docker Build Issues

### Build Locally
```bash
# Use optimized Dockerfile
make docker

# Or manually
docker build -f Dockerfile.optimized -t autonomos:latest .
```

### Test Docker Image
```bash
make docker-test

# Check image size
docker images autonomos:latest
```

### Common Docker Fixes

**Build Fails**:
```bash
# Clean Docker cache
docker builder prune -af

# Rebuild without cache
docker build -f Dockerfile.optimized -t autonomos:latest . --no-cache
```

**Image Too Large (>600MB)**:
- Check `Dockerfile.optimized` is being used
- Verify multi-stage build is working
- Remove unnecessary dependencies

---

## 📋 Complete Fix Workflow

### Before Pushing Code
```bash
# 1. Format and fix imports
make format

# 2. Run linting
make lint

# 3. Run tests
make test-ci

# 4. Verify everything
make verify

# 5. Commit and push
git add .
git commit -m "Your message"
git push
```

### One-Liner (Fixes Most Issues)
```bash
make format && make test-ci && echo "✅ Ready to push!"
```

---

## 🔍 Debugging CI Failures

### Check GitHub Actions Logs
1. Go to [Actions tab](https://github.com/Omkar0612/AutonomOS/actions)
2. Click the failed workflow run
3. Click the failed job (e.g., "test (3.11)")
4. Expand the failed step
5. Look for the error message

### Common Error Patterns

**"Import block is un-sorted"**:
```bash
ruff check --select I --fix src/
```

**"Module not found"**:
```bash
pip install -r requirements-ci.txt
```

**"Command not found: pytest"**:
```bash
pip install pytest pytest-asyncio pytest-cov
```

**"Process completed with exit code 1"**:
- Check the step logs for actual error
- Often a linting or test failure
- Run locally to reproduce

---

## 🎯 Specific File Fixes

### marketplace_api.py (Already Fixed)
```bash
# If you modify this file again, ensure imports are sorted:
ruff check --select I --fix src/marketplace/backend/marketplace_api.py
```

### Any Python File
```bash
# Fix specific file
ruff check --fix path/to/file.py

# Fix entire directory
ruff check --fix src/
```

---

## 📚 Reference Commands

### Makefile Targets
```bash
make help          # Show all available commands
make install       # Install all dependencies
make install-ci    # Install CI dependencies only
make verify        # Quick health check
make test          # Run tests with coverage
make test-fast     # Parallel test execution
make test-ci       # Run as CI does
make lint          # Run all linters
make format        # Auto-format code
make security      # Security scans
make docker        # Build Docker image
make docker-test   # Test Docker locally
make clean         # Remove cache files
make ci-test       # Full CI pipeline locally
```

### Ruff Commands
```bash
ruff check src/                    # Check for issues
ruff check --fix src/              # Auto-fix issues
ruff check --select I --fix src/   # Fix imports only
ruff format src/                   # Format code
```

### Git Workflow
```bash
git status                  # Check what changed
git add .                   # Stage all changes
git commit -m "message"     # Commit
git push                    # Push to GitHub
git push --force            # Force push (use carefully)
```

---

## 🆘 Still Stuck?

### Get Help
1. **Check CI logs**: Expand failed step in GitHub Actions
2. **Run locally**: Use `make test-ci` to reproduce
3. **Check docs**: See `CI_FIX_SUMMARY.md` for details
4. **Ask for help**: [GitHub Issues](https://github.com/Omkar0612/AutonomOS/issues)

### Nuclear Option (Reset to Clean State)
```bash
# ⚠️ WARNING: This removes all local changes
git reset --hard origin/main
git clean -fdx
make install
make verify
```

---

## ✨ Best Practices

1. **Always run pre-commit**: Catches issues before push
2. **Use `make format`**: Auto-fixes most issues
3. **Test locally first**: Use `make test-ci`
4. **Keep dependencies updated**: Regular `pip install --upgrade`
5. **Read CI logs carefully**: Error messages are usually clear

---

## 📊 CI Expected Results

After all fixes, you should see:

```
✅ test (3.10) - PASSED
✅ test (3.11) - PASSED  
✅ test (3.12) - PASSED
✅ security - PASSED (warnings OK)
✅ docker - PASSED
```

**Build time**: ~4-5 minutes with cache

---

*Last Updated: March 4, 2026*  
*All CI issues resolved as of this date*
