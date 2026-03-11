import { motion } from 'framer-motion'
import { Zap, MoreVertical, Play, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkflow } from '../contexts/WorkflowContext'
import toast from 'react-hot-toast'

interface WorkflowCardProps {
  workflow: any
  viewMode: 'grid' | 'list'
}

export default function WorkflowCard({ workflow, viewMode }: WorkflowCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { deleteWorkflow } = useWorkflow()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflow.id)
      toast.success('Workflow deleted')
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className={`glass-strong rounded-2xl p-6 hover:shadow-2xl transition-all group relative ${
        viewMode === 'list' ? 'flex items-center justify-between' : ''
      }`}
    >
      <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform ${
          viewMode === 'list' ? '' : 'mb-4'
        }`}>
          <Zap className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold truncate">{workflow.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
              workflow.status === 'active' ? 'bg-green-100 text-green-700' :
              workflow.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {workflow.status}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
            {workflow.description || 'No description'}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{workflow.nodes.length} nodes</span>
            <span>{workflow.edges.length} connections</span>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-2 ${viewMode === 'list' ? '' : 'mt-4'}`}>
        <Link
          to={`/workflows/${workflow.id}`}
          className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <button className="btn-primary px-3 py-2 text-sm flex items-center gap-2">
          <Play className="w-4 h-4" />
          Run
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-xl p-2 z-10">
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
