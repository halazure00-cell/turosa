'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-accent mb-3">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">
            Maaf, terjadi kesalahan yang tidak terduga. Kami sedang berusaha memperbaikinya.
          </p>

          {/* Error Details (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Lagi
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-secondary-dark hover:bg-accent text-accent hover:text-white px-6 py-3 rounded-lg transition-colors font-medium border border-accent"
            >
              <Home className="w-5 h-5" />
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Jika masalah terus berlanjut, silakan refresh halaman atau hubungi admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
