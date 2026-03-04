import { Zap, Bot, GitBranch, Workflow, Library } from 'lucide-react'

interface SidebarProps {
  onShowTemplates: () => void
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'bg-green-500' },
  { type: 'agent', label: 'AI Agent', icon: Bot, color: 'bg-blue-500' },
  { type: 'action', label: 'Action', icon: GitBranch, color: 'bg-purple-500' },
  { type: 'logic', label: 'Logic', icon: Workflow, color: 'bg-yellow-500' },
]

export default function Sidebar({ onShowTemplates }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Nodes</h2>
        <div className="space-y-2">
          {nodeTypes.map(({ type, label, icon: Icon, color }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates</h2>
        <button
          onClick={onShowTemplates}
          className="w-full flex items-center gap-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200"
        >
          <Library className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-primary-700">Browse Templates</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Start</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Drag nodes to canvas</li>
          <li>2. Connect them together</li>
          <li>3. Configure each node</li>
          <li>4. Click Execute!</li>
        </ol>
      </div>
    </aside>
  )
}
