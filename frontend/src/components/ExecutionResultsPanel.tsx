import { motion } from 'framer-motion'
import { X, FileText, FileSpreadsheet, FileBarChart, FileImage, Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { WorkflowExecutionResult } from '../services/api'
import {
  exportToPDF,
  exportToWord,
  exportToExcel,
  exportToPowerPoint,
  exportToJSON,
  exportToCSV,
  exportToMarkdown,
} from '../utils/export-advanced'

interface ExecutionResultsPanelProps {
  result: WorkflowExecutionResult
  workflowName?: string
  onClose: () => void
}

export default function ExecutionResultsPanel({
  result,
  workflowName = 'workflow',
  onClose,
}: ExecutionResultsPanelProps) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)

  const handleCopyAll = () => {
    const text = Object.entries(result.results)
      .map(([nodeId, res]: [string, any]) => {
        return `Node: ${nodeId}\nStatus: ${res.status}\n${res.output || res.error || ''}\n---\n`
      })
      .join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Results copied to clipboard!', { icon: '📋' })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = async (format: string) => {
    setExporting(format)
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(result, workflowName)
          break
        case 'word':
          await exportToWord(result, workflowName)
          break
        case 'excel':
          await exportToExcel(result, workflowName)
          break
        case 'ppt':
          await exportToPowerPoint(result, workflowName)
          break
        case 'json':
          exportToJSON(result, workflowName)
          break
        case 'csv':
          exportToCSV(result, workflowName)
          break
        case 'markdown':
          exportToMarkdown(result, workflowName)
          break
      }
      toast.success(
        <div>
          <div className="font-semibold">Exported successfully!</div>
          <div className="text-xs mt-1">Check your downloads folder</div>
        </div>,
        { icon: '📥', duration: 3000 }
      )
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`, { icon: '❌' })
    } finally {
      setExporting(null)
    }
  }

  const exportButtons = [
    { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-600', description: 'Professional report' },
    { id: 'word', label: 'Word', icon: FileText, color: 'text-blue-600', description: 'Editable document' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600', description: 'Data & charts' },
    { id: 'ppt', label: 'PowerPoint', icon: FileBarChart, color: 'text-orange-600', description: 'Presentation' },
    { id: 'json', label: 'JSON', icon: FileImage, color: 'text-purple-600', description: 'Raw data' },
    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, color: 'text-teal-600', description: 'Spreadsheet' },
    { id: 'markdown', label: 'Markdown', icon: FileText, color: 'text-gray-600', description: 'Documentation' },
  ]

  const successCount = Object.values(result.results).filter(
    (r: any) => r.status === 'success'
  ).length
  const errorCount = Object.values(result.results).filter(
    (r: any) => r.status === 'error'
  ).length

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 h-2/3 glass-strong border-t-2 border-white/30 shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="glass-strong border-b border-white/20 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                🎯 Execution Results
              </h2>
              <span className={`badge ${
                result.status === 'success' ? 'badge-success' : 'badge-error'
              }`}>
                {result.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Workflow:</span>
                <span className="font-semibold">{workflowName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Provider:</span>
                <span className="font-semibold">{result.provider}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Model:</span>
                <span className="font-semibold text-xs">{result.model.split('/').pop()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Nodes:</span>
                <span className="font-semibold">{result.nodes_executed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{successCount}</span>
                <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span>
                <span className="text-red-600 dark:text-red-400 font-semibold">{errorCount}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleCopyAll}
              className="btn-ghost p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </motion.button>
            <motion.button
              onClick={onClose}
              className="btn-ghost p-2"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {exportButtons.map((btn) => (
            <motion.button
              key={btn.id}
              onClick={() => handleExport(btn.id)}
              disabled={exporting !== null}
              className={`btn-ghost flex items-center gap-2 px-3 py-2 text-sm ${
                exporting === btn.id ? 'animate-pulse' : ''
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <btn.icon className={`w-4 h-4 ${btn.color}`} />
              <div className="text-left">
                <div className="font-semibold">{btn.label}</div>
                <div className="text-xs opacity-75">{btn.description}</div>
              </div>
              {exporting === btn.id && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="ml-2"
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {Object.entries(result.results).map(([nodeId, nodeResult]: [string, any], index) => (
            <motion.div
              key={nodeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{nodeId}</h3>
                    <span className={`badge ${
                      nodeResult.status === 'success' ? 'badge-success' : 'badge-error'
                    }`}>
                      {nodeResult.status}
                    </span>
                    {nodeResult.type && (
                      <span className="badge badge-secondary">{nodeResult.type}</span>
                    )}
                  </div>
                  {nodeResult.task && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      Task: {nodeResult.task}
                    </p>
                  )}
                </div>
              </div>

              {nodeResult.output && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Output</span>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                    {nodeResult.output}
                  </pre>
                </div>
              )}

              {nodeResult.error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Error</span>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap break-words font-mono text-red-700 dark:text-red-300">
                    {nodeResult.error}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
