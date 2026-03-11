import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/testUtils'
import ErrorBoundary from '../../components/ErrorBoundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error UI when error is thrown', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = () => {}

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/reload page/i)).toBeInTheDocument()

    console.error = originalError
  })

  it('should render custom fallback when provided', () => {
    const originalError = console.error
    console.error = () => {}

    const customFallback = <div>Custom Error UI</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument()

    console.error = originalError
  })
})
