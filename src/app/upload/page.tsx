import { Upload as UploadIcon, FileText, Image, AlertCircle } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Upload Kitab</h1>
          <p className="text-lg text-gray-700">
            Berkontribusi dengan mengunggah Kitab Kuning untuk koleksi digital
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-accent mb-2">
                Pilih File atau Drag & Drop
              </h3>
              <p className="text-gray-600 mb-4">
                PDF, JPEG, atau PNG (Maksimal 50MB)
              </p>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Pilih File
              </button>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-accent mb-6">Informasi Kitab</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Kitab
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: Fathul Qarib"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pengarang
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nama pengarang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Pilih kategori</option>
                  <option>Fiqih</option>
                  <option>Akidah</option>
                  <option>Tafsir</option>
                  <option>Hadits</option>
                  <option>Nahwu</option>
                  <option>Sharaf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Deskripsi singkat tentang kitab..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Panduan Upload:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pastikan file dalam kondisi yang jelas dan dapat dibaca</li>
                <li>Lengkapi semua informasi kitab dengan akurat</li>
                <li>File akan direview sebelum dipublikasikan</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors">
            Upload Kitab
          </button>
        </div>
      </div>
    </div>
  )
}
