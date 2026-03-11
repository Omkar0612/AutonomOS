import { describe, it, expect, vi } from 'vitest'
import { exportWorkflowJSON } from '../../utils/export'
import { Node, Edge } from 'reactflow'

describe('exportWorkflowJSON', () => {
  it('should export workflow with nodes and edges', () => {
    const nodes: Node[] = [
      {
        id: '1',
        type: 'agent',
        position: { x: 0, y: 0 },
        data: { label: 'Agent 1' }
      }
    ]

    const edges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2'
      }
    ]

    // Mock URL.createObjectURL and document.createElement
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    const mockLink = {
      click: vi.fn(),
      href: '',
      download: ''
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

    exportWorkflowJSON(nodes, edges, 'test-workflow')

    expect(mockLink.download).toBe('test-workflow.json')
    expect(mockLink.click).toHaveBeenCalled()
  })
})
