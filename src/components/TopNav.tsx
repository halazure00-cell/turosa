'use client'

import { Menu, X, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function TopNav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Berhasil keluar')
    router.push('/')
    setIsOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-secondary-200 safe-area-top">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl text-primary hidden sm:inline">Turosa</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/dashboard" className="text-accent-700 hover:text-primary font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/library" className="text-accent-700 hover:text-primary font-medium transition-colors">
                Perpustakaan
              </Link>
              <Link href="/quiz" className="text-accent-700 hover:text-primary font-medium transition-colors">
                Kuis
              </Link>
              <Link href="/forum" className="text-accent-700 hover:text-primary font-medium transition-colors">
                Forum
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/profile" className="btn-secondary text-sm">
                    Profil
                  </Link>
                  <button onClick={handleSignOut} className="btn-ghost text-sm">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/auth" className="btn-primary text-sm hidden sm:inline-flex">
                  Masuk
                </Link>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden btn-ghost p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-64 bg-white z-40 shadow-elevated animate-slide-down lg:hidden">
            <div className="p-6 pt-20">
              {user ? (
                <div className="mb-6">
                  <p className="text-sm text-accent mb-1">Selamat datang,</p>
                  <p className="font-medium text-accent-dark truncate">{user.email}</p>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="btn-primary w-full mb-6"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk / Daftar
                </Link>
              )}

              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 rounded-xl text-accent-700 hover:bg-secondary-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/library"
                  className="block px-4 py-3 rounded-xl text-accent-700 hover:bg-secondary-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Perpustakaan
                </Link>
                <Link
                  href="/quiz"
                  className="block px-4 py-3 rounded-xl text-accent-700 hover:bg-secondary-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Kuis
                </Link>
                <Link
                  href="/forum"
                  className="block px-4 py-3 rounded-xl text-accent-700 hover:bg-secondary-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Forum
                </Link>
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 rounded-xl text-accent-700 hover:bg-secondary-100 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Keluar
                    </button>
                  </>
                )}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
