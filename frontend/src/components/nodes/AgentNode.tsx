import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { 
  Bot, 
  Brain, 
  Users, 
  Wrench, 
  Database, 
  Target,
  Zap,
  MessageSquare,
  Shield,
  Activity
} from 'lucide-react'

interface AgentNodeProps {
  data: {
    label: string
    agentType?: 'single' | 'multi' | 'swarm' | 'hierarchical' | 'sequential'
    pattern?: 'supervisor' | 'consensus' | 'debate' | 'collaborative'
    model?: string
    task?: string
    
    // Advanced features
    capabilities?: {
      reasoning?: boolean
      memory?: boolean
      tools?: boolean
      planning?: boolean
      reflection?: boolean
      vision?: boolean
      codeExecution?: boolean
    }
    
    memory?: {
      enabled: boolean
      type: 'short' | 'long' | 'episodic' | 'semantic'
      vectorStore?: string
    }
    
    tools?: Array<{
      name: string
      type: 'api' | 'function' | 'database' | 'web'
      enabled: boolean
    }>
    
    autonomy?: {
      level: 'low' | 'medium' | 'high' | 'full'
      requiresApproval: boolean
      maxIterations?: number
    }
    
    guardrails?: {
      enabled: boolean
      rules?: string[]
      outputValidation?: boolean
    }
    
    performance?: {
      temperature?: number
      maxTokens?: number
      streaming?: boolean
      caching?: boolean
    }
    
    metadata?: {
      status?: 'idle' | 'running' | 'completed' | 'error'
      lastRun?: string
      executionCount?: number
      avgDuration?: string
    }
  }
}

function AgentNode({ data }: AgentNodeProps) {
  const agentType = data.agentType || 'single'
  const status = data.metadata?.status || 'idle'
  const capabilities = data.capabilities || {}
  const hasTools = data.tools && data.tools.length > 0
  const hasMemory = data.memory?.enabled
  const autonomyLevel = data.autonomy?.level || 'medium'
  
  // Status color mapping
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'from-blue-400 to-indigo-600 animate-pulse'
      case 'completed': return 'from-green-400 to-emerald-600'
      case 'error': return 'from-red-400 to-rose-600'
      default: return 'from-blue-400 to-indigo-600'
    }
  }

  // Agent type icon
  const getAgentIcon = () => {
    switch (agentType) {
      case 'multi':
      case 'swarm':
      case 'hierarchical':
        return <Users className="w-5 h-5" />
      case 'sequential':
        return <Activity className="w-5 h-5" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  // Autonomy badge color
  const getAutonomyColor = () => {
    switch (autonomyLevel) {
      case 'low': return 'bg-slate-400/30'
      case 'medium': return 'bg-blue-400/30'
      case 'high': return 'bg-purple-400/30'
      case 'full': return 'bg-red-400/30'
      default: return 'bg-blue-400/30'
    }
  }

  return (
    <div className={`
      px-6 py-4 rounded-2xl shadow-xl border-2 border-blue-500 min-w-[240px] transition-all
      bg-gradient-to-br ${getStatusColor()}
      text-white relative overflow-hidden
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-blue-300 !border-2 !border-white"
      />

      {/* Status Indicator */}
      {status === 'running' && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {getAgentIcon()}
          <div className="font-bold text-xs uppercase tracking-wider">AGENT</div>
        </div>
        {data.guardrails?.enabled && (
          <Shield className="w-4 h-4 opacity-70" title="Guardrails enabled" />
        )}
      </div>

      {/* Agent Name */}
      <div className="text-sm font-bold mb-2">{data.label}</div>

      {/* Agent Type & Pattern */}
      <div className="flex flex-wrap gap-1 mb-2">
        {agentType !== 'single' && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
            {agentType}
          </span>
        )}
        {data.pattern && (
          <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full capitalize">
            {data.pattern}
          </span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getAutonomyColor()}`}>
          {autonomyLevel} autonomy
        </span>
      </div>

      {/* Capabilities Row */}
      {Object.keys(capabilities).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {capabilities.reasoning && (
            <div className="flex items-center gap-1 text-xs bg-purple-400/30 px-2 py-0.5 rounded-full" title="Advanced reasoning">
              <Brain className="w-3 h-3" />
              <span className="hidden sm:inline">Reason</span>
            </div>
          )}
          {capabilities.memory && (
            <div className="flex items-center gap-1 text-xs bg-indigo-400/30 px-2 py-0.5 rounded-full" title="Memory enabled">
              <Database className="w-3 h-3" />
              <span className="hidden sm:inline">Memory</span>
            </div>
          )}
          {capabilities.tools && (
            <div className="flex items-center gap-1 text-xs bg-amber-400/30 px-2 py-0.5 rounded-full" title="Tool usage">
              <Wrench className="w-3 h-3" />
              <span className="hidden sm:inline">Tools</span>
            </div>
          )}
          {capabilities.planning && (
            <div className="flex items-center gap-1 text-xs bg-green-400/30 px-2 py-0.5 rounded-full" title="Planning capability">
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">Plan</span>
            </div>
          )}
          {capabilities.vision && (
            <div className="flex items-center gap-1 text-xs bg-pink-400/30 px-2 py-0.5 rounded-full" title="Vision model">
              <span>👁️</span>
            </div>
          )}
          {capabilities.codeExecution && (
            <div className="flex items-center gap-1 text-xs bg-teal-400/30 px-2 py-0.5 rounded-full" title="Code execution">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Code</span>
            </div>
          )}
        </div>
      )}

      {/* Task Preview */}
      {data.task && (
        <div className="text-xs opacity-80 mb-2 line-clamp-2 italic">
          "{data.task.substring(0, 60)}{data.task.length > 60 ? '...' : ''}"
        </div>
      )}

      {/* Model Info */}
      {data.model && (
        <div className="text-xs opacity-60 truncate mb-2">
          🤖 {data.model.split('/').pop()}
        </div>
      )}

      {/* Tools Info */}
      {hasTools && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <Wrench className="w-3 h-3" />
          <span>{data.tools?.filter(t => t.enabled).length} tools enabled</span>
        </div>
      )}

      {/* Memory Info */}
      {hasMemory && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <Database className="w-3 h-3" />
          <span>{data.memory?.type || 'standard'} memory</span>
        </div>
      )}

      {/* Metadata */}
      {data.metadata && (
        <div className="text-xs opacity-60 space-y-0.5 pt-2 border-t border-white/20">
          {data.metadata.executionCount !== undefined && (
            <div>Runs: {data.metadata.executionCount}</div>
          )}
          {data.metadata.avgDuration && (
            <div>Avg: {data.metadata.avgDuration}</div>
          )}
          {data.metadata.lastRun && (
            <div className="truncate">
              Last: {new Date(data.metadata.lastRun).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-blue-300 !border-2 !border-white"
      />

      {/* Glow effect for active agents */}
      {status === 'running' && (
        <div className="absolute inset-0 bg-blue-400/20 blur-xl -z-10 animate-pulse" />
      )}
    </div>
  )
}

export default memo(AgentNode)
