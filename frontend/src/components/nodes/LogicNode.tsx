import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'

interface LogicNodeProps {
  data: {
    label: string
  }
}

function LogicNode({ data }: LogicNodeProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl shadow-xl border-2 border-yellow-500 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-yellow-300 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-5 h-5" />
        <div className="font-bold text-sm">LOGIC</div>
      </div>
      <div className="text-sm font-medium">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-yellow-300 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(LogicNode)
