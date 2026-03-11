import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Zap, Clock, Webhook, Calendar, Filter, Database } from 'lucide-react'

interface TriggerNodeProps {
  data: {
    label: string
    triggerType?: 'manual' | 'schedule' | 'webhook' | 'event' | 'database'
    schedule?: {
      type: 'cron' | 'interval' | 'datetime'
      value: string
    }
    condition?: {
      enabled: boolean
      expression: string
    }
    webhookConfig?: {
      url: string
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      headers?: Record<string, string>
    }
    eventConfig?: {
      source: string
      eventType: string
      filters?: Record<string, any>
    }
    databaseConfig?: {
      query: string
      pollInterval?: number
      changeDetection?: boolean
    }
    metadata?: {
      lastTriggered?: string
      triggerCount?: number
      enabled?: boolean
    }
  }
}

function TriggerNode({ data }: TriggerNodeProps) {
  const triggerType = data.triggerType || 'manual'
  const isEnabled = data.metadata?.enabled !== false
  
  // Icon mapping for different trigger types
  const getTriggerIcon = () => {
    switch (triggerType) {
      case 'schedule':
        return <Clock className="w-5 h-5" />
      case 'webhook':
        return <Webhook className="w-5 h-5" />
      case 'event':
        return <Zap className="w-5 h-5" />
      case 'database':
        return <Database className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  // Get schedule display text
  const getScheduleText = () => {
    if (!data.schedule) return null
    
    switch (data.schedule.type) {
      case 'cron':
        return `Cron: ${data.schedule.value}`
      case 'interval':
        return `Every ${data.schedule.value}`
      case 'datetime':
        return `At: ${new Date(data.schedule.value).toLocaleString()}`
      default:
        return data.schedule.value
    }
  }

  // Get webhook display text
  const getWebhookText = () => {
    if (!data.webhookConfig) return null
    return `${data.webhookConfig.method} ${data.webhookConfig.url.substring(0, 30)}...`
  }

  // Get event display text
  const getEventText = () => {
    if (!data.eventConfig) return null
    return `${data.eventConfig.source}: ${data.eventConfig.eventType}`
  }

  // Get database display text
  const getDatabaseText = () => {
    if (!data.databaseConfig) return null
    const queryPreview = data.databaseConfig.query.substring(0, 30)
    return `Query: ${queryPreview}...`
  }

  // Get subtitle based on trigger type
  const getSubtitle = () => {
    switch (triggerType) {
      case 'schedule':
        return getScheduleText()
      case 'webhook':
        return getWebhookText()
      case 'event':
        return getEventText()
      case 'database':
        return getDatabaseText()
      default:
        return 'Click execute to run'
    }
  }

  return (
    <div 
      className={`
        px-6 py-4 rounded-2xl shadow-xl border-2 min-w-[220px] transition-all
        ${isEnabled 
          ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-green-500' 
          : 'bg-gradient-to-br from-slate-400 to-slate-600 border-slate-500 opacity-60'
        }
        text-white
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {getTriggerIcon()}
          <div className="font-bold text-xs uppercase tracking-wider">TRIGGER</div>
        </div>
        {!isEnabled && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">DISABLED</span>
        )}
      </div>

      {/* Main Label */}
      <div className="text-sm font-bold mb-1">{data.label}</div>

      {/* Type Badge */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
          {triggerType}
        </span>
        {data.condition?.enabled && (
          <span className="text-xs bg-yellow-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Conditional
          </span>
        )}
      </div>

      {/* Subtitle (schedule/webhook/event info) */}
      {getSubtitle() && (
        <div className="text-xs opacity-90 mb-2 font-mono truncate">
          {getSubtitle()}
        </div>
      )}

      {/* Metadata */}
      {data.metadata && (
        <div className="text-xs opacity-75 space-y-0.5 mt-2 pt-2 border-t border-white/20">
          {data.metadata.triggerCount !== undefined && (
            <div>Runs: {data.metadata.triggerCount}</div>
          )}
          {data.metadata.lastTriggered && (
            <div className="truncate">
              Last: {new Date(data.metadata.lastTriggered).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-green-300 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(TriggerNode)
