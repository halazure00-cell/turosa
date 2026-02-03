import { BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

export default function ReaderPage({ params }: { params: { bookId: string } }) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-accent">Nama Kitab</h1>
                <p className="text-sm text-gray-600">Pengarang</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ZoomOut className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">100%</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BookOpen className="w-24 h-24 mx-auto mb-4" />
            <p className="text-lg">Halaman kitab akan ditampilkan di sini</p>
            <p className="text-sm mt-2">Book ID: {params.bookId}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Sebelumnya
          </button>
          <span className="text-gray-700">Halaman 1 dari 1</span>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Selanjutnya
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
