"""Trigger management system for automated workflow execution."""

from typing import Any, Dict, List, Optional, Callable
import asyncio
import logging
from datetime import datetime
from croniter import croniter
import hashlib
import hmac

logger = logging.getLogger(__name__)


class TriggerManager:
    """Manages all trigger types and their lifecycle."""
    
    def __init__(self):
        self.active_triggers: Dict[str, 'Trigger'] = {}
        self.trigger_handlers = {
            'schedule': ScheduleTrigger,
            'webhook': WebhookTrigger,
            'database': DatabaseTrigger,
            'email': EmailTrigger,
            'file': FileTrigger,
            'queue': QueueTrigger,
            'event': EventTrigger,
        }
    
    async def register_trigger(self, trigger_id: str, trigger_type: str,
                              config: Dict[str, Any], callback: Callable) -> bool:
        """Register a new trigger."""
        if trigger_id in self.active_triggers:
            logger.warning(f"Trigger {trigger_id} already exists")
            return False
        
        handler_class = self.trigger_handlers.get(trigger_type)
        if not handler_class:
            logger.error(f"Unknown trigger type: {trigger_type}")
            return False
        
        trigger = handler_class(trigger_id, config, callback)
        await trigger.start()
        
        self.active_triggers[trigger_id] = trigger
        logger.info(f"Registered trigger {trigger_id} of type {trigger_type}")
        return True
    
    async def unregister_trigger(self, trigger_id: str) -> bool:
        """Unregister and stop a trigger."""
        trigger = self.active_triggers.get(trigger_id)
        if not trigger:
            return False
        
        await trigger.stop()
        del self.active_triggers[trigger_id]
        logger.info(f"Unregistered trigger {trigger_id}")
        return True
    
    async def stop_all(self):
        """Stop all active triggers."""
        for trigger_id in list(self.active_triggers.keys()):
            await self.unregister_trigger(trigger_id)


class Trigger:
    """Base trigger class."""
    
    def __init__(self, trigger_id: str, config: Dict[str, Any], callback: Callable):
        self.trigger_id = trigger_id
        self.config = config
        self.callback = callback
        self.running = False
        self.task: Optional[asyncio.Task] = None
    
    async def start(self):
        """Start the trigger."""
        self.running = True
        self.task = asyncio.create_task(self.run())
    
    async def stop(self):
        """Stop the trigger."""
        self.running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
    
    async def run(self):
        """Main trigger loop - override in subclasses."""
        raise NotImplementedError
    
    async def fire(self, data: Optional[Dict] = None):
        """Fire the trigger and execute callback."""
        logger.info(f"Trigger {self.trigger_id} fired")
        try:
            await self.callback(self.trigger_id, data or {})
        except Exception as e:
            logger.error(f"Trigger {self.trigger_id} callback failed: {e}")


class ScheduleTrigger(Trigger):
    """Schedule-based trigger using cron expressions."""
    
    async def run(self):
        """Run scheduled trigger."""
        cron_expression = self.config.get('cronExpression', '0 * * * *')
        timezone = self.config.get('timezone', 'UTC')
        
        try:
            cron = croniter(cron_expression, datetime.now())
        except Exception as e:
            logger.error(f"Invalid cron expression: {cron_expression} - {e}")
            return
        
        while self.running:
            # Get next execution time
            next_run = cron.get_next(datetime)
            now = datetime.now()
            
            # Calculate sleep time
            sleep_seconds = (next_run - now).total_seconds()
            
            if sleep_seconds > 0:
                try:
                    await asyncio.sleep(sleep_seconds)
                except asyncio.CancelledError:
                    break
            
            if self.running:
                await self.fire({'scheduled_time': next_run.isoformat()})


