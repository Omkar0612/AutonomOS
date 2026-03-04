"""
Swarm Multi-Agent Pattern (Decentralized Coordination)
"""
from typing import Any

from ..core.agent import Agent


class Swarm:
    """Decentralized swarm of agents that self-coordinate."""

    def __init__(self, agents: list[Agent]) -> None:
        self.agents = agents

    def collect_information(self) -> list[dict[str, Any]]:
        return [agent.get_information() for agent in self.agents]

    def make_decisions(self) -> None:
        for agent in self.agents:
            decision = agent.make_decision()
            agent.execute_decision(decision)

    def execute(self) -> None:
        self.collect_information()
        self.make_decisions()
