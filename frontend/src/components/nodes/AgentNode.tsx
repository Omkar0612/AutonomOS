import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Bot, Settings } from 'lucide-react'

interface AgentNodeProps {
  data: {
    label: string
    agentType?: string
    model?: string
  }
}

function AgentNode({ data }: AgentNodeProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl shadow-xl border-2 border-blue-500 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-blue-300 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-5 h-5" />
        <div className="font-bold text-sm">AGENT</div>
        <Settings className="w-4 h-4 ml-auto opacity-70" />
      </div>
      <div className="text-sm font-medium mb-1">{data.label}</div>
      {data.agentType && (
        <div className="text-xs opacity-80 capitalize">{data.agentType}</div>
      )}
      {data.model && (
        <div className="text-xs opacity-60 mt-1 truncate">{data.model}</div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-blue-300 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(AgentNode)
