import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Database, 
  Wrench, 
  Target, 
  Shield, 
  Zap,
  Settings,
  Plus,
  X,
  Eye,
  Code,
  Sparkles
} from 'lucide-react'

interface Tool {
  name: string
  type: 'api' | 'function' | 'database' | 'web'
  enabled: boolean
  config?: any
}

interface AgentConfigPanelProps {
  agentType: string
  onUpdate: (config: any) => void
  initialConfig?: any
}

export default function AgentConfigPanel({ agentType, onUpdate, initialConfig = {} }: AgentConfigPanelProps) {
  // Capabilities
  const [reasoning, setReasoning] = useState(initialConfig.capabilities?.reasoning || false)
  const [memory, setMemory] = useState(initialConfig.capabilities?.memory || false)
  const [toolsEnabled, setToolsEnabled] = useState(initialConfig.capabilities?.tools || false)
  const [planning, setPlanning] = useState(initialConfig.capabilities?.planning || false)
  const [reflection, setReflection] = useState(initialConfig.capabilities?.reflection || false)
  const [vision, setVision] = useState(initialConfig.capabilities?.vision || false)
  const [codeExecution, setCodeExecution] = useState(initialConfig.capabilities?.codeExecution || false)

  // Memory config
  const [memoryType, setMemoryType] = useState(initialConfig.memory?.type || 'short')
  const [vectorStore, setVectorStore] = useState(initialConfig.memory?.vectorStore || '')

  // Tools
  const [tools, setTools] = useState<Tool[]>(initialConfig.tools || [])
  const [showAddTool, setShowAddTool] = useState(false)

  // Autonomy
  const [autonomyLevel, setAutonomyLevel] = useState(initialConfig.autonomy?.level || 'medium')
  const [requiresApproval, setRequiresApproval] = useState(initialConfig.autonomy?.requiresApproval || false)
  const [maxIterations, setMaxIterations] = useState(initialConfig.autonomy?.maxIterations || 10)

  // Guardrails
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(initialConfig.guardrails?.enabled || false)
  const [outputValidation, setOutputValidation] = useState(initialConfig.guardrails?.outputValidation || false)

  // Performance
  const [temperature, setTemperature] = useState(initialConfig.performance?.temperature || 0.7)
  const [maxTokens, setMaxTokens] = useState(initialConfig.performance?.maxTokens || 4096)
  const [streaming, setStreaming] = useState(initialConfig.performance?.streaming || false)
  const [caching, setCaching] = useState(initialConfig.performance?.caching || false)

  // Multi-agent config
  const [pattern, setPattern] = useState(initialConfig.pattern || 'supervisor')

  const handleAddTool = (toolName: string, toolType: 'api' | 'function' | 'database' | 'web') => {
    setTools([...tools, { name: toolName, type: toolType, enabled: true }])
    setShowAddTool(false)
  }

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const config = {
      agentType,
      pattern,
      capabilities: {
        reasoning,
        memory,
        tools: toolsEnabled,
        planning,
        reflection,
        vision,
        codeExecution
      },
      memory: memory ? {
        enabled: true,
        type: memoryType,
        vectorStore
      } : { enabled: false },
      tools: toolsEnabled ? tools : [],
      autonomy: {
        level: autonomyLevel,
        requiresApproval,
        maxIterations
      },
      guardrails: {
        enabled: guardrailsEnabled,
        outputValidation
      },
      performance: {
        temperature,
        maxTokens,
        streaming,
        caching
      }
    }
    onUpdate(config)
  }

  return (
    <div className="space-y-6">
      {/* Capabilities Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Agent Capabilities
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <CapabilityToggle
            icon={<Brain className="w-4 h-4" />}
            label="Advanced Reasoning"
            enabled={reasoning}
            onToggle={setReasoning}
            description="Chain-of-thought, step-by-step analysis"
          />
          <CapabilityToggle
            icon={<Database className="w-4 h-4" />}
            label="Memory"
            enabled={memory}
            onToggle={setMemory}
            description="Remember context across sessions"
          />
          <CapabilityToggle
            icon={<Wrench className="w-4 h-4" />}
            label="Tool Usage"
            enabled={toolsEnabled}
            onToggle={setToolsEnabled}
            description="Call external APIs and functions"
          />
          <CapabilityToggle
            icon={<Target className="w-4 h-4" />}
            label="Planning"
            enabled={planning}
            onToggle={setPlanning}
            description="Multi-step task planning"
          />
          <CapabilityToggle
            icon={<Zap className="w-4 h-4" />}
            label="Reflection"
            enabled={reflection}
            onToggle={setReflection}
            description="Self-critique and improvement"
          />
          <CapabilityToggle
            icon={<Eye className="w-4 h-4" />}
            label="Vision"
            enabled={vision}
            onToggle={setVision}
            description="Image understanding"
          />
          <CapabilityToggle
            icon={<Code className="w-4 h-4" />}
            label="Code Execution"
            enabled={codeExecution}
            onToggle={setCodeExecution}
            description="Run Python code"
          />
        </div>
      </div>

      {/* Multi-Agent Pattern (if applicable) */}
      {agentType !== 'single' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Multi-Agent Pattern</h3>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="input-field"
          >
            <option value="supervisor">👔 Supervisor - One agent manages others</option>
            <option value="consensus">🤝 Consensus - Agents vote on decisions</option>
            <option value="debate">🧠 Debate - Agents argue different perspectives</option>
            <option value="collaborative">🤝 Collaborative - Agents work together</option>
          </select>
        </div>
      )}

      {/* Memory Configuration */}
      <AnimatePresence>
        {memory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Memory Configuration
            </h3>
            
            <select
              value={memoryType}
              onChange={(e) => setMemoryType(e.target.value)}
              className="input-field"
            >
              <option value="short">Short-term (conversation only)</option>
              <option value="long">Long-term (persistent storage)</option>
              <option value="episodic">Episodic (event-based memories)</option>
              <option value="semantic">Semantic (knowledge graphs)</option>
            </select>

            {(memoryType === 'long' || memoryType === 'semantic') && (
              <input
                type="text"
                value={vectorStore}
                onChange={(e) => setVectorStore(e.target.value)}
                className="input-field"
                placeholder="Vector store (e.g., pinecone, weaviate)"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tools Configuration */}
      <AnimatePresence>
        {toolsEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Available Tools
              </h3>
              <button
                onClick={() => setShowAddTool(true)}
                className="btn-ghost text-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Tool
              </button>
            </div>

            <div className="space-y-2">
              {tools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between p-2 glass rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-xs text-slate-500">({tool.type})</span>
                  </div>
                  <button
                    onClick={() => handleRemoveTool(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {tools.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No tools added yet
                </div>
              )}
            </div>

            {/* Quick add common tools */}
            {showAddTool && (
              <div className="p-3 glass rounded-lg space-y-2">
                <p className="text-xs font-semibold text-slate-600">Quick Add:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleAddTool('Web Search', 'web')} className="btn-ghost text-xs">Web Search</button>
                  <button onClick={() => handleAddTool('Calculator', 'function')} className="btn-ghost text-xs">Calculator</button>
                  <button onClick={() => handleAddTool('Database Query', 'database')} className="btn-ghost text-xs">Database</button>
                  <button onClick={() => handleAddTool('API Call', 'api')} className="btn-ghost text-xs">API Call</button>
                </div>
                <button onClick={() => setShowAddTool(false)} className="text-xs text-slate-500 w-full mt-2">Cancel</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autonomy Level */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Autonomy Level
        </h3>
        
        <select
          value={autonomyLevel}
          onChange={(e) => setAutonomyLevel(e.target.value)}
          className="input-field"
        >
          <option value="low">Low - Requires approval for each step</option>
          <option value="medium">Medium - Approval for major decisions</option>
          <option value="high">High - Minimal oversight</option>
          <option value="full">Full - Complete autonomy</option>
        </select>

        <div className="flex items-center justify-between p-2 glass rounded-lg">
          <span className="text-xs font-medium">Require Approval</span>
          <button
            onClick={() => setRequiresApproval(!requiresApproval)}
            className={`px-2 py-1 rounded text-xs ${
              requiresApproval ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}
          >
            {requiresApproval ? 'ON' : 'OFF'}
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
            Max Iterations: {maxIterations}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={maxIterations}
            onChange={(e) => setMaxIterations(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Guardrails */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Safety Guardrails
          </h3>
          <button
            onClick={() => setGuardrailsEnabled(!guardrailsEnabled)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              guardrailsEnabled ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}
          >
            {guardrailsEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <AnimatePresence>
          {guardrailsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between p-2 glass rounded-lg">
                <span className="text-xs font-medium">Output Validation</span>
                <button
                  onClick={() => setOutputValidation(!outputValidation)}
                  className={`px-2 py-1 rounded text-xs ${
                    outputValidation ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {outputValidation ? 'ON' : 'OFF'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Performance
        </h3>

        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
            Temperature: {temperature.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-1">
            Lower = more focused, Higher = more creative
          </p>
        </div>

        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
            Max Tokens
          </label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="input-field"
            min="100"
            max="32000"
            step="100"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center justify-between p-2 glass rounded-lg flex-1">
            <span className="text-xs font-medium">Streaming</span>
            <button
              onClick={() => setStreaming(!streaming)}
              className={`px-2 py-1 rounded text-xs ${
                streaming ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              {streaming ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="flex items-center justify-between p-2 glass rounded-lg flex-1">
            <span className="text-xs font-medium">Caching</span>
            <button
              onClick={() => setCaching(!caching)}
              className={`px-2 py-1 rounded text-xs ${
                caching ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              {caching ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn-primary w-full"
      >
        Apply Configuration
      </button>
    </div>
  )
}

// Helper component for capability toggles
function CapabilityToggle({ 
  icon, 
  label, 
  enabled, 
  onToggle, 
  description 
}: { 
  icon: React.ReactNode
  label: string
  enabled: boolean
  onToggle: (value: boolean) => void
  description: string
}) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`
        p-3 rounded-xl transition-all text-left
        ${enabled 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
        }
      `}
      title={description}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <p className="text-xs opacity-80">{description}</p>
    </button>
  )
}
