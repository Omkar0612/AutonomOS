import { WorkflowExecutionResult } from '../services/api'
import { downloadFile, formatDate } from './helpers'

// Basic exports (existing)
export function exportToJSON(result: WorkflowExecutionResult, workflowName: string) {
  const json = JSON.stringify(result, null, 2)
  const filename = `${workflowName}_results_${Date.now()}.json`
  downloadFile(json, filename, 'application/json')
}

export function exportToCSV(result: WorkflowExecutionResult, workflowName: string) {
  const headers = ['Node ID', 'Type', 'Status', 'Task', 'Output/Error']
  const rows = Object.entries(result.results).map(([nodeId, res]: [string, any]) => [
    nodeId,
    res.type || 'unknown',
    res.status || 'unknown',
    res.task || 'N/A',
    res.error || res.output || 'N/A',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const filename = `${workflowName}_results_${Date.now()}.csv`
  downloadFile(csvContent, filename, 'text/csv')
}

export function exportToMarkdown(result: WorkflowExecutionResult, workflowName: string) {
  const timestamp = formatDate(new Date())
  let md = `# 🚀 ${workflowName} - Execution Results\n\n`
  md += `**Date:** ${timestamp}  \n`
  md += `**Provider:** ${result.provider}  \n`
  md += `**Model:** ${result.model}  \n`
  md += `**Status:** ${result.status}  \n`
  md += `**Nodes Executed:** ${result.nodes_executed}  \n\n`
  md += `---\n\n`

  Object.entries(result.results).forEach(([nodeId, res]: [string, any]) => {
    md += `## 📦 ${nodeId}\n\n`
    md += `- **Status:** ${res.status === 'success' ? '✅' : '❌'} ${res.status}\n`
    if (res.type) md += `- **Type:** ${res.type}\n`
    if (res.task) md += `- **Task:** ${res.task}\n`
    if (res.output) md += `\n**Output:**\n\`\`\`\n${res.output}\n\`\`\`\n`
    if (res.error) md += `\n**Error:**\n\`\`\`\n${res.error}\n\`\`\`\n`
    md += `\n---\n\n`
  })

  const filename = `${workflowName}_results_${Date.now()}.md`
  downloadFile(md, filename, 'text/markdown')
}

// ============================================================================
// PDF Export (using jsPDF)
// ============================================================================
export async function exportToPDF(result: WorkflowExecutionResult, workflowName: string) {
  // Dynamically import jsPDF to reduce bundle size
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPos = margin

  // Title
  doc.setFontSize(24)
  doc.setTextColor(139, 92, 246) // Primary purple
  doc.text('🚀 Workflow Execution Results', margin, yPos)
  yPos += 12

  // Metadata
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Workflow: ${workflowName}`, margin, yPos)
  yPos += 6
  doc.text(`Date: ${formatDate(new Date())}`, margin, yPos)
  yPos += 6
  doc.text(`Provider: ${result.provider} | Model: ${result.model}`, margin, yPos)
  yPos += 6
  doc.text(`Status: ${result.status} | Nodes: ${result.nodes_executed}`, margin, yPos)
  yPos += 12

  // Separator line
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Results
  Object.entries(result.results).forEach(([nodeId, res]: [string, any]) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = margin
    }

    // Node header
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`📦 ${nodeId}`, margin, yPos)
    yPos += 8

    // Status badge
    doc.setFontSize(10)
    if (res.status === 'success') {
      doc.setTextColor(16, 185, 129)
      doc.text('✅ SUCCESS', margin + 5, yPos)
    } else {
      doc.setTextColor(239, 68, 68)
      doc.text('❌ ERROR', margin + 5, yPos)
    }
    yPos += 8

    // Content
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    
    if (res.task) {
      doc.text(`Task: ${res.task}`, margin + 5, yPos)
      yPos += 6
    }

    if (res.output) {
      doc.text('Output:', margin + 5, yPos)
      yPos += 5
      const outputLines = doc.splitTextToSize(res.output, pageWidth - margin * 2 - 10)
      outputLines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }
        doc.text(line, margin + 10, yPos)
        yPos += 4
      })
    }

    if (res.error) {
      doc.setTextColor(220, 38, 38)
      doc.text('Error:', margin + 5, yPos)
      yPos += 5
      const errorLines = doc.splitTextToSize(res.error, pageWidth - margin * 2 - 10)
      errorLines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }
        doc.text(line, margin + 10, yPos)
        yPos += 4
      })
    }

    yPos += 10
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Generated by AutonomOS • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  const filename = `${workflowName}_results_${Date.now()}.pdf`
  doc.save(filename)
}

// ============================================================================
// Word Export (using docx)
// ============================================================================
export async function exportToWord(result: WorkflowExecutionResult, workflowName: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')
  const { saveAs } = await import('file-saver')

  const children: any[] = [
    // Title
    new Paragraph({
      text: '🚀 Workflow Execution Results',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    // Metadata
    new Paragraph({
      children: [
        new TextRun({ text: 'Workflow: ', bold: true }),
        new TextRun({ text: workflowName }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Date: ', bold: true }),
        new TextRun({ text: formatDate(new Date()) }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Provider: ', bold: true }),
        new TextRun({ text: `${result.provider} | Model: ${result.model}` }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Status: ', bold: true }),
        new TextRun({ text: `${result.status} | Nodes: ${result.nodes_executed}` }),
      ],
      spacing: { after: 400 },
    }),
  ]

  // Results
  Object.entries(result.results).forEach(([nodeId, res]: [string, any]) => {
    children.push(
      new Paragraph({
        text: `📦 ${nodeId}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
      })
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Status: ', bold: true }),
          new TextRun({
            text: res.status === 'success' ? '✅ SUCCESS' : '❌ ERROR',
            color: res.status === 'success' ? '10B981' : 'EF4444',
            bold: true,
          }),
        ],
        spacing: { after: 100 },
      })
    )

    if (res.task) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Task: ', bold: true }),
            new TextRun({ text: res.task }),
          ],
          spacing: { after: 100 },
        })
      )
    }

    if (res.output) {
      children.push(
        new Paragraph({
          text: 'Output:',
          bold: true,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: res.output,
          spacing: { after: 200 },
        })
      )
    }

    if (res.error) {
      children.push(
        new Paragraph({
          text: 'Error:',
          bold: true,
          color: 'DC2626',
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: res.error,
          color: 'DC2626',
          spacing: { after: 200 },
        })
      )
    }
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `${workflowName}_results_${Date.now()}.docx`
  saveAs(blob, filename)
}

