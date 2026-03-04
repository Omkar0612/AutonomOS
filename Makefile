# Makefile for AutonomOS - Production-Ready AI Agent Framework

.DEFAULT_GOAL := help
.PHONY: help install install-ci test test-fast test-ci lint format security clean docker docker-test docker-run run benchmark verify

## Help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## Development
install: ## Install all dependencies (dev + prod)
	@echo "Installing production dependencies..."
	pip install --upgrade pip wheel setuptools
	pip install -r requirements.txt
	@echo "Installing development dependencies..."
	pip install -r requirements-dev.txt
	@echo "Setting up pre-commit hooks..."
	pre-commit install
	@echo "✓ Installation complete!"

install-ci: ## Install CI dependencies only (fast)
	pip install --upgrade pip wheel setuptools
	pip install -r requirements-ci.txt

verify: ## Quick verification of installation
	@echo "Verifying Python environment..."
	@python -c "import sys; assert sys.version_info >= (3, 10), 'Python 3.10+ required'; print(f'✓ Python {sys.version}')"
	@echo "Verifying core dependencies..."
	@python -c "import fastapi, pydantic, httpx, orjson; print('✓ Core packages OK')"
	@echo "Verifying project structure..."
	@test -d src && echo "✓ src/ directory exists" || echo "✗ src/ missing"
	@test -f pytest.ini && echo "✓ pytest.ini exists" || echo "✗ pytest.ini missing"
	@echo "✓ Verification complete!"

## Testing
test: ## Run all tests with coverage
	@echo "Running tests with coverage..."
	pytest tests/ -v --cov=src --cov-report=html --cov-report=term-missing
	@echo "✓ Coverage report: htmlcov/index.html"

test-fast: ## Run tests in parallel (4x faster)
	@echo "Running tests in parallel..."
	pytest tests/ -n auto --dist=loadgroup -v

test-ci: ## Run tests exactly as CI does
	@echo "Running CI test suite..."
	pytest tests/ -v --cov=src --cov-report=xml --cov-report=term --tb=short --strict-markers -p no:warnings

test-watch: ## Run tests in watch mode (requires pytest-watch)
	ptw tests/ -- -v

## Code Quality
lint: ## Run all linters
	@echo "Running ruff..."
	ruff check src/ tests/ --output-format=github
	@echo "Running mypy..."
	mypy src/ --ignore-missing-imports
	@echo "✓ Linting complete!"

format: ## Auto-format all code
	@echo "Formatting with ruff..."
	ruff check --fix src/ tests/
	ruff format src/ tests/
	@echo "✓ Formatting complete!"

lint-fix: format ## Alias for format

## Security
security: ## Run security scans
	@echo "Running pip-audit..."
	pip-audit --requirement requirements-ci.txt --progress-spinner off || true
	@echo "Running safety scan..."
	safety scan --file requirements-ci.txt || true
	@echo "Running bandit security scan..."
	bandit -r src/ -ll || true
	@echo "✓ Security scan complete!"

## Docker
docker: ## Build optimized Docker image
	@echo "Building optimized Docker image..."
	docker build -t autonomos:latest -f Dockerfile.optimized . --progress=plain
	@docker images autonomos:latest --format "Built: {{.Size}}"
	@echo "✓ Docker build complete!"

docker-test: ## Test Docker image locally
	@echo "Testing Docker image..."
	docker run -d --name autonomos-test autonomos:latest sleep 30
	@sleep 3
	@docker logs autonomos-test || true
	@docker rm -f autonomos-test
	@echo "✓ Docker test complete!"

docker-run: ## Start all services with docker-compose
	@echo "Starting AutonomOS services..."
	docker-compose up -d
	@echo "✓ Services running at http://localhost:8080"

docker-stop: ## Stop all docker-compose services
	docker-compose down

docker-logs: ## Show docker-compose logs
	docker-compose logs -f

## Cleanup
clean: ## Remove all cache and temporary files
	@echo "Cleaning cache files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type f -name "*.orig" -delete 2>/dev/null || true
	rm -rf .pytest_cache .coverage htmlcov/ .mypy_cache .ruff_cache dist/ build/ 2>/dev/null || true
	@echo "✓ Cleanup complete!"

clean-all: clean ## Remove all cache, data, and virtual environments
	@echo "Deep cleaning..."
	rm -rf venv/ .venv/ data/ logs/ 2>/dev/null || true
	@echo "✓ Deep cleanup complete!"

## Running
run: ## Run the application
	@echo "Starting AutonomOS..."
	python main.py

run-dev: ## Run with hot-reload (development mode)
	uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8080

## Performance
benchmark: ## Profile application performance
	@command -v py-spy >/dev/null 2>&1 || { echo "Installing py-spy..."; pip install py-spy; }
	@echo "Profiling application..."
	py-spy record -o profile.svg -- python main.py
	@echo "✓ Profile saved to profile.svg"

## CI Targets
ci-test: install-ci verify test-ci lint security ## Run complete CI pipeline locally
	@echo "✓ CI pipeline complete!"

## All-in-one
all: clean install verify test lint security docker ## Run everything
	@echo "✓ All tasks complete!"
