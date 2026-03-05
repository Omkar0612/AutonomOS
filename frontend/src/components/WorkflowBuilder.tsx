import { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Save, Trash2, Sparkles, Settings as SettingsIcon, FileJson, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import Sidebar from './Sidebar'
import NodePanel from './NodePanel'
import TemplatesPanel from './TemplatesPanel'
import ExecutionResultsPanel from './ExecutionResultsPanel'
import { TriggerNode, AgentNode, ActionNode, LogicNode } from './nodes'
import { apiService, WorkflowExecutionResult } from '../services/api'
import { useApiKeys } from '../contexts/ApiKeyContext'
import { useExecutionHistory } from '../contexts/ExecutionHistoryContext'
import { exportWorkflowJSON } from '../utils/export'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Demo mode: Generate mock results
function generateDemoResults(nodes: Node[]): WorkflowExecutionResult {
  const demoOutputs: any[] = nodes.map((node, index) => ({
    node_id: node.id,
    status: 'success',
    task: node.data.label || `Task ${index + 1}`,
    output: generateDemoOutput(node.type || 'agent', node.data.label || node.id),
    execution_time: `${(Math.random() * 3 + 0.5).toFixed(2)}s`
  }))

  return {
    execution_id: `demo_${Date.now()}`,
    status: 'completed',
    nodes_executed: nodes.length,
    results: demoOutputs,
    workflow_id: 'demo_workflow',
    provider: 'demo',
    model: 'demo-model',
    execution_time: `${(nodes.length * 1.5).toFixed(2)}s`
  }
}

function generateDemoOutput(nodeType: string, label: string): string {
  const outputs: Record<string, string[]> = {
    agent: [
      `**Market Research Analysis**\n\nKey Findings:\n• Market size: $42.5B (2024)\n• Growth rate: 23.4% CAGR\n• Primary drivers: AI adoption, automation demand\n• Key players: Microsoft, Google, OpenAI\n\nOpportunities:\n1. Enterprise integration solutions\n2. Vertical-specific AI products\n3. Edge AI deployment\n\nRecommendations:\n- Focus on compliance & security\n- Build for scalability\n- Partner with cloud providers`,
      `**Competitive Analysis Report**\n\nTop Competitors:\n1. **Company A** - Market leader, 35% share\n2. **Company B** - Fast growing, innovative\n3. **Company C** - Enterprise focused\n\nStrengths:\n• Strong brand recognition\n• Extensive partner network\n• Proven track record\n\nWeaknesses:\n• Higher pricing\n• Limited customization\n• Slower innovation cycles\n\nStrategic Recommendations:\n- Differentiate through specialization\n- Compete on customer experience\n- Leverage agile development`,
      `**Technology Assessment**\n\nCurrent Stack Analysis:\n• Frontend: React, TypeScript\n• Backend: Python, FastAPI\n• Database: PostgreSQL, Redis\n• Infrastructure: AWS, Docker\n\nRecommendations:\n1. Migrate to microservices architecture\n2. Implement GraphQL for data layer\n3. Add real-time capabilities with WebSockets\n4. Enhance monitoring with Datadog\n\nEstimated effort: 6-8 weeks\nROI: 40% efficiency improvement`
    ],
    trigger: [
      `**Workflow Initiated**\n\nTrigger: ${label}\nTimestamp: ${new Date().toLocaleString()}\nStatus: ✅ Success\n\nInitialization complete. Ready to process ${Math.floor(Math.random() * 50 + 10)} items.`
    ],
    action: [
      `**Action Executed**\n\n${label}\n\nResults:\n✅ Processed 147 records\n✅ Updated 89 entries\n✅ Generated 23 reports\n✅ Sent 12 notifications\n\nExecution time: ${(Math.random() * 2 + 0.5).toFixed(2)}s\nStatus: Complete`
    ],
    logic: [
      `**Logic Evaluation**\n\nCondition: ${label}\nResult: TRUE\n\nDecision path: Branch A selected\nConfidence: 94.3%\n\nNext steps:\n1. Route to primary workflow\n2. Execute action nodes\n3. Generate summary report`
    ]
  }

  const typeOutputs = outputs[nodeType] || outputs.agent
  return typeOutputs[Math.floor(Math.random() * typeOutputs.length)]
}

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<WorkflowExecutionResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const { getActiveKey } = useApiKeys()
  const { addExecution, executions } = useExecutionHistory()

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      agent: AgentNode,
      action: ActionNode,
      logic: LogicNode,
    }),
    []
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
      toast.success('Nodes connected!', { icon: '🔗' })
    },
    [setEdges]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        },
      }

      setNodes((nds) => nds.concat(newNode))
      toast.success('Node added!', { icon: '✨' })
    },
    [setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleExecute = async () => {
    // Check for API key
    const activeKey = getActiveKey()
    if (!activeKey) {
      toast.error(
        <div>
          <div className="font-semibold">No API key configured</div>
          <div className="text-sm mt-1">Please add an API key in Settings first</div>
        </div>,
        { duration: 5000 }
      )
      return
    }

    if (nodes.length === 0) {
      toast.error('Add nodes to your workflow first!', { icon: '⚠️' })
      return
    }

    setIsExecuting(true)
    const toastId = toast.loading(
      <div>
        <div>Executing workflow...</div>
        <div className="text-xs mt-1 opacity-75">
          Using {activeKey.provider} - {activeKey.model.split('/').pop()}
        </div>
      </div>,
      { icon: '🚀' }
    )

    // Wait a bit to simulate execution
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const workflow = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type || 'agent',
          data: node.data,
          position: node.position,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      }

      try {
        const result = await apiService.executeWorkflow(workflow, {
          provider: activeKey.provider,
          apiKey: activeKey.apiKey,
          model: activeKey.model,
        })
        
        setExecutionResult(result)
        setShowResults(true)
        
        // Save to execution history
        addExecution({
          workflowName: 'Workflow ' + new Date().toLocaleString(),
          result,
          nodes,
          edges
        })
        
        toast.success(
          <div>
            <div className="font-semibold">Workflow executed successfully!</div>
            <div className="text-xs mt-1">Processed {result.nodes_executed} nodes • Saved to history</div>
          </div>,
          { id: toastId, icon: '✅', duration: 4000 }
        )
        
        // Development-only logging
        if (import.meta.env.DEV) {
          console.log('Workflow execution result:', result)
        }
      } catch (apiError: any) {
        if (apiError.code === 'ERR_NETWORK' || apiError.message?.includes('Network Error')) {
          // Generate demo results instead
          const demoResult = generateDemoResults(nodes)
          setExecutionResult(demoResult)
          setShowResults(true)
          
          // Save to execution history
          addExecution({
            workflowName: 'Demo Workflow ' + new Date().toLocaleString(),
            result: demoResult,
            nodes,
            edges
          })
          
          toast.success(
            <div>
              <div className="font-semibold">✨ Demo Mode Executed!</div>
              <div className="text-xs mt-1">Generated sample outputs • Backend not connected</div>
            </div>,
            { id: toastId, icon: '🎭', duration: 6000 }
          )
        } else {
          throw apiError
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error'
      
      toast.error(
        <div>
          <div className="font-semibold">Execution error</div>
          <div className="text-xs mt-1">{errorMessage}</div>
        </div>,
        { id: toastId, icon: '❌', duration: 5000 }
      )
      
      // Development-only error logging
      if (import.meta.env.DEV) {
        console.error('Workflow execution error:', error)
      }
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClear = () => {
    if (nodes.length === 0) {
      toast('Workflow is already empty', { icon: '📝' })
      return
    }
    if (confirm('Clear all nodes and connections?')) {
      setNodes([])
      setEdges([])
      setSelectedNode(null)
      setExecutionResult(null)
      setShowResults(false)
      toast.success('Workflow cleared', { icon: '🗑️' })
    }
  }

  const handleSave = () => {
    if (nodes.length === 0) {
      toast.error('Nothing to save!', { icon: '⚠️' })
      return
    }
    const workflow = { nodes, edges, savedAt: new Date().toISOString() }
    localStorage.setItem('autonomos-workflow', JSON.stringify(workflow))
    toast.success('Workflow saved!', { icon: '💾' })
  }

  const handleExportWorkflow = () => {
    if (nodes.length === 0) {
      toast.error('Nothing to export!', { icon: '⚠️' })
      return
    }
    exportWorkflowJSON(nodes, edges, 'workflow')
    toast.success('Workflow exported!', { icon: '📥' })
  }

  const loadTemplate = (template: { nodes: Node[]; edges: Edge[] }) => {
    setNodes(template.nodes)
    setEdges(template.edges)
    setShowTemplates(false)
    toast.success('Template loaded!', { icon: '📋' })
  }

  const activeKey = getActiveKey()

  return (
    <div className="flex flex-1 overflow-hidden">
      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Sidebar onShowTemplates={() => setShowTemplates(true)} />
      </motion.div>
      
      <div className="flex-1 relative">
        {/* Action Buttons */}
        <motion.div 
          className="absolute top-6 right-6 z-10 flex gap-3"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* API Key Status */}
          {activeKey ? (
            <div className="glass-strong px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-400">
                {activeKey.provider === 'openrouter' ? '⭐ ' : ''}
                {activeKey.provider.charAt(0).toUpperCase() + activeKey.provider.slice(1)}
              </span>
            </div>
          ) : (
            <Link
              to="/settings"
              className="glass-strong px-4 py-2 rounded-xl text-sm flex items-center gap-2 text-amber-600 hover:text-amber-700"
            >
              <SettingsIcon className="w-4 h-4" />
              Setup API Key
            </Link>
          )}

          {/* History Button */}
          <motion.button
            onClick={() => setShowHistory(true)}
            className="btn-secondary flex items-center gap-2 shadow-lg relative"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">History</span>
            {executions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {executions.length}
              </span>
            )}
          </motion.button>

          <motion.button
            onClick={handleExportWorkflow}
            disabled={nodes.length === 0}
            className="btn-secondary flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileJson className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>

          <motion.button
            onClick={handleSave}
            className="btn-secondary flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Save</span>
          </motion.button>
          
          <motion.button
            onClick={handleClear}
            className="btn-secondary flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Clear</span>
          </motion.button>
          
          <motion.button
            onClick={handleExecute}
            disabled={isExecuting || !activeKey}
            className="btn-primary flex items-center gap-2 shadow-xl relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            animate={isExecuting ? { scale: [1, 1.02, 1] } : {}}
            transition={isExecuting ? { duration: 1, repeat: Infinity } : {}}
          >
            {isExecuting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Execute</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* React Flow Canvas */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="glass"
          >
            <Background gap={20} size={1} color="#e2e8f0" />
            <Controls className="glass rounded-xl border border-white/20 shadow-lg" />
            <MiniMap 
              className="glass rounded-xl border border-white/20 shadow-lg"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'trigger': return '#10b981'
                  case 'agent': return '#3b82f6'
                  case 'action': return '#a855f7'
                  case 'logic': return '#f59e0b'
                  default: return '#6b7280'
                }
              }}
            />
          </ReactFlow>
        </motion.div>

        {/* Execution Results Panel - Slides up from bottom, overlays canvas */}
        <AnimatePresence>
          {showResults && executionResult && (
            <ExecutionResultsPanel
              result={executionResult}
              workflowName="workflow"
              onClose={() => setShowResults(false)}
            />
          )}
        </AnimatePresence>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">📜 Execution History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="btn-ghost"
                  >
                    Close
                  </button>
                </div>

                {executions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No executions yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Execute a workflow to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executions.map((exec) => {
                      // Safe access to results array
                      const results = Array.isArray(exec.result?.results) ? exec.result.results : []
                      const successCount = results.filter(r => r.status === 'success').length
                      
                      return (
                        <div
                          key={exec.id}
                          className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                          onClick={() => {
                            setExecutionResult(exec.result)
                            setShowResults(true)
                            setShowHistory(false)
                            toast.success('Loaded execution from history', { icon: '📜' })
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{exec.workflowName}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {new Date(exec.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="badge badge-info">
                                {exec.nodes.length} nodes
                              </span>
                              {results.length > 0 && (
                                <span className="badge badge-success">
                                  {successCount} success
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            {exec.result.provider} • {exec.result.model?.split('/').pop()} • {exec.result.execution_time}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {nodes.length === 0 && !isExecuting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-24 h-24 text-primary-300 dark:text-primary-700 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-600 mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-slate-400 dark:text-slate-600">
                  Drag nodes from the sidebar or browse templates
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Node Settings Panel */}
      <AnimatePresence>
        {selectedNode && (
          <NodePanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(updatedNode) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
              )
              setSelectedNode(updatedNode)
              toast.success('Node updated!', { icon: '✅' })
            }}
          />
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      {showTemplates && (
        <TemplatesPanel
          onClose={() => setShowTemplates(false)}
          onLoadTemplate={loadTemplate}
        />
      )}
    </div>
  )
}
