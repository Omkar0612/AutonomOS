"""TaskScheduler - Cron-based task scheduling"""
from typing import Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from loguru import logger


class TaskScheduler:
    """Manages scheduled tasks using APScheduler"""

    def __init__(self, agent_brain: Any):
        self.agent_brain = agent_brain
        self.scheduler = AsyncIOScheduler()
        self.running = False
        self.tasks = {}
        logger.info("TaskScheduler initialized")

    def start(self) -> None:
        """Start the scheduler"""
        if self.running:
            logger.warning("Scheduler already running")
            return
        try:
            self.scheduler.start()
            self.running = True
            logger.success("TaskScheduler started")
        except Exception as e:
            logger.error(f"Failed to start scheduler: {e}")
            raise

    def stop(self) -> None:
        """Stop the scheduler"""
        if not self.running:
            return
        try:
            self.scheduler.shutdown(wait=True)
            self.running = False
            logger.info("TaskScheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping scheduler: {e}")

    def is_running(self) -> bool:
        """Check if scheduler is running"""
        return self.running

    def add_task(
        self,
        name: str,
        cron: str,
        func: Any,
        args: tuple[Any, ...] | None = None,
        kwargs: dict[str, Any] | None = None,
    ) -> None:
        """Add a new scheduled task"""
        try:
            # Parse cron expression
            cron_parts = cron.split()
            if len(cron_parts) != 5:
                raise ValueError("Cron expression must have 5 parts: min hour day month dow")
            minute, hour, day, month, day_of_week = cron_parts
            job = self.scheduler.add_job(
                func,
                trigger="cron",
                args=args or (),
                kwargs=kwargs or {},
                minute=minute,
                hour=hour,
                day=day,
                month=month,
                day_of_week=day_of_week,
                id=name,
                replace_existing=True,
            )
            self.tasks[name] = {"job": job, "cron": cron, "func": func.__name__}
            logger.info(f"Task '{name}' scheduled with cron: {cron}")
        except Exception as e:
            logger.error(f"Failed to add task '{name}': {e}")
            raise

    def remove_task(self, name: str) -> None:
        """Remove a scheduled task"""
        try:
            self.scheduler.remove_job(name)
            self.tasks.pop(name, None)
            logger.info(f"Task '{name}' removed")
        except Exception as e:
            logger.warning(f"Failed to remove task '{name}': {e}")

    def list_tasks(self) -> dict[str, Any]:
        """List all scheduled tasks"""
        return self.tasks

    async def execute_task_now(self, name: str) -> dict[str, Any]:
        """Execute a task immediately"""
        if name not in self.tasks:
            raise ValueError(f"Task '{name}' not found")
        logger.info(f"Executing task '{name}' immediately")
        # TODO: Execute task through agent brain
        return {"status": "executed", "task": name}
