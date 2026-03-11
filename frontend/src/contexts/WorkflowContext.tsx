import { createContext, useContext, useState, ReactNode } from 'react'
import { Node, Edge } from 'reactflow'

interface Workflow {
  id: string
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'archived'
}

interface WorkflowContextType {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  setCurrentWorkflow: (workflow: Workflow | null) => void
  saveWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    const saved = localStorage.getItem('workflows')
    return saved ? JSON.parse(saved) : []
  })
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)

  const saveWorkflow = (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...workflows, newWorkflow]
    setWorkflows(updated)
    localStorage.setItem('workflows', JSON.stringify(updated))
  }

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    const updated = workflows.map(w => 
      w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
    )
    setWorkflows(updated)
    localStorage.setItem('workflows', JSON.stringify(updated))
  }

  const deleteWorkflow = (id: string) => {
    const updated = workflows.filter(w => w.id !== id)
    setWorkflows(updated)
    localStorage.setItem('workflows', JSON.stringify(updated))
  }

  return (
    <WorkflowContext.Provider value={{
      workflows,
      currentWorkflow,
      setCurrentWorkflow,
      saveWorkflow,
      updateWorkflow,
      deleteWorkflow,
    }}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (!context) throw new Error('useWorkflow must be used within WorkflowProvider')
  return context
}
