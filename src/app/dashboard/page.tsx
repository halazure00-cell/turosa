'use client'

import { useState, useEffect } from 'react'
import { BarChart3, BookOpen, Clock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getUserStats, getLastReadChapter } from '@/lib/progress'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    booksInProgress: 0,
    chaptersRead: 0,
    chaptersCompleted: 0,
    completionRate: 0,
  })
  const [lastRead, setLastRead] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      if (user) {
        // Fetch user stats
        const { data: statsData } = await getUserStats(user.id)
        if (statsData) {
          setStats(statsData)
        }

        // Fetch last read chapter
        const { data: lastReadData } = await getLastReadChapter(user.id)
        if (lastReadData) {
          setLastRead(lastReadData)
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-accent">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            Dashboard
          </h1>
          <p className="text-accent">
            {currentUser ? `Selamat datang, ${currentUser.email?.split('@')[0]}!` : 'Pantau progres belajar Anda'}
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Kitab Dibaca"
            value={stats.booksInProgress.toString()}
            gradient="from-primary-500 to-primary-600"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Bab Dibaca"
            value={stats.chaptersRead.toString()}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Bab Selesai"
            value={stats.chaptersCompleted.toString()}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Progres"
            value={`${stats.completionRate}%`}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Continue Learning Card */}
        {currentUser && lastRead && lastRead.chapter ? (
          <div className="card-elevated p-6 mb-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-accent-700 mb-1">
                  Lanjutkan Belajar
                </h2>
                <p className="text-sm text-accent">
                  Terakhir dibaca {new Date(lastRead.last_read_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-accent-700 mb-1">
                  {lastRead.chapter.book?.title || 'Kitab'}
                </h3>
                <p className="text-sm text-accent">
                  Bab {lastRead.chapter.order_index}: {lastRead.chapter.title}
                </p>
              </div>
              
              <Link
                href={`/reader/${lastRead.chapter.book_id}/chapter/${lastRead.chapter.id}`}
                className="btn-primary w-full group"
              >
                <span>Lanjutkan Membaca</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : currentUser ? (
          <div className="card p-6 mb-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-accent-700 mb-2">
                Belum Ada Aktivitas
              </h3>
              <p className="text-accent mb-4">
                Mulai belajar sekarang dan lacak progres Anda!
              </p>
              <Link href="/library" className="btn-primary inline-flex">
                Mulai Belajar
              </Link>
            </div>
          </div>
        ) : (
          <div className="card p-6 mb-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-accent-700 mb-2">
                Selamat Datang di Turosa
              </h3>
              <p className="text-accent mb-4">
                Silakan login untuk melacak progres belajar Anda
              </p>
              <Link href="/auth" className="btn-primary inline-flex">
                Masuk / Daftar
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/library" className="card p-4 hover:shadow-medium transition-shadow group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                <BookOpen className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-accent-700 group-hover:text-primary transition-colors">
                  Perpustakaan
                </h3>
                <p className="text-sm text-accent">
                  Jelajahi koleksi kitab
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/quiz" className="card p-4 hover:shadow-medium transition-shadow group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                <BarChart3 className="w-6 h-6 text-blue-500 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-accent-700 group-hover:text-blue-600 transition-colors">
                  Kuis Interaktif
                </h3>
                <p className="text-sm text-accent">
                  Uji pemahaman Anda
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  gradient: string
}

function StatCard({ icon, title, value, gradient }: StatCardProps) {
  return (
    <div className="card p-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-accent mb-1">{title}</p>
      <p className="text-2xl font-bold text-accent-700">{value}</p>
    </div>
  )
}
