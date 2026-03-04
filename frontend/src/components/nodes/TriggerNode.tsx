import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Zap } from 'lucide-react'

interface TriggerNodeProps {
  data: {
    label: string
  }
}

function TriggerNode({ data }: TriggerNodeProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl shadow-xl border-2 border-green-500 min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5" />
        <div className="font-bold text-sm">TRIGGER</div>
      </div>
      <div className="text-sm font-medium">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-green-300 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(TriggerNode)
