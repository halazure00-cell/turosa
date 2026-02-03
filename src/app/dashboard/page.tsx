import { BarChart3, BookOpen, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Kitab Dibaca"
            value="0"
            color="primary"
          />
          <StatCard
            icon={<Clock className="w-8 h-8" />}
            title="Waktu Belajar"
            value="0 jam"
            color="accent"
          />
          <StatCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Kuis Diselesaikan"
            value="0"
            color="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Progres"
            value="0%"
            color="accent"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-accent mb-4">Aktivitas Terakhir</h2>
          <p className="text-gray-600">Belum ada aktivitas. Mulai belajar sekarang!</p>
        </div>

        <div className="text-center">
          <Link
            href="/library"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Mulai Belajar
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
