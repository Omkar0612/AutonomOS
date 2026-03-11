import { X, Sparkles, Users, Briefcase, Search, TrendingUp } from 'lucide-react'
import { Node, Edge } from 'reactflow'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface TemplatesPanelProps {
  onClose: () => void
  onLoadTemplate: (template: { nodes: Node[]; edges: Edge[] }) => void
}

const templates = [
  {
    id: 'ai-research',
    name: 'AI Market Research',
    description: 'Multi-agent system for comprehensive AI market analysis with data collection, analysis, and reporting',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Research',
    nodes: [
      {
        id: 'researcher',
        type: 'agent',
        position: { x: 100, y: 150 },
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
        position: { x: 450, y: 150 },
        data: {
          label: 'Data Analyst',
          agentType: 'single',
          model: 'llama-3.1-70b-versatile',
          task: 'Analyze market data and identify key insights and opportunities',
        },
      },
      {
        id: 'reporter',
        type: 'agent',
        position: { x: 800, y: 150 },
        data: {
          label: 'Report Writer',
          agentType: 'single',
          model: 'llama-3.1-70b-versatile',
          task: 'Create executive summary and actionable recommendations',
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
    description: 'Multiple AI agents collaborate and vote on complex decisions with consensus building',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
    category: 'Decision',
    nodes: [
      {
        id: 'council',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: {
          label: 'AI Council',
          agentType: 'multi',
          pattern: 'council',
          model: 'llama-3.1-70b-versatile',
          task: 'Evaluate strategic initiatives and make collaborative decisions',
        },
      },
    ],
    edges: [],
  },
  {
    id: 'business-automation',
    name: 'Business Process Automation',
    description: 'Automate business workflows with intelligent email processing and response generation',
    icon: Briefcase,
    gradient: 'from-orange-500 to-red-500',
    category: 'Automation',
    nodes: [
      {
        id: 'trigger',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: { label: 'Email Received', event: 'email' },
      },
      {
        id: 'classifier',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: {
          label: 'Email Classifier',
          agentType: 'single',
          task: 'Classify email priority, sentiment, and required action',
        },
      },
      {
        id: 'responder',
        type: 'agent',
        position: { x: 700, y: 200 },
        data: {
          label: 'Auto Responder',
          agentType: 'single',
          task: 'Generate contextually appropriate response',
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-3xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-8 border-b border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Sparkles className="w-8 h-8 text-primary-600" />
                  Workflow Templates
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-600 dark:text-slate-400 mt-2"
                >
                  Pre-built workflows to get you started quickly
                </motion.p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="relative mt-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass border-2 border-transparent focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      selectedCategory === category
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="p-8 overflow-y-auto max-h-[calc(85vh-280px)]">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              {filteredTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <motion.div
                    key={template.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="group relative glass rounded-2xl p-6 cursor-pointer overflow-hidden"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onLoadTemplate(template)}
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${template.gradient} mb-4`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                        {template.name}
                      </h3>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            {template.nodes.length} nodes
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-secondary-500" />
                            {template.edges.length} connections
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                          {template.category}
                        </span>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {filteredTemplates.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">No templates found</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filter</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
