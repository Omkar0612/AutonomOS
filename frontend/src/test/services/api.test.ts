import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { apiService } from '../../services/api'

vi.mock('axios')

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('executeWorkflow', () => {
    it('should call workflow execution endpoint', async () => {
      const mockResponse = {
        data: {
          execution_id: 'test-123',
          status: 'completed',
          nodes_executed: 3,
          results: []
        }
      }

      vi.mocked(axios.post).mockResolvedValue(mockResponse)

      const workflow = {
        nodes: [],
        edges: []
      }

      const config = {
        provider: 'openrouter',
        apiKey: 'test-key',
        model: 'llama-3'
      }

      const result = await apiService.executeWorkflow(workflow, config)

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/execute'),
        expect.objectContaining({
          workflow,
          config
        })
      )
      expect(result.execution_id).toBe('test-123')
    })

    it('should handle execution errors', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('Network error'))

      const workflow = { nodes: [], edges: [] }
      const config = {
        provider: 'openai',
        apiKey: 'key',
        model: 'gpt-4'
      }

      await expect(
        apiService.executeWorkflow(workflow, config)
      ).rejects.toThrow('Network error')
    })
  })
})
