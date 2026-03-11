# 🚀 Advanced Features Guide

Complete documentation for all advanced features in AutonomOS.

---

## 📢 Toast Notifications

### Setup

```tsx
// In App.tsx or main layout
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      {/* Your app */}
    </ToastProvider>
  )
}
```

### Usage

```tsx
import { useToast } from './components/Toast'

function MyComponent() {
  const { showToast } = useToast()

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Workflow created!',
      message: 'Your workflow has been saved successfully.',
      duration: 5000, // Optional, defaults to 5000ms
    })
  }

  const handleError = () => {
    showToast({
      type: 'error',
      title: 'Something went wrong',
      message: 'Please try again later.',
    })
  }

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </>
  )
}
```

### Toast Types

- `success` - Green, checkmark icon
- `error` - Red, alert icon
- `warning` - Amber, triangle icon
- `info` - Blue, info icon

### Features

- ✅ Auto-dismiss with countdown
- ✅ Swipe to dismiss
- ✅ Stack multiple toasts
- ✅ Click to dismiss
- ✅ ARIA live region for accessibility

---

## 🎭 Modal System

### Setup

```tsx
import { ModalProvider } from './components/Modal'

function App() {
  return (
    <ModalProvider>
      {/* Your app */}
    </ModalProvider>
  )
}
```

### Usage

```tsx
import { useModal } from './components/Modal'

function MyComponent() {
  const { openModal, closeModal } = useModal()

  const showConfirmDialog = () => {
    openModal(
      <div>
        <p>Are you sure you want to delete this workflow?</p>
        <div className="flex gap-3 mt-6">
          <button onClick={closeModal} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleDelete} className="btn-primary">
            Delete
          </button>
        </div>
      </div>,
      {
        title: 'Confirm Deletion',
        size: 'md',
        closeOnBackdrop: true,
        closeOnEscape: true,
      }
    )
  }

  const handleDelete = () => {
    // Delete logic
    closeModal()
  }

  return <button onClick={showConfirmDialog}>Delete</button>
}
```

### Modal Options

```typescript
interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}
```

### Features

- ✅ Backdrop blur effect
- ✅ Focus trap
- ✅ Escape key to close
- ✅ Click outside to close
- ✅ Smooth animations
- ✅ Body scroll lock
- ✅ Multiple sizes

---

## 📋 Context Menu

### Setup

```tsx
import { ContextMenuProvider } from './components/ContextMenu'

function App() {
  return (
    <ContextMenuProvider>
      {/* Your app */}
    </ContextMenuProvider>
  )
}
```

### Usage

```tsx
import { useContextMenu, ContextMenuItem } from './components/ContextMenu'
import { Copy, Trash2, Edit } from 'lucide-react'

function WorkflowCard() {
  const { showContextMenu } = useContextMenu()

  const menuItems: ContextMenuItem[] = [
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => console.log('Edit'),
      shortcut: 'E',
    },
    {
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      onClick: () => console.log('Duplicate'),
      shortcut: '⌘D',
    },
    { divider: true },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log('Delete'),
      danger: true,
      shortcut: '⌫',
    },
  ]

  return (
    <div onContextMenu={(e) => showContextMenu(e, menuItems)}>
      Right-click me!
    </div>
  )
}
```

### Menu Item Props

```typescript
interface ContextMenuItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  shortcut?: string
  divider?: boolean
  danger?: boolean
  submenu?: ContextMenuItem[]
}
```

### Features

- ✅ Custom position
- ✅ Smart repositioning (stays on screen)
- ✅ Keyboard navigation
- ✅ Nested submenus
- ✅ Icons + shortcuts
- ✅ Danger actions (red)
- ✅ Click outside closes
- ✅ Escape key closes

---

## 🌐 WebSocket Hook

### Usage

```tsx
import { useWebSocket } from './hooks/useWebSocket'

function Dashboard() {
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    'ws://localhost:8000/ws',
    {
      onOpen: () => console.log('Connected!'),
      onMessage: (event) => console.log('Message:', event.data),
      onError: (error) => console.error('Error:', error),
      onClose: () => console.log('Disconnected'),
      reconnect: true,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
    }
  )

  useEffect(() => {
    if (lastMessage) {
      console.log('New message:', lastMessage)
    }
  }, [lastMessage])

  const handleSend = () => {
    sendMessage({ type: 'ping', data: 'Hello!' })
  }

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={handleSend}>Send Message</button>
    </div>
  )
}
```

### Features

- ✅ Auto-reconnect
- ✅ Connection status
- ✅ Message queue
- ✅ Configurable retry
- ✅ TypeScript support

---

## ↩️ Undo/Redo Hook

### Usage

```tsx
import { useUndo } from './hooks/useUndo'

function WorkflowBuilder() {
  const {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useUndo(
    { nodes: [], edges: [] },
    { maxHistory: 50 }
  )

  const addNode = () => {
    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, { id: '1', type: 'agent' }],
    }))
  }

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo (⌘Z)
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo (⌘⇧Z)
      </button>
      <button onClick={reset}>Reset</button>
      <button onClick={addNode}>Add Node</button>
    </div>
  )
}
```

### Keyboard Shortcuts

Add these to your component:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        redo()
      } else {
        undo()
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [undo, redo])
```

---

## ♾️ Infinite Scroll Hook

### Usage

```tsx
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useState } from 'react'

