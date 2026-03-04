import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Zap } from 'lucide-react'

interface ActionNodeProps {
  data: {
    label: string
  }
}

function ActionNode({ data }: ActionNodeProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-purple-400 to-pink-600 text-white rounded-2xl shadow-xl border-2 border-purple-500 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-purple-300 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5" />
        <div className="font-bold text-sm">ACTION</div>
      </div>
      <div className="text-sm font-medium">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-purple-300 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(ActionNode)