class WebhookTrigger(Trigger):
    """Webhook trigger - registers HTTP endpoint."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.webhook_path = self.config.get('path', f'/webhook/{self.trigger_id}')
        self.auth_type = self.config.get('auth', 'none')
        self.secret = self.config.get('secret', '')
    
    async def run(self):
        """Webhook doesn't need active loop - waits for HTTP calls."""
        logger.info(f"Webhook trigger ready at {self.webhook_path}")
        while self.running:
            await asyncio.sleep(1)
    
    async def handle_request(self, request_data: Dict[str, Any]) -> bool:
        """Handle incoming webhook request."""
        # Validate authentication
        if self.auth_type == 'apikey':
            provided_key = request_data.get('headers', {}).get('X-API-Key')
            if provided_key != self.secret:
                logger.warning(f"Webhook auth failed for {self.trigger_id}")
                return False
        
        elif self.auth_type == 'bearer':
            auth_header = request_data.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer ') or auth_header[7:] != self.secret:
                logger.warning(f"Webhook auth failed for {self.trigger_id}")
                return False
        
        elif self.auth_type == 'signature':
            # HMAC signature validation
            signature = request_data.get('headers', {}).get('X-Signature', '')
            body = str(request_data.get('body', ''))
            expected = hmac.new(self.secret.encode(), body.encode(), hashlib.sha256).hexdigest()
            if signature != expected:
                logger.warning(f"Webhook signature mismatch for {self.trigger_id}")
                return False
        
        # Fire trigger with request data
        await self.fire(request_data)
        return True


class DatabaseTrigger(Trigger):
    """Database change detection trigger."""
    
    async def run(self):
        """Poll database for changes."""
        connection_string = self.config.get('connectionString', '')
        table = self.config.get('table', '')
        events = self.config.get('events', ['INSERT'])
        poll_interval = self.config.get('pollInterval', 60)
        
        last_check = datetime.now()
        
        while self.running:
            try:
                # Placeholder for actual DB polling
                # Would connect to DB and check for changes since last_check
                logger.debug(f"Polling database {table} for changes")
                
                # Simulate finding changes
                changes = []  # Would query DB here
                
                if changes:
                    await self.fire({
                        'table': table,
                        'events': events,
                        'changes': changes,
                        'timestamp': datetime.now().isoformat()
                    })
                
                last_check = datetime.now()
                await asyncio.sleep(poll_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Database trigger error: {e}")
                await asyncio.sleep(poll_interval)


class EmailTrigger(Trigger):
    """Email monitoring trigger."""
    
    async def run(self):
        """Monitor email inbox."""
        email_address = self.config.get('email', '')
        subject_filter = self.config.get('subjectFilter', '')
        check_interval = self.config.get('checkInterval', 300)  # 5 minutes
        
        while self.running:
            try:
                # Placeholder for actual email checking
                # Would connect to IMAP/POP3 and check for new emails
                logger.debug(f"Checking email {email_address}")
                
                # Simulate finding emails
                emails = []  # Would fetch from email server
                
                if emails:
                    await self.fire({
                        'email_address': email_address,
                        'count': len(emails),
                        'emails': emails
                    })
                
                await asyncio.sleep(check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Email trigger error: {e}")
                await asyncio.sleep(check_interval)


class FileTrigger(Trigger):
    """File system watcher trigger."""
    
    async def run(self):
        """Watch file system for changes."""
        file_path = self.config.get('filePath', '')
        watch_modes = self.config.get('watchModes', ['create'])
        
        # Placeholder for actual file watching
        # Would use watchdog or similar library
        
        logger.info(f"Watching file path: {file_path}")
        
        while self.running:
            try:
                # Simulate file change detection
                await asyncio.sleep(5)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"File trigger error: {e}")


class QueueTrigger(Trigger):
    """Message queue trigger."""
    
    async def run(self):
        """Listen to message queue."""
        queue_type = self.config.get('queueType', 'rabbitmq')
        queue_name = self.config.get('queueName', '')
        connection_url = self.config.get('connectionUrl', '')
        
        logger.info(f"Listening to {queue_type} queue: {queue_name}")
        
        # Placeholder for actual queue listening
        # Would connect to RabbitMQ, SQS, Kafka, etc.
        
        while self.running:
            try:
                # Simulate receiving messages
                await asyncio.sleep(1)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Queue trigger error: {e}")


class EventTrigger(Trigger):
    """Custom event trigger."""
    
    async def run(self):
        """Wait for custom events."""
        event_type = self.config.get('eventType', '')
        event_source = self.config.get('eventSource', '')
        
        logger.info(f"Listening for events: {event_type} from {event_source}")
        
        # Event-driven - would integrate with event bus
        while self.running:
            await asyncio.sleep(1)
    
    async def handle_event(self, event_data: Dict[str, Any]) -> bool:
        """Handle incoming event."""
        filter_expr = self.config.get('filterExpression', '')
        
        # Apply filter if specified
        if filter_expr:
            # Would evaluate filter expression
            pass
        
        await self.fire(event_data)
        return True
