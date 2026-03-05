import { motion } from 'framer-motion'
import { X, Copy, FileText, FileSpreadsheet, File, FileJson, Table, Sparkles } from 'lucide-react'
import { WorkflowExecutionResult } from '../services/api'
import toast from 'react-hot-toast'
import {
  exportToPDF,
  exportToWord,
  exportToExcel,
  exportToPowerPoint,
  exportToJSON,
  exportToCSV,
  exportToMarkdown
} from '../utils/export-advanced'
import { 
  exportFinalReportPDF,
  exportFinalReportWord,
  exportFinalReportPowerPoint,
  synthesizeFinalReport
} from '../utils/enhanced-export'
import { useState } from 'react'

interface ExecutionResultsPanelProps {
  result: WorkflowExecutionResult
  workflowName: string
  onClose: () => void
}

export default function ExecutionResultsPanel({ result, workflowName, onClose }: ExecutionResultsPanelProps) {
  const [showFinalReport, setShowFinalReport] = useState(false)
  const [finalReportText, setFinalReportText] = useState('')

  const handleCopyAll = () => {
    const allResults = result.results
      .map(r => `${r.node_id}:\n${r.output || r.error || 'No output'}\n`)
      .join('\n---\n\n')
    
    navigator.clipboard.writeText(allResults)
    toast.success('All results copied to clipboard!', { icon: '📋' })
  }

  const handleViewFinalReport = () => {
    const synthesized = synthesizeFinalReport(result)
    setFinalReportText(synthesized)
    setShowFinalReport(true)
    toast.success('Final report synthesized!', { icon: '✨' })
  }

  const handleExportFinalPDF = () => {
    exportFinalReportPDF(result, workflowName)
    toast.success('Final report exported as PDF!', { icon: '📄' })
  }

  const handleExportFinalWord = () => {
    exportFinalReportWord(result, workflowName)
    toast.success('Final report exported as Word!', { icon: '📝' })
  }

  const handleExportFinalPPT = () => {
    exportFinalReportPowerPoint(result, workflowName)
    toast.success('Final report exported as PowerPoint!', { icon: '📊' })
  }

  const successCount = result.results.filter(r => r.status === 'success').length
  const errorCount = result.results.filter(r => r.status === 'error').length

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 h-2/3 glass-strong border-t border-white/20 shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold mb-1">🚀 Execution Results</h2>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>✅ {successCount} Success</span>
            {errorCount > 0 && <span className="text-red-600">❌ {errorCount} Errors</span>}
            <span>⚡ {result.execution_time || 'N/A'}</span>
            <span>🤖 {result.provider} - {result.model?.split('/').pop() || 'Unknown'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCopyAll}
            className="btn-ghost text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </motion.button>
          <motion.button
            onClick={onClose}
            className="btn-ghost text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-4 border-b border-white/10 bg-white/5">
        {/* Final Report Button (NEW!) */}
        <motion.button
          onClick={handleViewFinalReport}
          className="btn-primary flex items-center gap-2 text-sm glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-4 h-4" />
          Final Report
        </motion.button>

        <div className="h-6 w-px bg-white/20 mx-1" />

        {/* Individual Exports */}
        <motion.button
          onClick={() => { exportToPDF(result, workflowName); toast.success('Exported as PDF!', { icon: '📄' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="w-4 h-4" />
          PDF
        </motion.button>

        <motion.button
          onClick={() => { exportToWord(result, workflowName); toast.success('Exported as Word!', { icon: '📝' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <File className="w-4 h-4" />
          Word
        </motion.button>

        <motion.button
          onClick={() => { exportToExcel(result, workflowName); toast.success('Exported as Excel!', { icon: '📊' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Excel
        </motion.button>

        <motion.button
          onClick={() => { exportToPowerPoint(result, workflowName); toast.success('Exported as PowerPoint!', { icon: '📊' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileSpreadsheet className="w-4 h-4" />
          PowerPoint
        </motion.button>

        <motion.button
          onClick={() => { exportToJSON(result, workflowName); toast.success('Exported as JSON!', { icon: '🔧' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileJson className="w-4 h-4" />
          JSON
        </motion.button>

        <motion.button
          onClick={() => { exportToCSV(result, workflowName); toast.success('Exported as CSV!', { icon: '📉' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Table className="w-4 h-4" />
          CSV
        </motion.button>

        <motion.button
          onClick={() => { exportToMarkdown(result, workflowName); toast.success('Exported as Markdown!', { icon: '📋' }) }}
          className="btn-secondary flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="w-4 h-4" />
          Markdown
        </motion.button>
      </div>

      {/* Final Report Export Buttons (shown when viewing final report) */}
      {showFinalReport && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/10"
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium">Export Final Report:</span>
          <button onClick={handleExportFinalPDF} className="btn-ghost text-xs py-1 px-3">
            📄 PDF
          </button>
          <button onClick={handleExportFinalWord} className="btn-ghost text-xs py-1 px-3">
            📝 Word
          </button>
          <button onClick={handleExportFinalPPT} className="btn-ghost text-xs py-1 px-3">
            📊 PowerPoint
          </button>
        </motion.div>
      )}

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {showFinalReport ? (
          /* Final Synthesized Report View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Final Synthesized Report
              </h3>
              <button
                onClick={() => setShowFinalReport(false)}
                className="btn-ghost text-sm"
              >
                View Individual Outputs
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg overflow-x-auto">
              {finalReportText}
            </pre>
          </motion.div>
        ) : (
          /* Individual Agent Outputs */
          result.results.map((r, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">📦 {r.node_id}</h3>
                    <span className={`badge ${
                      r.status === 'success' ? 'badge-success' :
                      r.status === 'error' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {r.status === 'success' ? '✅ SUCCESS' : r.status === 'error' ? '❌ ERROR' : '⏳ PENDING'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800">
                      {r.node_id.split('-')[0]}
                    </span>
                  </div>
                  {r.task && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Task:</strong> {r.task}
                    </p>
                  )}
                </div>
                {r.execution_time && (
                  <span className="text-xs text-slate-500">⚡ {r.execution_time}</span>
                )}
              </div>

              {r.output && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">OUTPUT:</p>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {r.output}
                  </div>
                </div>
              )}

              {r.error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">ERROR:</p>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    {r.error}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
