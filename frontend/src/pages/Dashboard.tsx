import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, TrendingUp, TrendingDown, Activity, Clock, 
  Zap, CheckCircle2, AlertCircle, Workflow, BarChart3,
  Settings, Play
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Metric {
  id: string
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  icon: any
  color: string
}

interface WorkflowItem {
  id: string
  name: string
  status: 'active' | 'draft' | 'archived'
  nodes: number
  lastRun: string
  executions: number
}

interface ActivityItem {
  id: string
  type: 'execution' | 'created' | 'updated' | 'error'
  message: string
  timestamp: string
  workflow?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: '1',
      label: 'Total Workflows',
      value: 12,
      change: 15.3,
      trend: 'up',
      icon: Workflow,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '2',
      label: 'Active Agents',
      value: 8,
      change: 22.5,
      trend: 'up',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      label: 'Executions Today',
      value: 147,
      change: 8.2,
      trend: 'up',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: '4',
      label: 'Avg Response Time',
      value: '2.4s',
      change: -12.8,
      trend: 'down',
      icon: Clock,
      color: 'from-amber-500 to-orange-500'
    },
  ])

  const [recentWorkflows, setRecentWorkflows] = useState<WorkflowItem[]>([
    {
      id: '1',
      name: 'Lead Generation Pipeline',
      status: 'active',
      nodes: 5,
      lastRun: '2 minutes ago',
      executions: 234
    },
    {
      id: '2',
      name: 'Content Creation Assistant',
      status: 'active',
      nodes: 8,
      lastRun: '1 hour ago',
      executions: 89
    },
    {
      id: '3',
      name: 'Customer Support Bot',
      status: 'draft',
      nodes: 3,
      lastRun: 'Never',
      executions: 0
    },
  ])

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'execution',
      message: 'Lead Generation Pipeline executed successfully',
      timestamp: '2 min ago',
      workflow: 'Lead Generation'
    },
    {
      id: '2',
      type: 'updated',
      message: 'Content Creation Assistant updated',
      timestamp: '1 hour ago',
      workflow: 'Content Creation'
    },
    {
      id: '3',
      type: 'created',
      message: 'New workflow created: Customer Support Bot',
      timestamp: '3 hours ago'
    },
    {
      id: '4',
      type: 'execution',
      message: 'Data Analysis Pipeline completed',
      timestamp: '5 hours ago',
      workflow: 'Data Analysis'
    },
  ])

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const handleCreateWorkflow = () => {
    navigate('/workflow')
    toast.success('Opening workflow builder...', { icon: '✨' })
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-black mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Here's what's happening with your workflows today.
            </p>
          </div>
          <button onClick={handleCreateWorkflow} className="btn-primary glow">
            <Plus className="w-5 h-5" />
            New Workflow
          </button>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              variants={item}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card gradient-card group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${metric.color} p-3 rounded-xl glow`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="text-3xl font-black mb-1 group-hover:gradient-text transition-all">
                {metric.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Workflows */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📊 Recent Workflows</h2>
              <button
                onClick={() => navigate('/workflow')}
                className="btn-ghost text-sm"
              >
                View all
              </button>
            </div>
            
            <div className="space-y-3">
              {recentWorkflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => navigate('/workflow')}
                  className="glass-strong rounded-xl p-4 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {workflow.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Workflow className="w-4 h-4" />
                          {workflow.nodes} nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workflow.lastRun}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${
                        workflow.status === 'active' ? 'badge-success' :
                        workflow.status === 'draft' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {workflow.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {workflow.executions} runs
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/workflow')
                      }}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success('Analytics coming soon!', { icon: '📊' })
                      }}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analytics
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {recentWorkflows.length === 0 && (
              <div className="text-center py-12">
                <Workflow className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-slate-600 dark:text-slate-400">
                  No workflows yet
                </h3>
                <p className="text-slate-500 dark:text-slate-500 mb-4">
                  Create your first workflow to get started
                </p>
                <button onClick={handleCreateWorkflow} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </button>
              </div>
            )}
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-6">⚡ Activity Feed</h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'execution' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    activity.type === 'created' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'updated' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {activity.type === 'execution' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : activity.type === 'created' ? (
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : activity.type === 'updated' ? (
                      <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                      {activity.message}
                    </p>
                    {activity.workflow && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                        {activity.workflow}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">🚀 Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleCreateWorkflow}
              className="glass-strong rounded-xl p-4 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl inline-block mb-3 glow">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold group-hover:gradient-text transition-all">
                Create Workflow
              </div>
            </button>

            <button
              onClick={() => {
                navigate('/workflow')
                toast.success('Loading templates...', { icon: '📋' })
              }}
              className="glass-strong rounded-xl p-4 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl inline-block mb-3 glow">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold group-hover:gradient-text transition-all">
                Browse Templates
              </div>
            </button>

            <button
              onClick={() => toast.success('Analytics dashboard coming soon!', { icon: '📊' })}
              className="glass-strong rounded-xl p-4 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl inline-block mb-3 glow">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold group-hover:gradient-text transition-all">
                View Analytics
              </div>
            </button>

            <Link
              to="/settings"
              className="glass-strong rounded-xl p-4 hover:scale-105 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl inline-block mb-3 glow">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold group-hover:gradient-text transition-all">
                API Settings
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
