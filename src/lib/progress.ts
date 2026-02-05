import { supabase } from './supabase'
import { isValidUUID } from './validation'

/**
 * Save user's progress for a specific chapter
 * Updates last_read_at timestamp and creates progress entry if not exists
 */
export async function saveProgress(userId: string, chapterId: string) {
  try {
    // Validate inputs
    if (!isValidUUID(userId) || !isValidUUID(chapterId)) {
      throw new Error('Invalid user ID or chapter ID format')
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          chapter_id: chapterId,
          last_read_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,chapter_id',
        }
      )
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error saving progress:', error)
    return { data: null, error }
  }
}

/**
 * Mark a chapter as completed for a user
 */
export async function markAsCompleted(userId: string, chapterId: string) {
  try {
    // Validate inputs
    if (!isValidUUID(userId) || !isValidUUID(chapterId)) {
      throw new Error('Invalid user ID or chapter ID format')
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          chapter_id: chapterId,
          is_completed: true,
          last_read_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,chapter_id',
        }
      )
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error marking as completed:', error)
    return { data: null, error }
  }
}

/**
 * Get the last chapter the user was reading
 */
export async function getLastReadChapter(userId: string) {
  try {
    // Validate input
    if (!isValidUUID(userId)) {
      throw new Error('Invalid user ID format')
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        chapter:chapters(
          id,
          title,
          book_id,
          order_index,
          book:books(
            id,
            title,
            author
          )
        )
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { data, error: null }
  } catch (error: any) {
    console.error('Error getting last read chapter:', error)
    return { data: null, error }
  }
}

/**
 * Get user statistics for dashboard
 */
export async function getUserStats(userId: string) {
  try {
    // Validate input
    if (!isValidUUID(userId)) {
      throw new Error('Invalid user ID format')
    }

    // Get total chapters read (with progress)
    const { count: chaptersReadCount, error: progressError } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (progressError) throw progressError

    // Get completed chapters count
    const { count: chaptersCompletedCount, error: completedError } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', true)

    if (completedError) throw completedError

    // Get unique books being read - optimized query
    const { data: booksData, error: booksError } = await supabase
      .from('user_progress')
      .select(`
        chapter:chapters!inner(
          book_id
        )
      `)
      .eq('user_id', userId)

    if (booksError) throw booksError

    // Extract unique book IDs
    const uniqueBookIds = new Set(
      booksData?.map((item: any) => item.chapter?.book_id).filter(Boolean) || []
    )

    const chaptersRead = chaptersReadCount || 0
    const chaptersCompleted = chaptersCompletedCount || 0

    // Safe calculation to prevent divide by zero
    const completionRate = chaptersRead > 0
      ? Math.round((chaptersCompleted / chaptersRead) * 100)
      : 0

    return {
      data: {
        chaptersRead,
        chaptersCompleted,
        booksInProgress: uniqueBookIds.size,
        completionRate,
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Error getting user stats:', error)
    return {
      data: {
        chaptersRead: 0,
        chaptersCompleted: 0,
        booksInProgress: 0,
        completionRate: 0,
      },
      error,
    }
  }
}

/**
 * Get progress for a specific chapter
 */
export async function getChapterProgress(userId: string, chapterId: string) {
  try {
    // Validate inputs
    if (!isValidUUID(userId) || !isValidUUID(chapterId)) {
      throw new Error('Invalid user ID or chapter ID format')
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error getting chapter progress:', error)
    return { data: null, error }
  }
}
