'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Book } from '@/types/database'
import Link from 'next/link'

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

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
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Memuat koleksi kitab...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Book Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-lg text-center col-span-full">
                <div className="text-primary mb-4 flex justify-center">
                  <BookOpen className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-bold text-accent mb-2">
                  {searchQuery ? 'Tidak Ada Hasil' : 'Koleksi Kosong'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {searchQuery 
                    ? `Tidak ada kitab yang cocok dengan pencarian "${searchQuery}"`
                    : 'Belum ada kitab yang tersedia. Silakan upload kitab pertama Anda!'}
                </p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/reader/${book.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Book Cover */}
                  <div className="relative h-64 bg-gray-200 flex items-center justify-center">
                    {book.cover_image_url ? (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-gray-400" />
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-accent mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    )}
                    {book.category && (
                      <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded">
                        {book.category}
                      </span>
                    )}
                    {book.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
