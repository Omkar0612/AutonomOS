"""Setup configuration for AutonomOS."""
from setuptools import find_packages, setup

setup(
    name="autonomos",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.10",
)
