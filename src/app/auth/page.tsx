'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (authError) {
        setError(authError.message)
      } else if (data) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Turosa</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Buat akun baru' : 'Masuk ke akun Anda'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="nama@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Memproses...' : (isSignUp ? 'Daftar' : 'Masuk')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? 'Masuk sekarang' : 'Daftar sekarang'}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-accent hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
