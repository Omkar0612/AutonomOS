import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, Clock, Plus, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import StatCard from '../components/StatCard'
import ActivityFeed from '../components/ActivityFeed'
import { useWorkflow } from '../contexts/WorkflowContext'

export default function DashboardPage() {
  const { workflows } = useWorkflow()

  const stats = [
    {
      label: 'Total Workflows',
      value: workflows.length.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Active Agents',
      value: workflows.filter(w => w.status === 'active').length.toString(),
      change: '+8%',
      trend: 'up' as const,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Executions Today',
      value: '127',
      change: '+23%',
      trend: 'up' as const,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Avg Response Time',
      value: '1.2s',
      change: '-5%',
      trend: 'down' as const,
      icon: Clock,
      gradient: 'from-orange-500 to-red-500'
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/workflows/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Workflow
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Workflows */}
          <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Workflows</h2>
              <Link to="/workflows" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            {workflows.length > 0 ? (
              <div className="space-y-3">
                {workflows.slice(0, 5).map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 glass rounded-xl hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{workflow.name}</div>
                        <div className="text-sm text-slate-500">{workflow.nodes.length} nodes</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                      workflow.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {workflow.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No workflows yet</p>
                <Link to="/workflows/new" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  Create your first workflow
                </Link>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="glass-strong rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
