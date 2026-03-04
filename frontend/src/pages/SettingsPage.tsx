import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Key, Bell, Shield, CreditCard, Plus, Eye, EyeOff, Copy, Trash2, Check, ExternalLink, Loader2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { useApiKeys, AI_PROVIDERS, ApiKey } from '../contexts/ApiKeyContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const { apiKeys, addApiKey, deleteApiKey, updateApiKey, testApiKey } = useApiKeys()
  const [activeTab, setActiveTab] = useState('api')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    provider: 'openrouter' as const,
    apiKey: '',
    model: 'openai/gpt-4-turbo-preview',
  })
  const [testing, setTesting] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  const selectedProvider = AI_PROVIDERS.find(p => p.id === formData.provider)

  const handleAddKey = async () => {
    if (!formData.apiKey || !formData.model) {
      toast.error('Please fill in all fields')
      return
    }

    setTesting(true)
    try {
      const isValid = await testApiKey(formData.provider, formData.apiKey)
      if (isValid) {
        addApiKey({
          provider: formData.provider,
          apiKey: formData.apiKey,
          model: formData.model,
          isActive: true,
        })
        toast.success(`${selectedProvider?.name} API key added successfully!`)
        setShowAddForm(false)
        setFormData({
          provider: 'openrouter',
          apiKey: '',
          model: 'openai/gpt-4-turbo-preview',
        })
      } else {
        toast.error('Invalid API key. Please check and try again.')
      }
    } catch (error) {
      toast.error('Failed to validate API key')
    } finally {
      setTesting(false)
    }
  }

  const handleDelete = (id: string, providerName: string) => {
    if (confirm(`Delete ${providerName} API key?`)) {
      deleteApiKey(id)
      toast.success('API key deleted')
    }
  }

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const maskApiKey = (key: string, visible: boolean) => {
    if (visible) return key
    const start = key.substring(0, 8)
    const end = key.substring(key.length - 4)
    return `${start}${'•'.repeat(20)}${end}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

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
            <AnimatePresence mode="wait">
              {activeTab === 'api' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">API Keys</h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Configure AI provider API keys. OpenRouter is recommended for access to 50+ models.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Key
                    </button>
                  </div>

                  {/* Add API Key Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass rounded-2xl p-6 space-y-4"
                      >
                        <h3 className="font-bold text-lg">Add New API Key</h3>
                        
                        {/* Provider Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Provider</label>
                          <select
                            value={formData.provider}
                            onChange={(e) => {
                              const provider = e.target.value as any
                              const providerData = AI_PROVIDERS.find(p => p.id === provider)
                              setFormData({
                                provider,
                                apiKey: '',
                                model: providerData?.models[0].value || '',
                              })
                            }}
                            className="input-field"
                          >
                            {AI_PROVIDERS.map(provider => (
                              <option key={provider.id} value={provider.id}>
                                {provider.name} {provider.id === 'openrouter' && '⭐ Recommended'}
                              </option>
                            ))}
                          </select>
                          {selectedProvider && (
                            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                              <p className="text-sm text-primary-700 dark:text-primary-300">
                                {selectedProvider.description}
                              </p>
                              <a
                                href={selectedProvider.signupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2"
                              >
                                Get API Key
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Model Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Model</label>
                          <select
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="input-field"
                          >
                            {selectedProvider?.models.map(model => (
                              <option key={model.value} value={model.value}>
                                {model.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* API Key Input */}
                        <div>
                          <label className="block text-sm font-medium mb-2">API Key</label>
                          <input
                            type="password"
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            placeholder="sk-..." 
                            className="input-field"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleAddKey}
                            disabled={testing}
                            className="btn-primary flex items-center gap-2"
                          >
                            {testing ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Plus className="w-5 h-5" />
                                Add API Key
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowAddForm(false)}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* API Keys List */}
                  <div className="space-y-3">
                    {apiKeys.length > 0 ? (
                      apiKeys.map((key) => {
                        const provider = AI_PROVIDERS.find(p => p.id === key.provider)
                        const isVisible = visibleKeys.has(key.id)
                        return (
                          <motion.div
                            key={key.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold">{provider?.name}</h3>
                                  {key.isActive && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      Active
                                    </span>
                                  )}
                                  {key.provider === 'openrouter' && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                                      ⭐ Priority
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                                  <span className="font-mono">{maskApiKey(key.apiKey, isVisible)}</span>
                                  <button
                                    onClick={() => toggleVisibility(key.id)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  >
                                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(key.apiKey)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-xs text-slate-500">
                                  Model: {provider?.models.find(m => m.value === key.model)?.label || key.model}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateApiKey(key.id, { isActive: !key.isActive })}
                                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                    key.isActive
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                      : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {key.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleDelete(key.id, provider?.name || '')}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <Key className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="mb-4">No API keys configured</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add Your First API Key
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" defaultValue={user?.email} className="input-field w-full" />
                    </div>
                  </div>
                  <button onClick={() => toast.success('Profile updated!')} className="btn-primary">
                    Save Changes
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
