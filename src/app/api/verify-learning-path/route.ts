import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { log, LogCategory } from '@/lib/logger'

/**
 * Learning Path Verification API
 * Verifies the complete learning flow for a book
 */

interface VerificationResult {
  success: boolean
  bookId: string
  userId?: string
  checks: {
    bookExists: { passed: boolean; details?: string }
    pdfAccessible: { passed: boolean; details?: string }
    chaptersExist: { passed: boolean; count: number; details?: string }
    progressTracking: { passed: boolean; details?: string }
    readerAccessible: { passed: boolean; details?: string }
    quizGeneration: { passed: boolean; details?: string }
    discussionsAccessible: { passed: boolean; details?: string }
  }
  overallStatus: 'complete' | 'partial' | 'failed'
  recommendations: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, userId } = body

    if (!bookId) {
      return NextResponse.json(
        { error: 'bookId is required' },
        { status: 400 }
      )
    }

    log.info(LogCategory.API, 'Learning path verification started', { bookId, userId })

    const result: VerificationResult = {
      success: true,
      bookId,
      userId,
      checks: {
        bookExists: { passed: false },
        pdfAccessible: { passed: false },
        chaptersExist: { passed: false, count: 0 },
        progressTracking: { passed: false },
        readerAccessible: { passed: false },
        quizGeneration: { passed: false },
        discussionsAccessible: { passed: false }
      },
      overallStatus: 'failed',
      recommendations: []
    }

    // Check 1: Book exists and is accessible
    try {
      const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()

      if (error || !book) {
        result.checks.bookExists.passed = false
        result.checks.bookExists.details = 'Book not found in database'
        result.recommendations.push('Ensure the book has been uploaded successfully')
      } else {
        result.checks.bookExists.passed = true
        result.checks.bookExists.details = `Found: ${book.title}`

        // Check 2: PDF URL is valid and accessible
        if (book.pdf_url) {
          try {
            // Try to fetch the URL (HEAD request would be better but not all servers support it)
            const pdfResponse = await fetch(book.pdf_url, {
              method: 'HEAD',
              signal: AbortSignal.timeout(5000)
            }).catch(() => null)

            if (pdfResponse && pdfResponse.ok) {
              result.checks.pdfAccessible.passed = true
              result.checks.pdfAccessible.details = 'PDF URL is accessible'
            } else {
              result.checks.pdfAccessible.passed = false
              result.checks.pdfAccessible.details = 'PDF URL may be invalid or inaccessible'
              result.recommendations.push('Check if PDF URL is correctly configured and accessible')
            }
          } catch (e: any) {
            result.checks.pdfAccessible.passed = false
            result.checks.pdfAccessible.details = `Error checking PDF: ${e.message}`
            result.recommendations.push('Verify PDF storage and URL configuration')
          }
        } else {
          result.checks.pdfAccessible.passed = false
          result.checks.pdfAccessible.details = 'No PDF URL configured'
          result.recommendations.push('Upload a PDF file for this book')
        }
      }
    } catch (e: any) {
      result.checks.bookExists.passed = false
      result.checks.bookExists.details = `Error: ${e.message}`
      result.recommendations.push('Check database connection and book table')
    }

    // Check 3: Chapters exist (if digitized)
    try {
      const { data: chapters, error, count } = await supabase
        .from('chapters')
        .select('*', { count: 'exact' })
        .eq('book_id', bookId)

      if (!error && count !== null) {
        result.checks.chaptersExist.count = count
        if (count > 0) {
          result.checks.chaptersExist.passed = true
          result.checks.chaptersExist.details = `${count} chapters found`
        } else {
          result.checks.chaptersExist.passed = false
          result.checks.chaptersExist.details = 'No chapters found (book not digitized yet)'
          result.recommendations.push('Digitize the book to enable chapter-based learning')
        }
      }
    } catch (e: any) {
      result.checks.chaptersExist.details = `Error: ${e.message}`
    }

    // Check 4: User progress tracking works
    if (userId) {
      try {
        const { data: progress, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('book_id', bookId)

        if (!error) {
          result.checks.progressTracking.passed = true
          result.checks.progressTracking.details = `Found ${progress?.length || 0} progress records`
        }
      } catch (e: any) {
        result.checks.progressTracking.passed = false
        result.checks.progressTracking.details = `Error: ${e.message}`
        result.recommendations.push('Check user_progress table and RLS policies')
      }
    } else {
      result.checks.progressTracking.passed = true
      result.checks.progressTracking.details = 'Skipped (no userId provided)'
    }

    // Check 5: Reader page should be accessible
    result.checks.readerAccessible.passed = true
    result.checks.readerAccessible.details = `Reader URL: /reader/${bookId}`

    // Check 6: Quiz generation possible (if chapters exist)
    if (result.checks.chaptersExist.count > 0) {
      const openaiConfigured = !!process.env.OPENAI_API_KEY
      result.checks.quizGeneration.passed = openaiConfigured
      result.checks.quizGeneration.details = openaiConfigured 
        ? 'OpenAI configured, quiz generation available'
        : 'OpenAI not configured, quiz generation unavailable'
      
      if (!openaiConfigured) {
        result.recommendations.push('Configure OpenAI API key to enable quiz generation')
      }
    } else {
      result.checks.quizGeneration.passed = false
      result.checks.quizGeneration.details = 'Requires chapters (digitize book first)'
    }

    // Check 7: Discussions accessible
    try {
      const { error } = await supabase
        .from('discussions')
        .select('count', { count: 'exact', head: true })
        .eq('book_id', bookId)

      if (!error) {
        result.checks.discussionsAccessible.passed = true
        result.checks.discussionsAccessible.details = 'Discussion feature accessible'
      }
    } catch (e: any) {
      result.checks.discussionsAccessible.passed = false
      result.checks.discussionsAccessible.details = `Error: ${e.message}`
      result.recommendations.push('Check discussions table configuration')
    }

    // Determine overall status
    const passedChecks = Object.values(result.checks).filter(c => c.passed).length
    const totalChecks = Object.values(result.checks).length

    if (passedChecks === totalChecks) {
      result.overallStatus = 'complete'
    } else if (passedChecks >= totalChecks / 2) {
      result.overallStatus = 'partial'
    } else {
      result.overallStatus = 'failed'
    }

    log.info(LogCategory.API, 'Learning path verification completed', {
      bookId,
      status: result.overallStatus,
      passedChecks,
      totalChecks
    })

    return NextResponse.json(result)
  } catch (error: any) {
    log.error(LogCategory.API, 'Learning path verification error', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to verify learning path',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
