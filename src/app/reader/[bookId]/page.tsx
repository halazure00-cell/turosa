'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Download, Eye, ArrowLeft, ScanText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Book, Chapter } from '@/types/database'
import Link from 'next/link'
import { use } from 'react'

export default function ReaderPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = use(params)
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchBookDetails()
    fetchChapters()
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

  const fetchChapters = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('order_index', { ascending: true })

      if (fetchError) {
        console.error('Error fetching chapters:', fetchError)
        return
      }

      setChapters(data || [])
    } catch (err: any) {
      console.error('Error fetching chapters:', err)
    }
  }

  const handleDownload = async () => {
    if (!book || !book.pdf_url) return

    try {
      // Open PDF in new tab for download
      window.open(book.pdf_url, '_blank')
    } catch (err: any) {
      alert('Gagal mengunduh file: ' + err.message)
    }
  }

  const handleView = async () => {
    if (!book || !book.pdf_url) return

    try {
      // Open PDF in new tab for viewing
      window.open(book.pdf_url, '_blank')
    } catch (err: any) {
      alert('Gagal membuka file: ' + err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat detail kitab...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
            <p className="text-red-800 mb-4">{error || 'Kitab tidak ditemukan'}</p>
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
                href="/library"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-accent">{book.title}</h1>
                {book.author && (
                  <p className="text-sm text-gray-600">{book.author}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {book.pdf_url && (
                <>
                  <button
                    onClick={handleView}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    Lihat PDF
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Cover Image */}
              <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-8">
                {book.cover_image_url && !imageError ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                ) : (
                  <BookOpen className="w-32 h-32 text-gray-400" />
                )}
              </div>

              {/* Book Information */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-accent mb-4">{book.title}</h2>
                
                <div className="space-y-3 mb-6">
                  {book.author && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Pengarang:</span>
                      <p className="text-gray-900">{book.author}</p>
                    </div>
                  )}

                  {book.category && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Kategori:</span>
                      <p className="text-gray-900">
                        <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded">
                          {book.category}
                        </span>
                      </p>
                    </div>
                  )}

                  {book.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Deskripsi:</span>
                      <p className="text-gray-700 mt-1 whitespace-pre-line">{book.description}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-gray-700">Ditambahkan:</span>
                    <p className="text-gray-900">
                      {new Date(book.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {book.pdf_url && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={handleView}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                      <Eye className="w-5 h-5" />
                      Baca Sekarang
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Fitur pembaca PDF interaktif akan tersedia di versi mendatang. 
              Untuk saat ini, gunakan tombol "Lihat PDF" atau "Download" untuk membaca kitab.
            </p>
          </div>

          {/* Digitization Section */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-accent">Digitalisasi Kitab</h2>
              <Link
                href={`/digitize/${bookId}`}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ScanText className="w-5 h-5" />
                Digitalisasi Kitab Ini
              </Link>
            </div>

            {/* Chapters List */}
            {chapters.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Bab-bab yang telah didigitalisasi ({chapters.length} bab):
                </p>
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-primary">
                            Bab {chapter.order_index}
                          </span>
                        </div>
                        <h3 className="font-semibold text-accent mb-2">
                          {chapter.title}
                        </h3>
                        {chapter.content && (
                          <p className="text-sm text-gray-600 line-clamp-2" style={{ direction: 'rtl' }}>
                            {chapter.content}
                          </p>
                        )}
                      </div>
                      <BookOpen className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ScanText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  Belum ada bab yang didigitalisasi
                </p>
                <p className="text-sm text-gray-500">
                  Klik tombol "Digitalisasi Kitab Ini" untuk memulai
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
