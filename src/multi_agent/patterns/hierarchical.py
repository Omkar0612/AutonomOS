""" 
Hierarchical Multi-Agent Pattern (Leader-Worker)
"""
from typing import List, Dict, Any, Optional
import asyncio
from ..core.agent import Agent, AgentConfig, AgentRole, TaskResult, AgentMessage


class HierarchicalTeam:
    """
    Hierarchical team with manager coordinating workers.
    
    Manager delegates tasks to specialized workers and synthesizes results.
    Best for: Structured workflows, content pipelines, report generation.
    """
    
    def __init__(
        self,
        name: str,
        manager: Agent,
        workers: List[Agent],
        workflow: str = "sequential"  # sequential, parallel, adaptive
    ):
        self.name = name
        self.manager = manager
        self.workers = workers
        self.workflow = workflow
        self.task_history: List[Dict] = []
        
    async def execute(
        self,
        task: str,
        context: Optional[Dict[str, Any]] = None
    ) -> TaskResult:
        """
        Execute task through hierarchical delegation.
        
        Args:
            task: Task description
            context: Additional context and parameters
            
        Returns:
            Final synthesized result from manager
        """
        context = context or {}
        
        # Step 1: Manager plans decomposition
        plan = await self._manager_plan(task, context)
        
        # Step 2: Delegate subtasks to workers
        if self.workflow == "sequential":
            worker_results = await self._execute_sequential(plan)
        elif self.workflow == "parallel":
            worker_results = await self._execute_parallel(plan)
        else:  # adaptive
            worker_results = await self._execute_adaptive(plan)
        
        # Step 3: Manager synthesizes results
        final_result = await self._manager_synthesize(task, worker_results)
        
        self.task_history.append({
            "task": task,
            "plan": plan,
            "worker_results": worker_results,
            "final_result": final_result
        })
        
        return final_result
    
    async def _manager_plan(self, task: str, context: Dict) -> Dict[str, Any]:
        """Manager decomposes task into subtasks"""
        plan_task = {
            "description": f"Decompose this task: {task}",
            "context": context,
            "workers_available": [w.name for w in self.workers],
            "worker_capabilities": {w.name: w.config.expertise for w in self.workers}
        }
        
        result = await self.manager.execute_task(plan_task)
        
        # Extract plan (in real implementation, LLM would generate this)
        return {
            "subtasks": [
                {"worker": self.workers[i % len(self.workers)].name, 
                 "task": f"Subtask {i+1} for {task}"}
                for i in range(len(self.workers))
            ],
            "workflow": self.workflow
        }
    
    async def _execute_sequential(self, plan: Dict) -> List[TaskResult]:
        """Execute subtasks sequentially, each building on previous"""
        results = []
        context = {}
        
        for subtask in plan["subtasks"]:
            worker = self._get_worker_by_name(subtask["worker"])
            task = {
                "description": subtask["task"],
                "previous_results": context
            }
            result = await worker.execute_task(task)
            results.append(result)
            context[worker.name] = result.output
            
        return results
    
    async def _execute_parallel(self, plan: Dict) -> List[TaskResult]:
        """Execute all subtasks in parallel"""
        tasks = []
        for subtask in plan["subtasks"]:
            worker = self._get_worker_by_name(subtask["worker"])
            task = {"description": subtask["task"]}
            tasks.append(worker.execute_task(task))
        
        return await asyncio.gather(*tasks)
    
    async def _execute_adaptive(self, plan: Dict) -> List[TaskResult]:
        """Adaptively choose sequential or parallel based on dependencies"""
        # For now, default to parallel
        return await self._execute_parallel(plan)
    
    async def _manager_synthesize(
        self, 
        original_task: str, 
        worker_results: List[TaskResult]
    ) -> TaskResult:
        """Manager synthesizes worker outputs into final result"""
        synthesis_task = {
            "description": f"Synthesize results for: {original_task}",
            "worker_outputs": [r.output for r in worker_results if r.success],
            "failed_workers": [r.metadata.get("agent_name") for r in worker_results if not r.success]
        }
        
        return await self.manager.execute_task(synthesis_task)
    
    def _get_worker_by_name(self, name: str) -> Agent:
        """Find worker by name"""
        for worker in self.workers:
            if worker.name == name:
                return worker
        return self.workers[0]  # Fallback
    
    def get_team_stats(self) -> Dict[str, Any]:
        """Get team performance statistics"""
        return {
            "name": self.name,
            "manager": self.manager.get_stats(),
            "workers": [w.get_stats() for w in self.workers],
            "tasks_completed": len(self.task_history),
            "workflow": self.workflow
        }
    
    def __repr__(self) -> str:
        return f"HierarchicalTeam(name={self.name}, manager={self.manager.name}, workers={len(self.workers)})"
