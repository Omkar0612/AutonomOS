import { X } from 'lucide-react'
import { Node } from 'reactflow'
import { useState } from 'react'

interface NodePanelProps {
  node: Node
  onClose: () => void
  onUpdate: (node: Node) => void
}

export default function NodePanel({ node, onClose, onUpdate }: NodePanelProps) {
  const [label, setLabel] = useState(node.data.label || '')
  const [agentType, setAgentType] = useState(node.data.agentType || 'single')
  const [pattern, setPattern] = useState(node.data.pattern || 'hierarchical')
  const [model, setModel] = useState(node.data.model || 'llama-3.1-70b-versatile')
  const [task, setTask] = useState(node.data.task || '')

  const handleSave = () => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        label,
        agentType,
        pattern,
        model,
        task,
      },
    }
    onUpdate(updatedNode)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Node Settings</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Node name"
          />
        </div>

        {node.type === 'agent' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Type
              </label>
              <select
                value={agentType}
                onChange={(e) => setAgentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="single">Single Agent</option>
                <option value="multi">Multi-Agent System</option>
              </select>
            </div>

            {agentType === 'multi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern
                </label>
                <select
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="hierarchical">Hierarchical Team</option>
                  <option value="swarm">Swarm Intelligence</option>
                  <option value="council">Council System</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Groq)</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="What should this agent do?"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
