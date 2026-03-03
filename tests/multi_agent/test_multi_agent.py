""" 
Tests for Multi-Agent Collaboration System
"""
import pytest
import asyncio
from src.multi_agent import Agent, AgentConfig, AgentRole, HierarchicalTeam


@pytest.mark.asyncio
async def test_agent_creation():
    """Test agent creation"""
    config = AgentConfig(name="TestAgent", role=AgentRole.WORKER)
    agent = Agent(config)
    
    assert agent.name == "TestAgent"
    assert agent.role == AgentRole.WORKER
    assert agent.state.value == "idle"


@pytest.mark.asyncio
async def test_agent_task_execution():
    """Test agent can execute tasks"""
    agent = Agent(AgentConfig(name="Worker"))
    
    result = await agent.execute_task({"description": "Test task"})
    
    assert result.success
    assert result.output is not None


@pytest.mark.asyncio
async def test_hierarchical_team():
    """Test hierarchical team execution"""
    manager = Agent(AgentConfig(name="Manager", role=AgentRole.COORDINATOR))
    worker1 = Agent(AgentConfig(name="Worker1", role=AgentRole.WORKER))
    worker2 = Agent(AgentConfig(name="Worker2", role=AgentRole.WORKER))
    
    team = HierarchicalTeam(
        name="TestTeam",
        manager=manager,
        workers=[worker1, worker2]
    )
    
    result = await team.execute(task="Test collaborative task")
    
    assert result.success
    assert team.get_team_stats()["tasks_completed"] == 1


def test_agent_stats():
    """Test agent statistics tracking"""
    agent = Agent(AgentConfig(name="StatsAgent"))
    stats = agent.get_stats()
    
    assert stats["name"] == "StatsAgent"
    assert "metrics" in stats
    assert stats["metrics"]["tasks_completed"] == 0