// ============================================================================
// Excel Export (using exceljs)
// ============================================================================
export async function exportToExcel(result: WorkflowExecutionResult, workflowName: string) {
  const ExcelJS = await import('exceljs')
  const { saveAs } = await import('file-saver')

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'AutonomOS'
  workbook.created = new Date()

  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary', {
    views: [{ showGridLines: false }],
  })

  summarySheet.columns = [
    { header: 'Property', key: 'property', width: 20 },
    { header: 'Value', key: 'value', width: 50 },
  ]

  summarySheet.addRows([
    { property: 'Workflow', value: workflowName },
    { property: 'Date', value: formatDate(new Date()) },
    { property: 'Provider', value: result.provider },
    { property: 'Model', value: result.model },
    { property: 'Status', value: result.status },
    { property: 'Nodes Executed', value: result.nodes_executed },
  ])

  // Style header
  summarySheet.getRow(1).font = { bold: true, size: 12 }
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B5CF6' },
  }

  // Results Sheet
  const resultsSheet = workbook.addWorksheet('Results')
  resultsSheet.columns = [
    { header: 'Node ID', key: 'nodeId', width: 20 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Task', key: 'task', width: 30 },
    { header: 'Output', key: 'output', width: 60 },
    { header: 'Error', key: 'error', width: 60 },
  ]

  Object.entries(result.results).forEach(([nodeId, res]: [string, any]) => {
    resultsSheet.addRow({
      nodeId,
      type: res.type || 'N/A',
      status: res.status || 'N/A',
      task: res.task || 'N/A',
      output: res.output || '',
      error: res.error || '',
    })
  })

  // Style header
  resultsSheet.getRow(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } }
  resultsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B5CF6' },
  }

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const filename = `${workflowName}_results_${Date.now()}.xlsx`
  saveAs(blob, filename)
}

// ============================================================================
// PowerPoint Export (using pptxgenjs)
// ============================================================================
export async function exportToPowerPoint(result: WorkflowExecutionResult, workflowName: string) {
  const pptxgen = (await import('pptxgenjs')).default
  const pres = new pptxgen()

  // Title Slide
  const titleSlide = pres.addSlide()
  titleSlide.background = { color: '8B5CF6' }
  titleSlide.addText('🚀 Workflow Results', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  })
  titleSlide.addText(workflowName, {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: 'FFFFFF',
    align: 'center',
  })

  // Summary Slide
  const summarySlide = pres.addSlide()
  summarySlide.addText('📊 Execution Summary', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '8B5CF6',
  })

  const summaryData = [
    ['Property', 'Value'],
    ['Date', formatDate(new Date())],
    ['Provider', result.provider],
    ['Model', result.model],
    ['Status', result.status],
    ['Nodes Executed', result.nodes_executed.toString()],
  ]

  summarySlide.addTable(summaryData, {
    x: 1.5,
    y: 1.5,
    w: 7,
    h: 3,
    fontSize: 14,
    color: '000000',
    fill: { color: 'F3F4F6' },
    border: { pt: 1, color: 'D1D5DB' },
  })

  // Result Slides (one per node)
  Object.entries(result.results).forEach(([nodeId, res]: [string, any]) => {
    const slide = pres.addSlide()
    slide.addText(`📦 ${nodeId}`, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: '8B5CF6',
    })

    slide.addText(`Status: ${res.status === 'success' ? '✅' : '❌'} ${res.status}`, {
      x: 0.5,
      y: 1.3,
      w: 9,
      h: 0.4,
      fontSize: 16,
      color: res.status === 'success' ? '10B981' : 'EF4444',
      bold: true,
    })

    let yPos = 2.0

    if (res.task) {
      slide.addText(`Task: ${res.task}`, {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 0.4,
        fontSize: 12,
        color: '4B5563',
      })
      yPos += 0.6
    }

    if (res.output) {
      slide.addText('Output:', {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: '000000',
      })
      yPos += 0.4
      slide.addText(res.output.substring(0, 500), {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 2,
        fontSize: 10,
        color: '374151',
        valign: 'top',
      })
    }

    if (res.error) {
      slide.addText('Error:', {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: 'DC2626',
      })
      yPos += 0.4
      slide.addText(res.error.substring(0, 500), {
        x: 0.5,
        y: yPos,
        w: 9,
        h: 2,
        fontSize: 10,
        color: 'DC2626',
        valign: 'top',
      })
    }
  })

  const filename = `${workflowName}_results_${Date.now()}.pptx`
  await pres.writeFile({ fileName: filename })
}
