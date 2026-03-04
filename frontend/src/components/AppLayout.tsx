import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  LayoutDashboard,
  Workflow,
  Library,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

interface AppLayoutProps {
  children: ReactNode
  hideNav?: boolean
}

export default function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Workflow, label: 'Workflows', path: '/workflows' },
    { icon: Library, label: 'Templates', path: '/templates' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (hideNav) {
    return <div className="h-screen flex flex-col overflow-hidden">{children}</div>
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              />
            )}

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed lg:sticky top-0 left-0 h-screen w-70 glass-strong border-r border-white/20 p-6 flex flex-col z-50"
            >
              {/* Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    AutonomOS
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* User Menu */}
              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{user?.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-secondary"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-secondary text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden glass-strong border-b border-white/20 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AutonomOS
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
