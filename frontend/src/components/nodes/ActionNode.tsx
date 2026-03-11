import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { 
  Zap, 
  Send, 
  Database, 
  FileText, 
  Mail, 
  MessageSquare,
  Cloud,
  Code,
  Webhook,
  FileUp,
  FileDown,
  Globe,
  Server,
  Bell,
  Calendar,
  Repeat,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ActionNodeProps {
  data: {
    label: string
    actionType?: 
      | 'api_call' 
      | 'database' 
      | 'file_operation'
      | 'notification'
      | 'email'
      | 'webhook'
      | 'cloud_storage'
      | 'data_transform'
      | 'integration'
      | 'custom'
    
    // API Call configuration
    apiConfig?: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      url: string
      headers?: Record<string, string>
      body?: any
      auth?: {
        type: 'bearer' | 'basic' | 'api_key' | 'oauth'
        credentials?: string
      }
      retry?: {
        enabled: boolean
        maxAttempts: number
        backoff: 'linear' | 'exponential'
      }
    }
    
    // Database operations
    databaseConfig?: {
      operation: 'query' | 'insert' | 'update' | 'delete'
      connection: string
      query?: string
      table?: string
      data?: any
      transaction?: boolean
    }
    
    // File operations
    fileConfig?: {
      operation: 'read' | 'write' | 'append' | 'delete' | 'upload' | 'download'
      path: string
      format?: 'json' | 'csv' | 'xml' | 'txt' | 'pdf'
      encoding?: string
      destination?: string
    }
    
    // Notification
    notificationConfig?: {
      service: 'slack' | 'discord' | 'teams' | 'telegram' | 'push'
      channel?: string
      message: string
      priority?: 'low' | 'normal' | 'high' | 'urgent'
      mentions?: string[]
    }
    
    // Email
    emailConfig?: {
      to: string[]
      cc?: string[]
      subject: string
      body: string
      html?: boolean
      attachments?: string[]
    }
    
    // Webhook
    webhookConfig?: {
      url: string
      method: 'GET' | 'POST'
      payload: any
      headers?: Record<string, string>
    }
    
    // Cloud storage
    cloudConfig?: {
      provider: 's3' | 'gcs' | 'azure' | 'dropbox'
      operation: 'upload' | 'download' | 'delete' | 'list'
      bucket?: string
      key?: string
      localPath?: string
    }
    
    // Data transformation
    transformConfig?: {
      type: 'map' | 'filter' | 'reduce' | 'aggregate' | 'join'
      script?: string
      inputFormat?: string
      outputFormat?: string
    }
    
    // Integration
    integrationConfig?: {
      service: 'github' | 'jira' | 'salesforce' | 'stripe' | 'twilio' | 'sendgrid'
      action: string
      params?: Record<string, any>
    }
    
    // Error handling
    errorHandling?: {
      onError: 'fail' | 'continue' | 'retry' | 'fallback'
      fallbackValue?: any
      logErrors?: boolean
    }
    
    // Execution settings
    execution?: {
      async?: boolean
      timeout?: number
      batch?: {
        enabled: boolean
        size: number
      }
    }
    
    metadata?: {
      status?: 'idle' | 'running' | 'success' | 'error'
      lastRun?: string
      executionCount?: number
      successRate?: number
      avgDuration?: string
    }
  }
}

