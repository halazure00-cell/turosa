'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { Upload as UploadIcon, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')

  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0])
    }
  }

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setUploadSuccess(false)

    // Validation
    if (!title.trim()) {
      const errorMsg = 'Judul kitab harus diisi'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    if (!pdfFile) {
      const errorMsg = 'File PDF kitab harus dipilih'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setIsLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        const errorMsg = 'Anda harus login terlebih dahulu'
        setError(errorMsg)
        toast.error(errorMsg)
        setIsLoading(false)
        return
      }

      let coverImageUrl = null
      let pdfUrl = null

      // Upload cover image if provided
      if (coverFile) {
        const coverFileName = `${Date.now()}_${coverFile.name}`
        const { data: coverData, error: coverError } = await supabase.storage
          .from('book-covers')
          .upload(coverFileName, coverFile)

        if (coverError) {
          throw new Error(`Gagal upload cover: ${coverError.message}`)
        }

        // Get public URL for cover
        const { data: { publicUrl } } = supabase.storage
          .from('book-covers')
          .getPublicUrl(coverFileName)
        
        coverImageUrl = publicUrl
      }

      // Upload PDF file
      const pdfFileName = `${Date.now()}_${pdfFile.name}`
      const { data: pdfData, error: pdfError } = await supabase.storage
        .from('book-files')
        .upload(pdfFileName, pdfFile)

      if (pdfError) {
        throw new Error(`Gagal upload PDF: ${pdfError.message}`)
      }

      // Get signed URL for PDF (since it's private) - valid for 1 year
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('book-files')
        .createSignedUrl(pdfFileName, 31536000) // 1 year in seconds
      
      if (signedUrlError) {
        throw new Error(`Gagal membuat URL PDF: ${signedUrlError.message}`)
      }

      pdfUrl = signedUrlData.signedUrl

      // Insert book metadata into database
      const { error: dbError } = await supabase
        .from('books')
        .insert({
          title: title.trim(),
          author: author.trim() || null,
          description: description.trim() || null,
          category: category || null,
          pdf_url: pdfUrl,
          cover_image_url: coverImageUrl,
          uploader_id: user.id
        })

      if (dbError) {
        throw new Error(`Gagal menyimpan data: ${dbError.message}`)
      }

      // Success
      setUploadSuccess(true)
      toast.success('Upload berhasil! Kitab telah ditambahkan ke perpustakaan.')
      
      // Reset form
      setTitle('')
      setAuthor('')
      setCategory('')
      setDescription('')
      setCoverFile(null)
      setPdfFile(null)
      if (coverInputRef.current) coverInputRef.current.value = ''
      if (pdfInputRef.current) pdfInputRef.current.value = ''

    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat upload'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Upload Kitab</h1>
          <p className="text-lg text-gray-700">
            Berkontribusi dengan mengunggah Kitab Kuning untuk koleksi digital
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Upload berhasil! Kitab telah ditambahkan ke perpustakaan.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Area - Cover Image */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <h3 className="text-lg font-bold text-accent mb-4">Cover Kitab (Opsional)</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">
                {coverFile ? coverFile.name : 'JPEG atau PNG (Maksimal 5MB)'}
              </p>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleCoverChange}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer inline-block"
              >
                Pilih Cover
              </label>
            </div>
          </div>

          {/* Upload Area - PDF File */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <h3 className="text-lg font-bold text-accent mb-4">File Kitab (PDF) *</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">
                {pdfFile ? pdfFile.name : 'PDF (Maksimal 50MB)'}
              </p>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer inline-block"
              >
                Pilih File PDF
              </label>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-accent mb-6">Informasi Kitab</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Kitab *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: Fathul Qarib"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pengarang
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nama pengarang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Fiqih">Fiqih</option>
                  <option value="Akidah">Akidah</option>
                  <option value="Tafsir">Tafsir</option>
                  <option value="Hadits">Hadits</option>
                  <option value="Nahwu">Nahwu</option>
                  <option value="Sharaf">Sharaf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Mengupload...' : 'Upload Kitab'}
          </button>
        </form>
      </div>
    </div>
  )
}
