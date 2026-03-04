import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getTemplates = async () => {
  const response = await api.get('/api/workflow/templates')
  return response.data
}

export const executeWorkflow = async (workflow: any) => {
  const response = await api.post('/api/workflow/execute', workflow)
  return response.data
}

export default api
