import { Zap, Bot, GitBranch, Workflow, Library, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface SidebarProps {
  onShowTemplates: () => void
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, gradient: 'from-green-400 to-emerald-600' },
  { type: 'agent', label: 'AI Agent', icon: Bot, gradient: 'from-blue-400 to-indigo-600' },
  { type: 'action', label: 'Action', icon: GitBranch, gradient: 'from-purple-400 to-pink-600' },
  { type: 'logic', label: 'Logic', icon: Workflow, gradient: 'from-yellow-400 to-orange-500' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export default function Sidebar({ onShowTemplates }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-80 glass-strong border-r border-white/20 p-6 overflow-y-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Nodes Section */}
        <div>
          <motion.h2 
            className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"
            variants={item}
          >
            <Sparkles className="w-5 h-5 text-primary-600" />
            Nodes
          </motion.h2>
          <motion.div 
            className="space-y-3"
            variants={container}
          >
            {nodeTypes.map(({ type, label, icon: Icon, gradient }) => (
              <motion.div
                key={type}
                variants={item}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                className="node-card group"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Drag to canvas</div>
                  </div>
                </div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Templates Section */}
        <motion.div variants={item}>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Library className="w-5 h-5 text-secondary-600" />
            Templates
          </h2>
          <motion.button
            onClick={onShowTemplates}
            className="w-full node-card bg-gradient-to-br from-primary-500 to-secondary-500 text-white"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Library className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Browse Templates</div>
                <div className="text-sm opacity-90 mt-1">Pre-built workflows</div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div 
          variants={item}
          className="glass rounded-2xl p-5 border-2 border-primary-200 dark:border-primary-800"
        >
          <h3 className="font-bold text-primary-700 dark:text-primary-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Start
          </h3>
          <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {[
              'Drag nodes to canvas',
              'Connect them together',
              'Configure each node',
              'Click Execute!'
            ].map((step, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-xs">
                  {index + 1}
                </span>
                {step}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </aside>
  )
}
