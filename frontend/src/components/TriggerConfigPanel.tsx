import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Webhook, Database, Mail, FileText, List, Zap, Globe, FileInput, Save } from 'lucide-react'

interface TriggerConfigPanelProps {
  onUpdate: (config: any) => void
  initialConfig?: any
}

export default function TriggerConfigPanel({ onUpdate, initialConfig = {} }: TriggerConfigPanelProps) {
  const [triggerType, setTriggerType] = useState(initialConfig.triggerType || 'manual')
  const [config, setConfig] = useState(initialConfig.triggerConfig || {})

  const triggerTypes = [
    { value: 'manual', label: 'Manual Trigger', icon: '▶️', description: 'Start manually' },
    { value: 'schedule', label: 'Schedule', icon: '⏰', description: 'Run on schedule' },
    { value: 'webhook', label: 'Webhook', icon: '🔗', description: 'HTTP endpoint' },
    { value: 'database', label: 'Database', icon: '💾', description: 'DB changes' },
    { value: 'email', label: 'Email', icon: '📧', description: 'Email received' },
    { value: 'file', label: 'File', icon: '📁', description: 'File changes' },
    { value: 'queue', label: 'Queue', icon: '📬', description: 'Message queue' },
    { value: 'event', label: 'Event', icon: '⚡', description: 'Custom event' },
    { value: 'api', label: 'API', icon: '🌐', description: 'API call' },
    { value: 'form', label: 'Form', icon: '📝', description: 'Form submission' },
  ]

  const handleTriggerTypeChange = (type: string) => {
    setTriggerType(type)
    setConfig({})
  }

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onUpdate({
      triggerType,
      triggerConfig: config,
    })
  }

  return (
    <div className="space-y-6">
      {/* Trigger Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Trigger Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {triggerTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTriggerTypeChange(type.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                triggerType === type.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}
            >
              <div className="text-xl mb-1">{type.icon}</div>
              <div className="text-xs font-semibold">{type.label}</div>
              <div className="text-xs text-slate-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Type-specific Configuration */}
      <motion.div
        key={triggerType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
            {triggerTypes.find(t => t.value === triggerType)?.label} Configuration
          </h3>

          {triggerType === 'manual' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={config.description || ''}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Describe when this trigger should be executed..."
              />
            </div>
          )}

          {triggerType === 'schedule' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cron Expression
                </label>
                <input
                  type="text"
                  value={config.cronExpression || ''}
                  onChange={(e) => handleConfigChange('cronExpression', e.target.value)}
                  className="input-field font-mono"
                  placeholder="0 0 * * * (every hour)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: minute hour day month weekday
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={config.timezone || 'UTC'}
                  onChange={(e) => handleConfigChange('timezone', e.target.value)}
                  className="input-field"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
          )}

          {triggerType === 'webhook' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Webhook Path
                </label>
                <input
                  type="text"
                  value={config.path || ''}
                  onChange={(e) => handleConfigChange('path', e.target.value)}
                  className="input-field font-mono"
                  placeholder="/webhook/my-trigger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Authentication
                </label>
                <select
                  value={config.auth || 'none'}
                  onChange={(e) => handleConfigChange('auth', e.target.value)}
                  className="input-field"
                >
                  <option value="none">None</option>
                  <option value="apikey">API Key</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              {config.auth && config.auth !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    value={config.secret || ''}
                    onChange={(e) => handleConfigChange('secret', e.target.value)}
                    className="input-field"
                    placeholder="Enter secret key..."
                  />
                </div>
              )}
            </div>
          )}

          {triggerType === 'database' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Connection String
                </label>
                <input
                  type="text"
                  value={config.connectionString || ''}
                  onChange={(e) => handleConfigChange('connectionString', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="mongodb://localhost:27017/mydb"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Table/Collection
                </label>
                <input
                  type="text"
                  value={config.table || ''}
                  onChange={(e) => handleConfigChange('table', e.target.value)}
                  className="input-field"
                  placeholder="users"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Type
                </label>
                <div className="flex gap-2">
                  {['INSERT', 'UPDATE', 'DELETE'].map((event) => (
                    <label key={event} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(config.events || []).includes(event)}
                        onChange={(e) => {
                          const events = config.events || []
                          if (e.target.checked) {
                            handleConfigChange('events', [...events, event])
                          } else {
                            handleConfigChange('events', events.filter((e: string) => e !== event))
                          }
                        }}
                        className="rounded"
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Poll Interval (seconds)
                </label>
                <input
                  type="number"
                  value={config.pollInterval || 60}
                  onChange={(e) => handleConfigChange('pollInterval', parseInt(e.target.value))}
                  className="input-field"
                  min="5"
                  max="3600"
                />
              </div>
            </div>
          )}

          {triggerType === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address to Monitor
                </label>
                <input
                  type="email"
                  value={config.email || ''}
                  onChange={(e) => handleConfigChange('email', e.target.value)}
                  className="input-field"
                  placeholder="inbox@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject Filter (optional)
                </label>
                <input
                  type="text"
                  value={config.subjectFilter || ''}
                  onChange={(e) => handleConfigChange('subjectFilter', e.target.value)}
                  className="input-field"
                  placeholder="Contains text..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.includeAttachments || false}
                    onChange={(e) => handleConfigChange('includeAttachments', e.target.checked)}
                    className="rounded"
                  />
                  Include Attachments
                </label>
              </div>
            </div>
          )}

          {triggerType === 'file' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  File Path/Pattern
                </label>
                <input
                  type="text"
                  value={config.filePath || ''}
                  onChange={(e) => handleConfigChange('filePath', e.target.value)}
                  className="input-field font-mono"
                  placeholder="/uploads/*.csv"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Watch Mode
                </label>
                <div className="flex gap-2">
                  {['create', 'modify', 'delete'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(config.watchModes || []).includes(mode)}
                        onChange={(e) => {
                          const modes = config.watchModes || []
                          if (e.target.checked) {
                            handleConfigChange('watchModes', [...modes, mode])
                          } else {
                            handleConfigChange('watchModes', modes.filter((m: string) => m !== mode))
                          }
                        }}
                        className="rounded"
                      />
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {triggerType === 'queue' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Queue Type
                </label>
                <select
                  value={config.queueType || 'rabbitmq'}
                  onChange={(e) => handleConfigChange('queueType', e.target.value)}
                  className="input-field"
                >
                  <option value="rabbitmq">RabbitMQ</option>
                  <option value="sqs">AWS SQS</option>
                  <option value="kafka">Apache Kafka</option>
                  <option value="redis">Redis Streams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Queue/Topic Name
                </label>
                <input
                  type="text"
                  value={config.queueName || ''}
                  onChange={(e) => handleConfigChange('queueName', e.target.value)}
                  className="input-field"
                  placeholder="my-queue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Connection URL
                </label>
                <input
                  type="text"
                  value={config.connectionUrl || ''}
                  onChange={(e) => handleConfigChange('connectionUrl', e.target.value)}
                  className="input-field font-mono text-xs"
                  placeholder="amqp://localhost:5672"
                />
              </div>
            </div>
          )}

          {triggerType === 'event' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Type
                </label>
                <input
                  type="text"
                  value={config.eventType || ''}
                  onChange={(e) => handleConfigChange('eventType', e.target.value)}
                  className="input-field"
                  placeholder="user.created"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Source
                </label>
                <input
                  type="text"
                  value={config.eventSource || ''}
                  onChange={(e) => handleConfigChange('eventSource', e.target.value)}
                  className="input-field"
                  placeholder="user-service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Filter Expression (optional)
                </label>
                <textarea
                  value={config.filterExpression || ''}
                  onChange={(e) => handleConfigChange('filterExpression', e.target.value)}
                  className="input-field resize-none font-mono text-xs"
                  rows={2}
                  placeholder="event.data.userId === '123'"
                />
              </div>
            </div>
          )}

          {triggerType === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  HTTP Method
                </label>
                <select
                  value={config.method || 'POST'}
                  onChange={(e) => handleConfigChange('method', e.target.value)}
                  className="input-field"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Endpoint Path
                </label>
                <input
                  type="text"
                  value={config.endpoint || ''}
                  onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                  className="input-field font-mono"
                  placeholder="/api/trigger"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.requireAuth || false}
                    onChange={(e) => handleConfigChange('requireAuth', e.target.checked)}
                    className="rounded"
                  />
                  Require Authentication
                </label>
              </div>
            </div>
          )}

          {triggerType === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Form ID
                </label>
                <input
                  type="text"
                  value={config.formId || ''}
                  onChange={(e) => handleConfigChange('formId', e.target.value)}
                  className="input-field"
                  placeholder="contact-form"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Required Fields (comma-separated)
                </label>
                <input
                  type="text"
                  value={config.requiredFields || ''}
                  onChange={(e) => handleConfigChange('requiredFields', e.target.value)}
                  className="input-field"
                  placeholder="name, email, message"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.validateEmail || false}
                    onChange={(e) => handleConfigChange('validateEmail', e.target.checked)}
                    className="rounded"
                  />
                  Validate Email Fields
                </label>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Apply Button */}
      <motion.button
        onClick={handleApply}
        className="btn-primary w-full flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="w-4 h-4" />
        Apply Configuration
      </motion.button>
    </div>
  )
}
