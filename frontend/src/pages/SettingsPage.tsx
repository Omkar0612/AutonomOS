import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Key, Bell, Shield, CreditCard } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-64 glass-strong rounded-2xl p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 glass-strong rounded-2xl p-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="input-field w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="input-field w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <input
                        type="text"
                        defaultValue={user?.role}
                        disabled
                        className="input-field w-full opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Profile updated!')}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">API Keys</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Manage your API keys for programmatic access
                </p>
                <button
                  onClick={() => toast.success('API key generated!')}
                  className="btn-primary"
                >
                  Generate New Key
                </button>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Configure how you receive notifications
                </p>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account security
                </p>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">Billing & Plans</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your subscription and billing
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
