# Multi-Agent Collaboration System

Production-ready implementation of multi-agent orchestration patterns for AutonomOS.

## Features

✅ **Core Agent Framework**
- Async task execution
- Message passing communication
- State management
- Performance metrics tracking

✅ **Orchestration Patterns**
- **Hierarchical**: Manager-worker delegation
- **Swarm**: Decentralized pheromone-based coordination
- **Council**: Multi-perspective deliberative decision-making

✅ **Production Ready**
- Full async/await support
- Error handling and retry logic
- Comprehensive logging
- Unit tests included

## Quick Start

```python
import asyncio
from src.multi_agent import Agent, AgentConfig, HierarchicalTeam

async def main():
    # Create agents
    manager = Agent(AgentConfig(name="Manager"))
    workers = [Agent(AgentConfig(name=f"Worker{i}")) for i in range(3)]
    
    # Create team
    team = HierarchicalTeam(
        name="MyTeam",
        manager=manager,
        workers=workers
    )
    
    # Execute task
    result = await team.execute("Build a feature")
    print(f"Success: {result.success}")

asyncio.run(main())
```

## Installation

```bash
# Install dependencies
pip install numpy  # For swarm pattern

# Run tests
pytest tests/multi_agent/

# Run example
python examples/multi_agent_demo.py
```

## Architecture

```
src/multi_agent/
├── core/
│   └── agent.py          # Core Agent class with async execution
├── patterns/
│   ├── hierarchical.py   # Hierarchical team pattern
│   ├── swarm.py         # Swarm coordination pattern
│   └── council.py       # Council deliberation pattern
└── __init__.py          # Public API exports
```

## Patterns Explained

### 1. Hierarchical Pattern
Manager delegates tasks to specialized workers sequentially or in parallel.

**Use cases**: Content creation, data processing pipelines, report generation

### 2. Swarm Pattern  
Agents explore task space using pheromone trails (like ant colonies).

**Use cases**: Research synthesis, distributed search, optimization problems

**Research**: Based on SwarmSys (2024) - pheromone-based coordination

### 3. Council Pattern
Agents with different perspectives deliberate and vote on decisions.

**Use cases**: Strategic planning, risk assessment, investment decisions

## API Reference

See [MULTI_AGENT.md](../../docs/MULTI_AGENT.md) for complete documentation.

## Testing

```bash
# Run all tests
pytest tests/multi_agent/ -v

# Run specific pattern
pytest tests/multi_agent/test_multi_agent.py::test_hierarchical_team
```

## Performance

**Benchmarks** (on test workloads):
- Agent task latency: <100ms
- Swarm convergence: 3-5 iterations
- Council consensus: 2-3 deliberation rounds

## Contributing

See main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE)
