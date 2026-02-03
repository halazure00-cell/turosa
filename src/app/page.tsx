import { BookOpen, Users, Upload, Brain, MessageSquare, User } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary mb-4">
            Turosa
          </h1>
          <p className="text-2xl text-accent mb-8">
            Media Belajar Kitab Kuning
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Platform pembelajaran modern untuk mengakses, membaca, dan mempelajari 
            Kitab Kuning dengan bantuan AI dan komunitas pembelajar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12" />}
            title="Perpustakaan Digital"
            description="Akses koleksi Kitab Kuning dalam format digital"
            href="/library"
          />
          <FeatureCard
            icon={<Upload className="w-12 h-12" />}
            title="Upload Kitab"
            description="Berkontribusi dengan mengunggah Kitab Kuning"
            href="/upload"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12" />}
            title="Kuis Interaktif"
            description="Uji pemahaman dengan kuis yang adaptif"
            href="/quiz"
          />
          <FeatureCard
            icon={<MessageSquare className="w-12 h-12" />}
            title="Forum Diskusi"
            description="Berdiskusi dengan sesama pembelajar"
            href="/forum"
          />
          <FeatureCard
            icon={<User className="w-12 h-12" />}
            title="Profil Pengguna"
            description="Lacak progres pembelajaran Anda"
            href="/profile"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12" />}
            title="Dashboard"
            description="Kelola aktivitas belajar Anda"
            href="/dashboard"
          />
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-x-4">
          <Link
            href="/auth"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Mulai Belajar
          </Link>
          <Link
            href="/library"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Jelajahi Perpustakaan
          </Link>
        </div>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-accent mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
