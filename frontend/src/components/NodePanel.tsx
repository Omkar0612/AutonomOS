import { X, Save, Sparkles } from 'lucide-react'
import { Node } from 'reactflow'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input-field"
                >
                  <option value="llama-3.1-70b-versatile">🦙 Llama 3.1 70B (Groq)</option>
                  <option value="mixtral-8x7b-32768">⚡ Mixtral 8x7B (Groq)</option>
                  <option value="gpt-4-turbo-preview">🤖 GPT-4 Turbo</option>
                  <option value="claude-3-opus-20240229">🔮 Claude 3 Opus</option>
                  <option value="gemini-1.5-pro">✨ Gemini 1.5 Pro</option>
                </select>
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
