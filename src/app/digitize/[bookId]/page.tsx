'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import {
  BookOpen,
  Upload,
  Scan,
  Save,
  ArrowLeft,
  FileImage,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Book, Chapter } from '@/types/database'
import Link from 'next/link'

export default function DigitizePage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = use(params)
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // OCR state
  const [isScanning, setIsScanning] = useState(false)
  const [ocrText, setOcrText] = useState('')
  const [ocrError, setOcrError] = useState('')

  // Chapter save state
  const [chapterTitle, setChapterTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchBookDetails()
  }, [bookId])

  const fetchBookDetails = async () => {
    setIsLoading(true)
    setError('')

    try {
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setBook(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail kitab')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Reset OCR state
      setOcrText('')
      setOcrError('')
      setSaveSuccess(false)
    }
  }

  const handleScanPage = async () => {
    if (!selectedImage) {
      setOcrError('Silakan pilih gambar terlebih dahulu')
      return
    }

    setIsScanning(true)
    setOcrError('')
    setOcrText('')

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(selectedImage)
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1]

        try {
          const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageBase64: base64Data,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Gagal melakukan OCR')
          }

          if (data.text) {
            setOcrText(data.text)
          } else {
            setOcrError('Tidak ada teks yang terdeteksi pada gambar')
          }
        } catch (err: any) {
          setOcrError(err.message || 'Gagal melakukan OCR')
        } finally {
          setIsScanning(false)
        }
      }

      reader.onerror = () => {
        setOcrError('Gagal membaca file gambar')
        setIsScanning(false)
      }
    } catch (err: any) {
      setOcrError(err.message || 'Gagal memproses gambar')
      setIsScanning(false)
    }
  }

  const handleSaveChapter = async () => {
    if (!chapterTitle.trim()) {
      alert('Silakan masukkan judul bab')
      return
    }

    if (!ocrText.trim()) {
      alert('Tidak ada teks untuk disimpan')
      return
    }

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Anda harus login untuk menyimpan bab')
      }

      // Get the next order index
      const { data: existingChapters, error: countError } = await supabase
        .from('chapters')
        .select('order_index')
        .eq('book_id', bookId)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingChapters?.[0]?.order_index
        ? existingChapters[0].order_index + 1
        : 1

      // Insert the chapter
      const { error: insertError } = await supabase.from('chapters').insert({
        book_id: bookId,
        title: chapterTitle.trim(),
        content: ocrText.trim(),
        order_index: nextOrderIndex,
      })

      if (insertError) {
        throw new Error(insertError.message)
      }

      setSaveSuccess(true)
      
      // Reset form
      setTimeout(() => {
        setChapterTitle('')
        setOcrText('')
        setSelectedImage(null)
        setImagePreview('')
        setSaveSuccess(false)
      }, 2000)
    } catch (err: any) {
      alert('Gagal menyimpan bab: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat workspace digitalisasi...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
            <p className="text-red-800 mb-4">
              {error || 'Kitab tidak ditemukan'}
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Perpustakaan
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/reader/${bookId}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-accent">
                  Digitalisasi: {book.title}
                </h1>
                <p className="text-sm text-gray-600">
                  OCR & Intelijen Halaman Kitab
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Image Upload & Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Upload Halaman Kitab
            </h2>

            {/* Upload Input */}
            <div className="mb-4">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-gray-50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-60 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Klik untuk upload</span>{' '}
                      atau drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG atau JPEG (MAX. 10MB)
                    </p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>

            {/* Scan Button */}
            <button
              onClick={handleScanPage}
              disabled={!selectedImage || isScanning}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memindai Halaman...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Scan Halaman
                </>
              )}
            </button>

            {/* OCR Error */}
            {ocrError && (
              <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-800">{ocrError}</p>
              </div>
            )}
          </div>

          {/* Right: Text Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-accent mb-4">
              Editor Teks & Simpan Bab
            </h2>

            {/* Chapter Title Input */}
            <div className="mb-4">
              <label
                htmlFor="chapter-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Judul Bab
              </label>
              <input
                id="chapter-title"
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Masukkan judul bab..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Text Editor */}
            <div className="mb-4">
              <label
                htmlFor="chapter-content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Konten Bab (Human-in-the-Loop)
              </label>
              <textarea
                id="chapter-content"
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                placeholder="Hasil OCR akan muncul di sini. Anda dapat mengeditnya sebelum menyimpan..."
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                style={{ direction: 'rtl' }} // Right-to-left for Arabic text
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveChapter}
              disabled={isSaving || !ocrText.trim() || !chapterTitle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Bab
                </>
              )}
            </button>

            {/* Success Message */}
            {saveSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Bab berhasil disimpan!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Panduan:</strong> Upload gambar halaman kitab, klik "Scan
            Halaman" untuk OCR otomatis, edit teks jika diperlukan, lalu simpan
            sebagai bab baru. Gunakan fitur Human-in-the-Loop untuk memastikan
            akurasi teks.
          </p>
        </div>
      </div>
    </div>
  )
}
