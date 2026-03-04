import { useCallback, useState } from 'react'
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

import Sidebar from './Sidebar'
import NodePanel from './NodePanel'
import TemplatesPanel from './TemplatesPanel'
import { executeWorkflow } from '../services/api'
import toast from 'react-hot-toast'
import { Play, Save, Trash2 } from 'lucide-react'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      const position = {
        x: event.clientX,
        y: event.clientY,
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
    },
    [setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleExecute = async () => {
    if (nodes.length === 0) {
      toast.error('Add nodes to your workflow first!')
      return
    }

    setIsExecuting(true)
    const toastId = toast.loading('Executing workflow...')

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

      const result = await executeWorkflow(workflow)
      toast.success('Workflow executed successfully!', { id: toastId })
      console.log('Workflow result:', result)
    } catch (error) {
      toast.error('Failed to execute workflow', { id: toastId })
      console.error(error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    toast.success('Workflow cleared')
  }

  const handleSave = () => {
    const workflow = { nodes, edges }
    localStorage.setItem('autonomos-workflow', JSON.stringify(workflow))
    toast.success('Workflow saved!')
  }

  const loadTemplate = (template: { nodes: Node[]; edges: Edge[] }) => {
    setNodes(template.nodes)
    setEdges(template.edges)
    setShowTemplates(false)
    toast.success('Template loaded!')
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar onShowTemplates={() => setShowTemplates(true)} />
      
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Executing...' : 'Execute'}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <NodePanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={(updatedNode) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
            )
            setSelectedNode(updatedNode)
          }}
        />
      )}

      {showTemplates && (
        <TemplatesPanel
          onClose={() => setShowTemplates(false)}
          onLoadTemplate={loadTemplate}
        />
      )}
    </div>
  )
}
