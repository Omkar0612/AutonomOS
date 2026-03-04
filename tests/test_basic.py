"""
Basic sanity tests for AutonomOS.
These are lightweight, import-free tests that verify core project structure.
Integration tests (requiring LLM keys, browsers, etc.) live in tests/integration/.
"""
import sys
import os


def test_python_version():
    """Ensure we are running a supported Python version."""
    assert sys.version_info >= (3, 10), f"Python 3.10+ required, got {sys.version}"


def test_project_structure():
    """Verify top-level project directories exist."""
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assert os.path.isdir(os.path.join(root, "src")), "src/ directory missing"
    assert os.path.isfile(os.path.join(root, "requirements.txt")), "requirements.txt missing"
    assert os.path.isfile(os.path.join(root, "requirements-ci.txt")), "requirements-ci.txt missing"


def test_env_example_exists():
    """Verify .env.example exists for onboarding."""
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_example = os.path.join(root, ".env.example")
    # Warn but do not hard-fail if file is missing
    if not os.path.isfile(env_example):
        import warnings
        warnings.warn(".env.example missing - add one to help new contributors")


def test_import_fastapi():
    """FastAPI must be importable (core dep)."""
    import fastapi  # noqa: F401
    assert fastapi.__version__


def test_import_pydantic():
    """Pydantic v2 must be importable."""
    import pydantic  # noqa: F401
    assert int(pydantic.__version__.split(".")[0]) >= 2, "Pydantic v2+ required"


def test_import_click():
    """Click must be importable (CLI dep)."""
    import click  # noqa: F401
    assert click.__version__


def test_import_httpx():
    """httpx must be importable."""
    import httpx  # noqa: F401
    assert httpx.__version__


def test_import_orjson():
    """orjson must be importable (performance dep)."""
    import orjson  # noqa: F401


def test_import_loguru():
    """loguru must be importable."""
    from loguru import logger  # noqa: F401
    assert logger
