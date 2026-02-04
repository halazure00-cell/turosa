'use client'

import { useState, useEffect } from 'react'
import { BarChart3, BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react'
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
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>
          <div className="flex items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Kitab Dibaca"
            value={stats.booksInProgress.toString()}
            color="primary"
          />
          <StatCard
            icon={<Clock className="w-8 h-8" />}
            title="Bab Dibaca"
            value={stats.chaptersRead.toString()}
            color="accent"
          />
          <StatCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Bab Selesai"
            value={stats.chaptersCompleted.toString()}
            color="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Progres"
            value={`${stats.completionRate}%`}
            color="accent"
          />
        </div>

        {/* Continue Learning */}
        {currentUser && lastRead && lastRead.chapter ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Lanjutkan Belajar</h2>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {lastRead.chapter.book?.title || 'Kitab'}
                </h3>
                <p className="text-gray-600 mb-2">
                  Bab {lastRead.chapter.order_index}: {lastRead.chapter.title}
                </p>
                <p className="text-sm text-gray-500">
                  Terakhir dibaca: {new Date(lastRead.last_read_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Link
                href={`/reader/${lastRead.chapter.book_id}/chapter/${lastRead.chapter.id}`}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Lanjutkan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : currentUser ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Aktivitas Terakhir</h2>
            <p className="text-gray-600">Belum ada aktivitas. Mulai belajar sekarang!</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Selamat Datang</h2>
            <p className="text-gray-600 mb-4">Silakan login untuk melacak progres belajar Anda.</p>
            <Link
              href="/auth"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Login / Daftar
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/library"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {currentUser && lastRead ? 'Jelajahi Kitab Lainnya' : 'Mulai Belajar'}
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
  color: 'primary' | 'accent'
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  const colorClass = color === 'primary' ? 'text-primary' : 'text-accent'
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className={`${colorClass} mb-2`}>{icon}</div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
