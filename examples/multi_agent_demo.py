""" 
Example: Using Multi-Agent Collaboration System
"""
import asyncio
from src.multi_agent import (
    Agent, AgentConfig, AgentRole,
    HierarchicalTeam, SwarmSystem, CouncilSystem
)


async def example_hierarchical_team():
    """Example: Content creation pipeline"""
    print("\n=== Hierarchical Team Example ===")
    
    # Create specialized agents
    researcher = Agent(AgentConfig(
        name="Researcher",
        role=AgentRole.RESEARCHER,
        expertise="information_gathering"
    ))
    
    writer = Agent(AgentConfig(
        name="Writer",
        role=AgentRole.SPECIALIST,
        expertise="copywriting"
    ))
    
    manager = Agent(AgentConfig(
        name="Manager",
        role=AgentRole.COORDINATOR
    ))
    
    # Create team
    team = HierarchicalTeam(
        name="ContentTeam",
        manager=manager,
        workers=[researcher, writer],
        workflow="sequential"
    )
    
    # Execute
    result = await team.execute(
        task="Create blog post about quantum computing"
    )
    
    print(f"Success: {result.success}")
    print(f"Time: {result.execution_time:.2f}s")


async def example_swarm_system():
    """Example: Research synthesis"""
    print("\n=== Swarm System Example ===")
    
    agents = [Agent(AgentConfig(name=f"Agent-{i}")) for i in range(5)]
    
    swarm = SwarmSystem(
        name="ResearchSwarm",
        agents=agents,
        coordination="pheromone_based"
    )
    
    result = await swarm.execute(
        task="Research multi-agent systems",
        parameters={"max_iterations": 3}
    )
    
    print(f"Iterations: {result.metadata.get('iterations')}")


async def example_council_system():
    """Example: Decision making"""
    print("\n=== Council System Example ===")
    
    council = CouncilSystem(
        name="Council",
        agents=[
            Agent(AgentConfig(name="Analyst1", expertise="risk")),
            Agent(AgentConfig(name="Analyst2", expertise="growth"))
        ]
    )
    
    decision = await council.decide(
        question="Should we proceed with project X?"
    )
    
    print(f"Decision: {decision.recommendation}")
    print(f"Confidence: {decision.confidence:.0%}")


async def main():
    await example_hierarchical_team()
    await example_swarm_system()
    await example_council_system()


if __name__ == "__main__":
    asyncio.run(main())
