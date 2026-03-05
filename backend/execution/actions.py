"""Action node handlers for various integrations."""

from typing import Any, Dict
import httpx
import logging
import json

from .context import ExecutionContext

logger = logging.getLogger(__name__)


class ActionHandler:
    """Handles execution of action nodes."""
    
    async def execute(self, action_type: str, config: Dict[str, Any],
                     context: ExecutionContext) -> Dict[str, Any]:
        """Route to appropriate action handler."""
        handlers = {
            'api': self.execute_api,
            'http': self.execute_api,
            'database': self.execute_database,
            'file': self.execute_file,
            'email': self.execute_email,
            'notification': self.execute_notification,
            'webhook': self.execute_webhook,
            'transform': self.execute_transform,
        }
        
        handler = handlers.get(action_type, self.execute_generic)
        return await handler(config, context)
    
    async def execute_api(self, config: Dict[str, Any], 
                         context: ExecutionContext) -> Dict[str, Any]:
        """Execute HTTP/API call."""
        method = config.get('method', 'GET').upper()
        url = context.resolve_value(config.get('url', ''))
        headers = config.get('headers', {})
        body = config.get('body')
        auth_type = config.get('auth', 'none')
        timeout = config.get('timeout', 30)
        retries = config.get('retries', 0)
        
        # Resolve variables in headers and body
        resolved_headers = {k: context.resolve_value(v) for k, v in headers.items()}
        
        if body:
            if isinstance(body, str):
                resolved_body = context.resolve_value(body)
                try:
                    resolved_body = json.loads(resolved_body)
                except:
                    pass
            else:
                resolved_body = {k: context.resolve_value(v) for k, v in body.items()}
        else:
            resolved_body = None
        
        # Add authentication
        if auth_type == 'bearer':
            token = context.resolve_value(config.get('token', ''))
            resolved_headers['Authorization'] = f'Bearer {token}'
        elif auth_type == 'apikey':
            key = context.resolve_value(config.get('apiKey', ''))
            resolved_headers['X-API-Key'] = key
        
        # Execute request with retries
        last_error = None
        for attempt in range(retries + 1):
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.request(
                        method=method,
                        url=url,
                        headers=resolved_headers,
                        json=resolved_body if method in ['POST', 'PUT', 'PATCH'] else None
                    )
                    response.raise_for_status()
                    
                    # Try to parse as JSON
                    try:
                        response_data = response.json()
                    except:
                        response_data = response.text
                    
                    return {
                        'status': 'success',
                        'status_code': response.status_code,
                        'data': response_data,
                        'headers': dict(response.headers)
                    }
            except Exception as e:
                last_error = e
                logger.warning(f"API call attempt {attempt + 1} failed: {e}")
                if attempt < retries:
                    await asyncio.sleep(2 ** attempt)
        
        return {
            'status': 'error',
            'error': str(last_error)
        }
    
    async def execute_database(self, config: Dict[str, Any],
                              context: ExecutionContext) -> Dict[str, Any]:
        """Execute database operation."""
        # Placeholder - would implement actual DB operations
        operation = config.get('operation', 'query')
        
        return {
            'status': 'success',
            'operation': operation,
            'message': 'Database operation executed (mock)'
        }
    
    async def execute_file(self, config: Dict[str, Any],
                          context: ExecutionContext) -> Dict[str, Any]:
        """Execute file operation."""
        operation = config.get('operation', 'read')
        file_path = context.resolve_value(config.get('filePath', ''))
        
        # Placeholder - would implement actual file operations
        return {
            'status': 'success',
            'operation': operation,
            'file_path': file_path,
            'message': 'File operation executed (mock)'
        }
    
    async def execute_email(self, config: Dict[str, Any],
                           context: ExecutionContext) -> Dict[str, Any]:
        """Send email."""
        recipients = config.get('recipients', [])
        subject = context.resolve_value(config.get('subject', ''))
        body = context.resolve_value(config.get('body', ''))
        
        logger.info(f"Sending email to {recipients}: {subject}")
        
        return {
            'status': 'success',
            'recipients': recipients,
            'subject': subject,
            'message': 'Email sent (mock)'
        }
    
    async def execute_notification(self, config: Dict[str, Any],
                                  context: ExecutionContext) -> Dict[str, Any]:
        """Send notification."""
        service = config.get('service', 'slack')
        message = context.resolve_value(config.get('message', ''))
        
        logger.info(f"Sending {service} notification: {message}")
        
        return {
            'status': 'success',
            'service': service,
            'message': 'Notification sent (mock)'
        }
    
    async def execute_webhook(self, config: Dict[str, Any],
                             context: ExecutionContext) -> Dict[str, Any]:
        """Execute webhook call."""
        return await self.execute_api(config, context)
    
    async def execute_transform(self, config: Dict[str, Any],
                               context: ExecutionContext) -> Dict[str, Any]:
        """Transform data."""
        transform_type = config.get('transformType', 'map')
        expression = config.get('expression', '')
        
        # Simple transformation using context evaluation
        try:
            result = context.evaluate_expression(expression)
            return {
                'status': 'success',
                'transform_type': transform_type,
                'output': result
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    async def execute_generic(self, config: Dict[str, Any],
                             context: ExecutionContext) -> Dict[str, Any]:
        """Generic action handler."""
        return {
            'status': 'success',
            'message': 'Generic action executed',
            'config': config
        }