function ActionNode({ data }: ActionNodeProps) {
  const actionType = data.actionType || 'custom'
  const status = data.metadata?.status || 'idle'
  
  // Get icon based on action type
  const getActionIcon = () => {
    switch (actionType) {
      case 'api_call':
        return <Globe className="w-5 h-5" />
      case 'database':
        return <Database className="w-5 h-5" />
      case 'file_operation':
        return <FileText className="w-5 h-5" />
      case 'notification':
        return <Bell className="w-5 h-5" />
      case 'email':
        return <Mail className="w-5 h-5" />
      case 'webhook':
        return <Webhook className="w-5 h-5" />
      case 'cloud_storage':
        return <Cloud className="w-5 h-5" />
      case 'data_transform':
        return <Code className="w-5 h-5" />
      case 'integration':
        return <Server className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'from-purple-400 to-pink-600 animate-pulse'
      case 'success':
        return 'from-green-400 to-emerald-600'
      case 'error':
        return 'from-red-400 to-rose-600'
      default:
        return 'from-purple-400 to-pink-600'
    }
  }
  
  // Get action type display name
  const getActionTypeName = () => {
    return actionType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  // Get configuration summary
  const getConfigSummary = () => {
    switch (actionType) {
      case 'api_call':
        return data.apiConfig ? `${data.apiConfig.method} ${data.apiConfig.url.substring(0, 30)}...` : null
      case 'database':
        return data.databaseConfig ? `${data.databaseConfig.operation} on ${data.databaseConfig.table || 'query'}` : null
      case 'file_operation':
        return data.fileConfig ? `${data.fileConfig.operation} ${data.fileConfig.format || ''}` : null
      case 'notification':
        return data.notificationConfig ? `${data.notificationConfig.service} - ${data.notificationConfig.priority || 'normal'}` : null
      case 'email':
        return data.emailConfig ? `To: ${data.emailConfig.to[0]}...` : null
      case 'webhook':
        return data.webhookConfig ? `${data.webhookConfig.method} webhook` : null
      case 'cloud_storage':
        return data.cloudConfig ? `${data.cloudConfig.provider} - ${data.cloudConfig.operation}` : null
      case 'data_transform':
        return data.transformConfig ? data.transformConfig.type : null
      case 'integration':
        return data.integrationConfig ? `${data.integrationConfig.service} - ${data.integrationConfig.action}` : null
      default:
        return null
    }
  }
  
  return (
    <div className={`
      px-6 py-4 rounded-2xl shadow-xl border-2 border-purple-500 min-w-[220px] transition-all
      bg-gradient-to-br ${getStatusColor()}
      text-white relative overflow-hidden
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-purple-300 !border-2 !border-white"
      />
      
      {/* Status Indicator */}
      {status === 'running' && (
        <div className="absolute top-2 right-2">
          <Repeat className="w-4 h-4 animate-spin" />
        </div>
      )}
      {status === 'success' && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {getActionIcon()}
        <div className="font-bold text-xs uppercase tracking-wider">ACTION</div>
      </div>
      
      {/* Action Name */}
      <div className="text-sm font-bold mb-2">{data.label}</div>
      
      {/* Action Type Badge */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {getActionTypeName()}
        </span>
        
        {data.execution?.async && (
          <span className="text-xs bg-blue-400/30 px-2 py-0.5 rounded-full">
            Async
          </span>
        )}
        
        {data.apiConfig?.retry?.enabled && (
          <span className="text-xs bg-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            Retry
          </span>
        )}
        
        {data.databaseConfig?.transaction && (
          <span className="text-xs bg-green-400/30 px-2 py-0.5 rounded-full">
            Transaction
          </span>
        )}
      </div>
      
      {/* Configuration Summary */}
      {getConfigSummary() && (
        <div className="text-xs opacity-80 mb-2 font-mono truncate">
          {getConfigSummary()}
        </div>
      )}
      
      {/* Error Handling */}
      {data.errorHandling && data.errorHandling.onError !== 'fail' && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <AlertCircle className="w-3 h-3" />
          <span>On error: {data.errorHandling.onError}</span>
        </div>
      )}
      
      {/* Batch Processing */}
      {data.execution?.batch?.enabled && (
        <div className="text-xs opacity-70 flex items-center gap-1 mb-2">
          <span>Batch: {data.execution.batch.size} items</span>
        </div>
      )}
      
      {/* Metadata */}
      {data.metadata && (
        <div className="text-xs opacity-60 space-y-0.5 pt-2 border-t border-white/20">
          {data.metadata.executionCount !== undefined && (
            <div className="flex justify-between">
              <span>Runs:</span>
              <span>{data.metadata.executionCount}</span>
            </div>
          )}
          {data.metadata.successRate !== undefined && (
            <div className="flex justify-between">
              <span>Success:</span>
              <span>{data.metadata.successRate.toFixed(1)}%</span>
            </div>
          )}
          {data.metadata.avgDuration && (
            <div className="flex justify-between">
              <span>Avg time:</span>
              <span>{data.metadata.avgDuration}</span>
            </div>
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
        className="w-4 h-4 !bg-purple-300 !border-2 !border-white"
      />
      
      {/* Glow effect for running actions */}
      {status === 'running' && (
        <div className="absolute inset-0 bg-purple-400/20 blur-xl -z-10 animate-pulse" />
      )}
    </div>
  )
}

export default memo(ActionNode)
