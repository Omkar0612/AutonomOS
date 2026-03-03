# Contributing to AutonomOS

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Include reproduction steps, expected vs actual behavior
4. Add relevant logs and system info

### Feature Requests
1. Check if feature already exists or is planned
2. Use the feature request template
3. Describe the use case and expected behavior
4. Consider implementation approach

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Update documentation
6. Run tests and linting
7. Commit with clear messages
8. Push to your fork
9. Open a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/autonomos.git
cd autonomos

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dev dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install
```

## Code Standards

### Python Style
- Follow PEP 8
- Use Black for formatting: `black src/`
- Use Ruff for linting: `ruff check src/`
- Type hints for function signatures
- Docstrings for all public functions

### Testing
```bash
# Run all tests
pytest tests/

# Run with coverage
pytest --cov=src tests/

# Run specific test
pytest tests/test_agent.py::test_memory_system
```

### Documentation
- Update README.md for user-facing changes
- Add docstrings to new functions/classes
- Update docs/ for architectural changes
- Include examples for new features

## Skill Development

Create new skills in `src/skills/`:

```python
from perplexity_computer.skill import Skill, SkillParameter

class MySkill(Skill):
    name = "my_skill"
    description = "Description of what this skill does"
    parameters = [
        SkillParameter(
            name="param1",
            type="string",
            description="Parameter description",
            required=True
        )
    ]

    async def execute(self, param1: str) -> dict:
        # Implementation
        return {"success": True, "result": "output"}
```

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Example: `feat: add Discord voice channel support`

## Review Process

1. Automated checks must pass (tests, linting)
2. At least one maintainer approval required
3. Address review feedback
4. Squash commits before merge

## Questions?

- Open a discussion on GitHub
- Join our Discord server
- Email: contact@yourproject.com

Thank you for contributing! 🎉
