import { User, BookOpen, Trophy, Clock, Settings } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Profil Pengguna</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-accent mb-1">Pengguna</h2>
                <p className="text-gray-600">pengguna@email.com</p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bergabung</span>
                  <span className="font-medium text-accent">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium text-primary">Pemula</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-accent hover:bg-accent-dark text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Pengaturan
              </button>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-accent mb-6">Statistik Belajar</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <StatItem
                  icon={<BookOpen className="w-8 h-8" />}
                  label="Kitab Dibaca"
                  value="0"
                  color="primary"
                />
                <StatItem
                  icon={<Clock className="w-8 h-8" />}
                  label="Waktu Belajar"
                  value="0 jam"
                  color="accent"
                />
                <StatItem
                  icon={<Trophy className="w-8 h-8" />}
                  label="Kuis Diselesaikan"
                  value="0"
                  color="primary"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-accent mb-6">Aktivitas Terbaru</h2>
              
              <div className="text-center py-12 text-gray-400">
                <Clock className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Belum ada aktivitas</p>
                <p className="text-sm mt-2">Mulai belajar untuk melihat aktivitas Anda</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-accent mb-6">Pencapaian</h2>
              
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Belum ada pencapaian</p>
                <p className="text-sm mt-2">Selesaikan kuis dan baca kitab untuk mendapatkan pencapaian</p>
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
  color: 'primary' | 'accent'
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  const colorClass = color === 'primary' ? 'text-primary' : 'text-accent'
  
  return (
    <div className="text-center">
      <div className={`${colorClass} mb-2 flex justify-center`}>{icon}</div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
