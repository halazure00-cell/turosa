'use client'

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react'
import { Upload as UploadIcon, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured, validateSupabaseConnection } from '@/lib/supabase'
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
  const [configError, setConfigError] = useState<string | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Check Supabase configuration on mount
  useEffect(() => {
    const checkConfig = async () => {
      if (!isSupabaseConfigured()) {
        setConfigError('Aplikasi belum dikonfigurasi dengan benar. Environment variables Supabase belum diatur.')
        return
      }
      
      // Validate connection
      const { isValid, error: validationError } = await validateSupabaseConnection()
      if (!isValid) {
        setConfigError(validationError || 'Tidak dapat terhubung ke Supabase')
      }
    }
    
    checkConfig()
  }, [])

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

    // Check configuration first
    if (!isSupabaseConfigured()) {
      const errorMsg = 'Sistem belum dikonfigurasi. Hubungi administrator untuk mengatur credentials Supabase.'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    // Validate connection before upload
    const { isValid, error: validationError } = await validateSupabaseConnection()
    if (!isValid) {
      const errorMsg = validationError || 'Tidak dapat terhubung ke server. Periksa konfigurasi.'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

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
          // Provide more helpful error messages
          if (coverError.message.includes('Invalid API key') || coverError.message.includes('JWT')) {
            throw new Error('Konfigurasi API tidak valid. Hubungi administrator untuk memperbaiki SUPABASE credentials.')
          }
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
        // Provide more helpful error messages
        if (pdfError.message.includes('Invalid API key') || pdfError.message.includes('JWT') || pdfError.message.includes('invalid')) {
          throw new Error('Konfigurasi API tidak valid. Hubungi administrator untuk memperbaiki credentials Supabase (NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY).')
        }
        if (pdfError.message.includes('row-level security')) {
          throw new Error('Akses ditolak. Pastikan Anda sudah login dan memiliki izin untuk upload.')
        }
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
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            Upload Kitab
          </h1>
          <p className="text-accent">
            Berkontribusi dengan mengunggah Kitab Kuning untuk koleksi digital
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Configuration Error Message */}
          {configError && (
            <div className="card p-6 mb-6 border-2 border-red-300 bg-red-50 animate-slide-down">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900 mb-2">⚠️ Konfigurasi Sistem Tidak Lengkap</p>
                  <p className="text-sm text-red-800 mb-3">{configError}</p>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-red-900 mb-2">Panduan untuk Administrator:</p>
                    <ol className="text-sm text-red-800 space-y-2 list-decimal list-inside">
                      <li>Buat project di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase</a></li>
                      <li>Dapatkan URL dan Anon Key dari Dashboard Supabase</li>
                      <li>Set environment variables berikut:
                        <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                          <li><code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                          <li><code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                        </ul>
                      </li>
                      <li>Restart aplikasi setelah konfigurasi</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="card p-4 mb-6 border-2 border-green-200 bg-green-50 animate-slide-down">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 mb-1">Upload Berhasil!</p>
                  <p className="text-sm text-green-700">Kitab telah ditambahkan ke perpustakaan.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="card p-4 mb-6 border-2 border-red-200 bg-red-50 animate-slide-down">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Areas */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Cover Image Upload */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-accent-700 mb-3">Cover Kitab (Opsional)</h3>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-accent mb-3">
                  {coverFile ? (
                    <span className="text-primary font-medium">{coverFile.name}</span>
                  ) : (
                    'JPEG/PNG (Max 5MB)'
                  )}
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
                  className="btn-secondary text-sm cursor-pointer"
                >
                  Pilih Cover
                </label>
              </div>
            </div>

            {/* PDF File Upload */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-accent-700 mb-3">File Kitab (PDF) *</h3>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-accent mb-3">
                  {pdfFile ? (
                    <span className="text-primary font-medium">{pdfFile.name}</span>
                  ) : (
                    'PDF (Max 50MB)'
                  )}
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
                  className="btn-secondary text-sm cursor-pointer"
                >
                  Pilih File PDF
                </label>
              </div>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-accent-700 mb-6">Informasi Kitab</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Judul Kitab *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full"
                  placeholder="Contoh: Fathul Qarib"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Pengarang
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input w-full"
                  placeholder="Nama pengarang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input w-full"
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
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input w-full"
                  placeholder="Deskripsi singkat tentang kitab..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="card p-4 mb-6 border-2 border-blue-200 bg-blue-50">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Panduan Upload:</p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Pastikan file dalam kondisi yang jelas dan dapat dibaca</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Lengkapi semua informasi kitab dengan akurat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>File akan direview sebelum dipublikasikan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-base py-4 shadow-medium hover:shadow-elevated"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mengupload...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <UploadIcon className="w-5 h-5" />
                <span>Upload Kitab</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
