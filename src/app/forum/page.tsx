import { MessageSquare, Plus, Search, TrendingUp, Users } from 'lucide-react'

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
              Forum Diskusi
            </h1>
            <p className="text-accent">
              Berdiskusi dengan sesama pembelajar Kitab Kuning
            </p>
          </div>
          <button className="btn-primary hidden sm:inline-flex flex-shrink-0">
            <Plus className="w-5 h-5 mr-2" />
            Topik Baru
          </button>
        </div>

        {/* Mobile New Topic Button */}
        <button className="btn-primary w-full mb-4 sm:hidden">
          <Plus className="w-5 h-5 mr-2" />
          Topik Baru
        </button>

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-5 h-5" />
            <input
              type="text"
              placeholder="Cari diskusi..."
              className="input pl-11 w-full"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ForumCategoryCard
            title="Fiqih"
            description="Diskusi tentang hukum fiqih"
            topics={0}
            gradient="from-primary-500 to-primary-600"
          />
          <ForumCategoryCard
            title="Akidah"
            description="Diskusi tentang akidah Islam"
            topics={0}
            gradient="from-blue-500 to-blue-600"
          />
          <ForumCategoryCard
            title="Tafsir"
            description="Diskusi tentang tafsir Al-Quran"
            topics={0}
            gradient="from-purple-500 to-purple-600"
          />
          <ForumCategoryCard
            title="Hadits"
            description="Diskusi tentang hadits Nabi"
            topics={0}
            gradient="from-orange-500 to-orange-600"
          />
          <ForumCategoryCard
            title="Bahasa Arab"
            description="Diskusi tentang nahwu dan sharaf"
            topics={0}
            gradient="from-green-500 to-green-600"
          />
          <ForumCategoryCard
            title="Umum"
            description="Diskusi umum seputar pembelajaran"
            topics={0}
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Latest Discussions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-accent-700 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Diskusi Terbaru
          </h2>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg font-medium text-accent-700 mb-1">Belum ada diskusi</p>
            <p className="text-sm text-accent">Jadilah yang pertama memulai diskusi!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ForumCategoryCardProps {
  title: string
  description: string
  topics: number
  gradient: string
}

function ForumCategoryCard({ title, description, topics, gradient }: ForumCategoryCardProps) {
  return (
    <div className="card-elevated p-5 hover:scale-[1.02] transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-accent-700 mb-0.5">{title}</h3>
          <p className="text-sm text-accent mb-2 line-clamp-2">{description}</p>
          <span className="text-xs text-accent font-medium">{topics} topik</span>
        </div>
      </div>
    </div>
  )
}
