import { motion } from 'framer-motion'
import { Zap, Check, Clock, AlertCircle } from 'lucide-react'

const activities = [
  { icon: Check, label: 'Workflow completed', time: '2 min ago', color: 'text-green-600' },
  { icon: Zap, label: 'New agent deployed', time: '15 min ago', color: 'text-blue-600' },
  { icon: Clock, label: 'Workflow started', time: '1 hour ago', color: 'text-yellow-600' },
  { icon: AlertCircle, label: 'Error in workflow', time: '2 hours ago', color: 'text-red-600' },
  { icon: Check, label: 'Template loaded', time: '3 hours ago', color: 'text-green-600' },
]

export default function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-lg glass ${activity.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{activity.label}</div>
              <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
