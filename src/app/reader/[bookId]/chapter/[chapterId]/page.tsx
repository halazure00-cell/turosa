'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { saveProgress, markAsCompleted, getChapterProgress } from '@/lib/progress'
import { Book, Chapter } from '@/types/database'
import Link from 'next/link'
import { use } from 'react'
import AIChatSidebar from '@/components/AIChatSidebar'

export default function ChapterReaderPage({ 
  params 
}: { 
  params: Promise<{ bookId: string; chapterId: string }> 
}) {
  const { bookId, chapterId } = use(params)
  const [book, setBook] = useState<Book | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [allChapters, setAllChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    initializePage()
  }, [bookId, chapterId])

  const initializePage = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Fetch book, chapter, and all chapters in parallel
      await Promise.all([
        fetchBook(),
        fetchChapter(),
        fetchAllChapters()
      ])

      // Save progress if user is logged in
      if (user) {
        await saveProgress(user.id, chapterId)
        
        // Check if chapter is already completed
        const { data: progressData } = await getChapterProgress(user.id, chapterId)
        if (progressData) {
          setIsCompleted(progressData.is_completed)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBook = async () => {
    const { data, error: fetchError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (fetchError) throw new Error(fetchError.message)
    setBook(data)
  }

  const fetchChapter = async () => {
    const { data, error: fetchError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single()

    if (fetchError) throw new Error(fetchError.message)
    setChapter(data)
  }

  const fetchAllChapters = async () => {
    const { data, error: fetchError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('order_index', { ascending: true })

    if (fetchError) throw new Error(fetchError.message)
    setAllChapters(data || [])
  }

  const handleMarkComplete = async () => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu')
      return
    }

    setIsMarkingComplete(true)
    try {
      const { error } = await markAsCompleted(currentUser.id, chapterId)
      if (error) throw error
      
      setIsCompleted(true)
      alert('Bab ditandai selesai!')
    } catch (err: any) {
      alert('Gagal menandai selesai: ' + err.message)
    } finally {
      setIsMarkingComplete(false)
    }
  }

  const getCurrentChapterIndex = () => {
    return allChapters.findIndex(ch => ch.id === chapterId)
  }

  const getPreviousChapter = () => {
    const currentIndex = getCurrentChapterIndex()
    return currentIndex > 0 ? allChapters[currentIndex - 1] : null
  }

  const getNextChapter = () => {
    const currentIndex = getCurrentChapterIndex()
    return currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat bab...</p>
        </div>
      </div>
    )
  }

  if (error || !book || !chapter) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
            <p className="text-red-800 mb-4">{error || 'Bab tidak ditemukan'}</p>
            <Link
              href={`/reader/${bookId}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Kitab
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const previousChapter = getPreviousChapter()
  const nextChapter = getNextChapter()

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/reader/${bookId}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-accent">{book.title}</h1>
                <p className="text-sm text-gray-600">Bab {chapter.order_index}: {chapter.title}</p>
              </div>
            </div>
            
            {currentUser && (
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted || isMarkingComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                {isCompleted ? 'Selesai' : isMarkingComplete ? 'Menyimpan...' : 'Tandai Selesai'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">
              {chapter.title}
            </h2>
            
            {chapter.content ? (
              <div 
                className="prose prose-lg max-w-none text-right leading-loose"
                style={{ 
                  direction: 'rtl',
                  fontFamily: "'Amiri', 'Scheherazade New', serif",
                  fontSize: '1.5rem',
                  lineHeight: '2.5',
                }}
              >
                <p className="whitespace-pre-line">{chapter.content}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Konten bab belum tersedia</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {previousChapter ? (
              <Link
                href={`/reader/${bookId}/chapter/${previousChapter.id}`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-primary px-6 py-3 rounded-lg shadow-md transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Bab Sebelumnya</div>
                  <div className="text-sm">Bab {previousChapter.order_index}: {previousChapter.title}</div>
                </div>
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}

            {nextChapter ? (
              <Link
                href={`/reader/${bookId}/chapter/${nextChapter.id}`}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg shadow-md transition-colors font-medium ml-auto"
              >
                <div className="text-right">
                  <div className="text-xs text-white/80">Bab Selanjutnya</div>
                  <div className="text-sm">Bab {nextChapter.order_index}: {nextChapter.title}</div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>

          {/* Mark Complete Button (Bottom) */}
          {currentUser && chapter.content && !isCompleted && (
            <div className="mt-8 text-center">
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {isMarkingComplete ? 'Menyimpan...' : 'Tandai Bab Selesai'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Sidebar */}
      {chapter && chapter.content && (
        <AIChatSidebar
          chapterContent={chapter.content}
          chapterTitle={`${book?.title} - Bab ${chapter.order_index}: ${chapter.title}`}
        />
      )}
    </div>
  )
}
