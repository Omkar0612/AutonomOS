import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import WorkflowBuilder from './components/WorkflowBuilder'
import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'

function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
      </motion.div>
      
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <WorkflowBuilder />
      </motion.div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#334155',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
