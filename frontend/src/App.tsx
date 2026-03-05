import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ApiKeyProvider } from './contexts/ApiKeyContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WorkflowBuilder from './components/WorkflowBuilder'
import Settings from './pages/Settings'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workflow" element={<WorkflowBuilder />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ApiKeyProvider>
  )
}

export default App
