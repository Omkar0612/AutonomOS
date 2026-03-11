import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe,
  Database,
  FileText,
  Bell,
  Mail,
  Webhook,
  Cloud,
  Code,
  Server,
  Zap,
  AlertCircle,
  Settings,
  Plus,
  X
} from 'lucide-react'

interface ActionConfigPanelProps {
  onUpdate: (config: any) => void
  initialConfig?: any
}

export default function ActionConfigPanel({ onUpdate, initialConfig = {} }: ActionConfigPanelProps) {
  // Action type
  const [actionType, setActionType] = useState(initialConfig.actionType || 'api_call')
  
  // API Call config
  const [apiMethod, setApiMethod] = useState(initialConfig.apiConfig?.method || 'POST')
  const [apiUrl, setApiUrl] = useState(initialConfig.apiConfig?.url || '')
  const [apiBody, setApiBody] = useState(initialConfig.apiConfig?.body ? JSON.stringify(initialConfig.apiConfig.body, null, 2) : '')
  const [authType, setAuthType] = useState(initialConfig.apiConfig?.auth?.type || 'bearer')
  const [authCredentials, setAuthCredentials] = useState(initialConfig.apiConfig?.auth?.credentials || '')
  const [retryEnabled, setRetryEnabled] = useState(initialConfig.apiConfig?.retry?.enabled || false)
  const [maxRetries, setMaxRetries] = useState(initialConfig.apiConfig?.retry?.maxAttempts || 3)
  
  // Database config
  const [dbOperation, setDbOperation] = useState(initialConfig.databaseConfig?.operation || 'query')
  const [dbConnection, setDbConnection] = useState(initialConfig.databaseConfig?.connection || '')
  const [dbQuery, setDbQuery] = useState(initialConfig.databaseConfig?.query || '')
  const [dbTable, setDbTable] = useState(initialConfig.databaseConfig?.table || '')
  const [dbTransaction, setDbTransaction] = useState(initialConfig.databaseConfig?.transaction || false)
  
  // File config
  const [fileOperation, setFileOperation] = useState(initialConfig.fileConfig?.operation || 'write')
  const [filePath, setFilePath] = useState(initialConfig.fileConfig?.path || '')
  const [fileFormat, setFileFormat] = useState(initialConfig.fileConfig?.format || 'json')
  
  // Notification config
  const [notifService, setNotifService] = useState(initialConfig.notificationConfig?.service || 'slack')
  const [notifChannel, setNotifChannel] = useState(initialConfig.notificationConfig?.channel || '')
  const [notifMessage, setNotifMessage] = useState(initialConfig.notificationConfig?.message || '')
  const [notifPriority, setNotifPriority] = useState(initialConfig.notificationConfig?.priority || 'normal')
  
  // Email config
  const [emailTo, setEmailTo] = useState(initialConfig.emailConfig?.to?.join(', ') || '')
  const [emailSubject, setEmailSubject] = useState(initialConfig.emailConfig?.subject || '')
  const [emailBody, setEmailBody] = useState(initialConfig.emailConfig?.body || '')
  const [emailHtml, setEmailHtml] = useState(initialConfig.emailConfig?.html || false)
  
  // Webhook config
  const [webhookUrl, setWebhookUrl] = useState(initialConfig.webhookConfig?.url || '')
  const [webhookMethod, setWebhookMethod] = useState(initialConfig.webhookConfig?.method || 'POST')
  const [webhookPayload, setWebhookPayload] = useState(
    initialConfig.webhookConfig?.payload ? JSON.stringify(initialConfig.webhookConfig.payload, null, 2) : ''
  )
  
  // Cloud config
  const [cloudProvider, setCloudProvider] = useState(initialConfig.cloudConfig?.provider || 's3')
  const [cloudOperation, setCloudOperation] = useState(initialConfig.cloudConfig?.operation || 'upload')
  const [cloudBucket, setCloudBucket] = useState(initialConfig.cloudConfig?.bucket || '')
  const [cloudKey, setCloudKey] = useState(initialConfig.cloudConfig?.key || '')
  
  // Transform config
  const [transformType, setTransformType] = useState(initialConfig.transformConfig?.type || 'map')
  const [transformScript, setTransformScript] = useState(initialConfig.transformConfig?.script || '')
  
  // Integration config
  const [integrationService, setIntegrationService] = useState(initialConfig.integrationConfig?.service || 'github')
  const [integrationAction, setIntegrationAction] = useState(initialConfig.integrationConfig?.action || '')
  
  // Error handling
  const [onError, setOnError] = useState(initialConfig.errorHandling?.onError || 'fail')
  const [logErrors, setLogErrors] = useState(initialConfig.errorHandling?.logErrors !== false)
  
  // Execution settings
  const [asyncExecution, setAsyncExecution] = useState(initialConfig.execution?.async || false)
  const [timeout, setTimeout] = useState(initialConfig.execution?.timeout || 30)
  const [batchEnabled, setBatchEnabled] = useState(initialConfig.execution?.batch?.enabled || false)
  const [batchSize, setBatchSize] = useState(initialConfig.execution?.batch?.size || 10)

  const handleSave = () => {
    const config: any = {
      actionType,
      errorHandling: {
        onError,
        logErrors
      },
      execution: {
        async: asyncExecution,
        timeout,
        batch: batchEnabled ? { enabled: true, size: batchSize } : { enabled: false }
      }
    }

    // Add type-specific config
    switch (actionType) {
      case 'api_call':
        config.apiConfig = {
          method: apiMethod,
          url: apiUrl,
          body: apiBody ? JSON.parse(apiBody) : undefined,
          auth: authCredentials ? {
            type: authType,
            credentials: authCredentials
          } : undefined,
          retry: retryEnabled ? {
            enabled: true,
            maxAttempts: maxRetries,
            backoff: 'exponential'
          } : undefined
        }
        break
      
      case 'database':
        config.databaseConfig = {
          operation: dbOperation,
          connection: dbConnection,
          query: dbQuery,
          table: dbTable,
          transaction: dbTransaction
        }
        break
      
      case 'file_operation':
        config.fileConfig = {
          operation: fileOperation,
          path: filePath,
          format: fileFormat
        }
        break
      
      case 'notification':
        config.notificationConfig = {
          service: notifService,
          channel: notifChannel,
          message: notifMessage,
          priority: notifPriority
        }
        break
      
      case 'email':
        config.emailConfig = {
          to: emailTo.split(',').map(e => e.trim()),
          subject: emailSubject,
          body: emailBody,
          html: emailHtml
        }
        break
      
      case 'webhook':
        config.webhookConfig = {
          url: webhookUrl,
          method: webhookMethod,
          payload: webhookPayload ? JSON.parse(webhookPayload) : {}
        }
        break
      
      case 'cloud_storage':
        config.cloudConfig = {
          provider: cloudProvider,
          operation: cloudOperation,
          bucket: cloudBucket,
          key: cloudKey
        }
        break
      
      case 'data_transform':
        config.transformConfig = {
          type: transformType,
          script: transformScript
        }
        break
      
      case 'integration':
        config.integrationConfig = {
          service: integrationService,
          action: integrationAction
        }
        break
    }

    onUpdate(config)
  }

  return (
    <div className="space-y-6">
      {/* Action Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Action Type
        </h3>
        
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className="input-field"
        >
          <option value="api_call">🌐 API Call - HTTP requests</option>
          <option value="database">💾 Database - Query/Insert/Update</option>
          <option value="file_operation">📄 File Operation - Read/Write files</option>
          <option value="notification">🔔 Notification - Slack/Discord/Teams</option>
          <option value="email">✉️ Email - Send emails</option>
          <option value="webhook">🔗 Webhook - Call external webhook</option>
          <option value="cloud_storage">☁️ Cloud Storage - S3/GCS/Azure</option>
          <option value="data_transform">🛠️ Data Transform - Map/Filter/Reduce</option>
          <option value="integration">🔌 Integration - GitHub/Jira/etc</option>
          <option value="custom">✨ Custom - Custom logic</option>
        </select>
      </div>

      {/* API Call Configuration */}
      <AnimatePresence>
        {actionType === 'api_call' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              API Configuration
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              <select value={apiMethod} onChange={(e) => setApiMethod(e.target.value as any)} className="input-field">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="input-field col-span-2"
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            {(apiMethod === 'POST' || apiMethod === 'PUT' || apiMethod === 'PATCH') && (
              <textarea
                value={apiBody}
                onChange={(e) => setApiBody(e.target.value)}
                rows={4}
                className="input-field resize-none font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Authentication</label>
              <select value={authType} onChange={(e) => setAuthType(e.target.value as any)} className="input-field">
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="api_key">API Key</option>
                <option value="oauth">OAuth</option>
              </select>
              <input
                type="password"
                value={authCredentials}
                onChange={(e) => setAuthCredentials(e.target.value)}
                className="input-field"
                placeholder="Enter credentials"
              />
            </div>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Retry on failure</span>
                {retryEnabled && (
                  <input
                    type="number"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs rounded border"
                    min="1"
                    max="10"
                  />
                )}
              </div>
              <button
                onClick={() => setRetryEnabled(!retryEnabled)}
                className={`px-2 py-1 rounded text-xs ${retryEnabled ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {retryEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Configuration */}
      <AnimatePresence>
        {actionType === 'database' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database Configuration
            </h3>
            
            <select value={dbOperation} onChange={(e) => setDbOperation(e.target.value as any)} className="input-field">
              <option value="query">Query - SELECT</option>
              <option value="insert">Insert - INSERT</option>
              <option value="update">Update - UPDATE</option>
              <option value="delete">Delete - DELETE</option>
            </select>

            <input
              type="text"
              value={dbConnection}
              onChange={(e) => setDbConnection(e.target.value)}
              className="input-field"
              placeholder="Connection string or name"
            />

            <input
              type="text"
              value={dbTable}
              onChange={(e) => setDbTable(e.target.value)}
              className="input-field"
              placeholder="Table name"
            />

            <textarea
              value={dbQuery}
              onChange={(e) => setDbQuery(e.target.value)}
              rows={3}
              className="input-field resize-none font-mono text-sm"
              placeholder="SELECT * FROM users WHERE status = 'active'"
            />

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Use transaction</span>
              <button
                onClick={() => setDbTransaction(!dbTransaction)}
                className={`px-2 py-1 rounded text-xs ${dbTransaction ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {dbTransaction ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Operation Configuration */}
      <AnimatePresence>
        {actionType === 'file_operation' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              File Configuration
            </h3>
            
            <select value={fileOperation} onChange={(e) => setFileOperation(e.target.value as any)} className="input-field">
              <option value="read">Read</option>
              <option value="write">Write</option>
              <option value="append">Append</option>
              <option value="delete">Delete</option>
              <option value="upload">Upload</option>
              <option value="download">Download</option>
            </select>

            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="input-field"
              placeholder="/path/to/file.json"
            />

            <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)} className="input-field">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
              <option value="txt">Text</option>
              <option value="pdf">PDF</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Configuration */}
      <AnimatePresence>
        {actionType === 'notification' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Configuration
            </h3>
            
            <select value={notifService} onChange={(e) => setNotifService(e.target.value as any)} className="input-field">
              <option value="slack">Slack</option>
              <option value="discord">Discord</option>
              <option value="teams">Microsoft Teams</option>
              <option value="telegram">Telegram</option>
              <option value="push">Push Notification</option>
            </select>

            <input
              type="text"
              value={notifChannel}
              onChange={(e) => setNotifChannel(e.target.value)}
              className="input-field"
              placeholder="#channel or chat ID"
            />

            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Message to send"
            />

            <select value={notifPriority} onChange={(e) => setNotifPriority(e.target.value as any)} className="input-field">
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Configuration */}
      <AnimatePresence>
        {actionType === 'email' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Configuration
            </h3>
            
            <input
              type="text"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="input-field"
              placeholder="recipient@example.com, another@example.com"
            />

            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="input-field"
              placeholder="Email subject"
            />

            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={5}
              className="input-field resize-none"
              placeholder="Email body"
            />

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">HTML Email</span>
              <button
                onClick={() => setEmailHtml(!emailHtml)}
                className={`px-2 py-1 rounded text-xs ${emailHtml ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {emailHtml ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Storage Configuration */}
      <AnimatePresence>
        {actionType === 'cloud_storage' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Cloud Storage Configuration
            </h3>
            
            <select value={cloudProvider} onChange={(e) => setCloudProvider(e.target.value as any)} className="input-field">
              <option value="s3">Amazon S3</option>
              <option value="gcs">Google Cloud Storage</option>
              <option value="azure">Azure Blob Storage</option>
              <option value="dropbox">Dropbox</option>
            </select>

            <select value={cloudOperation} onChange={(e) => setCloudOperation(e.target.value as any)} className="input-field">
              <option value="upload">Upload</option>
              <option value="download">Download</option>
              <option value="delete">Delete</option>
              <option value="list">List Files</option>
            </select>

            <input
              type="text"
              value={cloudBucket}
              onChange={(e) => setCloudBucket(e.target.value)}
              className="input-field"
              placeholder="Bucket/Container name"
            />

            <input
              type="text"
              value={cloudKey}
              onChange={(e) => setCloudKey(e.target.value)}
              className="input-field"
              placeholder="Object key/path"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Handling */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Error Handling
        </h3>
        
        <select value={onError} onChange={(e) => setOnError(e.target.value as any)} className="input-field">
          <option value="fail">Fail - Stop workflow</option>
          <option value="continue">Continue - Proceed anyway</option>
          <option value="retry">Retry - Try again</option>
          <option value="fallback">Fallback - Use default value</option>
        </select>

        <div className="flex items-center justify-between p-2 glass rounded-lg">
          <span className="text-xs font-medium">Log errors</span>
          <button
            onClick={() => setLogErrors(!logErrors)}
            className={`px-2 py-1 rounded text-xs ${logErrors ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
          >
            {logErrors ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Execution Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Execution Settings
        </h3>

        <div className="flex items-center justify-between p-2 glass rounded-lg">
          <span className="text-xs font-medium">Async execution</span>
          <button
            onClick={() => setAsyncExecution(!asyncExecution)}
            className={`px-2 py-1 rounded text-xs ${asyncExecution ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
          >
            {asyncExecution ? 'ON' : 'OFF'}
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
            Timeout (seconds): {timeout}
          </label>
          <input
            type="range"
            min="5"
            max="300"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between p-2 glass rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Batch processing</span>
            {batchEnabled && (
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs rounded border"
                min="1"
                max="1000"
              />
            )}
          </div>
          <button
            onClick={() => setBatchEnabled(!batchEnabled)}
            className={`px-2 py-1 rounded text-xs ${batchEnabled ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
          >
            {batchEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn-primary w-full"
      >
        Apply Configuration
      </button>
    </div>
  )
}
