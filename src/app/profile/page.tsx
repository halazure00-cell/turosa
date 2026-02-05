import { User, BookOpen, Trophy, Clock, Settings, Award, TrendingUp } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-6">
          Profil Pengguna
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-accent-700 mb-1">Pengguna</h2>
                <p className="text-sm text-accent">pengguna@email.com</p>
              </div>

              <div className="space-y-3 border-t border-secondary-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent">Bergabung</span>
                  <span className="text-sm font-semibold text-accent-700">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent">Level</span>
                  <span className="text-sm font-semibold text-primary">Pemula</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent">Poin</span>
                  <span className="text-sm font-semibold text-accent-700">0</span>
                </div>
              </div>

              <button className="btn-secondary w-full mt-6">
                <Settings className="w-5 h-5 mr-2" />
                Pengaturan
              </button>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-accent-700 mb-6">Statistik Belajar</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <StatItem
                  icon={<BookOpen className="w-6 h-6" />}
                  label="Kitab"
                  value="0"
                  gradient="from-primary-500 to-primary-600"
                />
                <StatItem
                  icon={<Clock className="w-6 h-6" />}
                  label="Waktu"
                  value="0h"
                  gradient="from-blue-500 to-blue-600"
                />
                <StatItem
                  icon={<Trophy className="w-6 h-6" />}
                  label="Kuis"
                  value="0"
                  gradient="from-orange-500 to-orange-600"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-accent-700 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Aktivitas Terbaru
              </h2>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <p className="text-lg font-medium text-accent-700 mb-1">Belum ada aktivitas</p>
                <p className="text-sm text-accent">Mulai belajar untuk melihat aktivitas Anda</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-accent-700 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Pencapaian
              </h2>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
                <p className="text-lg font-medium text-accent-700 mb-1">Belum ada pencapaian</p>
                <p className="text-sm text-accent">Selesaikan kuis dan baca kitab untuk mendapatkan pencapaian</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
  gradient: string
}

function StatItem({ icon, label, value, gradient }: StatItemProps) {
  return (
    <div className="text-center">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-accent mb-0.5">{label}</p>
      <p className="text-xl font-bold text-accent-700">{value}</p>
    </div>
  )
}
