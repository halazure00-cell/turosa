import { BookOpen, Search, Filter } from 'lucide-react'

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Perpustakaan Digital</h1>
          <p className="text-lg text-gray-700">
            Koleksi Kitab Kuning dalam format digital
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kitab..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-primary mb-4 flex justify-center">
              <BookOpen className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-bold text-accent mb-2">Koleksi Kosong</h3>
            <p className="text-gray-600 text-sm">
              Belum ada kitab yang tersedia. Silakan upload kitab pertama Anda!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
