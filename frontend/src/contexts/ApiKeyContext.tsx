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
    description: 'Access 200+ AI models including 24 FREE models (no card needed) - Recommended',
    models: [
      // ⭐ BEST FREE MODELS (2026)
      { value: 'google/gemini-2.0-flash-exp:free', label: '🆓 Gemini 2.0 Flash (1M context, experimental)', free: true },
      { value: 'meta-llama/llama-3.3-70b-instruct:free', label: '🆓 Llama 3.3 70B (GPT-4 level)', free: true },
      { value: 'meta-llama/llama-3.1-405b-instruct:free', label: '🆓 Llama 3.1 405B (most capable)', free: true },
      { value: 'mistralai/devstral-2512:free', label: '🆓 Devstral 2 (best for coding)', free: true },
      { value: 'qwen/qwen3-coder-480b:free', label: '🆓 Qwen3-Coder 480B (coding)', free: true },
      { value: 'deepseek/deepseek-r1:free', label: '🆓 DeepSeek R1 (reasoning)', free: true },
      { value: 'deepseek/deepseek-chat:free', label: '🆓 DeepSeek Chat (general)', free: true },
      { value: 'nvidia/nemotron-3-nano-30b:free', label: '🆓 Nemotron 3 Nano (AI agents)', free: true },
      { value: 'mistralai/mistral-small-3.1:free', label: '🆓 Mistral Small 3.1 (fast)', free: true },
      { value: 'mistralai/mistral-7b-instruct:free', label: '🆓 Mistral 7B (lightweight)', free: true },
      { value: 'nous-research/hermes-3-405b:free', label: '🆓 Hermes 3 405B (instruction)', free: true },
      { value: 'google/gemma-3-27b-it:free', label: '🆓 Gemma 3 27B (multimodal)', free: true },
      { value: 'liquid/lfm-2.5-1.2b-thinking:free', label: '🆓 LFM2.5 1.2B (reasoning)', free: true },
      { value: 'qwen/qwen-2.5-vl-7b-instruct:free', label: '🆓 Qwen 2.5 VL (vision)', free: true },
      
      // 💎 PREMIUM MODELS (Paid)
      { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo (paid)', free: false },
      { value: 'openai/gpt-4', label: 'GPT-4 (paid)', free: false },
      { value: 'openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo (paid)', free: false },
      { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus (paid)', free: false },
      { value: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet (paid)', free: false },
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (paid)', free: false },
      { value: 'google/gemini-pro-1.5', label: 'Gemini 1.5 Pro (paid)', free: false },
      { value: 'google/gemini-pro', label: 'Gemini Pro (paid)', free: false },
      { value: 'meta-llama/llama-3-70b-instruct', label: 'Llama 3 70B (paid)', free: false },
      { value: 'mistralai/mixtral-8x7b-instruct', label: 'Mixtral 8x7B (paid)', free: false },
    ],
    docsUrl: 'https://openrouter.ai/docs',
    signupUrl: 'https://openrouter.ai/keys'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models (paid)',
    models: [
      { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo', free: false },
      { value: 'gpt-4', label: 'GPT-4', free: false },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', free: false },
    ],
    docsUrl: 'https://platform.openai.com/docs',
    signupUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 family models (paid)',
    models: [
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', free: false },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', free: false },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', free: false },
    ],
    docsUrl: 'https://docs.anthropic.com',
    signupUrl: 'https://console.anthropic.com/'
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini models (paid)',
    models: [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', free: false },
      { value: 'gemini-pro', label: 'Gemini Pro', free: false },
    ],
    docsUrl: 'https://ai.google.dev/docs',
    signupUrl: 'https://makersuite.google.com/app/apikey'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast LLM inference (paid)',
    models: [
      { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', free: false },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', free: false },
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', free: false },
    ],
    docsUrl: 'https://console.groq.com/docs',
    signupUrl: 'https://console.groq.com/keys'
  },
] as const

// Helper to get recommended free models
export const RECOMMENDED_FREE_MODELS = [
  {
    name: 'Best for Coding',
    models: [
      'mistralai/devstral-2512:free',
      'qwen/qwen3-coder-480b:free',
    ]
  },
  {
    name: 'Best Overall Free',
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'meta-llama/llama-3.1-405b-instruct:free',
    ]
  },
  {
    name: 'Best for Long Context',
    models: [
      'google/gemini-2.0-flash-exp:free', // 1M tokens
    ]
  },
  {
    name: 'Best for Reasoning',
    models: [
      'deepseek/deepseek-r1:free',
      'liquid/lfm-2.5-1.2b-thinking:free',
    ]
  },
  {
    name: 'Fast & Lightweight',
    models: [
      'mistralai/mistral-small-3.1:free',
      'mistralai/mistral-7b-instruct:free',
    ]
  },
]

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
