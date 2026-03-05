import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  User, Key, Palette, Settings as SettingsIcon, Bell, Shield,
  Trash2, Plus, Eye, EyeOff, Check, X, AlertTriangle, Save,
  Moon, Sun, Monitor
} from 'lucide-react'

type Tab = 'profile' | 'api-keys' | 'appearance' | 'notifications' | 'advanced'

interface ApiKey {
  id: string
  name: string
  provider: string
  key: string
  model: string
  createdAt: string
  lastUsed: string | null
  isActive: boolean
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'api-keys' as Tab, label: 'API Keys', icon: Key },
    { id: 'appearance' as Tab, label: 'Appearance', icon: Palette },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'advanced' as Tab, label: 'Advanced', icon: SettingsIcon },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Unsaved Changes Banner */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-xl p-4 flex items-center justify-between border-l-4 border-amber-500"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-sm">Discard</button>
              <button className="btn-primary text-sm py-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl p-2"
          >
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'api-keys' && <ApiKeysTab />}
            {activeTab === 'appearance' && <AppearanceTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'advanced' && <AdvancedTab />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab() {
  const [name, setName] = useState('Omkar Parab')
  const [email, setEmail] = useState('omkar@autonomos.ai')

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-3">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                OP
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm">Change</button>
                <button className="btn-ghost text-sm text-red-600">Remove</button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex gap-3">
            <button className="btn-primary">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button className="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              className="input"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              className="input"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button className="btn-primary">
            Update Password
          </button>
        </div>
      </div>
    </div>
  )
}

function ApiKeysTab() {
  const [showAddKey, setShowAddKey] = useState(false)
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenRouter Production',
      provider: 'openrouter',
      key: 'sk-or-v1-xxxxxxxxxxxxxxxxxxxx',
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      createdAt: '2026-03-01',
      lastUsed: '2 minutes ago',
      isActive: true
    }
  ])
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">API Keys</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your AI provider API keys securely
            </p>
          </div>
          <button
            onClick={() => setShowAddKey(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Key
          </button>
        </div>

        {keys.length > 0 ? (
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.id}
                className="glass-strong rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{key.name}</h3>
                      {key.isActive && (
                        <span className="badge badge-success">
                          <span className="status-dot active" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Provider: <span className="font-medium">{key.provider}</span></div>
                      <div>Model: <span className="font-mono text-xs">{key.model}</span></div>
                      <div>Last used: {key.lastUsed || 'Never'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost p-2" title="Test key">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost p-2 text-red-600" title="Delete key">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 glass rounded-lg px-3 py-2 text-sm font-mono">
                    {showKeys[key.id] ? key.key : key.key.replace(/./g, '•')}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="btn-ghost p-2"
                  >
                    {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Add an API key to start using AI models
            </p>
            <button onClick={() => setShowAddKey(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Your First Key
            </button>
          </div>
        )}
      </div>

      {/* Add Key Form */}
      {showAddKey && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Add API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Key Name</label>
              <input type="text" placeholder="e.g., Production Key" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <select className="input">
                <option>OpenRouter</option>
                <option>OpenAI</option>
                <option>Anthropic</option>
                <option>Google AI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input type="password" placeholder="sk-..." className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input type="text" placeholder="meta-llama/llama-3.3-70b-instruct:free" className="input" />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">Add Key</button>
              <button onClick={() => setShowAddKey(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AppearanceTab() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Appearance</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-4">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light' as const, label: 'Light', icon: Sun },
              { id: 'dark' as const, label: 'Dark', icon: Moon },
              { id: 'system' as const, label: 'System', icon: Monitor },
            ].map((option) => {
              const Icon = option.icon
              const isActive = theme === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={`glass-strong rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                    isActive ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <Icon className={`w-8 h-8 ${
                    isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'
                  }`} />
                  <span className="font-medium">{option.label}</span>
                  {isActive && <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      
      <div className="space-y-6">
        {[
          { id: 'workflow-complete', label: 'Workflow completions', description: 'Get notified when a workflow finishes executing' },
          { id: 'workflow-error', label: 'Workflow errors', description: 'Get notified when a workflow encounters an error' },
          { id: 'new-features', label: 'New features', description: 'Stay updated on new features and improvements' },
          { id: 'security', label: 'Security alerts', description: 'Important security and account notifications' },
        ].map((notification) => (
          <label key={notification.id} className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <div className="flex-1">
              <div className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {notification.label}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {notification.description}
              </div>
            </div>
          </label>
        ))}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function AdvancedTab() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Advanced Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Enable beta features
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Get early access to experimental features
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Analytics and crash reports
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Help us improve by sharing anonymous usage data
                </div>
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <button className="btn-primary">
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-200 dark:border-red-900/30">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Irreversible and destructive actions
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-strong rounded-xl p-4">
            <h3 className="font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
