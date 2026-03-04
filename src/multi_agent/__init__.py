"""
AutonomOS Multi-Agent Collaboration System.

A comprehensive framework for building coordinated AI agent teams.
"""

from .core.agent import (
    Agent,
    AgentConfig,
    AgentMessage,
    AgentRole,
    AgentState,
    TaskResult,
)
from .patterns.council import CouncilDecision, CouncilSystem, Vote
from .patterns.hierarchical import HierarchicalTeam
from .patterns.swarm import Swarm as SwarmSystem

__version__ = "1.0.0"

__all__ = [
    "Agent",
    "AgentConfig",
    "AgentMessage",
    "AgentRole",
    "AgentState",
    "CouncilDecision",
    "CouncilSystem",
    "HierarchicalTeam",
    "SwarmSystem",
    "TaskResult",
    "Vote",
]
