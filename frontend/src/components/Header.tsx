import { Bot, Github, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AutonomOS</h1>
            <p className="text-sm text-gray-500">Visual AI Workflow Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Omkar0612/AutonomOS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>API Docs</span>
          </a>
        </div>
      </div>
    </header>
  )
}
