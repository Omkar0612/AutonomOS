# Updated Swarm

# Fixing linting errors

from typing import Any


class Swarm:
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