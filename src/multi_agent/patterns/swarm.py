""" 
Swarm Multi-Agent Pattern (Decentralized)
"""
from typing import List, Dict, Any, Optional
import asyncio
from dataclasses import dataclass, field
from datetime import datetime
import numpy as np
from ..core.agent import Agent, AgentConfig, AgentRole, TaskResult


@dataclass
class PheromoneTrail:
    """
    Pheromone trail for swarm coordination (inspired by ant colonies).
    Agents leave trails guiding others to promising areas.
    """
    location: str  # Task/subtask identifier
    strength: float = 1.0  # Trail strength (decays over time)
    deposited_by: str = ""  # Agent ID
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def decay(self, decay_rate: float = 0.1) -> None:
        """Reduce trail strength over time"""
        self.strength *= (1 - decay_rate)
    
    def is_active(self, threshold: float = 0.1) -> bool:
        """Check if trail is still strong enough to follow"""
        return self.strength >= threshold


class SwarmSystem:
    """
    Decentralized swarm of agents coordinating through pheromone-like signals.
    
    Agents explore task space, leave trails for others, and converge on solutions.
    Best for: Research synthesis, exploration, distributed problem-solving.
    
    Based on: SwarmSys research (2024) - pheromone-based coordination
    """
    
    def __init__(
        self,
        name: str,
        agents: List[Agent],
        coordination: str = "pheromone_based",  # pheromone_based, voting, consensus
        convergence_threshold: float = 0.85,
        memory: str = "shared_vector_db"
    ):
        self.name = name
        self.agents = agents
        self.coordination = coordination
        self.convergence_threshold = convergence_threshold
        self.memory_type = memory
        
        self.pheromone_map: Dict[str, List[PheromoneTrail]] = {}
        self.shared_memory: List[Dict] = []
        self.iterations = 0
        
    async def execute(
        self,
        task: str,
        parameters: Optional[Dict[str, Any]] = None
    ) -> TaskResult:
        """
        Execute task through swarm exploration and convergence.
        
        Args:
            task: Task description
            parameters: Swarm parameters (depth, time_range, etc.)
            
        Returns:
            Converged solution from swarm
        """
        parameters = parameters or {}
        max_iterations = parameters.get("max_iterations", 10)
        
        # Initialize exploration
        task_space = await self._initialize_task_space(task, parameters)
        
        # Swarm iterations
        for iteration in range(max_iterations):
            self.iterations += 1
            
            # Each agent explores and deposits pheromones
            agent_results = await self._swarm_iteration(task_space)
            
            # Update pheromone trails
            self._update_pheromones(agent_results)
            
            # Check convergence
            if self._check_convergence():
                break
            
            # Decay old pheromones
            self._decay_pheromones()
        
        # Synthesize final result
        final_result = await self._synthesize_swarm_output(task)
        
        return final_result
    
    async def _initialize_task_space(
        self, 
        task: str, 
        parameters: Dict
    ) -> Dict[str, Any]:
        """Initialize the exploration space for agents"""
        return {
            "task": task,
            "parameters": parameters,
            "subtasks": self._decompose_task(task),
            "explored_areas": set()
        }
    
    def _decompose_task(self, task: str) -> List[str]:
        """Break task into explorable subtasks"""
        # In real implementation, use LLM to decompose
        num_subtasks = len(self.agents)
        return [f"{task} - aspect {i+1}" for i in range(num_subtasks)]
    
    async def _swarm_iteration(self, task_space: Dict) -> List[Dict]:
        """One iteration of swarm exploration"""
        tasks = []
        
        for agent in self.agents:
            # Agent chooses where to explore based on pheromones
            target = self._choose_exploration_target(agent, task_space)
            
            task_def = {
                "description": target,
                "pheromone_map": self._get_relevant_pheromones(target),
                "shared_knowledge": self.shared_memory[-5:]  # Last 5 discoveries
            }
            
            tasks.append(self._agent_explore(agent, task_def, target))
        
        return await asyncio.gather(*tasks)
    
    def _choose_exploration_target(
        self, 
        agent: Agent, 
        task_space: Dict
    ) -> str:
        """Agent chooses where to explore based on pheromone strength"""
        subtasks = task_space["subtasks"]
        
        # Calculate attraction to each subtask
        attractions = []
        for subtask in subtasks:
            pheromone_strength = self._get_pheromone_strength(subtask)
            # Balance exploration (low pheromone) and exploitation (high pheromone)
            attraction = pheromone_strength + np.random.random() * 0.5
            attractions.append(attraction)
        
        # Choose target (can be probabilistic)
        if np.random.random() < 0.7:  # 70% follow pheromones
            target_idx = np.argmax(attractions)
        else:  # 30% explore randomly
            target_idx = np.random.randint(len(subtasks))
        
        return subtasks[target_idx]
    
    async def _agent_explore(
        self, 
        agent: Agent, 
        task: Dict, 
        location: str
    ) -> Dict:
        """Agent explores and returns findings"""
        result = await agent.execute_task(task)
        
        return {
            "agent_id": agent.id,
            "agent_name": agent.name,
            "location": location,
            "result": result,
            "quality": self._assess_result_quality(result)
        }
    
    def _assess_result_quality(self, result: TaskResult) -> float:
        """Assess quality of agent's findings (0-1)"""
        if not result.success:
            return 0.0
        # In real implementation, use more sophisticated quality metrics
        return 0.8 + np.random.random() * 0.2
    
    def _update_pheromones(self, agent_results: List[Dict]) -> None:
        """Update pheromone trails based on agent findings"""
        for result_data in agent_results:
            location = result_data["location"]
            quality = result_data["quality"]
            
            if location not in self.pheromone_map:
                self.pheromone_map[location] = []
            
            # Deposit pheromone proportional to quality
            trail = PheromoneTrail(
                location=location,
                strength=quality,
                deposited_by=result_data["agent_id"],
                metadata={"iteration": self.iterations}
            )
            
            self.pheromone_map[location].append(trail)
            
            # Add to shared memory
            if result_data["result"].success:
                self.shared_memory.append({
                    "location": location,
                    "finding": result_data["result"].output,
                    "quality": quality
                })
    
    def _get_pheromone_strength(self, location: str) -> float:
        """Get total pheromone strength at location"""
        if location not in self.pheromone_map:
            return 0.1  # Small baseline
        
        trails = self.pheromone_map[location]
        active_trails = [t for t in trails if t.is_active()]
        
        return sum(t.strength for t in active_trails)
    
    def _get_relevant_pheromones(self, location: str) -> List[PheromoneTrail]:
        """Get pheromone trails for a location"""
        return self.pheromone_map.get(location, [])
    
    def _decay_pheromones(self, decay_rate: float = 0.1) -> None:
        """Decay all pheromone trails"""
        for location in self.pheromone_map:
            for trail in self.pheromone_map[location]:
                trail.decay(decay_rate)
    
    def _check_convergence(self) -> bool:
        """Check if swarm has converged on solution"""
        if len(self.shared_memory) < 3:
            return False
        
        # Check if recent findings are similar (convergence)
        recent_qualities = [m["quality"] for m in self.shared_memory[-5:]]
        avg_quality = np.mean(recent_qualities)
        
        return avg_quality >= self.convergence_threshold
    
    async def _synthesize_swarm_output(self, task: str) -> TaskResult:
        """Synthesize final output from swarm discoveries"""
        # Combine all high-quality findings
        high_quality_findings = [
            m["finding"] for m in self.shared_memory 
            if m["quality"] >= 0.7
        ]
        
        synthesis = {
            "task": task,
            "total_explorations": len(self.shared_memory),
            "iterations": self.iterations,
            "key_findings": high_quality_findings,
            "convergence_achieved": self._check_convergence()
        }
        
        return TaskResult(
            success=True,
            output=synthesis,
            metadata={
                "swarm_size": len(self.agents),
                "coordination": self.coordination,
                "iterations": self.iterations
            }
        )
    
    def get_swarm_stats(self) -> Dict[str, Any]:
        """Get swarm performance statistics"""
        return {
            "name": self.name,
            "agent_count": len(self.agents),
            "coordination": self.coordination,
            "iterations": self.iterations,
            "total_explorations": len(self.shared_memory),
            "pheromone_locations": len(self.pheromone_map),
            "convergence_threshold": self.convergence_threshold,
            "agents": [a.get_stats() for a in self.agents]
        }
