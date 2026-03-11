import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  FileSpreadsheet,
  FileBarChart,
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  FileJson,
  FileCode,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
} from 'lucide-react'
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

export default function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const [workflowName, setWorkflowName] = useState('workflow')

  useEffect(() => {
    // Load results from sessionStorage
    const resultsId = searchParams.get('id') || 'latest'
    const storedResult = sessionStorage.getItem(`autonomos-results-${resultsId}`)
    const storedName = sessionStorage.getItem(`autonomos-workflow-name-${resultsId}`)

    if (storedResult) {
      setResult(JSON.parse(storedResult))
      if (storedName) setWorkflowName(storedName)
    } else {
      toast.error('No results found', { icon: '⚠️' })
      navigate('/workflow')
    }
  }, [searchParams, navigate])

  const handleExport = async (format: string) => {
    if (!result) return

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

  const handleCopyAll = () => {
    if (!result) return

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

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!', { icon: '🔗' })
  }

  const handlePrint = () => {
    window.print()
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl font-semibold">Loading results...</div>
        </div>
      </div>
    )
  }

  const successCount = Object.values(result.results).filter(
    (r: any) => r.status === 'success'
  ).length
  const errorCount = Object.values(result.results).filter(
    (r: any) => r.status === 'error'
  ).length
  const totalNodes = Object.keys(result.results).length

  const exportButtons = [
    {
      id: 'pdf',
      label: 'Export PDF',
      icon: FileText,
      color: 'from-red-500 to-red-600',
      description: 'Professional report',
    },
    {
      id: 'word',
      label: 'Export Word',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      description: 'Editable document',
    },
    {
      id: 'excel',
      label: 'Export Excel',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-green-600',
      description: 'Data & charts',
    },
    {
      id: 'ppt',
      label: 'Export PowerPoint',
      icon: FileBarChart,
      color: 'from-orange-500 to-orange-600',
      description: 'Presentation',
    },
    {
      id: 'json',
      label: 'Export JSON',
      icon: FileJson,
      color: 'from-purple-500 to-purple-600',
      description: 'Raw data',
    },
    {
      id: 'csv',
      label: 'Export CSV',
      icon: FileSpreadsheet,
      color: 'from-teal-500 to-teal-600',
      description: 'Spreadsheet',
    },
    {
      id: 'markdown',
      label: 'Export Markdown',
      icon: FileCode,
      color: 'from-gray-500 to-gray-600',
      description: 'Documentation',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Header */}
      <div className="glass-strong border-b border-white/20 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/workflow')}
                className="btn-ghost p-2"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  🎯 Execution Results
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {workflowName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleCopyAll}
                className="btn-ghost"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">Copy</span>
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="btn-ghost"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-2">Share</span>
              </motion.button>
              <motion.button
                onClick={handlePrint}
                className="btn-ghost"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Printer className="w-4 h-4" />
                <span className="ml-2">Print</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Status Card */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
              {result.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div
              className={`text-2xl font-bold ${
                result.status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.status === 'success' ? 'Success' : 'Error'}
            </div>
          </div>

          {/* Total Nodes */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Total Nodes</span>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalNodes}</div>
          </div>

          {/* Success Count */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Successful</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
          </div>

          {/* Error Count */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Errors</span>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          </div>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/20 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Execution Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-500 dark:text-slate-400 mb-1">Provider</div>
              <div className="font-semibold">{result.provider}</div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 mb-1">Model</div>
              <div className="font-semibold text-xs">{result.model.split('/').pop()}</div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 mb-1">Timestamp</div>
              <div className="font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date().toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 mb-1">Workflow</div>
              <div className="font-semibold">{workflowName}</div>
            </div>
          </div>
        </motion.div>

        {/* Export Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportButtons.map((btn, index) => (
              <motion.button
                key={btn.id}
                onClick={() => handleExport(btn.id)}
                disabled={exporting !== null}
                className={`glass rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all relative overflow-hidden group ${
                  exporting === btn.id ? 'animate-pulse' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${btn.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <btn.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${btn.color} bg-clip-text text-transparent`} />
                  <div className="font-semibold mb-1">{btn.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{btn.description}</div>
                  {exporting === btn.id && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-4 right-4"
                    >
                      <Download className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Node Results</h2>
          <div className="space-y-4">
            {Object.entries(result.results).map(([nodeId, nodeResult]: [string, any], index) => (
              <motion.div
                key={nodeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{nodeId}</h3>
                      <span
                        className={`badge ${
                          nodeResult.status === 'success' ? 'badge-success' : 'badge-error'
                        }`}
                      >
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
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-green-500 rounded" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                        Output
                      </span>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                      {nodeResult.output}
                    </pre>
                  </div>
                )}

                {nodeResult.error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-red-500 rounded" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                        Error
                      </span>
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
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400 print:hidden">
        Generated by AutonomOS • {new Date().toLocaleString()}
      </div>
    </div>
  )
}
