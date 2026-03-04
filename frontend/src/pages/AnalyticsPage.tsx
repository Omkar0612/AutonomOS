import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import StatCard from '../components/StatCard'

export default function AnalyticsPage() {
  const stats = [
    {
      label: 'Total Executions',
      value: '12,453',
      change: '+18%',
      trend: 'up' as const,
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Active Users',
      value: '1,234',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Cost Saved',
      value: '$4,567',
      change: '+24%',
      trend: 'up' as const,
      icon: DollarSign,
      gradient: 'from-orange-500 to-red-500'
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Track performance and usage metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Execution History</h2>
            <div className="h-64 flex items-center justify-center text-slate-400">
              Chart will be displayed here
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Popular Workflows</h2>
            <div className="h-64 flex items-center justify-center text-slate-400">
              Chart will be displayed here
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
