import { X, Sparkles, Users, Briefcase } from 'lucide-react'
import { Node, Edge } from 'reactflow'

interface TemplatesPanelProps {
  onClose: () => void
  onLoadTemplate: (template: { nodes: Node[]; edges: Edge[] }) => void
}

const templates = [
  {
    id: 'ai-research',
    name: 'AI Market Research',
    description: 'Multi-agent system for comprehensive AI market analysis',
    icon: Sparkles,
    nodes: [
      {
        id: 'researcher',
        type: 'agent',
        position: { x: 100, y: 100 },
        data: {
          label: 'Market Researcher',
          agentType: 'single',
          model: 'llama-3.1-70b-versatile',
          task: 'Research AI market size, trends, and growth projections for 2026',
        },
      },
      {
        id: 'analyst',
        type: 'agent',
        position: { x: 400, y: 100 },
        data: {
          label: 'Data Analyst',
          agentType: 'single',
          model: 'llama-3.1-70b-versatile',
          task: 'Analyze market data and identify key insights',
        },
      },
      {
        id: 'reporter',
        type: 'agent',
        position: { x: 700, y: 100 },
        data: {
          label: 'Report Writer',
          agentType: 'single',
          model: 'llama-3.1-70b-versatile',
          task: 'Create executive summary of findings',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'researcher', target: 'analyst' },
      { id: 'e2', source: 'analyst', target: 'reporter' },
    ],
  },
  {
    id: 'council',
    name: 'Council Decision System',
    description: 'Multiple agents collaborate and vote on decisions',
    icon: Users,
    nodes: [
      {
        id: 'council',
        type: 'agent',
        position: { x: 300, y: 150 },
        data: {
          label: 'AI Council',
          agentType: 'multi',
          pattern: 'council',
          model: 'llama-3.1-70b-versatile',
          task: 'Evaluate and decide on strategic AI initiatives',
        },
      },
    ],
    edges: [],
  },
  {
    id: 'business-automation',
    name: 'Business Process Automation',
    description: 'Automate business workflows with AI agents',
    icon: Briefcase,
    nodes: [
      {
        id: 'trigger',
        type: 'trigger',
        position: { x: 100, y: 150 },
        data: { label: 'Email Received' },
      },
      {
        id: 'classifier',
        type: 'agent',
        position: { x: 350, y: 150 },
        data: {
          label: 'Email Classifier',
          agentType: 'single',
          task: 'Classify email priority and category',
        },
      },
      {
        id: 'responder',
        type: 'agent',
        position: { x: 600, y: 150 },
        data: {
          label: 'Auto Responder',
          agentType: 'single',
          task: 'Generate appropriate response',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger', target: 'classifier' },
      { id: 'e2', source: 'classifier', target: 'responder' },
    ],
  },
]

export default function TemplatesPanel({ onClose, onLoadTemplate }: TemplatesPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const Icon = template.icon
              return (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onLoadTemplate(template)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {template.nodes.length} nodes • {template.edges.length} connections
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
