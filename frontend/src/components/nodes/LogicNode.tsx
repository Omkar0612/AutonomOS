import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { 
  GitBranch,
  GitMerge,
  Repeat,
  RefreshCw,
  Split,
  Merge,
  PlayCircle,
  CheckCircle,
  XCircle,
  Shuffle,
  Timer,
  Zap,
  ChevronRight
} from 'lucide-react'

interface LogicNodeProps {
  data: {
    label: string
    logicType?: 
      | 'if_else'           // Conditional branching
      | 'switch'            // Multi-way branching
      | 'loop'              // For/While loop
      | 'foreach'           // Iterate over items
      | 'parallel'          // Execute branches in parallel
      | 'merge'             // Wait for multiple inputs
      | 'delay'             // Time delay
      | 'try_catch'         // Error handling
      | 'filter'            // Filter items
      | 'map'               // Transform items
      | 'debounce'          // Rate limiting
      | 'custom'            // Custom logic
    
    // Conditional config (if/else)
    condition?: {
      expression: string
      operator?: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'regex'
      leftValue?: string
      rightValue?: string
    }
    
    // Switch config
    switchConfig?: {
      variable: string
      cases: Array<{
        value: any
        label: string
      }>
      defaultCase?: boolean
    }
    
    // Loop config
    loopConfig?: {
      type: 'for' | 'while' | 'until'
      iterations?: number
      condition?: string
      maxIterations?: number
      breakOn?: string
    }
    
    // ForEach config
    forEachConfig?: {
      array: string
      itemName: string
      batchSize?: number
      parallel?: boolean
    }
    
    // Parallel config
    parallelConfig?: {
      branches: number
      waitForAll?: boolean
      timeout?: number
      failFast?: boolean
    }
    
    // Merge config
    mergeConfig?: {
      waitFor: 'all' | 'any' | 'first'
      timeout?: number
      strategy: 'combine' | 'latest' | 'first'
    }
    
    // Delay config
    delayConfig?: {
      duration: number
      unit: 'ms' | 's' | 'm' | 'h'
      dynamic?: boolean
      expression?: string
    }
    
    // Try/Catch config
    tryCatchConfig?: {
      retries?: number
      fallback?: 'default' | 'skip' | 'alternative'
      logErrors?: boolean
    }
    
    // Filter config
    filterConfig?: {
      expression: string
      mode: 'include' | 'exclude'
    }
    
    // Map config
    mapConfig?: {
      transformation: string
      outputKey?: string
    }
    
    // Debounce config
    debounceConfig?: {
      wait: number
      maxWait?: number
      leading?: boolean
      trailing?: boolean
    }
    
    metadata?: {
      status?: 'idle' | 'evaluating' | 'true' | 'false' | 'error'
      lastEvaluation?: string
      evaluationCount?: number
      branchTaken?: string
      loopIterations?: number
    }
  }
}

