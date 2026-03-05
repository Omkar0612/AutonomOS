import { WorkflowNode, WorkflowEdge, WorkflowExecutionResult } from '../services/api'
import { downloadFile, formatDate } from './helpers'

/**
 * Export workflow as JSON
 */
export function exportWorkflowJSON(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name: string = 'workflow'
): void {
  const workflow = {
    name,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    nodes,
    edges,
  }

  const json = JSON.stringify(workflow, null, 2)
  const filename = `${name}_${Date.now()}.json`
  downloadFile(json, filename, 'application/json')
}

/**
 * Export execution results as JSON
 */
export function exportResultsJSON(
  results: WorkflowExecutionResult,
  workflowName: string = 'workflow'
): void {
  const json = JSON.stringify(results, null, 2)
  const filename = `${workflowName}_results_${Date.now()}.json`
  downloadFile(json, filename, 'application/json')
}

/**
 * Export execution results as CSV
 */
export function exportResultsCSV(
  results: WorkflowExecutionResult,
  workflowName: string = 'workflow'
): void {
  // CSV Headers
  const headers = ['Node ID', 'Type', 'Status', 'Output/Error']
  
  // CSV Rows
  const rows = Object.entries(results.results).map(([nodeId, result]: [string, any]) => [
    nodeId,
    result.type || 'unknown',
    result.status || 'unknown',
    result.error || result.output || 'N/A',
  ])

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // Escape commas and quotes
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(',')
    ),
  ].join('\n')

  const filename = `${workflowName}_results_${Date.now()}.csv`
  downloadFile(csvContent, filename, 'text/csv')
}

/**
 * Export execution results as Markdown
 */
export function exportResultsMarkdown(
  results: WorkflowExecutionResult,
  workflowName: string = 'workflow'
): void {
  const timestamp = formatDate(new Date())
  
  let markdown = `# Workflow Execution Results\n\n`
  markdown += `**Workflow:** ${workflowName}\n`
  markdown += `**Date:** ${timestamp}\n`
  markdown += `**Provider:** ${results.provider}\n`
  markdown += `**Model:** ${results.model}\n`
  markdown += `**Status:** ${results.status}\n`
  markdown += `**Nodes Executed:** ${results.nodes_executed}\n\n`
  markdown += `---\n\n`

  // Add results for each node
  markdown += `## Results\n\n`
  
  Object.entries(results.results).forEach(([nodeId, result]: [string, any]) => {
    markdown += `### Node: ${nodeId}\n\n`
    markdown += `- **Type:** ${result.type || 'unknown'}\n`
    markdown += `- **Status:** ${result.status || 'unknown'}\n`
    
    if (result.task) {
      markdown += `- **Task:** ${result.task}\n`
    }
    
    if (result.output) {
      markdown += `\n**Output:**\n\n`
      markdown += `\`\`\`\n${result.output}\n\`\`\`\n\n`
    }
    
    if (result.error) {
      markdown += `\n**Error:**\n\n`
      markdown += `\`\`\`\n${result.error}\n\`\`\`\n\n`
    }
    
    markdown += `---\n\n`
  })

  const filename = `${workflowName}_results_${Date.now()}.md`
  downloadFile(markdown, filename, 'text/markdown')
}

/**
 * Export execution results as HTML (for PDF printing)
 */
export function exportResultsHTML(
  results: WorkflowExecutionResult,
  workflowName: string = 'workflow'
): void {
  const timestamp = formatDate(new Date())
  
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Workflow Results - ${workflowName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 { color: #8b5cf6; border-bottom: 3px solid #8b5cf6; padding-bottom: 10px; }
    h2 { color: #6d28d9; margin-top: 30px; }
    h3 { color: #5b21b6; }
    .meta { 
      background: #f3f4f6; 
      padding: 15px; 
      border-radius: 8px; 
      margin: 20px 0;
    }
    .meta p { margin: 5px 0; }
    .node-result {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .status-success { color: #10b981; font-weight: bold; }
    .status-error { color: #ef4444; font-weight: bold; }
    .output-box {
      background: #f9fafb;
      border-left: 4px solid #8b5cf6;
      padding: 15px;
      margin: 10px 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .error-box {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 10px 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  <h1>🚀 Workflow Execution Results</h1>
  
  <div class="meta">
    <p><strong>Workflow:</strong> ${workflowName}</p>
    <p><strong>Date:</strong> ${timestamp}</p>
    <p><strong>Provider:</strong> ${results.provider}</p>
    <p><strong>Model:</strong> ${results.model}</p>
    <p><strong>Status:</strong> <span class="status-${results.status}">${results.status}</span></p>
    <p><strong>Nodes Executed:</strong> ${results.nodes_executed}</p>
  </div>

  <h2>📊 Results</h2>
`

  Object.entries(results.results).forEach(([nodeId, result]: [string, any]) => {
    const statusClass = result.status === 'success' ? 'status-success' : 'status-error'
    
    html += `
  <div class="node-result">
    <h3>Node: ${nodeId}</h3>
    <p><strong>Type:</strong> ${result.type || 'unknown'}</p>
    <p><strong>Status:</strong> <span class="${statusClass}">${result.status || 'unknown'}</span></p>
`

    if (result.task) {
      html += `    <p><strong>Task:</strong> ${result.task}</p>\n`
    }

    if (result.output) {
      html += `
    <p><strong>Output:</strong></p>
    <div class="output-box">${escapeHtml(result.output)}</div>
`
    }

    if (result.error) {
      html += `
    <p><strong>Error:</strong></p>
    <div class="error-box">${escapeHtml(result.error)}</div>
`
    }

    html += `  </div>\n`
  })

  html += `
  <hr>
  <p style="text-align: center; color: #9ca3af; margin-top: 40px;">
    Generated by AutonomOS • ${timestamp}
  </p>
</body>
</html>`

  const filename = `${workflowName}_results_${Date.now()}.html`
  downloadFile(html, filename, 'text/html')
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Export with format selection
 */
export function exportResults(
  results: WorkflowExecutionResult,
  format: 'json' | 'csv' | 'markdown' | 'html',
  workflowName: string = 'workflow'
): void {
  switch (format) {
    case 'json':
      exportResultsJSON(results, workflowName)
      break
    case 'csv':
      exportResultsCSV(results, workflowName)
      break
    case 'markdown':
      exportResultsMarkdown(results, workflowName)
      break
    case 'html':
      exportResultsHTML(results, workflowName)
      break
    default:
      throw new Error(`Unknown format: ${format}`)
  }
}