function WorkflowList() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const response = await fetch(`/api/workflows?page=${page}`)
    const data = await response.json()
    
    setWorkflows((prev) => [...prev, ...data.workflows])
    setPage((prev) => prev + 1)
    setHasMore(data.hasMore)
  }

  const { targetRef, isLoading } = useInfiniteScroll(loadMore, {
    threshold: 0.5,
    enabled: hasMore,
  })

  return (
    <div>
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
      
      {hasMore && (
        <div ref={targetRef} className="py-4 text-center">
          {isLoading ? 'Loading...' : 'Load more'}
        </div>
      )}
    </div>
  )
}
```

---

## ⏱️ Debounce Hook

### useDebounce (Value)

```tsx
import { useDebounce } from './hooks/useDebounce'
import { useState, useEffect } from 'react'

function SearchWorkflows() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedQuery) {
      // API call with debounced value
      searchWorkflows(debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### useDebouncedCallback (Function)

```tsx
import { useDebouncedCallback } from './hooks/useDebounce'

function AutoSave() {
  const saveWorkflow = useDebouncedCallback(
    (data) => {
      fetch('/api/workflows', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    1000
  )

  const handleChange = (data) => {
    saveWorkflow(data)
  }

  return <WorkflowEditor onChange={handleChange} />
}
```

---

## 💾 LocalStorage Hook

### Usage

```tsx
import { useLocalStorage } from './hooks/useLocalStorage'

function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark')
  const [settings, setSettings] = useLocalStorage('settings', {
    notifications: true,
    autoSave: true,
  })

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <button onClick={removeTheme}>Reset Theme</button>
    </div>
  )
}
```

### Features

- ✅ Type-safe
- ✅ Syncs across tabs
- ✅ Error handling
- ✅ Remove capability

---

## 🛠️ Utility Helpers

### Class Name Merger

```tsx
import { cn } from './utils/helpers'

function Button({ className, variant }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-purple-600 text-white',
        variant === 'secondary' && 'bg-slate-200',
        className
      )}
    />
  )
}
```

### Date Formatting

```tsx
import { formatRelativeTime, formatDate } from './utils/helpers'

const lastRun = formatRelativeTime('2026-03-05T08:30:00') // "2 hours ago"
const createdAt = formatDate('2026-03-01') // "Mar 1, 2026"
```

### Text Truncation

```tsx
import { truncate } from './utils/helpers'

const description = truncate(longText, 100) // "First 100 chars..."
```

### Copy to Clipboard

```tsx
import { copyToClipboard } from './utils/helpers'

const handleCopy = async () => {
  const success = await copyToClipboard('sk-or-v1-...')
  if (success) {
    showToast({ type: 'success', title: 'Copied!' })
  }
}
```

### Download File

```tsx
import { downloadFile } from './utils/helpers'

const exportWorkflow = () => {
  const json = JSON.stringify(workflowData, null, 2)
  downloadFile(json, 'workflow.json', 'application/json')
}
```

### Retry with Backoff

```tsx
import { retry } from './utils/helpers'

const data = await retry(
  () => fetch('/api/workflow').then(r => r.json()),
  3, // retries
  1000 // initial delay
)
```

---

## 📦 Complete Provider Setup

### App.tsx

```tsx
import { ToastProvider } from './components/Toast'
import { ModalProvider } from './components/Modal'
import { ContextMenuProvider } from './components/ContextMenu'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <ContextMenuProvider>
            <div className="app">
              {/* Your routes */}
            </div>
          </ContextMenuProvider>
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
```

---

## 🎯 Best Practices

### 1. Toast Notifications

✅ **DO**: Use for non-critical feedback
✅ **DO**: Auto-dismiss after 3-5 seconds
❌ **DON'T**: Use for critical errors (use modal)
❌ **DON'T**: Show too many at once

### 2. Modals

✅ **DO**: Use for critical actions requiring confirmation
✅ **DO**: Keep content focused
❌ **DON'T**: Nest modals
❌ **DON'T**: Make them full-screen unless necessary

### 3. Context Menus

✅ **DO**: Group related actions
✅ **DO**: Show keyboard shortcuts
❌ **DON'T**: Overload with too many items
❌ **DON'T**: Hide primary actions

### 4. WebSocket

✅ **DO**: Handle reconnection
✅ **DO**: Show connection status
❌ **DON'T**: Send large payloads
❌ **DON'T**: Forget to cleanup on unmount

### 5. Undo/Redo

✅ **DO**: Limit history size
✅ **DO**: Clear on save
❌ **DON'T**: Track every keystroke
❌ **DON'T**: Forget keyboard shortcuts

---

## ♿ Accessibility

All components follow WAI-ARIA guidelines:

- ✅ **Keyboard navigation**: Tab, Enter, Escape
- ✅ **Screen readers**: ARIA labels and live regions
- ✅ **Focus management**: Auto-focus and trap
- ✅ **Color contrast**: WCAG AA compliant
- ✅ **Reduced motion**: Respects user preferences

---

## 📝 TypeScript Support

All components and hooks are fully typed:

```tsx
import type { Toast, ContextMenuItem } from './components'
import type { UseWebSocketOptions } from './hooks/useWebSocket'
```

---

## 🚀 Performance

- **Toast**: Uses AnimatePresence for smooth exit animations
- **Modal**: Body scroll lock prevents reflow
- **Context Menu**: Smart repositioning to avoid overflow
- **WebSocket**: Message queue and reconnection logic
- **Undo**: Limits history to prevent memory leaks
- **Debounce**: Cancels previous timers

---

## 🧪 Testing

```tsx
import { renderHook } from '@testing-library/react'
import { useUndo } from './hooks/useUndo'

test('undo works', () => {
  const { result } = renderHook(() => useUndo(0))
  
  act(() => result.current.setState(1))
  expect(result.current.state).toBe(1)
  
  act(() => result.current.undo())
  expect(result.current.state).toBe(0)
})
```

---

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

© 2026 AutonomOS - Advanced Features Guide
