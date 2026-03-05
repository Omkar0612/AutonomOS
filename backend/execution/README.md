# AutonomOS Enhanced Execution Engine

## Overview

Phase 1.1 implementation of the enhanced execution engine with comprehensive logic execution, data flow management, and trigger system.

## Architecture

```
execution/
├── __init__.py          # Package exports
├── executor.py          # Main workflow executor with graph traversal
├── context.py           # Execution context and variable management
├── logic.py             # Logic node execution (if/else, loops, parallel)
├── actions.py           # Action node handlers (API, DB, email, etc.)
└── triggers.py          # Trigger management system
```

---

## Features Implemented

### ✅ 1. Logic Execution

#### **If/Else Branching**
```python
# Simple mode
config = {
    'condition': {
        'leftValue': '{{variable}}',
        'operator': '>',
        'rightValue': 100
    }
}

# Expression mode
config = {
    'condition': {
        'expression': 'variables["count"] > 100 and variables["status"] == "active"'
    }
}
```

**Supported Operators:**
- `==`, `!=`, `>`, `<`, `>=`, `<=`
- `contains` - String/array containment
- `regex` - Regular expression matching

#### **Switch/Case Routing**
```python
config = {
    'switchConfig': {
        'variable': '{{status}}',
        'cases': [
            {'value': 'pending', 'label': 'Handle Pending'},
            {'value': 'approved', 'label': 'Handle Approved'},
        ],
        'defaultCase': True
    }
}
```

#### **Loop Execution**

**For Loop:**
```python
config = {
    'loopConfig': {
        'type': 'for',
        'iterations': 10,
        'maxIterations': 100,
        'breakOn': 'variables["found"] == true'
    }
}
```

**While Loop:**
```python
config = {
    'loopConfig': {
        'type': 'while',
        'condition': 'variables["count"] < 100',
        'maxIterations': 1000
    }
}
```

**Until Loop:**
```python
config = {
    'loopConfig': {
        'type': 'until',
        'condition': 'variables["complete"] == true',
        'maxIterations': 100
    }
}
```

#### **ForEach Loop**
```python
config = {
    'forEachConfig': {
        'array': '{{items}}',
        'itemName': 'item',
        'batchSize': 10,
        'parallel': True
    }
}
```

#### **Parallel Execution**
```python
config = {
    'parallelConfig': {
        'waitForAll': True,
        'failFast': False,
        'timeout': 60
    }
}
```

#### **Delay/Sleep**
```python
config = {
    'delayConfig': {
        'duration': 5,
        'unit': 's',  # ms, s, m, h
        'dynamic': False
    }
}
```

#### **Try/Catch Error Handling**
```python
config = {
    'tryCatchConfig': {
        'retries': 3,
        'fallback': 'default',
        'logErrors': True
    }
}
```

---

### ✅ 2. Data Flow Between Nodes

#### **Execution Context**

The `ExecutionContext` class manages:
- Workflow variables
- Node outputs
- Node status tracking
- Error collection
- Expression evaluation

#### **Variable Management**

```python
# Set variables
context.set_variable('user_id', 12345)
context.set_variable('status', 'active')

# Get variables
user_id = context.get_variable('user_id')
status = context.get_variable('status', 'unknown')

# Check existence
if context.has_variable('user_id'):
    # Process
```

#### **Node Output Storage**

```python
# Store output from node
context.set_node_output('node_1', {
    'result': 'success',
    'data': [1, 2, 3]
})

# Retrieve output in later node
previous_result = context.get_node_output('node_1')
```

#### **Variable References**

**Double Curly Braces (`{{variable}}`):**
```python
# In node configuration
config = {
    'url': 'https://api.example.com/users/{{user_id}}',
    'message': 'Hello {{username}}!'
}

# Resolves to
context.resolve_value('{{user_id}}')  # Returns actual value
```

**Dollar Braces (`${expression}`):**
```python
# In node configuration
config = {
    'threshold': '${variables["base"] * 1.5}',
    'count': '${len(outputs["node_1"])}'
}

# Evaluates expression
context.resolve_value('${variables["base"] * 1.5}')
```

#### **Context Evaluation**

```python
# Evaluate expressions with current context
result = context.evaluate_expression('count > 10 and status == "active"')

# Access variables and outputs
result = context.evaluate_expression('variables["total"] + outputs["node_1"]["sum"]')
```

