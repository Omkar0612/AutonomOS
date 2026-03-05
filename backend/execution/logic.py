"""Logic execution engine for control flow operations."""

from typing import Any, Dict, List, Optional
import asyncio
import re
import logging
from .context import ExecutionContext

logger = logging.getLogger(__name__)


class LogicEngine:
    """Handles logic node execution including if/else, loops, parallel, etc."""
    
    @staticmethod
    async def execute_if_else(config: Dict[str, Any], context: ExecutionContext) -> Dict[str, Any]:
        """Execute if/else conditional logic."""
        condition_config = config.get('condition', {})
        
        # Simple mode: left operator right
        if 'operator' in condition_config:
            left = context.resolve_value(condition_config.get('leftValue'))
            right = context.resolve_value(condition_config.get('rightValue'))
            operator = condition_config.get('operator')
            
            result = LogicEngine._evaluate_operator(left, right, operator)
        # Expression mode
        elif 'expression' in condition_config:
            expression = condition_config['expression']
            result = context.evaluate_expression(expression)
        else:
            result = False
        
        branch = 'true' if result else 'false'
        
        return {
            'branch': branch,
            'result': result,
            'next_path': branch
        }
    
    @staticmethod
    def _evaluate_operator(left: Any, right: Any, operator: str) -> bool:
        """Evaluate comparison operators."""
        operators = {
            '==': lambda l, r: l == r,
            '!=': lambda l, r: l != r,
            '>': lambda l, r: l > r,
            '<': lambda l, r: l < r,
            '>=': lambda l, r: l >= r,
            '<=': lambda l, r: l <= r,
            'contains': lambda l, r: r in str(l),
            'regex': lambda l, r: bool(re.search(r, str(l)))
        }
        
        op_func = operators.get(operator)
        if not op_func:
            raise ValueError(f"Unknown operator: {operator}")
        
        return op_func(left, right)
    
    @staticmethod
    async def execute_switch(config: Dict[str, Any], context: ExecutionContext) -> Dict[str, Any]:
        """Execute switch/case logic."""
        switch_config = config.get('switchConfig', {})
        variable = context.resolve_value(switch_config.get('variable'))
        cases = switch_config.get('cases', [])
        default_case = switch_config.get('defaultCase', False)
        
        # Find matching case
        for i, case in enumerate(cases):
            if context.resolve_value(case['value']) == variable:
                return {
                    'branch': f'case_{i}',
                    'matched_case': case['label'],
                    'next_path': f'case_{i}'
                }
        
        # No match, use default if available
        if default_case:
            return {
                'branch': 'default',
                'matched_case': 'default',
                'next_path': 'default'
            }
        
        return {
            'branch': 'none',
            'matched_case': None,
            'next_path': None
        }
    
    @staticmethod
    async def execute_loop(config: Dict[str, Any], context: ExecutionContext, 
                          node_executor: Any) -> Dict[str, Any]:
        """Execute loop (for, while, until)."""
        loop_config = config.get('loopConfig', {})
        loop_type = loop_config.get('type', 'for')
        max_iterations = loop_config.get('maxIterations', 100)
        break_condition = loop_config.get('breakOn')
        
        iteration = 0
        results = []
        
        if loop_type == 'for':
            iterations = loop_config.get('iterations', 10)
            for i in range(min(iterations, max_iterations)):
                context.set_variable('iteration', i)
                
                # Check break condition
                if break_condition and context.evaluate_expression(break_condition):
                    break
                
                # Execute loop body (would call node_executor here)
                results.append({'iteration': i, 'status': 'completed'})
                iteration = i + 1
                
        elif loop_type == 'while':
            condition = loop_config.get('condition')
            while iteration < max_iterations:
                if not context.evaluate_expression(condition):
                    break
                
                context.set_variable('iteration', iteration)
                results.append({'iteration': iteration, 'status': 'completed'})
                iteration += 1
                
        elif loop_type == 'until':
            condition = loop_config.get('condition')
            while iteration < max_iterations:
                context.set_variable('iteration', iteration)
                results.append({'iteration': iteration, 'status': 'completed'})
                iteration += 1
                
                if context.evaluate_expression(condition):
                    break
        
        return {
            'iterations_completed': iteration,
            'results': results,
            'loop_type': loop_type
        }
    
    @staticmethod
    async def execute_foreach(config: Dict[str, Any], context: ExecutionContext) -> Dict[str, Any]:
        """Execute foreach loop over array."""
        foreach_config = config.get('forEachConfig', {})
        array_source = foreach_config.get('array')
        item_name = foreach_config.get('itemName', 'item')
        batch_size = foreach_config.get('batchSize', 1)
        parallel = foreach_config.get('parallel', False)
        
        # Resolve array
        array = context.resolve_value(array_source)
        if not isinstance(array, list):
            return {'error': 'Array source is not a list', 'results': []}
        
        results = []
        
        if parallel:
            # Parallel execution
            tasks = []
            for item in array:
                context.set_variable(item_name, item)
                # Would execute node here
                tasks.append(asyncio.create_task(asyncio.sleep(0.1)))
            
            await asyncio.gather(*tasks)
            results = [{'item': item, 'status': 'completed'} for item in array]
        else:
            # Sequential execution
            for item in array:
                context.set_variable(item_name, item)
                results.append({'item': item, 'status': 'completed'})
        
        return {
            'items_processed': len(array),
            'results': results,
            'mode': 'parallel' if parallel else 'sequential'
        }
    
    @staticmethod
    async def execute_parallel(config: Dict[str, Any], context: ExecutionContext,
                              branches: List[Any]) -> Dict[str, Any]:
        """Execute multiple branches in parallel."""
        parallel_config = config.get('parallelConfig', {})
        wait_for_all = parallel_config.get('waitForAll', True)
        fail_fast = parallel_config.get('failFast', False)
        timeout = parallel_config.get('timeout', 60)
        
        tasks = []
        for branch in branches:
            # Create task for each branch
            task = asyncio.create_task(asyncio.sleep(0.1))  # Placeholder
            tasks.append(task)
        
        try:
            if wait_for_all:
                results = await asyncio.wait_for(
                    asyncio.gather(*tasks, return_exceptions=not fail_fast),
                    timeout=timeout
                )
            else:
                done, pending = await asyncio.wait(
                    tasks,
                    return_when=asyncio.FIRST_COMPLETED,
                    timeout=timeout
                )
                # Cancel pending tasks
                for task in pending:
                    task.cancel()
                results = [task.result() for task in done]
        except asyncio.TimeoutError:
            return {'error': 'Parallel execution timed out', 'timeout': timeout}
        
        return {
            'branches_completed': len(results),
            'results': results,
            'mode': 'wait_all' if wait_for_all else 'first_completed'
        }
    
    @staticmethod
    async def execute_delay(config: Dict[str, Any], context: ExecutionContext) -> Dict[str, Any]:
        """Execute delay/sleep."""
        delay_config = config.get('delayConfig', {})
        duration = delay_config.get('duration', 1)
        unit = delay_config.get('unit', 's')
        dynamic = delay_config.get('dynamic', False)
        
        if dynamic:
            expression = delay_config.get('expression')
            duration = context.evaluate_expression(expression) or duration
        
        # Convert to seconds
        multipliers = {'ms': 0.001, 's': 1, 'm': 60, 'h': 3600}
        delay_seconds = duration * multipliers.get(unit, 1)
        
        logger.info(f"Delaying for {delay_seconds} seconds")
        await asyncio.sleep(delay_seconds)
        
        return {
            'delayed_for': delay_seconds,
            'unit': unit
        }
    
    @staticmethod
    async def execute_try_catch(config: Dict[str, Any], context: ExecutionContext,
                               try_func: Any) -> Dict[str, Any]:
        """Execute try/catch error handling."""
        try_config = config.get('tryCatchConfig', {})
        retries = try_config.get('retries', 0)
        fallback = try_config.get('fallback', 'default')
        log_errors = try_config.get('logErrors', True)
        
        last_error = None
        
        for attempt in range(retries + 1):
            try:
                result = await try_func()
                return {
                    'status': 'success',
                    'result': result,
                    'attempts': attempt + 1
                }
            except Exception as e:
                last_error = e
                if log_errors:
                    logger.error(f"Try/catch attempt {attempt + 1} failed: {e}")
                
                if attempt < retries:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        # All attempts failed
        return {
            'status': 'error',
            'error': str(last_error),
            'fallback': fallback,
            'attempts': retries + 1
        }
