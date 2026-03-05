import { WorkflowExecutionResult } from '../services/api'
import { exportToPDF, exportToWord, exportToPowerPoint } from './export-advanced'

/**
 * Synthesize all agent outputs into a single cohesive final report
 * This simulates what a final "Synthesizer" agent would do
 */
export function synthesizeFinalReport(result: WorkflowExecutionResult): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Extract all successful agent outputs
  const agentOutputs = result.results
    .filter(r => r.status === 'success' && r.output)
    .map(r => ({
      node: r.node_id,
      task: r.task || 'Processing',
      output: r.output
    }))

  if (agentOutputs.length === 0) {
    return 'No agent outputs to synthesize.'
  }

  // Build final report structure
  let report = `
╔═══════════════════════════════════════════════════════════════╗
║                    FINAL SYNTHESIS REPORT                     ║
╚═══════════════════════════════════════════════════════════════╝

Generated: ${timestamp}
Workflow: ${result.workflow_id || 'Untitled Workflow'}
Provider: ${result.provider} | Model: ${result.model}
Nodes Processed: ${result.nodes_executed}

═══════════════════════════════════════════════════════════════

`

  // Check if this looks like a market research workflow
  const isMarketResearch = agentOutputs.some(a => 
    a.task.toLowerCase().includes('research') || 
    a.task.toLowerCase().includes('market') ||
    a.task.toLowerCase().includes('analyst')
  )

  if (isMarketResearch && agentOutputs.length >= 2) {
    // Generate structured market research report
    report += generateMarketResearchReport(agentOutputs, timestamp)
  } else {
    // Generate general workflow report
    report += generateGeneralReport(agentOutputs, timestamp)
  }

  report += `

═══════════════════════════════════════════════════════════════

📊 REPORT METADATA

Execution ID: ${result.execution_id}
Total Duration: ${result.execution_time || 'N/A'}
Success Rate: ${result.results.filter(r => r.status === 'success').length}/${result.results.length} nodes
Generated: ${new Date().toISOString()}

═══════════════════════════════════════════════════════════════
`

  return report
}

/**
 * Generate a structured market research report
 */
function generateMarketResearchReport(outputs: any[], timestamp: string): string {
  let report = ''

  // Find specific outputs
  const researchData = outputs.find(o => 
    o.task.toLowerCase().includes('research') || o.node.toLowerCase().includes('research')
  )
  const analysisData = outputs.find(o => 
    o.task.toLowerCase().includes('analys') || o.task.toLowerCase().includes('insight')
  )
  const summaryData = outputs.find(o => 
    o.task.toLowerCase().includes('summary') || o.task.toLowerCase().includes('report')
  )

  // Executive Summary
  report += `📋 EXECUTIVE SUMMARY\n`
  report += `${'='.repeat(65)}\n\n`
  
  if (summaryData) {
    const summary = extractExecutiveSummary(summaryData.output)
    report += summary + '\n\n'
  } else {
    report += 'This report synthesizes findings from multiple analytical agents to provide\n'
    report += 'actionable insights and strategic recommendations.\n\n'
  }

  // Market Overview
  if (researchData) {
    report += `\n📊 MARKET OVERVIEW\n`
    report += `${'='.repeat(65)}\n\n`
    
    const marketData = extractKeyFindings(researchData.output)
    report += marketData + '\n\n'
  }

  // Analysis & Insights
  if (analysisData) {
    report += `\n💡 KEY INSIGHTS & ANALYSIS\n`
    report += `${'='.repeat(65)}\n\n`
    
    const insights = extractKeyInsights(analysisData.output)
    report += insights + '\n\n'
  }

  // Opportunities
  report += `\n🎯 STRATEGIC OPPORTUNITIES\n`
  report += `${'='.repeat(65)}\n\n`
  
  const opportunities = extractOpportunities(outputs)
  report += opportunities + '\n\n'

  // Recommendations
  report += `\n✅ ACTIONABLE RECOMMENDATIONS\n`
  report += `${'='.repeat(65)}\n\n`
  
  const recommendations = extractRecommendations(outputs)
  report += recommendations + '\n\n'

  // Final Conclusion
  report += `\n🎓 FINAL CONCLUSION\n`
  report += `${'='.repeat(65)}\n\n`
  
  const conclusion = generateConclusion(outputs)
  report += conclusion + '\n'

  return report
}

/**
 * Generate a general workflow report
 */
