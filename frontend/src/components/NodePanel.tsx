import { X, Save, Sparkles } from 'lucide-react'
import { Node } from 'reactflow'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApiKeys, AI_PROVIDERS } from '../contexts/ApiKeyContext'

interface NodePanelProps {
  node: Node
  onClose: () => void
  onUpdate: (node: Node) => void
}

export default function NodePanel({ node, onClose, onUpdate }: NodePanelProps) {
  const { getActiveKey } = useApiKeys()
  const activeKey = getActiveKey()
  
  const [label, setLabel] = useState(node.data.label || '')
  const [agentType, setAgentType] = useState(node.data.agentType || 'single')
  const [pattern, setPattern] = useState(node.data.pattern || 'hierarchical')
  const [model, setModel] = useState(node.data.model || activeKey?.model || 'openai/gpt-4-turbo-preview')
  const [task, setTask] = useState(node.data.task || '')

  // Update model when active key changes
  useEffect(() => {
    if (activeKey && !node.data.model) {
      setModel(activeKey.model)
    }
  }, [activeKey, node.data.model])

  // Get available models based on active provider
  const getAvailableModels = () => {
    if (!activeKey) {
      return [{ value: 'openai/gpt-4-turbo-preview', label: 'GPT-4 Turbo (Configure API key in Settings)' }]
    }
    const provider = AI_PROVIDERS.find(p => p.id === activeKey.provider)
    return provider?.models || []
  }

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
    <AnimatePresence>
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-96 glass-strong border-l border-white/20 p-6 overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-5 h-5 text-primary-600" />
            Node Settings
          </motion.h2>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.div 
          className="space-y-5"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Label */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input-field"
              placeholder="Node name"
            />
          </motion.div>

          {node.type === 'agent' && (
            <>
              {/* Agent Type */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Agent Type
                </label>
                <select
                  value={agentType}
                  onChange={(e) => setAgentType(e.target.value)}
                  className="input-field"
                >
                  <option value="single">Single Agent</option>
                  <option value="multi">Multi-Agent System</option>
                </select>
              </motion.div>

              {/* Pattern (only for multi-agent) */}
              <AnimatePresence>
                {agentType === 'multi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Pattern
                    </label>
                    <select
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="input-field"
                    >
                      <option value="hierarchical">🏢 Hierarchical Team</option>
                      <option value="swarm">🐝 Swarm Intelligence</option>
                      <option value="council">👥 Council System</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Model */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  AI Model
                  {!activeKey && (
                    <span className="ml-2 text-xs text-amber-600">(Configure in Settings)</span>
                  )}
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input-field"
                  disabled={!activeKey}
                >
                  {getAvailableModels().map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {activeKey && (
                  <p className="text-xs text-slate-500 mt-1">
                    Using {activeKey.provider} API key
                  </p>
                )}
              </motion.div>

              {/* Task */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Task Description
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  rows={5}
                  className="input-field resize-none"
                  placeholder="What should this agent do?"
                />
              </motion.div>
            </>
          )}

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </motion.div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500/5 to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  )
}
