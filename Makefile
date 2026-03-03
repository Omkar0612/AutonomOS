# Makefile for AutonomOS

.PHONY: help install test lint format clean docker run

help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code"
	@echo "  make clean      - Clean cache files"
	@echo "  make docker     - Build Docker image"
	@echo "  make run        - Run application"

install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	pre-commit install

test:
	pytest tests/ -v --cov=src --cov-report=html

test-fast:
	pytest tests/ -n auto

lint:
	ruff check src/ tests/
	mypy src/
	black --check src/ tests/

format:
	black src/ tests/
	ruff check --fix src/ tests/
	isort src/ tests/

security:
	pip-audit
	safety check
	bandit -r src/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	rm -rf .pytest_cache .coverage htmlcov/ .mypy_cache .ruff_cache

docker:
	docker build -t autonomos:latest -f Dockerfile.optimized .

docker-run:
	docker-compose up -d

run:
	python main.py

benchmark:
	py-spy record -o profile.svg -- python main.py
