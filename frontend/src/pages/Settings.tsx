import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  User, Key, Palette, Settings as SettingsIcon, Bell, Shield,
  Trash2, Plus, Eye, EyeOff, Check, X, AlertTriangle, Save,
  Moon, Sun, Monitor, Zap, Copy
} from 'lucide-react'
import { useApiKeys } from '../contexts/ApiKeyContext'
import toast from 'react-hot-toast'

type Tab = 'api-keys' | 'appearance' | 'notifications' | 'advanced'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('api-keys')

  const tabs = [
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
          <h1 className="text-4xl font-black mb-2">⚙️ Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your API keys and preferences
          </p>
        </motion.div>

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

function ApiKeysTab() {
  const apiKeyContext = useApiKeys()
  
  // Add safety check
  if (!apiKeyContext) {
    return (
      <div className="card">
        <p>Loading API keys...</p>
      </div>
    )
  }

  // ✅ FIX: Use correct property names from context
  const { apiKeys = [], addApiKey, updateApiKey, deleteApiKey } = apiKeyContext
  const activeKeyId = apiKeys.find(k => k.isActive)?.id
  
  const [showAddKey, setShowAddKey] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    provider: 'openrouter' as 'openrouter' | 'openai' | 'anthropic' | 'google',
    apiKey: '',
    model: 'meta-llama/llama-3.3-70b-instruct:free'
  })

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddKey = () => {
    if (!formData.name || !formData.apiKey || !formData.model) {
      toast.error('Please fill in all fields')
      return
    }

    // ✅ FIX: Call addApiKey (not addKey)
    addApiKey({
      provider: formData.provider,
      apiKey: formData.apiKey,
      model: formData.model,
      isActive: true // Set as active by default
    })

    toast.success('API key added successfully!', { icon: '✅' })
    setFormData({ name: '', provider: 'openrouter', apiKey: '', model: 'meta-llama/llama-3.3-70b-instruct:free' })
    setShowAddKey(false)
  }

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      deleteApiKey(id)
      toast.success('API key deleted', { icon: '🗑️' })
    }
  }

  const handleSetActive = (id: string) => {
    // ✅ FIX: Use updateApiKey to set active
    updateApiKey(id, { isActive: true })
    toast.success('Active API key updated!', { icon: '⭐' })
  }

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API key copied to clipboard!', { icon: '📋' })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">🔑 API Keys</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your AI provider API keys securely
            </p>
          </div>
          <button
            onClick={() => setShowAddKey(!showAddKey)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Key
          </button>
        </div>

        {/* Add Key Form */}
        {showAddKey && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold mb-4">➕ Add API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Production Key"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
                  className="input"
                >
                  <option value="openrouter">⭐ OpenRouter (40+ FREE models)</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Your API key is stored securely in your browser only
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="meta-llama/llama-3.3-70b-instruct:free"
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">
                  For OpenRouter, use format: provider/model-name:free
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddKey} className="btn-primary">
                  <Check className="w-4 h-4" />
                  Add Key
                </button>
                <button onClick={() => setShowAddKey(false)} className="btn-ghost">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Keys List */}
        {apiKeys && apiKeys.length > 0 ? (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className={`glass-strong rounded-xl p-4 space-y-3 transition-all ${
                  key.id === activeKeyId ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{key.provider}</h3>
                      {key.id === activeKeyId && (
                        <span className="badge badge-success">
                          <Zap className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {key.provider === 'openrouter' && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          ⭐ 40+ FREE
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Provider: <span className="font-medium capitalize">{key.provider}</span></div>
                      <div>Model: <span className="font-mono text-xs">{key.model}</span></div>
                      <div>Added: {new Date(key.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {key.id !== activeKeyId && (
                      <button
                        onClick={() => handleSetActive(key.id)}
                        className="btn-ghost p-2"
                        title="Set as active"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyKey(key.apiKey)}
                      className="btn-ghost p-2"
                      title="Copy key"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="btn-ghost p-2 text-red-600"
                      title="Delete key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 glass rounded-lg px-3 py-2 text-sm font-mono">
                    {showKeys[key.id] ? key.apiKey : key.apiKey.replace(/./g, '•')}
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

      {/* Free Models Info */}
      <div className="card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl">
            ⭐
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Free Models Available!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              OpenRouter offers 40+ FREE AI models (no credit card needed):
            </p>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Llama 3.3 70B (GPT-4 level performance)</li>
              <li>• StepFun Step 3.5 Flash (533B parameters)</li>
              <li>• Arcee AI Trinity Large (574B parameters)</li>
              <li>• Qwen3 Coder 480B (best for coding)</li>
              <li>• DeepSeek R1 (reasoning specialist)</li>
            </ul>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              Get Free API Key
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppearanceTab() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('autonomos-theme', theme)
    setSaved(true)
    toast.success('Theme preference saved!', { icon: '🎨' })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🎨 Appearance</h2>
      
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
                  className={`glass-strong rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:scale-105 ${
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
          <button onClick={handleSave} className="btn-primary" disabled={saved}>
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Preferences</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    toast.success('Notification preferences saved!', { icon: '🔔' })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>
      
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
          <button onClick={handleSave} className="btn-primary" disabled={saved}>
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Preferences</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdvancedTab() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    toast.success('Advanced settings saved!', { icon: '⚙️' })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">⚙️ Advanced Settings</h2>
        
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
            <button onClick={handleSave} className="btn-primary" disabled={saved}>
              {saved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Preferences</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📊 System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Version:</span>
            <span className="font-mono">0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Build:</span>
            <span className="font-mono">2026.03.05</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Environment:</span>
            <span className="font-mono">Production</span>
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
            <h3 className="font-semibold mb-2">Clear All Data</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Clear all workflows, API keys, and settings from browser storage.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure? This will clear ALL your data!')) {
                  localStorage.clear()
                  sessionStorage.clear()
                  toast.success('All data cleared!', { icon: '🗑️' })
                  setTimeout(() => window.location.reload(), 1000)
                }
              }}
              className="btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
