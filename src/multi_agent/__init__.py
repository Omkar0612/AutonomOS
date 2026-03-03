"""
AutonomOS Multi-Agent Collaboration System

A comprehensive framework for building coordinated AI agent teams.
"""

from .core.agent import Agent, AgentConfig, AgentRole, AgentState, AgentMessage, TaskResult
from .patterns.hierarchical import HierarchicalTeam
from .patterns.swarm import SwarmSystem, PheromoneTrail
from .patterns.council import CouncilSystem, Vote, CouncilDecision

__version__ = "1.0.0"
__all__ = [
    "Agent",
    "AgentConfig",
    "AgentRole",
    "AgentState",
    "AgentMessage",
    "TaskResult",
    "HierarchicalTeam",
    "SwarmSystem",
    "PheromoneTrail",
    "CouncilSystem",
    "Vote",
    "CouncilDecision",
]
