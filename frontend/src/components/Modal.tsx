import { motion, AnimatePresence } from 'framer-motion'
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalContextType {
  isOpen: boolean
  openModal: (content: ReactNode, options?: ModalOptions) => void
  closeModal: () => void
}

interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [options, setOptions] = useState<ModalOptions>({})

  const openModal = useCallback((content: ReactNode, opts: ModalOptions = {}) => {
    setContent(content)
    setOptions({
      size: 'md',
      showClose: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      ...opts,
    })
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setContent(null)
      setOptions({})
    }, 300)
  }, [])

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !options.closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, options.closeOnEscape, closeModal])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <ModalComponent
            content={content}
            options={options}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}

function ModalComponent({
  content,
  options,
  onClose,
}: {
  content: ReactNode
  options: ModalOptions
  onClose: () => void
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={options.closeOnBackdrop ? onClose : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${sizes[options.size || 'md']} glass-strong rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={options.title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(options.title || options.showClose) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            {options.title && (
              <h2 id="modal-title" className="text-2xl font-bold">
                {options.title}
              </h2>
            )}
            {options.showClose && (
              <button
                onClick={onClose}
                className="btn-ghost p-2 ml-auto"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {content}
        </div>
      </motion.div>
    </motion.div>
  )
}
