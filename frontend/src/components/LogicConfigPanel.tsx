import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GitBranch,
  Repeat,
  Split,
  GitMerge,
  Timer,
  Zap,
  RefreshCw,
  Shuffle,
  Filter,
  Plus,
  X
} from 'lucide-react'

interface LogicConfigPanelProps {
  onUpdate: (config: any) => void
  initialConfig?: any
}

export default function LogicConfigPanel({ onUpdate, initialConfig = {} }: LogicConfigPanelProps) {
  // Logic type
  const [logicType, setLogicType] = useState(initialConfig.logicType || 'if_else')
  
  // If/Else config
  const [conditionExpression, setConditionExpression] = useState(initialConfig.condition?.expression || '')
  const [conditionOperator, setConditionOperator] = useState(initialConfig.condition?.operator || '==')
  const [leftValue, setLeftValue] = useState(initialConfig.condition?.leftValue || '')
  const [rightValue, setRightValue] = useState(initialConfig.condition?.rightValue || '')
  const [useSimpleMode, setUseSimpleMode] = useState(!initialConfig.condition?.expression)
  
  // Switch config
  const [switchVariable, setSwitchVariable] = useState(initialConfig.switchConfig?.variable || '')
  const [switchCases, setSwitchCases] = useState(initialConfig.switchConfig?.cases || [])
  const [hasDefaultCase, setHasDefaultCase] = useState(initialConfig.switchConfig?.defaultCase || false)
  
  // Loop config
  const [loopType, setLoopType] = useState(initialConfig.loopConfig?.type || 'for')
  const [iterations, setIterations] = useState(initialConfig.loopConfig?.iterations || 10)
  const [loopCondition, setLoopCondition] = useState(initialConfig.loopConfig?.condition || '')
  const [maxIterations, setMaxIterations] = useState(initialConfig.loopConfig?.maxIterations || 100)
  const [breakOn, setBreakOn] = useState(initialConfig.loopConfig?.breakOn || '')
  
  // ForEach config
  const [arraySource, setArraySource] = useState(initialConfig.forEachConfig?.array || '')
  const [itemName, setItemName] = useState(initialConfig.forEachConfig?.itemName || 'item')
  const [batchSize, setBatchSize] = useState(initialConfig.forEachConfig?.batchSize || 1)
  const [parallelExecution, setParallelExecution] = useState(initialConfig.forEachConfig?.parallel || false)
  
  // Parallel config
  const [branches, setBranches] = useState(initialConfig.parallelConfig?.branches || 2)
  const [waitForAll, setWaitForAll] = useState(initialConfig.parallelConfig?.waitForAll !== false)
  const [parallelTimeout, setParallelTimeout] = useState(initialConfig.parallelConfig?.timeout || 30)
  const [failFast, setFailFast] = useState(initialConfig.parallelConfig?.failFast || false)
  
  // Merge config
  const [waitFor, setWaitFor] = useState(initialConfig.mergeConfig?.waitFor || 'all')
  const [mergeTimeout, setMergeTimeout] = useState(initialConfig.mergeConfig?.timeout || 60)
  const [mergeStrategy, setMergeStrategy] = useState(initialConfig.mergeConfig?.strategy || 'combine')
  
  // Delay config
  const [delayDuration, setDelayDuration] = useState(initialConfig.delayConfig?.duration || 1)
  const [delayUnit, setDelayUnit] = useState(initialConfig.delayConfig?.unit || 's')
  const [dynamicDelay, setDynamicDelay] = useState(initialConfig.delayConfig?.dynamic || false)
  const [delayExpression, setDelayExpression] = useState(initialConfig.delayConfig?.expression || '')
  
  // Try/Catch config
  const [retries, setRetries] = useState(initialConfig.tryCatchConfig?.retries || 3)
  const [fallback, setFallback] = useState(initialConfig.tryCatchConfig?.fallback || 'default')
  const [logErrors, setLogErrors] = useState(initialConfig.tryCatchConfig?.logErrors !== false)
  
  // Filter config
  const [filterExpression, setFilterExpression] = useState(initialConfig.filterConfig?.expression || '')
  const [filterMode, setFilterMode] = useState(initialConfig.filterConfig?.mode || 'include')
  
  // Map config
  const [transformation, setTransformation] = useState(initialConfig.mapConfig?.transformation || '')
  const [outputKey, setOutputKey] = useState(initialConfig.mapConfig?.outputKey || '')
  
  // Debounce config
  const [debounceWait, setDebounceWait] = useState(initialConfig.debounceConfig?.wait || 300)
  const [maxWait, setMaxWait] = useState(initialConfig.debounceConfig?.maxWait || 1000)
  const [leading, setLeading] = useState(initialConfig.debounceConfig?.leading || false)
  const [trailing, setTrailing] = useState(initialConfig.debounceConfig?.trailing !== false)

  const handleAddCase = () => {
    setSwitchCases([...switchCases, { value: '', label: `Case ${switchCases.length + 1}` }])
  }

  const handleRemoveCase = (index: number) => {
    setSwitchCases(switchCases.filter((_, i) => i !== index))
  }

  const handleUpdateCase = (index: number, field: 'value' | 'label', value: string) => {
    const updated = [...switchCases]
    updated[index][field] = value
    setSwitchCases(updated)
  }

  const handleSave = () => {
    const config: any = { logicType }

    switch (logicType) {
      case 'if_else':
        config.condition = useSimpleMode
          ? { operator: conditionOperator, leftValue, rightValue }
          : { expression: conditionExpression }
        break
      
      case 'switch':
        config.switchConfig = {
          variable: switchVariable,
          cases: switchCases,
          defaultCase: hasDefaultCase
        }
        break
      
      case 'loop':
        config.loopConfig = {
          type: loopType,
          iterations: loopType === 'for' ? iterations : undefined,
          condition: loopType !== 'for' ? loopCondition : undefined,
          maxIterations,
          breakOn: breakOn || undefined
        }
        break
      
      case 'foreach':
        config.forEachConfig = {
          array: arraySource,
          itemName,
          batchSize,
          parallel: parallelExecution
        }
        break
      
      case 'parallel':
        config.parallelConfig = {
          branches,
          waitForAll,
          timeout: parallelTimeout,
          failFast
        }
        break
      
      case 'merge':
        config.mergeConfig = {
          waitFor,
          timeout: mergeTimeout,
          strategy: mergeStrategy
        }
        break
      
      case 'delay':
        config.delayConfig = {
          duration: delayDuration,
          unit: delayUnit,
          dynamic: dynamicDelay,
          expression: dynamicDelay ? delayExpression : undefined
        }
        break
      
      case 'try_catch':
        config.tryCatchConfig = {
          retries,
          fallback,
          logErrors
        }
        break
      
      case 'filter':
        config.filterConfig = {
          expression: filterExpression,
          mode: filterMode
        }
        break
      
      case 'map':
        config.mapConfig = {
          transformation,
          outputKey: outputKey || undefined
        }
        break
      
      case 'debounce':
        config.debounceConfig = {
          wait: debounceWait,
          maxWait,
          leading,
          trailing
        }
        break
    }

    onUpdate(config)
  }

  return (
    <div className="space-y-6">
      {/* Logic Type Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Logic Type
        </h3>
        
        <select
          value={logicType}
          onChange={(e) => setLogicType(e.target.value)}
          className="input-field"
        >
          <option value="if_else">➕ If/Else - Conditional branch</option>
          <option value="switch">🔀 Switch - Multi-way branch</option>
          <option value="loop">🔁 Loop - Repeat N times</option>
          <option value="foreach">🔂 ForEach - Iterate items</option>
          <option value="parallel">↔️ Parallel - Execute simultaneously</option>
          <option value="merge">🔀 Merge - Combine branches</option>
          <option value="delay">⏱️ Delay - Time wait</option>
          <option value="try_catch">⚡ Try/Catch - Error handling</option>
          <option value="filter">📊 Filter - Filter items</option>
          <option value="map">🔄 Map - Transform items</option>
          <option value="debounce">⏳ Debounce - Rate limit</option>
          <option value="custom">✨ Custom Logic</option>
        </select>
      </div>

      {/* If/Else Configuration */}
      <AnimatePresence>
        {logicType === 'if_else' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Condition</h3>
            
            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Simple Mode</span>
              <button
                onClick={() => setUseSimpleMode(!useSimpleMode)}
                className={`px-2 py-1 rounded text-xs ${useSimpleMode ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {useSimpleMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {useSimpleMode ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={leftValue}
                    onChange={(e) => setLeftValue(e.target.value)}
                    className="input-field"
                    placeholder="data.value"
                  />
                  <select value={conditionOperator} onChange={(e) => setConditionOperator(e.target.value as any)} className="input-field">
                    <option value="==">Equals</option>
                    <option value="!=">Not Equals</option>
                    <option value=">">Greater Than</option>
                    <option value="<">Less Than</option>
                    <option value=">=">Greater or Equal</option>
                    <option value="<=">Less or Equal</option>
                    <option value="contains">Contains</option>
                    <option value="regex">Regex Match</option>
                  </select>
                  <input
                    type="text"
                    value={rightValue}
                    onChange={(e) => setRightValue(e.target.value)}
                    className="input-field"
                    placeholder="100"
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={conditionExpression}
                onChange={(e) => setConditionExpression(e.target.value)}
                rows={3}
                className="input-field resize-none font-mono text-sm"
                placeholder="data.value > 100 && data.status == 'active'"
              />
            )}
            <p className="text-xs text-slate-500">Two outputs: TRUE (green) and FALSE (red)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch Configuration */}
      <AnimatePresence>
        {logicType === 'switch' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Switch Cases
            </h3>
            
            <input
              type="text"
              value={switchVariable}
              onChange={(e) => setSwitchVariable(e.target.value)}
              className="input-field"
              placeholder="Variable to evaluate (e.g., data.status)"
            />

            <div className="space-y-2">
              {switchCases.map((caseItem, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={caseItem.value}
                    onChange={(e) => handleUpdateCase(index, 'value', e.target.value)}
                    className="input-field flex-1"
                    placeholder="Value"
                  />
                  <input
                    type="text"
                    value={caseItem.label}
                    onChange={(e) => handleUpdateCase(index, 'label', e.target.value)}
                    className="input-field flex-1"
                    placeholder="Label"
                  />
                  <button onClick={() => handleRemoveCase(index)} className="text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleAddCase} className="btn-ghost text-xs flex items-center gap-1 w-full">
              <Plus className="w-3 h-3" />
              Add Case
            </button>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Default Case</span>
              <button
                onClick={() => setHasDefaultCase(!hasDefaultCase)}
                className={`px-2 py-1 rounded text-xs ${hasDefaultCase ? 'bg-gray-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {hasDefaultCase ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loop Configuration */}
      <AnimatePresence>
        {logicType === 'loop' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Loop Configuration
            </h3>
            
            <select value={loopType} onChange={(e) => setLoopType(e.target.value as any)} className="input-field">
              <option value="for">For - Fixed iterations</option>
              <option value="while">While - Condition true</option>
              <option value="until">Until - Condition false</option>
            </select>

            {loopType === 'for' ? (
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Iterations: {iterations}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ) : (
              <textarea
                value={loopCondition}
                onChange={(e) => setLoopCondition(e.target.value)}
                rows={2}
                className="input-field resize-none font-mono text-sm"
                placeholder="data.hasMore === true"
              />
            )}

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Max Iterations (safety): {maxIterations}</label>
              <input
                type="range"
                min="10"
                max="1000"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <input
              type="text"
              value={breakOn}
              onChange={(e) => setBreakOn(e.target.value)}
              className="input-field"
              placeholder="Break condition (optional)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ForEach Configuration */}
      <AnimatePresence>
        {logicType === 'foreach' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">ForEach Configuration</h3>
            
            <input
              type="text"
              value={arraySource}
              onChange={(e) => setArraySource(e.target.value)}
              className="input-field"
              placeholder="Array source (e.g., data.users)"
            />

            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="input-field"
              placeholder="Item variable name"
            />

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Batch Size: {batchSize}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Parallel Execution</span>
              <button
                onClick={() => setParallelExecution(!parallelExecution)}
                className={`px-2 py-1 rounded text-xs ${parallelExecution ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {parallelExecution ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parallel Configuration */}
      <AnimatePresence>
        {logicType === 'parallel' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Split className="w-4 h-4" />
              Parallel Execution
            </h3>
            
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Number of Branches: {branches}</label>
              <input
                type="range"
                min="2"
                max="10"
                value={branches}
                onChange={(e) => setBranches(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Wait for all branches</span>
              <button
                onClick={() => setWaitForAll(!waitForAll)}
                className={`px-2 py-1 rounded text-xs ${waitForAll ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {waitForAll ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Fail fast (stop on error)</span>
              <button
                onClick={() => setFailFast(!failFast)}
                className={`px-2 py-1 rounded text-xs ${failFast ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {failFast ? 'ON' : 'OFF'}
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Timeout (seconds)</label>
              <input
                type="number"
                value={parallelTimeout}
                onChange={(e) => setParallelTimeout(Number(e.target.value))}
                className="input-field"
                min="5"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delay Configuration */}
      <AnimatePresence>
        {logicType === 'delay' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Delay Configuration
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={delayDuration}
                onChange={(e) => setDelayDuration(Number(e.target.value))}
                className="input-field"
                min="1"
              />
              <select value={delayUnit} onChange={(e) => setDelayUnit(e.target.value as any)} className="input-field">
                <option value="ms">Milliseconds</option>
                <option value="s">Seconds</option>
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Dynamic delay</span>
              <button
                onClick={() => setDynamicDelay(!dynamicDelay)}
                className={`px-2 py-1 rounded text-xs ${dynamicDelay ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {dynamicDelay ? 'ON' : 'OFF'}
              </button>
            </div>

            {dynamicDelay && (
              <input
                type="text"
                value={delayExpression}
                onChange={(e) => setDelayExpression(e.target.value)}
                className="input-field font-mono text-sm"
                placeholder="data.delay * 1000"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Try/Catch Configuration */}
      <AnimatePresence>
        {logicType === 'try_catch' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Error Handling
            </h3>
            
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Retry Attempts: {retries}</label>
              <input
                type="range"
                min="0"
                max="10"
                value={retries}
                onChange={(e) => setRetries(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <select value={fallback} onChange={(e) => setFallback(e.target.value as any)} className="input-field">
              <option value="default">Default Value</option>
              <option value="skip">Skip</option>
              <option value="alternative">Alternative Path</option>
            </select>

            <div className="flex items-center justify-between p-2 glass rounded-lg">
              <span className="text-xs font-medium">Log errors</span>
              <button
                onClick={() => setLogErrors(!logErrors)}
                className={`px-2 py-1 rounded text-xs ${logErrors ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'}`}
              >
                {logErrors ? 'ON' : 'OFF'}
              </button>
            </div>

            <p className="text-xs text-slate-500">Two outputs: SUCCESS (green) and ERROR (red)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Configuration */}
      <AnimatePresence>
        {logicType === 'filter' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Configuration
            </h3>
            
            <select value={filterMode} onChange={(e) => setFilterMode(e.target.value as any)} className="input-field">
              <option value="include">Include (keep matching)</option>
              <option value="exclude">Exclude (remove matching)</option>
            </select>

            <textarea
              value={filterExpression}
              onChange={(e) => setFilterExpression(e.target.value)}
              rows={3}
              className="input-field resize-none font-mono text-sm"
              placeholder="item.value > 100"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Configuration */}
      <AnimatePresence>
        {logicType === 'map' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Map Transformation
            </h3>
            
            <textarea
              value={transformation}
              onChange={(e) => setTransformation(e.target.value)}
              rows={3}
              className="input-field resize-none font-mono text-sm"
              placeholder="{ id: item.id, name: item.name.toUpperCase() }"
            />

            <input
              type="text"
              value={outputKey}
              onChange={(e) => setOutputKey(e.target.value)}
              className="input-field"
              placeholder="Output key (optional)"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
