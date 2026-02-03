import { MessageSquare, Plus, Search, TrendingUp } from 'lucide-react'

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">Forum Diskusi</h1>
            <p className="text-lg text-gray-700">
              Berdiskusi dengan sesama pembelajar Kitab Kuning
            </p>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Topik Baru
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari diskusi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ForumCategoryCard
            title="Fiqih"
            description="Diskusi tentang hukum fiqih"
            topics={0}
          />
          <ForumCategoryCard
            title="Akidah"
            description="Diskusi tentang akidah Islam"
            topics={0}
          />
          <ForumCategoryCard
            title="Tafsir"
            description="Diskusi tentang tafsir Al-Quran"
            topics={0}
          />
          <ForumCategoryCard
            title="Hadits"
            description="Diskusi tentang hadits Nabi"
            topics={0}
          />
          <ForumCategoryCard
            title="Bahasa Arab"
            description="Diskusi tentang nahwu dan sharaf"
            topics={0}
          />
          <ForumCategoryCard
            title="Umum"
            description="Diskusi umum seputar pembelajaran"
            topics={0}
          />
        </div>

        {/* Latest Discussions */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-accent mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Diskusi Terbaru
          </h2>
          
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">Belum ada diskusi</p>
            <p className="text-sm mt-2">Jadilah yang pertama memulai diskusi!</p>
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
}

function ForumCategoryCard({ title, description, topics }: ForumCategoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
      <div className="flex items-start gap-4">
        <MessageSquare className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-accent mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">{description}</p>
          <span className="text-sm text-gray-500">{topics} topik</span>
        </div>
      </div>
    </div>
  )
}