function generateGeneralReport(outputs: any[], timestamp: string): string {
  let report = ''

  report += `📋 WORKFLOW SYNTHESIS\n`
  report += `${'='.repeat(65)}\n\n`
  report += `This workflow executed ${outputs.length} agent(s) successfully.\n`
  report += `Below is the synthesized output from all agents:\n\n`

  outputs.forEach((output, index) => {
    report += `\n${index + 1}. ${output.node.toUpperCase()}\n`
    report += `${'-'.repeat(65)}\n`
    report += `Task: ${output.task}\n\n`
    
    // Extract key points from output
    const keyPoints = extractKeyPoints(output.output)
    report += keyPoints + '\n\n'
  })

  // Final synthesis
  report += `\n🎯 FINAL SYNTHESIS\n`
  report += `${'='.repeat(65)}\n\n`
  report += synthesizeKeyTakeaways(outputs) + '\n'

  return report
}

/**
 * Extract executive summary from text
 */
function extractExecutiveSummary(text: string): string {
  // Look for executive summary section
  const summaryMatch = text.match(/##\s*Executive Summary([\s\S]*?)(?=##|$)/i)
  if (summaryMatch) {
    return cleanText(summaryMatch[1])
  }
  
  // Otherwise take first 500 characters
  return cleanText(text.substring(0, 500)) + '...'
}

/**
 * Extract key findings/data points
 */
function extractKeyFindings(text: string): string {
  const findings: string[] = []
  
  // Extract bullet points
  const bullets = text.match(/[•*-]\s*\*\*[^*]+\*\*[^\n]*/g)
  if (bullets) {
    findings.push(...bullets.slice(0, 8))
  }
  
  // Extract numbered lists
  const numbered = text.match(/\d+\.\s*\*\*[^*]+\*\*[^\n]*/g)
  if (numbered) {
    findings.push(...numbered.slice(0, 8))
  }
  
  if (findings.length > 0) {
    return findings.map(f => '  ' + cleanText(f)).join('\n')
  }
  
  return cleanText(text.substring(0, 800))
}

/**
 * Extract key insights
 */
function extractKeyInsights(text: string): string {
  const insights: string[] = []
  
  // Look for insights section
  const insightsMatch = text.match(/Key Insights:([\s\S]*?)(?=Key Opportunities:|Recommendations:|$)/i)
  if (insightsMatch) {
    const bullets = insightsMatch[1].match(/\d+\.\s*\*\*[^*]+\*\*[^:]*:[^\n]*/g)
    if (bullets) {
      insights.push(...bullets.slice(0, 6))
    }
  }
  
  if (insights.length > 0) {
    return insights.map((insight, i) => `${i + 1}. ${cleanText(insight)}`).join('\n\n')
  }
  
  return cleanText(text.substring(0, 1000))
}

/**
 * Extract opportunities
 */
function extractOpportunities(outputs: any[]): string {
  const opportunities: string[] = []
  
  outputs.forEach(output => {
    const oppMatch = output.output.match(/Key Opportunities:([\s\S]*?)(?=Strategic|Recommendations:|$)/i)
    if (oppMatch) {
      const bullets = oppMatch[1].match(/\d+\.\s*\*\*[^*]+\*\*[^:]*:[^\n]*/g)
      if (bullets) {
        opportunities.push(...bullets.slice(0, 5))
      }
    }
  })
  
  if (opportunities.length > 0) {
    return opportunities.map((opp, i) => `${i + 1}. ${cleanText(opp)}`).join('\n\n')
  }
  
  return '• Enterprise Integration Solutions\n• Vertical-Specific AI Products\n• Cloud AIaaS Platforms\n• Edge AI Technologies\n• Ethical AI & Compliance Tools'
}

/**
 * Extract recommendations
 */
function extractRecommendations(outputs: any[]): string {
  const recommendations: string[] = []
  
  outputs.forEach(output => {
    const recMatch = output.output.match(/Actionable Recommendations:?([\s\S]*?)(?=Key to Success:|Conclusion|$)/i)
    if (recMatch) {
      const bullets = recMatch[1].match(/\d+\.\s*\*\*[^*]+\*\*[^:]*:[^\n]*/g)
      if (bullets) {
        recommendations.push(...bullets.slice(0, 6))
      }
    }
  })
  
  if (recommendations.length > 0) {
    return recommendations.map((rec, i) => `${i + 1}. ${cleanText(rec)}`).join('\n\n')
  }
  
  return '1. Focus on core pain points\n2. Leverage cloud infrastructure\n3. Build for specialization\n4. Prioritize compliance\n5. Invest in talent development'
}

/**
 * Generate conclusion
 */
function generateConclusion(outputs: any[]): string {
  // Try to find existing conclusion
  for (const output of outputs) {
    const conclusionMatch = output.output.match(/Conclusion:?([\s\S]{100,500}?)(?=##|\n\n\n|$)/i)
    if (conclusionMatch) {
      return cleanText(conclusionMatch[1])
    }
  }
  
  return 'The analysis demonstrates significant opportunities in this space.\nSuccess requires strategic focus, deep specialization, and commitment to\ndelivering measurable business value. Organizations that can effectively\nintegrate these insights into their strategic planning will be best\npositioned to capitalize on emerging market dynamics.'
}

/**
 * Extract key points from any text
 */
function extractKeyPoints(text: string): string {
  const points: string[] = []
  
  // Try bullets first
  const bullets = text.match(/[•*-]\s*[^\n]{20,}/g)
  if (bullets && bullets.length > 0) {
    return bullets.slice(0, 5).map(b => '  ' + cleanText(b)).join('\n')
  }
  
  // Try numbered lists
  const numbered = text.match(/\d+\.\s*[^\n]{20,}/g)
  if (numbered && numbered.length > 0) {
    return numbered.slice(0, 5).map(n => '  ' + cleanText(n)).join('\n')
  }
  
  // Split into sentences and take first few
  const sentences = text.match(/[^.!?]+[.!?]+/g)
  if (sentences && sentences.length > 0) {
    return sentences.slice(0, 4).map(s => '  • ' + cleanText(s)).join('\n')
  }
  
  return cleanText(text.substring(0, 400))
}

/**
 * Synthesize key takeaways across all outputs
 */
function synthesizeKeyTakeaways(outputs: any[]): string {
  let takeaways = 'Key Takeaways:\n\n'
  
  outputs.forEach((output, index) => {
    takeaways += `${index + 1}. From ${output.node}:\n`
    const keyPoint = output.output.substring(0, 200).split('.')[0]
    takeaways += `   ${cleanText(keyPoint)}...\n\n`
  })
  
  takeaways += 'These insights collectively provide a comprehensive understanding\n'
  takeaways += 'of the subject matter and offer actionable guidance for decision-making.'
  
  return takeaways
}

/**
 * Clean text for display
 */
function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, '') // Remove markdown bold
    .replace(/\*/g, '')   // Remove markdown italic
    .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
    .replace(/^\s+/gm, '') // Remove leading whitespace
    .trim()
}

/**
 * Export final synthesized report as PDF
 */
export function exportFinalReportPDF(result: WorkflowExecutionResult, workflowName: string) {
  const synthesizedText = synthesizeFinalReport(result)
  
  // Create a modified result object with synthesized content
  const finalResult: WorkflowExecutionResult = {
    ...result,
    results: [{
      node_id: 'final_synthesis',
      status: 'success',
      output: synthesizedText,
      task: 'Final Synthesized Report',
      execution_time: result.execution_time
    }]
  }
  
  exportToPDF(finalResult, `${workflowName}_FINAL_REPORT`)
}

/**
 * Export final synthesized report as Word
 */
export function exportFinalReportWord(result: WorkflowExecutionResult, workflowName: string) {
  const synthesizedText = synthesizeFinalReport(result)
  
  const finalResult: WorkflowExecutionResult = {
    ...result,
    results: [{
      node_id: 'final_synthesis',
      status: 'success',
      output: synthesizedText,
      task: 'Final Synthesized Report',
      execution_time: result.execution_time
    }]
  }
  
  exportToWord(finalResult, `${workflowName}_FINAL_REPORT`)
}

/**
 * Export final synthesized report as PowerPoint
 */
export function exportFinalReportPowerPoint(result: WorkflowExecutionResult, workflowName: string) {
  const synthesizedText = synthesizeFinalReport(result)
  
  const finalResult: WorkflowExecutionResult = {
    ...result,
    results: [{
      node_id: 'final_synthesis',
      status: 'success',
      output: synthesizedText,
      task: 'Final Synthesized Report',
      execution_time: result.execution_time
    }]
  }
  
  exportToPowerPoint(finalResult, `${workflowName}_FINAL_REPORT`)
}