---

### ✅ 3. Graph-Based Execution

#### **Dependency Resolution**

The executor automatically:
1. Builds dependency graph from nodes and edges
2. Finds entry points (nodes with no dependencies)
3. Executes nodes in topological order
4. Waits for dependencies before execution
5. Handles parallel paths

#### **Execution Flow**

```python
# Example workflow
Trigger → Agent 1 → Logic (if/else) → Agent 2a (true branch)
                                   → Agent 2b (false branch)
                                   → Merge → Action
```

**Execution order:**
1. Trigger fires
2. Agent 1 executes (depends on Trigger)
3. Logic evaluates (depends on Agent 1)
4. Agent 2a OR Agent 2b executes (based on condition)
5. Action executes (after merge)

---

### ✅ 4. Action Handlers

#### **HTTP/API Calls**

```python
config = {
    'method': 'POST',
    'url': 'https://api.example.com/data',
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {{token}}'
    },
    'body': {
        'user_id': '{{user_id}}',
        'action': 'create'
    },
    'auth': 'bearer',
    'token': '{{api_token}}',
    'timeout': 30,
    'retries': 3
}
```

**Features:**
- Variable resolution in URL, headers, body
- Authentication (Bearer, API Key, Basic)
- Automatic retries with exponential backoff
- Timeout handling
- Response parsing (JSON/text)

#### **Data Transformation**

```python
config = {
    'transformType': 'map',
    'expression': '[item * 2 for item in variables["numbers"]]'
}
```

---

### ✅ 5. Trigger System

#### **Schedule Triggers (Cron)**

```python
config = {
    'cronExpression': '0 */6 * * *',  # Every 6 hours
    'timezone': 'UTC'
}

await trigger_manager.register_trigger(
    'my-schedule',
    'schedule',
    config,
    callback_function
)
```

**Cron Format:**
```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6)
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 * * * *` - Every hour
- `*/15 * * * *` - Every 15 minutes
- `0 9 * * 1-5` - 9 AM on weekdays
- `0 0 1 * *` - First day of every month

#### **Webhook Triggers**

```python
config = {
    'path': '/webhook/my-trigger',
    'auth': 'apikey',
    'secret': 'my-secret-key'
}

await trigger_manager.register_trigger(
    'my-webhook',
    'webhook',
    config,
    callback_function
)
```

**Authentication Types:**
- `none` - No authentication
- `apikey` - X-API-Key header
- `bearer` - Authorization: Bearer token
- `signature` - HMAC signature validation

#### **Database Change Detection**

```python
config = {
    'connectionString': 'postgresql://user:pass@host/db',
    'table': 'users',
    'events': ['INSERT', 'UPDATE'],
    'pollInterval': 60
}
```

#### **Email Monitoring**

```python
config = {
    'email': 'monitor@example.com',
    'subjectFilter': 'Order Confirmation',
    'includeAttachments': True,
    'checkInterval': 300
}
```

#### **File System Watching**

```python
config = {
    'filePath': '/data/uploads/*.csv',
    'watchModes': ['create', 'modify']
}
```

#### **Message Queue**

```python
config = {
    'queueType': 'rabbitmq',
    'queueName': 'workflow-events',
    'connectionUrl': 'amqp://localhost:5672'
}
```

---

## API Endpoints

### Execute Workflow

```bash
POST /api/workflows/execute
Headers:
  X-API-Provider: openai
  X-API-Key: sk-...
  X-Model: gpt-4-turbo

Body:
{
  "nodes": [...],
  "edges": [...]
}
```

### Register Trigger

```bash
POST /api/triggers/register
Body:
{
  "workflow_id": "workflow-123",
  "trigger_type": "schedule",
  "config": {
    "cronExpression": "0 */6 * * *",
    "timezone": "UTC"
  }
}
```

### List Active Triggers

```bash
GET /api/triggers

Response:
{
  "triggers": [
    {
      "id": "workflow-123_schedule",
      "running": true,
      "config": {...}
    }
  ]
}
```

### Unregister Trigger

```bash
DELETE /api/triggers/{trigger_id}
```

---

## Usage Examples

### Example 1: Conditional Workflow