function LogicNode({ data }: LogicNodeProps) {
  const logicType = data.logicType || 'if_else'
  const status = data.metadata?.status || 'idle'
  
  // Get icon based on logic type
  const getLogicIcon = () => {
    switch (logicType) {
      case 'if_else':
        return <GitBranch className="w-5 h-5" />
      case 'switch':
        return <Shuffle className="w-5 h-5" />
      case 'loop':
      case 'foreach':
        return <Repeat className="w-5 h-5" />
      case 'parallel':
        return <Split className="w-5 h-5" />
      case 'merge':
        return <GitMerge className="w-5 h-5" />
      case 'delay':
        return <Timer className="w-5 h-5" />
      case 'try_catch':
        return <Zap className="w-5 h-5" />
      case 'filter':
      case 'map':
        return <RefreshCw className="w-5 h-5" />
      case 'debounce':
        return <Timer className="w-5 h-5" />
      default:
        return <GitBranch className="w-5 h-5" />
    }
  }
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'evaluating':
        return 'from-yellow-400 to-orange-500 animate-pulse'
      case 'true':
        return 'from-green-400 to-emerald-600'
      case 'false':
        return 'from-red-400 to-rose-600'
      case 'error':
        return 'from-red-500 to-red-700'
      default:
        return 'from-yellow-400 to-orange-500'
    }
  }
  
  // Get logic type display name
  const getLogicTypeName = () => {
    return logicType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  // Get configuration summary
  const getConfigSummary = () => {
    switch (logicType) {
      case 'if_else':
        if (data.condition?.expression) {
          return data.condition.expression.substring(0, 30) + (data.condition.expression.length > 30 ? '...' : '')
        }
        return data.condition ? `${data.condition.leftValue} ${data.condition.operator} ${data.condition.rightValue}` : null
      
      case 'switch':
        return data.switchConfig ? `${data.switchConfig.cases.length} cases` : null
      
      case 'loop':
        if (data.loopConfig?.type === 'for') {
          return `${data.loopConfig.iterations || 0} iterations`
        }
        return data.loopConfig ? `${data.loopConfig.type} loop` : null
      
      case 'foreach':
        return data.forEachConfig ? `Each ${data.forEachConfig.itemName}` : null
      
      case 'parallel':
        return data.parallelConfig ? `${data.parallelConfig.branches} branches` : null
      
      case 'merge':
        return data.mergeConfig ? `Wait for ${data.mergeConfig.waitFor}` : null
      
      case 'delay':
        return data.delayConfig ? `${data.delayConfig.duration}${data.delayConfig.unit}` : null
      
      case 'try_catch':
        return data.tryCatchConfig?.retries ? `${data.tryCatchConfig.retries} retries` : 'Error handling'
      
      case 'filter':
        return data.filterConfig ? data.filterConfig.mode : null
      
      case 'map':
        return 'Transform items'
      
      case 'debounce':
        return data.debounceConfig ? `${data.debounceConfig.wait}ms` : null
      
      default:
        return null
    }
  }
  
  // Determine if node has multiple outputs
  const hasMultipleOutputs = ['if_else', 'switch', 'parallel', 'try_catch'].includes(logicType)
  
  return (
    <div className={`
      px-6 py-4 rounded-2xl shadow-xl border-2 border-yellow-500 min-w-[220px] transition-all
      bg-gradient-to-br ${getStatusColor()}
      text-white relative overflow-hidden
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-yellow-300 !border-2 !border-white"
      />
      
      {/* Status Indicator */}
      {status === 'evaluating' && (
        <div className="absolute top-2 right-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
        </div>
      )}
      {status === 'true' && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4" />
        </div>
      )}
      {status === 'false' && (
        <div className="absolute top-2 right-2">
          <XCircle className="w-4 h-4" />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {getLogicIcon()}
        <div className="font-bold text-xs uppercase tracking-wider">LOGIC</div>
      </div>
      
      {/* Node Name */}
      <div className="text-sm font-bold mb-2">{data.label}</div>
      
      {/* Logic Type Badge */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {getLogicTypeName()}
        </span>
        
        {logicType === 'foreach' && data.forEachConfig?.parallel && (
          <span className="text-xs bg-blue-400/30 px-2 py-0.5 rounded-full">
            Parallel
          </span>
        )}
        
        {logicType === 'loop' && data.loopConfig?.breakOn && (
          <span className="text-xs bg-red-400/30 px-2 py-0.5 rounded-full">
            Break
          </span>
        )}
        
        {logicType === 'parallel' && data.parallelConfig?.waitForAll && (
          <span className="text-xs bg-green-400/30 px-2 py-0.5 rounded-full">
            Wait All
          </span>
        )}
      </div>
      
      {/* Configuration Summary */}
      {getConfigSummary() && (
        <div className="text-xs opacity-80 mb-2 font-mono truncate">
          {getConfigSummary()}
        </div>
      )}
      
      {/* Branch Taken (for if/else, switch) */}
      {data.metadata?.branchTaken && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <ChevronRight className="w-3 h-3" />
          <span>Branch: {data.metadata.branchTaken}</span>
        </div>
      )}
      
      {/* Loop Iterations */}
      {data.metadata?.loopIterations !== undefined && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <Repeat className="w-3 h-3" />
          <span>Iteration: {data.metadata.loopIterations}</span>
        </div>
      )}
      
      {/* Metadata */}
      {data.metadata && (
        <div className="text-xs opacity-60 space-y-0.5 pt-2 border-t border-white/20">
          {data.metadata.evaluationCount !== undefined && (
            <div className="flex justify-between">
              <span>Evaluations:</span>
              <span>{data.metadata.evaluationCount}</span>
            </div>
          )}
          {data.metadata.lastEvaluation && (
            <div className="truncate">
              Last: {new Date(data.metadata.lastEvaluation).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
      
      {/* Output Handles */}
      {hasMultipleOutputs ? (
        <>
          {/* True/Success/Branch outputs */}
          {logicType === 'if_else' && (
            <>
              <Handle
                type="source"
                position={Position.Right}
                id="true"
                style={{ top: '40%' }}
                className="w-4 h-4 !bg-green-400 !border-2 !border-white"
              />
              <Handle
                type="source"
                position={Position.Right}
                id="false"
                style={{ top: '60%' }}
                className="w-4 h-4 !bg-red-400 !border-2 !border-white"
              />
            </>
          )}
          
          {logicType === 'try_catch' && (
            <>
              <Handle
                type="source"
                position={Position.Right}
                id="success"
                style={{ top: '40%' }}
                className="w-4 h-4 !bg-green-400 !border-2 !border-white"
              />
              <Handle
                type="source"
                position={Position.Right}
                id="error"
                style={{ top: '60%' }}
                className="w-4 h-4 !bg-red-400 !border-2 !border-white"
              />
            </>
          )}
          
          {logicType === 'switch' && data.switchConfig && (
            <>
              {data.switchConfig.cases.slice(0, 4).map((_, index) => (
                <Handle
                  key={index}
                  type="source"
                  position={Position.Right}
                  id={`case_${index}`}
                  style={{ top: `${25 + (index * 20)}%` }}
                  className="w-4 h-4 !bg-yellow-300 !border-2 !border-white"
                />
              ))}
              {data.switchConfig.defaultCase && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id="default"
                  style={{ top: '85%' }}
                  className="w-4 h-4 !bg-gray-400 !border-2 !border-white"
                />
              )}
            </>
          )}
          
          {logicType === 'parallel' && data.parallelConfig && (
            <>
              {Array.from({ length: Math.min(data.parallelConfig.branches, 4) }).map((_, index) => (
                <Handle
                  key={index}
                  type="source"
                  position={Position.Right}
                  id={`branch_${index}`}
                  style={{ top: `${20 + (index * 20)}%` }}
                  className="w-4 h-4 !bg-blue-400 !border-2 !border-white"
                />
              ))}
            </>
          )}
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="w-4 h-4 !bg-yellow-300 !border-2 !border-white"
        />
      )}
      
      {/* Glow effect for active logic */}
      {status === 'evaluating' && (
        <div className="absolute inset-0 bg-yellow-400/20 blur-xl -z-10 animate-pulse" />
      )}
    </div>
  )
}

export default memo(LogicNode)
