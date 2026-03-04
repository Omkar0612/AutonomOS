import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const templates = [
  {
    id: '1',
    name: 'AI Market Research',
    description: 'Multi-agent system for comprehensive market analysis',
    category: 'Research',
    gradient: 'from-blue-500 to-cyan-500',
    nodes: 3,
    popular: true
  },
  {
    id: '2',
    name: 'Customer Support Bot',
    description: '24/7 automated customer service agent',
    category: 'Support',
    gradient: 'from-purple-500 to-pink-500',
    nodes: 4,
    popular: true
  },
  {
    id: '3',
    name: 'Content Generator',
    description: 'Automated content creation pipeline',
    category: 'Content',
    gradient: 'from-orange-500 to-red-500',
    nodes: 5,
    popular: false
  },
  {
    id: '4',
    name: 'Data Analysis Pipeline',
    description: 'Process and analyze data with AI',
    category: 'Analytics',
    gradient: 'from-green-500 to-emerald-500',
    nodes: 6,
    popular: true
  },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]
  const filtered = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || t.category === category
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (templateId: string) => {
    toast.success('Template loaded!')
    navigate('/workflows/new')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Templates</h1>
          <p className="text-slate-600 dark:text-slate-400">Pre-built workflows to get started quickly</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="input-field pl-12 w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  category === cat ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
        >
          {filtered.map((template) => (
            <motion.div
              key={template.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="glass-strong rounded-2xl p-6 hover:shadow-2xl transition-all group cursor-pointer"
              onClick={() => handleUseTemplate(template.id)}
            >
              {template.popular && (
                <div className="flex items-center gap-1 text-xs font-medium text-primary-600 mb-3">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{template.nodes} nodes</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{template.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  )
}
