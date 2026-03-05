import { motion, AnimatePresence } from 'framer-motion'
import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'

export interface ContextMenuItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  shortcut?: string
  divider?: boolean
  danger?: boolean
  submenu?: ContextMenuItem[]
}

interface ContextMenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

interface ContextMenuContextType {
  showContextMenu: (e: React.MouseEvent, items: ContextMenuItem[]) => void
  hideContextMenu: () => void
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined)

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<ContextMenuState | null>(null)

  const showContextMenu = useCallback((e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault()
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    })
  }, [])

  const hideContextMenu = useCallback(() => {
    setMenu(null)
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!menu) return

    const handleClick = () => hideContextMenu()
    const handleScroll = () => hideContextMenu()

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [menu, hideContextMenu])

  // Close on escape
  useEffect(() => {
    if (!menu) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideContextMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menu, hideContextMenu])

  return (
    <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      <AnimatePresence>
        {menu && (
          <ContextMenuComponent
            x={menu.x}
            y={menu.y}
            items={menu.items}
            onClose={hideContextMenu}
          />
        )}
      </AnimatePresence>
    </ContextMenuContext.Provider>
  )
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error('useContextMenu must be used within ContextMenuProvider')
  }
  return context
}

function ContextMenuComponent({
  x,
  y,
  items,
  onClose,
}: {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  // Adjust position if menu goes off screen
  useEffect(() => {
    if (!menuRef.current) return

    const rect = menuRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let adjustedX = x
    let adjustedY = y

    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 8
    }

    if (y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 8
    }

    setPosition({ x: adjustedX, y: adjustedY })
  }, [x, y])

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[100] glass-strong rounded-xl shadow-2xl py-2 min-w-[200px]"
      onClick={(e) => e.stopPropagation()}
      role="menu"
    >
      {items.map((item, index) => (
        <MenuItem key={index} item={item} onClose={onClose} />
      ))}
    </motion.div>
  )
}

function MenuItem({ item, onClose }: { item: ContextMenuItem; onClose: () => void }) {
  const [showSubmenu, setShowSubmenu] = useState(false)
  const itemRef = useRef<HTMLButtonElement>(null)

  if (item.divider) {
    return <div className="divider my-2" />
  }

  const handleClick = () => {
    if (item.disabled || item.submenu) return
    item.onClick?.()
    onClose()
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => item.submenu && setShowSubmenu(true)}
      onMouseLeave={() => item.submenu && setShowSubmenu(false)}
    >
      <button
        ref={itemRef}
        onClick={handleClick}
        disabled={item.disabled}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
          item.disabled
            ? 'opacity-50 cursor-not-allowed'
            : item.danger
            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        role="menuitem"
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="flex-1 text-left">{item.label}</span>
        {item.shortcut && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{item.shortcut}</span>
        )}
        {item.submenu && <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {/* Submenu */}
      {item.submenu && showSubmenu && itemRef.current && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full top-0 ml-1 glass-strong rounded-xl shadow-2xl py-2 min-w-[200px]"
          role="menu"
        >
          {item.submenu.map((subitem, index) => (
            <MenuItem key={index} item={subitem} onClose={onClose} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
