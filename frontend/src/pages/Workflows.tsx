import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreVertical, Play, Pause, Trash2,
  Copy, Download, Eye, Grid3x3, List, Calendar, TrendingUp,
  Workflow as WorkflowIcon, Clock, CheckCircle2
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'archived'
  nodes: number
  lastRun: string | null
  executions: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'updated' | 'created' | 'executions'
type FilterStatus = 'all' | 'active' | 'draft' | 'archived'

export default function Workflows() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('updated')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([])

  // Mock data - replace with actual API call
  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Lead Generation Pipeline',
      description: 'Automated lead qualification and enrichment workflow',
      status: 'active',
      nodes: 5,
      lastRun: '2 minutes ago',
      executions: 234,
      createdAt: '2026-01-15',
      updatedAt: '2026-03-05',
      tags: ['sales', 'automation']
    },
    {
      id: '2',
      name: 'Content Creation Assistant',
      description: 'Multi-agent system for blog post generation',
      status: 'active',
      nodes: 8,
      lastRun: '1 hour ago',
      executions: 89,
      createdAt: '2026-02-01',
      updatedAt: '2026-03-04',
      tags: ['content', 'writing']
    },
    {
      id: '3',
      name: 'Customer Support Bot',
      description: 'AI-powered customer service automation',
      status: 'draft',
      nodes: 3,
      lastRun: null,
      executions: 0,
      createdAt: '2026-03-01',
      updatedAt: '2026-03-03',
      tags: ['support']
    },
    {
      id: '4',
      name: 'Data Analysis Pipeline',
      description: 'Automated data processing and insights generation',
      status: 'active',
      nodes: 6,
      lastRun: '5 hours ago',
      executions: 156,
      createdAt: '2026-01-20',
      updatedAt: '2026-03-02',
      tags: ['analytics', 'data']
    },
  ]

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    let result = workflows

    // Search filter
    if (searchQuery) {
      result = result.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(w => w.status === filterStatus)
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'executions':
          return b.executions - a.executions
        default:
          return 0
      }
    })

    return result
  }, [workflows, searchQuery, filterStatus, sortBy])

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflows(prev =>
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([])
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.id))
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-black mb-2">Workflows</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/workflows/new" className="btn-primary glow">
            <Plus className="w-5 h-5" />
            New Workflow
          </Link>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="input w-auto min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="input w-auto min-w-[140px]"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name</option>
                <option value="executions">Most Run</option>
              </select>

              {/* View Toggle */}
              <div className="glass rounded-xl p-1 flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedWorkflows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <span className="text-sm font-medium">
                  {selectedWorkflows.length} selected
                </span>
                <div className="flex gap-2">
                  <button className="btn-ghost text-sm">
                    <Play className="w-4 h-4" />
                    Run
                  </button>
                  <button className="btn-ghost text-sm">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button className="btn-ghost text-sm">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="btn-ghost text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => setSelectedWorkflows([])}
                  className="ml-auto btn-ghost text-sm"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Workflows Grid/List */}
        {filteredWorkflows.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                viewMode={viewMode}
                isSelected={selectedWorkflows.includes(workflow.id)}
                onSelect={() => handleSelectWorkflow(workflow.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <WorkflowIcon className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              {searchQuery ? 'No workflows found' : 'No workflows yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first workflow to start automating tasks with AI agents'}
            </p>
            {!searchQuery && (
              <Link to="/workflows/new" className="btn-primary inline-flex">
                <Plus className="w-5 h-5" />
                Create Your First Workflow
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function WorkflowCard({
  workflow,
  viewMode,
  isSelected,
  onSelect
}: {
  workflow: Workflow
  viewMode: ViewMode
  isSelected: boolean
  onSelect: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          show: { opacity: 1, x: 0 }
        }}
        whileHover={{ scale: 1.01, x: 4 }}
        className={`card group cursor-pointer ${
          isSelected ? 'ring-2 ring-purple-500' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {workflow.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {workflow.description}
                </p>
              </div>
              <span className={`badge ml-4 ${
                workflow.status === 'active' ? 'badge-success' :
                workflow.status === 'draft' ? 'badge-warning' :
                'badge-info'
              }`}>
                {workflow.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <WorkflowIcon className="w-4 h-4" />
                {workflow.nodes} nodes
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {workflow.executions} runs
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {workflow.lastRun || 'Never run'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/workflows/${workflow.id}`}
              className="btn-secondary py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4" />
              Open
            </Link>
            <button className="btn-ghost p-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`card gradient-card group cursor-pointer ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
          onClick={(e) => e.stopPropagation()}
        />
        <button className="btn-ghost p-1.5 -m-1.5">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <Link to={`/workflows/${workflow.id}`} className="block">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl inline-block mb-4 glow">
          <WorkflowIcon className="w-8 h-8 text-white" />
        </div>

        <h3 className="font-bold text-xl mb-2 group-hover:gradient-text transition-all line-clamp-1">
          {workflow.name}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {workflow.description}
        </p>

        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <WorkflowIcon className="w-4 h-4" />
            {workflow.nodes}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {workflow.executions}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`badge ${
            workflow.status === 'active' ? 'badge-success' :
            workflow.status === 'draft' ? 'badge-warning' :
            'badge-info'
          }`}>
            {workflow.status}
          </span>
          <span className="text-xs text-slate-500">
            {workflow.lastRun || 'Never run'}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
