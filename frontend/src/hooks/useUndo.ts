import { useState, useCallback, useRef } from 'react'

interface UseUndoOptions<T> {
  maxHistory?: number
}

export function useUndo<T>(initialState: T, options: UseUndoOptions<T> = {}) {
  const { maxHistory = 50 } = options

  const [index, setIndex] = useState(0)
  const historyRef = useRef<T[]>([initialState])

  const state = historyRef.current[index]

  const setState = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      const resolvedState = typeof newState === 'function' ? (newState as Function)(state) : newState

      // Remove any history after current index
      const newHistory = historyRef.current.slice(0, index + 1)
      
      // Add new state
      newHistory.push(resolvedState)

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift()
      } else {
        setIndex(prev => prev + 1)
      }

      historyRef.current = newHistory
    },
    [index, maxHistory, state]
  )

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1)
    }
  }, [index])

  const redo = useCallback(() => {
    if (index < historyRef.current.length - 1) {
      setIndex(prev => prev + 1)
    }
  }, [index])

  const reset = useCallback(() => {
    historyRef.current = [initialState]
    setIndex(0)
  }, [initialState])

  const canUndo = index > 0
  const canRedo = index < historyRef.current.length - 1

  return {
    state,
    setState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history: historyRef.current,
    index,
  }
}