```python
workflow = {
    'nodes': [
        {
            'id': '1',
            'type': 'trigger',
            'data': {'triggerType': 'manual'}
        },
        {
            'id': '2',
            'type': 'agent',
            'data': {
                'task': 'Analyze sentiment of: {{input_text}}',
                'agentType': 'single'
            }
        },
        {
            'id': '3',
            'type': 'logic',
            'data': {
                'logicType': 'if_else',
                'condition': {
                    'expression': '"positive" in outputs["2"]["output"].lower()'
                }
            }
        },
        {
            'id': '4',
            'type': 'action',
            'data': {
                'actionType': 'email',
                'config': {
                    'recipients': ['team@example.com'],
                    'subject': 'Positive feedback received',
                    'body': '{{outputs["2"]["output"]}}'
                }
            }
        }
    ],
    'edges': [
        {'source': '1', 'target': '2'},
        {'source': '2', 'target': '3'},
        {'source': '3', 'target': '4'}  # True branch
    ]
}

result = await workflow_executor.execute(workflow, ai_config)
```

### Example 2: Loop Processing

```python
workflow = {
    'nodes': [
        {
            'id': '1',
            'type': 'trigger',
            'data': {'triggerType': 'schedule'}
        },
        {
            'id': '2',
            'type': 'action',
            'data': {
                'actionType': 'api',
                'config': {
                    'method': 'GET',
                    'url': 'https://api.example.com/items'
                }
            }
        },
        {
            'id': '3',
            'type': 'logic',
            'data': {
                'logicType': 'foreach',
                'forEachConfig': {
                    'array': '${outputs["2"]["data"]}',
                    'itemName': 'item',
                    'parallel': True
                }
            }
        },
        {
            'id': '4',
            'type': 'agent',
            'data': {
                'task': 'Process item: {{item}}'
            }
        }
    ]
}
```

### Example 3: Parallel Execution

```python
workflow = {
    'nodes': [
        {'id': '1', 'type': 'trigger'},
        {'id': '2', 'type': 'agent', 'data': {'task': 'Task A'}},
        {'id': '3', 'type': 'agent', 'data': {'task': 'Task B'}},
        {'id': '4', 'type': 'agent', 'data': {'task': 'Task C'}},
        {
            'id': '5',
            'type': 'logic',
            'data': {
                'logicType': 'parallel',
                'parallelConfig': {
                    'waitForAll': True,
                    'timeout': 60
                }
            }
        }
    ],
    'edges': [
        {'source': '1', 'target': '2'},
        {'source': '1', 'target': '3'},
        {'source': '1', 'target': '4'},
        {'source': '2', 'target': '5'},
        {'source': '3', 'target': '5'},
        {'source': '4', 'target': '5'}
    ]
}
```

---

## Installation

```bash
cd backend
pip install -r requirements.txt
python main.py
```

**New Dependencies:**
- `croniter` - Cron expression parsing
- `watchdog` - File system monitoring
- `httpx` - Async HTTP client

---

## Testing

### Test Execution Context

```python
from execution import ExecutionContext

context = ExecutionContext('workflow-1', 'exec-1')

# Test variables
context.set_variable('count', 10)
assert context.get_variable('count') == 10

# Test resolution
assert context.resolve_value('{{count}}') == 10
assert context.resolve_value('${count * 2}') == 20
```

### Test Logic Execution

```python
from execution import LogicEngine, ExecutionContext

engine = LogicEngine()
context = ExecutionContext('w1', 'e1')
context.set_variable('age', 25)

config = {
    'condition': {
        'leftValue': '{{age}}',
        'operator': '>',
        'rightValue': 18
    }
}

result = await engine.execute_if_else(config, context)
assert result['branch'] == 'true'
```

---

## Next Steps

### Phase 1.2: Real Integrations
- [ ] Implement actual database operations
- [ ] Add email sending (SMTP, SendGrid)
- [ ] Cloud storage integrations (S3, GCS)
- [ ] Slack/Discord notifications
- [ ] File operations

### Phase 1.3: Advanced Features
- [ ] Workflow versioning
- [ ] Execution history persistence
- [ ] Real-time execution monitoring
- [ ] Breakpoints and debugging
- [ ] Performance profiling

---

## Contributing

See main repository CONTRIBUTING.md

## License

See main repository LICENSE
