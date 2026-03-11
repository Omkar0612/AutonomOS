import { X, Save, Sparkles } from 'lucide-react'
import { Node } from 'reactflow'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TriggerConfigPanel from './TriggerConfigPanel'
import AgentConfigPanel from './AgentConfigPanel'
import ActionConfigPanel from './ActionConfigPanel'
import LogicConfigPanel from './LogicConfigPanel'

interface NodePanelProps {
  node: Node
  onClose: () => void
  onUpdate: (node: Node) => void
}

export default function NodePanel({ node, onClose, onUpdate }: NodePanelProps) {
  const [label, setLabel] = useState(node.data.label || '')

  const handleConfigUpdate = (config: any) => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        label,
        ...config,
      },
    }
    onUpdate(updatedNode)
  }

  const getNodeIcon = () => {
    switch (node.type) {
      case 'trigger':
        return '⚡'
      case 'agent':
        return '🤖'
      case 'action':
        return '⚙️'
      case 'logic':
        return '🔀'
      default:
        return '✨'
    }
  }

  const getNodeTitle = () => {
    switch (node.type) {
      case 'trigger':
        return 'Trigger Settings'
      case 'agent':
        return 'Agent Settings'
      case 'action':
        return 'Action Settings'
      case 'logic':
        return 'Logic Settings'
      default:
        return 'Node Settings'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-96 glass-strong border-l border-white/20 p-6 overflow-y-auto relative flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-2xl">{getNodeIcon()}</span>
            {getNodeTitle()}
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

        {/* Node Label (Common to all nodes) */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Node Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="input-field"
            placeholder="Enter a descriptive name"
          />
        </motion.div>

        {/* Type-specific Configuration Panel */}
        <motion.div 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {node.type === 'trigger' && (
            <TriggerConfigPanel
              onUpdate={handleConfigUpdate}
              initialConfig={node.data}
            />
          )}

          {node.type === 'agent' && (
            <AgentConfigPanel
              onUpdate={handleConfigUpdate}
              initialConfig={node.data}
            />
          )}

          {node.type === 'action' && (
            <ActionConfigPanel
              onUpdate={handleConfigUpdate}
              initialConfig={node.data}
            />
          )}

          {node.type === 'logic' && (
            <LogicConfigPanel
              onUpdate={handleConfigUpdate}
              initialConfig={node.data}
            />
          )}

          {!['trigger', 'agent', 'action', 'logic'].includes(node.type || '') && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unknown Node Type</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No configuration available for this node type
              </p>
            </div>
          )}
        </motion.div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-500/5 to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  )
}
