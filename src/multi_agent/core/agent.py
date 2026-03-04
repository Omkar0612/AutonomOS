"""
Core Agent Implementation for Multi-Agent Collaboration System
"""
import asyncio
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


class AgentState(Enum):
    """Agent execution states"""

    IDLE = "idle"
    WORKING = "working"
    WAITING = "waiting"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


class AgentRole(Enum):
    """Common agent roles in multi-agent systems"""

    COORDINATOR = "coordinator"
    WORKER = "worker"
    SPECIALIST = "specialist"
    VALIDATOR = "validator"
    EXPLORER = "explorer"
    MANAGER = "manager"
    RESEARCHER = "researcher"
    ANALYST = "analyst"


@dataclass
class AgentMessage:
    """Message structure for inter-agent communication"""

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str = ""
    recipient_id: str | None = None  # None for broadcast
    message_type: str = "task"  # task, result, query, notification
    payload: dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)
    priority: int = 1  # 1-10, higher is more urgent
    requires_response: bool = False

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "message_type": self.message_type,
            "payload": self.payload,
            "timestamp": self.timestamp.isoformat(),
            "priority": self.priority,
            "requires_response": self.requires_response,
        }


@dataclass
class TaskResult:
    """Result of agent task execution"""

    success: bool
    output: Any
    metadata: dict[str, Any] = field(default_factory=dict)
    error: str | None = None
    execution_time: float = 0.0
    cost: float = 0.0

    def to_dict(self) -> dict:
        return {
            "success": self.success,
            "output": self.output,
            "metadata": self.metadata,
            "error": self.error,
            "execution_time": self.execution_time,
            "cost": self.cost,
        }


@dataclass
class AgentConfig:
    """Configuration for an agent"""

    name: str
    role: AgentRole = AgentRole.WORKER
    expertise: str | None = None
    llm_model: str = "gpt-4"
    temperature: float = 0.7
    max_tokens: int = 4000
    timeout: int = 300
    tools: list[str] = field(default_factory=list)
    memory_type: str = "vector"
    memory_persistence: bool = True
    cost_limit: float | None = None

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "role": self.role.value,
            "expertise": self.expertise,
            "llm_model": self.llm_model,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "timeout": self.timeout,
            "tools": self.tools,
            "memory_type": self.memory_type,
            "memory_persistence": self.memory_persistence,
            "cost_limit": self.cost_limit,
        }


class Agent:
    """
    Core Agent class for multi-agent collaboration.

    Each agent has:
    - Unique identity and role
    - Specialized capabilities/tools
    - LLM backend for reasoning
    - Memory for context retention
    - Communication interface
    """

    def __init__(self, config: AgentConfig):
        self.id = str(uuid.uuid4())
        self.config = config
        self.state = AgentState.IDLE
        self.memory: list[AgentMessage] = []
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self.metrics = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "total_cost": 0.0,
            "total_time": 0.0,
            "messages_sent": 0,
            "messages_received": 0,
        }

    @property
    def name(self) -> str:
        return self.config.name

    @property
    def role(self) -> AgentRole:
        return self.config.role

    async def execute_task(self, task: dict[str, Any]) -> TaskResult:
        """
        Execute a task assigned to this agent.

        Args:
            task: Task specification with context and requirements

        Returns:
            TaskResult with output and metadata
        """
        self.state = AgentState.WORKING
        start_time = datetime.now()

        try:
            result = await self._reason_and_act(task)

            execution_time = (datetime.now() - start_time).total_seconds()

            self.metrics["tasks_completed"] += 1
            self.metrics["total_time"] += execution_time
            self.state = AgentState.COMPLETED

            return TaskResult(
                success=True,
                output=result,
                execution_time=execution_time,
                metadata={
                    "agent_id": self.id,
                    "agent_name": self.name,
                    "role": self.role.value,
                },
            )

        except Exception as e:
            self.metrics["tasks_failed"] += 1
            self.state = AgentState.FAILED

            return TaskResult(
                success=False,
                output=None,
                error=str(e),
                metadata={"agent_id": self.id, "agent_name": self.name},
            )

    async def _reason_and_act(self, task: dict[str, Any]) -> Any:
        """Internal reasoning and action execution"""
        # Integrate with actual LLM provider in production
        return {
            "status": "completed",
            "agent": self.name,
            "task_summary": task.get("description", "Task executed"),
            "reasoning": f"{self.name} processed the task using {self.config.llm_model}",
        }

    async def send_message(self, message: AgentMessage) -> None:
        """Send message to another agent or broadcast"""
        message.sender_id = self.id
        self.metrics["messages_sent"] += 1
        # Message routing handled by communication layer

    async def receive_message(self, message: AgentMessage) -> None:
        """Receive and queue message"""
        self.metrics["messages_received"] += 1
        await self.message_queue.put(message)
        self.memory.append(message)

    async def process_messages(self) -> None:
        """Process queued messages"""
        while not self.message_queue.empty():
            message = await self.message_queue.get()
            if message.message_type == "task":
                await self.execute_task(message.payload)

    def get_stats(self) -> dict[str, Any]:
        """Get agent performance statistics"""
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role.value,
            "state": self.state.value,
            "metrics": self.metrics,
            "queue_size": self.message_queue.qsize(),
            "memory_size": len(self.memory),
        }

    def __repr__(self) -> str:
        return f"Agent(name={self.name}, role={self.role.value}, state={self.state.value})"
