import { Toaster } from 'react-hot-toast'
import WorkflowBuilder from './components/WorkflowBuilder'
import Header from './components/Header'

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <WorkflowBuilder />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
