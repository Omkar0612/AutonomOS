import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-2xl w-full">
            <div className="glass-strong rounded-2xl p-8 text-center">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {/* Error Details (Development only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="glass rounded-xl p-4">
                    <summary className="cursor-pointer font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Error Details (Dev Mode)
                    </summary>
                    <div className="text-xs font-mono text-red-600 dark:text-red-400 space-y-2">
                      <div>
                        <strong>Message:</strong>
                        <pre className="mt-1 whitespace-pre-wrap break-words">
                          {this.state.error.message}
                        </pre>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-xs">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-6">
                If this problem persists, please contact support or check the console for more details.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
