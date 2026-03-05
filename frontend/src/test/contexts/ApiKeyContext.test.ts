import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ApiKeyProvider, useApiKeys } from '../../contexts/ApiKeyContext'

describe('ApiKeyContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty keys', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    expect(result.current.apiKeys).toEqual([])
  })

  it('should add an API key', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    act(() => {
      result.current.addApiKey({
        provider: 'openrouter',
        apiKey: 'test-key-123',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        isActive: true
      })
    })

    expect(result.current.apiKeys).toHaveLength(1)
    expect(result.current.apiKeys[0].provider).toBe('openrouter')
    expect(result.current.apiKeys[0].apiKey).toBe('test-key-123')
  })

  it('should delete an API key', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    let keyId: string

    act(() => {
      result.current.addApiKey({
        provider: 'openai',
        apiKey: 'sk-test',
        model: 'gpt-4',
        isActive: true
      })
      keyId = result.current.apiKeys[0].id
    })

    expect(result.current.apiKeys).toHaveLength(1)

    act(() => {
      result.current.deleteApiKey(keyId)
    })

    expect(result.current.apiKeys).toHaveLength(0)
  })

  it('should update an API key', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    let keyId: string

    act(() => {
      result.current.addApiKey({
        provider: 'anthropic',
        apiKey: 'sk-ant-test',
        model: 'claude-3-opus',
        isActive: false
      })
      keyId = result.current.apiKeys[0].id
    })

    act(() => {
      result.current.updateApiKey(keyId, { isActive: true })
    })

    expect(result.current.apiKeys[0].isActive).toBe(true)
  })

  it('should get active key', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    act(() => {
      result.current.addApiKey({
        provider: 'openrouter',
        apiKey: 'active-key',
        model: 'llama-3',
        isActive: true
      })
    })

    const activeKey = result.current.getActiveKey()
    expect(activeKey).not.toBeNull()
    expect(activeKey?.apiKey).toBe('active-key')
  })

  it('should return null when no active key', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    const activeKey = result.current.getActiveKey()
    expect(activeKey).toBeNull()
  })

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useApiKeys(), {
      wrapper: ApiKeyProvider
    })

    act(() => {
      result.current.addApiKey({
        provider: 'google',
        apiKey: 'google-key',
        model: 'gemini-pro',
        isActive: true
      })
    })

    const stored = localStorage.getItem('autonomos-api-keys')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].provider).toBe('google')
  })
})
