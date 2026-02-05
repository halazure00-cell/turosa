import { BookOpen, Users, Upload, Brain, MessageSquare, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Platform Pembelajaran Modern</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-accent-700 mb-6 leading-tight">
            Belajar Kitab Kuning
            <span className="text-primary block mt-2">Lebih Mudah & Modern</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-accent mb-8 leading-relaxed">
            Platform pembelajaran digital untuk mengakses, membaca, dan mempelajari 
            Kitab Kuning dengan bantuan AI dan komunitas pembelajar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth" className="btn-primary text-base px-8 py-4 w-full sm:w-auto shadow-medium hover:shadow-elevated group">
              <span>Mulai Belajar</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/library" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
              Jelajahi Perpustakaan
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4 card">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">100+</div>
            <div className="text-xs sm:text-sm text-accent">Kitab Digital</div>
          </div>
          <div className="text-center p-4 card">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">1000+</div>
            <div className="text-xs sm:text-sm text-accent">Pembelajar</div>
          </div>
          <div className="text-center p-4 card">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-xs sm:text-sm text-accent">Ustadz</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-accent max-w-2xl mx-auto">
            Platform lengkap untuk mendukung pembelajaran Kitab Kuning Anda
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Perpustakaan Digital"
            description="Akses koleksi lengkap Kitab Kuning dalam format digital yang mudah dibaca"
            href="/library"
            gradient="from-primary-500 to-primary-600"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Kuis Interaktif"
            description="Uji pemahaman dengan kuis adaptif yang disesuaikan dengan kemampuan Anda"
            href="/quiz"
            gradient="from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="Forum Diskusi"
            description="Berdiskusi dan bertanya dengan sesama pembelajar dan ustadz"
            href="/forum"
            gradient="from-purple-500 to-purple-600"
          />
          <FeatureCard
            icon={<Upload className="w-8 h-8" />}
            title="Upload Kitab"
            description="Berkontribusi dengan mengunggah dan digitalisasi Kitab Kuning"
            href="/upload"
            gradient="from-orange-500 to-orange-600"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Lacak Progres"
            description="Pantau perkembangan belajar Anda dengan statistik yang detail"
            href="/dashboard"
            gradient="from-green-500 to-green-600"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Komunitas Aktif"
            description="Bergabung dengan komunitas pembelajar Kitab Kuning se-Indonesia"
            href="/forum"
            gradient="from-pink-500 to-pink-600"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 lg:py-20">
        <div className="card-elevated max-w-4xl mx-auto p-8 lg:p-12 text-center bg-gradient-to-br from-primary-50 to-primary-100">
          <h2 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-4">
            Siap Memulai Perjalanan Belajar?
          </h2>
          <p className="text-lg text-accent mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pembelajar lainnya dan mulai petualangan 
            mempelajari Kitab Kuning dengan cara yang lebih modern dan mudah.
          </p>
          <Link href="/auth" className="btn-primary text-base px-8 py-4 inline-flex shadow-elevated">
            <span>Daftar Sekarang Gratis</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </main>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  gradient: string
}

function FeatureCard({ icon, title, description, href, gradient }: FeatureCardProps) {
  return (
    <Link href={href} className="group">
      <div className="card-elevated p-6 h-full hover:scale-[1.02] transition-all duration-200">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-accent-700 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-accent leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}
