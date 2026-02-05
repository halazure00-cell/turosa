'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, Filter, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Book } from '@/types/database'
import Link from 'next/link'

const BOOKS_PER_PAGE = 12

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchBooks()
  }, [currentPage])

  useEffect(() => {
    // Reset to page 1 when search query changes
    if (searchQuery.trim() !== '') {
      setCurrentPage(1)
    }
  }, [searchQuery])

  useEffect(() => {
    // Filter books based on search query
    if (searchQuery.trim() === '') {
      setFilteredBooks(books)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.category && book.category.toLowerCase().includes(query))
      )
      setFilteredBooks(filtered)
    }
  }, [searchQuery, books])

  const fetchBooks = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Get total count
      const { count } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })

      setTotalCount(count || 0)

      // Fetch books with pagination
      const start = (currentPage - 1) * BOOKS_PER_PAGE
      const end = start + BOOKS_PER_PAGE - 1

      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setBooks(data || [])
      setFilteredBooks(data || [])
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data kitab')
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / BOOKS_PER_PAGE)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            Perpustakaan Digital
          </h1>
          <p className="text-accent">
            Koleksi lengkap Kitab Kuning dalam format digital
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kitab, pengarang, kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-11 w-full"
              />
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-ghost p-3 lg:hidden"
              aria-label="Toggle view"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <p className="text-accent">Memuat koleksi kitab...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card p-4 border-2 border-red-200 bg-red-50 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Book Grid */}
        {!isLoading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-accent-700 mb-2">
                  {searchQuery ? 'Tidak Ada Hasil' : 'Koleksi Kosong'}
                </h3>
                <p className="text-accent mb-4">
                  {searchQuery 
                    ? `Tidak ada kitab yang cocok dengan pencarian "${searchQuery}"`
                    : 'Belum ada kitab yang tersedia. Silakan upload kitab pertama Anda!'}
                </p>
                {!searchQuery && (
                  <Link href="/upload" className="btn-primary inline-flex">
                    Upload Kitab
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                  : "space-y-4"
                }>
                  {filteredBooks.map((book) => (
                    viewMode === 'grid' ? (
                      <Link
                        key={book.id}
                        href={`/reader/${book.id}`}
                        className="card-elevated overflow-hidden hover:scale-[1.02] transition-all group"
                      >
                        {/* Book Cover */}
                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                          {book.cover_image_url ? (
                            <img
                              src={book.cover_image_url}
                              alt={book.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <BookOpen className="w-16 h-16 text-accent/30" />
                          )}
                        </div>

                        {/* Book Info */}
                        <div className="p-4">
                          <h3 className="font-bold text-accent-700 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {book.title}
                          </h3>
                          {book.author && (
                            <p className="text-sm text-accent mb-2 line-clamp-1">{book.author}</p>
                          )}
                          {book.category && (
                            <span className="inline-block bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">
                              {book.category}
                            </span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={book.id}
                        href={`/reader/${book.id}`}
                        className="card p-4 hover:shadow-medium transition-all group"
                      >
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl overflow-hidden">
                            {book.cover_image_url ? (
                              <img
                                src={book.cover_image_url}
                                alt={book.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-accent/30" />
                              </div>
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-accent-700 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                              {book.title}
                            </h3>
                            {book.author && (
                              <p className="text-sm text-accent mb-2">{book.author}</p>
                            )}
                            {book.description && (
                              <p className="text-sm text-accent line-clamp-2 mb-2">
                                {book.description}
                              </p>
                            )}
                            {book.category && (
                              <span className="inline-block bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">
                                {book.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {!searchQuery && totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={!canGoPrevious}
                      className="btn-secondary disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      <span className="hidden sm:inline">Sebelumnya</span>
                    </button>
                    
                    <div className="flex items-center gap-2 px-4 py-2 card">
                      <span className="text-sm text-accent">
                        <span className="font-bold text-primary">{currentPage}</span> / {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={!canGoNext}
                      className="btn-primary disabled:opacity-50"
                    >
                      <span className="hidden sm:inline">Selanjutnya</span>
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
