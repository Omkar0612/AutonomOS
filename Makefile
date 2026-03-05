# AutonomOS Makefile
# Quick commands for common tasks

.PHONY: help install install-optimized dev test lint format clean benchmark docker-build docker-up

help:
	@echo "AutonomOS Development Commands:"
	@echo ""
	@echo "Setup:"
	@echo "  make install           - Install dependencies (minimal)"
	@echo "  make install-optimized - Install with performance optimizations"
	@echo "  make dev              - Start development servers"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test             - Run tests"
	@echo "  make lint             - Run linters"
	@echo "  make format           - Format code"
	@echo "  make benchmark        - Run performance benchmarks"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-up        - Start with Docker Compose"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            - Remove generated files"

install:
	@echo "Installing minimal dependencies..."
	cd backend && pip install -r requirements-minimal.txt
	cd frontend && npm install

install-optimized:
	@echo "Installing optimized dependencies..."
	cd backend && pip install -r requirements-optimized.txt
	cd frontend && npm install
	@echo ""
	@echo "✅ Optimization packages installed!"
	@echo "Next: Read OPTIMIZATION_QUICKSTART.md"

dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo ""
	@make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && python main.py

dev-frontend:
	cd frontend && npm run dev

test:
	@echo "Running tests..."
	cd backend && pytest
	cd frontend && npm test

lint:
	@echo "Running linters..."
	cd backend && ruff check .
	cd frontend && npm run lint

format:
	@echo "Formatting code..."
	cd backend && black .
	cd frontend && npm run format

benchmark:
	@echo "Running performance benchmarks..."
	cd backend && python benchmark.py

clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	cd frontend && rm -rf dist node_modules/.vite

docker-build:
	@echo "Building Docker image..."
	docker build -t autonomos:latest .

docker-up:
	@echo "Starting with Docker Compose..."
	docker-compose up -d
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"

metrics:
	@echo "Fetching performance metrics..."
	curl -s http://localhost:8000/api/metrics | python -m json.tool
