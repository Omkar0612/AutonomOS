import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ApiKey {
  id: string
  provider: 'openrouter' | 'openai' | 'anthropic' | 'google' | 'groq' | 'together' | 'replicate'
  apiKey: string
  model: string
  isActive: boolean
  createdAt: string
}

export const AI_PROVIDERS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access 50+ AI models with a single API key (Recommended)',
    models: [
      { value: 'openai/gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
      { value: 'openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus' },
      { value: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet' },
      { value: 'google/gemini-pro-1.5', label: 'Gemini 1.5 Pro' },
      { value: 'meta-llama/llama-3-70b-instruct', label: 'Llama 3 70B' },
      { value: 'mistralai/mixtral-8x7b-instruct', label: 'Mixtral 8x7B' },
      { value: 'meta-llama/llama-3-8b-instruct', label: 'Llama 3 8B' },
    ],
    docsUrl: 'https://openrouter.ai/docs',
    signupUrl: 'https://openrouter.ai/keys'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    models: [
      { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ],
    docsUrl: 'https://platform.openai.com/docs',
    signupUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 family models',
    models: [
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ],
    docsUrl: 'https://docs.anthropic.com',
    signupUrl: 'https://console.anthropic.com/'
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini models',
    models: [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-pro', label: 'Gemini Pro' },
    ],
    docsUrl: 'https://ai.google.dev/docs',
    signupUrl: 'https://makersuite.google.com/app/apikey'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast LLM inference',
    models: [
      { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
    ],
    docsUrl: 'https://console.groq.com/docs',
    signupUrl: 'https://console.groq.com/keys'
  },
] as const

interface ApiKeyContextType {
  apiKeys: ApiKey[]
  addApiKey: (key: Omit<ApiKey, 'id' | 'createdAt'>) => void
  updateApiKey: (id: string, updates: Partial<ApiKey>) => void
  deleteApiKey: (id: string) => void
  getActiveKey: (provider?: string) => ApiKey | null
  testApiKey: (provider: string, apiKey: string) => Promise<boolean>
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('autonomos-api-keys')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('autonomos-api-keys', JSON.stringify(apiKeys))
  }, [apiKeys])

  const addApiKey = (key: Omit<ApiKey, 'id' | 'createdAt'>) => {
    // Deactivate other keys for the same provider
    const updatedKeys = apiKeys.map(k => 
      k.provider === key.provider ? { ...k, isActive: false } : k
    )
    
    const newKey: ApiKey = {
      ...key,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    
    setApiKeys([...updatedKeys, newKey])
  }

  const updateApiKey = (id: string, updates: Partial<ApiKey>) => {
    setApiKeys(keys => keys.map(k => {
      if (k.id === id) {
        // If activating this key, deactivate others for same provider
        if (updates.isActive) {
          setApiKeys(prev => prev.map(pk => 
            pk.provider === k.provider && pk.id !== id 
              ? { ...pk, isActive: false } 
              : pk
          ))
        }
        return { ...k, ...updates }
      }
      return k
    }))
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(keys => keys.filter(k => k.id !== id))
  }

  const getActiveKey = (provider?: string): ApiKey | null => {
    if (provider) {
      return apiKeys.find(k => k.provider === provider && k.isActive) || null
    }
    // Priority: OpenRouter > OpenAI > Others
    return apiKeys.find(k => k.provider === 'openrouter' && k.isActive) ||
           apiKeys.find(k => k.provider === 'openai' && k.isActive) ||
           apiKeys.find(k => k.isActive) ||
           null
  }

  const testApiKey = async (provider: string, apiKey: string): Promise<boolean> => {
    // Mock validation for now - in production, make actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(apiKey.length > 10)
      }, 1000)
    })
  }

  return (
    <ApiKeyContext.Provider value={{
      apiKeys,
      addApiKey,
      updateApiKey,
      deleteApiKey,
      getActiveKey,
      testApiKey,
    }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKeys() {
  const context = useContext(ApiKeyContext)
  if (!context) throw new Error('useApiKeys must be used within ApiKeyProvider')
  return context
}
