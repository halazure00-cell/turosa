'use client'

/**
 * React Error Boundary
 * Catches rendering errors and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home, Copy, Check } from 'lucide-react'
import { logger, LogCategory } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  copied: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    logger.error(
      LogCategory.ERROR,
      'React Error Boundary caught error',
      error,
      {
        componentStack: errorInfo.componentStack
      }
    )

    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleCopyError = () => {
    const { error, errorInfo } = this.state
    const errorText = `Error: ${error?.message}\n\nStack Trace:\n${error?.stack}\n\nComponent Stack:\n${errorInfo?.componentStack}`
    
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, copied } = this.state

      return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="card p-8 border-2 border-red-200">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-center text-accent-700 mb-3">
                Oops! Terjadi Kesalahan
              </h1>

              {/* Message */}
              <p className="text-center text-accent mb-6">
                Aplikasi mengalami kesalahan yang tidak terduga. Tim kami telah diberitahu dan akan segera memperbaikinya.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-red-900 text-sm">Error Details (Development):</p>
                    <button
                      onClick={this.handleCopyError}
                      className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-red-800 font-mono break-all mb-2">
                    {error.message}
                  </p>
                  {error.stack && (
                    <details className="text-xs text-red-700">
                      <summary className="cursor-pointer hover:text-red-900">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-48 p-2 bg-red-100 rounded">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                  {errorInfo?.componentStack && (
                    <details className="text-xs text-red-700 mt-2">
                      <summary className="cursor-pointer hover:text-red-900">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-48 p-2 bg-red-100 rounded">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Halaman
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Kembali ke Home
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-red-200">
                <p className="text-sm text-center text-accent">
                  Jika masalah terus berlanjut, silakan{' '}
                  <a
                    href="mailto:support@turosa.com"
                    className="text-primary hover:underline font-medium"
                  >
                    hubungi support
                  </a>
                </p>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-accent">
                Sementara itu, Anda dapat:
              </p>
              <ul className="mt-2 text-sm text-accent space-y-1">
                <li>• Coba akses halaman lain di aplikasi</li>
                <li>• Clear cache browser Anda</li>
                <li>• Gunakan mode incognito untuk sementara</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC to wrap components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
