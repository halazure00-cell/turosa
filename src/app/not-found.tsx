'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* 404 Illustration */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-primary mb-2">404</h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-accent mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL tidak valid.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Kembali ke Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-secondary-dark hover:bg-accent text-accent hover:text-white px-6 py-3 rounded-lg transition-colors font-medium border border-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              Halaman Sebelumnya
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Butuh bantuan? Kunjungi{' '}
              <Link href="/library" className="text-primary hover:underline font-medium">
                Perpustakaan
              </Link>
              {' '}atau{' '}
              <Link href="/upload" className="text-primary hover:underline font-medium">
                Upload Kitab
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
