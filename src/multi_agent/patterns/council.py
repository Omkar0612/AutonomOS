"""
Council Multi-Agent Pattern (Deliberative Decision-Making)
"""
import asyncio
import random
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from ..core.agent import Agent  # TaskResult removed - not referenced in this module


class VoteType(Enum):
    """Types of votes in council deliberation"""

    APPROVE = "approve"
    REJECT = "reject"
    ABSTAIN = "abstain"


@dataclass
class Vote:
    """Individual agent vote with reasoning"""

    agent_id: str
    agent_name: str
    vote: VoteType
    confidence: float  # 0-1
    reasoning: str
    perspective: str  # Agent's perspective/role

    def to_dict(self) -> dict:
        return {
            "agent_name": self.agent_name,
            "vote": self.vote.value,
            "confidence": self.confidence,
            "reasoning": self.reasoning,
            "perspective": self.perspective,
        }


@dataclass
class CouncilDecision:
    """Final decision from council deliberation"""

    recommendation: str  # "approve", "reject", "conditional"
    confidence: float
    majority_reasoning: str
    dissenting_opinions: list[str]
    vote_breakdown: dict[str, int]
    conditions: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "recommendation": self.recommendation,
            "confidence": self.confidence,
            "majority_reasoning": self.majority_reasoning,
            "dissenting_opinions": self.dissenting_opinions,
            "vote_breakdown": self.vote_breakdown,
            "conditions": self.conditions,
        }


class CouncilSystem:
    """
    Council of agents with different perspectives deliberating on decisions.

    Agents debate, provide reasoning, and reach consensus through voting.
    Best for: Strategic decisions, risk assessment, complex planning.
    """

    def __init__(
        self,
        name: str,
        agents: list[Agent],
        decision_process: dict[str, Any] | None = None,
    ):
        self.name = name
        self.agents = agents

        default_process: dict[str, Any] = {
            "deliberation_rounds": 3,
            "consensus_threshold": 0.75,
            "allow_debate": True,
            "require_reasoning": True,
        }
        self.decision_process = {**default_process, **(decision_process or {})}

        self.decision_history: list[dict] = []

    async def decide(
        self,
        question: str,
        context: dict[str, Any] | None = None,
    ) -> CouncilDecision:
        """
        Council deliberates and reaches decision.

        Args:
            question: Decision to be made
            context: Additional context and data

        Returns:
            CouncilDecision with recommendation and reasoning
        """
        context = context or {}
        deliberation_rounds = self.decision_process["deliberation_rounds"]

        # Round 1: Initial positions
        votes = await self._collect_votes(question, context)

        # Additional deliberation rounds if allowed
        if self.decision_process["allow_debate"] and deliberation_rounds > 1:
            for round_num in range(2, deliberation_rounds + 1):
                debate_context = {
                    **context,
                    "previous_votes": [v.to_dict() for v in votes],
                    "round": round_num,
                }
                votes = await self._collect_votes(question, debate_context)

        # Synthesize final decision
        decision = self._synthesize_decision(question, votes)

        self.decision_history.append({
            "question": question,
            "context": context,
            "votes": [v.to_dict() for v in votes],
            "decision": decision.to_dict(),
        })

        return decision

    async def _collect_votes(
        self,
        question: str,
        context: dict[str, Any],
    ) -> list[Vote]:
        """Collect votes from all council members"""
        voting_tasks = []

        for agent in self.agents:
            task = {
                "question": question,
                "context": context,
                "your_perspective": agent.config.expertise,
                "require_reasoning": self.decision_process["require_reasoning"],
            }
            voting_tasks.append(self._agent_vote(agent, task))

        votes = await asyncio.gather(*voting_tasks)
        return votes

    async def _agent_vote(self, agent: Agent, task: dict) -> Vote:
        """Individual agent casts vote with reasoning"""
        await agent.execute_task(task)

        # Simulate vote outcome for testing; replace with LLM response parsing in production
        # noqa comments below: random is used for simulation, not cryptographic purposes
        vote_type = random.choice([VoteType.APPROVE, VoteType.APPROVE, VoteType.REJECT])  # noqa: S311
        confidence = 0.6 + random.random() * 0.3  # noqa: S311

        return Vote(
            agent_id=agent.id,
            agent_name=agent.name,
            vote=vote_type,
            confidence=confidence,
            reasoning=f"{agent.name}'s reasoning from {agent.config.expertise} perspective",
            perspective=agent.config.expertise or agent.role.value,
        )

    def _synthesize_decision(
        self,
        question: str,  # noqa: ARG002
        votes: list[Vote],
    ) -> CouncilDecision:
        """Synthesize final decision from all votes"""
        vote_counts: dict[str, int] = {
            VoteType.APPROVE.value: 0,
            VoteType.REJECT.value: 0,
            VoteType.ABSTAIN.value: 0,
        }

        total_confidence = 0.0
        approve_reasoning: list[str] = []
        reject_reasoning: list[str] = []

        for vote in votes:
            vote_counts[vote.vote.value] += 1
            total_confidence += vote.confidence

            if vote.vote == VoteType.APPROVE:
                approve_reasoning.append(vote.reasoning)
            elif vote.vote == VoteType.REJECT:
                reject_reasoning.append(vote.reasoning)

        total_votes = len(votes)
        approve_pct = vote_counts[VoteType.APPROVE.value] / total_votes
        consensus_threshold = self.decision_process["consensus_threshold"]

        if approve_pct >= consensus_threshold:
            recommendation = "approve"
            majority_reasoning = " | ".join(approve_reasoning)
            dissenting = reject_reasoning
        elif vote_counts[VoteType.REJECT.value] / total_votes >= consensus_threshold:
            recommendation = "reject"
            majority_reasoning = " | ".join(reject_reasoning)
            dissenting = approve_reasoning
        else:
            recommendation = "conditional"
            majority_reasoning = "No strong consensus - conditional approval recommended"
            dissenting = reject_reasoning

        avg_confidence = total_confidence / total_votes

        return CouncilDecision(
            recommendation=recommendation,
            confidence=avg_confidence,
            majority_reasoning=majority_reasoning,
            dissenting_opinions=dissenting,
            vote_breakdown=vote_counts,
            conditions=(
                self._generate_conditions(votes) if recommendation == "conditional" else []
            ),
        )

    def _generate_conditions(self, votes: list[Vote]) -> list[str]:
        """Generate conditions when decision is not unanimous"""
        conditions = []

        for vote in votes:
            if vote.vote == VoteType.REJECT or vote.confidence < 0.7:
                conditions.append(f"Address {vote.perspective} concerns")

        return list(set(conditions))[:3]  # Top 3 unique conditions

    def get_council_stats(self) -> dict[str, Any]:
        """Get council performance statistics"""
        if not self.decision_history:
            return {
                "name": self.name,
                "member_count": len(self.agents),
                "decisions_made": 0,
            }

        total_decisions = len(self.decision_history)
        approvals = sum(
            1
            for d in self.decision_history
            if d["decision"]["recommendation"] == "approve"
        )

        return {
            "name": self.name,
            "member_count": len(self.agents),
            "decisions_made": total_decisions,
            "approval_rate": approvals / total_decisions if total_decisions > 0 else 0,
            "members": [a.get_stats() for a in self.agents],
            "decision_process": self.decision_process,
        }

    def __repr__(self) -> str:
        return f"CouncilSystem(name={self.name}, members={len(self.agents)})"
