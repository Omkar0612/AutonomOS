import axios, { AxiosInstance } from 'axios'
import { Node, Edge } from 'reactflow'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add API keys
    this.client.interceptors.request.use((config) => {
      const apiKeys = localStorage.getItem('autonomos-api-keys')
      if (apiKeys) {
        try {
          const keys = JSON.parse(apiKeys)
          const activeKey = keys.find((k: any) => k.isActive)
          if (activeKey) {
            config.headers['X-API-Provider'] = activeKey.provider
            config.headers['X-API-Key'] = activeKey.apiKey
            config.headers['X-Model'] = activeKey.model
          }
        } catch (e) {
          console.error('Failed to parse API keys', e)
        }
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  // Workflow execution
  async executeWorkflow(workflow: {
    nodes: Array<{ id: string; type: string; data: any; position: any }>
    edges: Array<{ id: string; source: string; target: string }>
  }) {
    const response = await this.client.post('/workflows/execute', workflow)
    return response.data
  }

  // Test API key
  async testApiKey(provider: string, apiKey: string, model: string) {
    try {
      const response = await this.client.post('/test-key', {
        provider,
        apiKey,
        model,
      })
      return response.data.success
    } catch (error) {
      return false
    }
  }

  // Get available models
  async getAvailableModels(provider: string) {
    const response = await this.client.get(`/models/${provider}`)
    return response.data
  }

  // Workflow management
  async saveWorkflow(workflow: any) {
    const response = await this.client.post('/workflows', workflow)
    return response.data
  }

  async getWorkflows() {
    const response = await this.client.get('/workflows')
    return response.data
  }

  async getWorkflow(id: string) {
    const response = await this.client.get(`/workflows/${id}`)
    return response.data
  }

  async updateWorkflow(id: string, workflow: any) {
    const response = await this.client.put(`/workflows/${id}`, workflow)
    return response.data
  }

  async deleteWorkflow(id: string) {
    const response = await this.client.delete(`/workflows/${id}`)
    return response.data
  }
}

export const apiService = new ApiService()

// Export for backward compatibility
export const executeWorkflow = (workflow: any) => apiService.executeWorkflow(workflow)
