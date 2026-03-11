import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Types
export interface WorkflowNode {
  id: string
  type: string
  data: Record<string, any>
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface WorkflowExecutionRequest {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface WorkflowExecutionResult {
  status: string
  nodes_executed: number
  results: Record<string, any>
  provider: string
  model: string
}

export interface ApiKeyConfig {
  provider: string
  apiKey: string
  model: string
}

export interface TestKeyRequest {
  provider: string
  apiKey: string
  model: string
}

export interface TestKeyResponse {
  success: boolean
  message: string
  response?: string
}

// API Functions
export const apiService = {
  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await api.get('/api/health')
    return response.data
  },

  // Execute workflow
  async executeWorkflow(
    request: WorkflowExecutionRequest,
    apiConfig: ApiKeyConfig
  ): Promise<WorkflowExecutionResult> {
    const response = await api.post('/api/workflows/execute', request, {
      headers: {
        'X-API-Provider': apiConfig.provider,
        'X-API-Key': apiConfig.apiKey,
        'X-Model': apiConfig.model,
      },
    })
    return response.data
  },

  // Test API key
  async testApiKey(request: TestKeyRequest): Promise<TestKeyResponse> {
    const response = await api.post('/api/test-key', request)
    return response.data
  },

  // Get available models for a provider
  async getModels(provider: string): Promise<{ provider: string; models: string[] }> {
    const response = await api.get(`/api/models/${provider}`)
    return response.data
  },
}

export default api
