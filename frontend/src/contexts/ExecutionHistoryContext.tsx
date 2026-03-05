import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WorkflowExecutionResult } from '../services/api'

interface ExecutionRecord {
  id: string
  workflowName: string
  timestamp: Date
  result: WorkflowExecutionResult
  nodes: any[]
  edges: any[]
}

interface ExecutionHistoryContextType {
  executions: ExecutionRecord[]
  addExecution: (execution: Omit<ExecutionRecord, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  getExecutionById: (id: string) => ExecutionRecord | undefined
}

const ExecutionHistoryContext = createContext<ExecutionHistoryContextType | undefined>(undefined)

export function ExecutionHistoryProvider({ children }: { children: ReactNode }) {
  const [executions, setExecutions] = useState<ExecutionRecord[]>(() => {
    const saved = localStorage.getItem('autonomos-execution-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Convert timestamp strings back to Date objects
        return parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }))
      } catch (e) {
        console.error('Failed to parse execution history:', e)
        return []
      }
    }
    return []
  })

  // Save to localStorage whenever executions change
  useEffect(() => {
    localStorage.setItem('autonomos-execution-history', JSON.stringify(executions))
  }, [executions])

  const addExecution = (execution: Omit<ExecutionRecord, 'id' | 'timestamp'>) => {
    const newExecution: ExecutionRecord = {
      ...execution,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setExecutions(prev => [newExecution, ...prev].slice(0, 50)) // Keep last 50 executions
  }

  const clearHistory = () => {
    setExecutions([])
    localStorage.removeItem('autonomos-execution-history')
  }

  const getExecutionById = (id: string) => {
    return executions.find(e => e.id === id)
  }

  return (
    <ExecutionHistoryContext.Provider value={{ executions, addExecution, clearHistory, getExecutionById }}>
      {children}
    </ExecutionHistoryContext.Provider>
  )
}

export function useExecutionHistory() {
  const context = useContext(ExecutionHistoryContext)
  if (!context) {
    throw new Error('useExecutionHistory must be used within ExecutionHistoryProvider')
  }
  return context
}
