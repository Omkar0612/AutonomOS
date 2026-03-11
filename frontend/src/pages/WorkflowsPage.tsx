import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Grid, List, Filter } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import WorkflowCard from '../components/WorkflowCard'
import { useWorkflow } from '../contexts/WorkflowContext'

export default function WorkflowsPage() {
  const { workflows } = useWorkflow()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all')

  const filtered = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || w.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workflows</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your AI workflows</p>
          </div>
          <Link to="/workflows/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Workflow
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workflows..."
              className="input-field pl-12 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <div className="flex glass rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workflows Grid/List */}
        {filtered.length > 0 ? (
          <motion.div
            className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {filtered.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} viewMode={viewMode} />
            ))}
          </motion.div>
        ) : (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search or filters</p>
            <Link to="/workflows/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Workflow
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
