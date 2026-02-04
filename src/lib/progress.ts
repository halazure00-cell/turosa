import { supabase } from './supabase'

/**
 * Save user's progress for a specific chapter
 * Updates last_read_at timestamp and creates progress entry if not exists
 */
export async function saveProgress(userId: string, chapterId: string) {
  try {
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
    // Get total chapters read (with progress)
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('chapter_id', { count: 'exact' })
      .eq('user_id', userId)

    if (progressError) throw progressError

    // Get completed chapters count
    const { data: completedData, error: completedError } = await supabase
      .from('user_progress')
      .select('chapter_id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_completed', true)

    if (completedError) throw completedError

    // Get unique books being read
    const { data: booksData, error: booksError } = await supabase
      .from('user_progress')
      .select(`
        chapter:chapters(
          book_id
        )
      `)
      .eq('user_id', userId)

    if (booksError) throw booksError

    // Extract unique book IDs
    const uniqueBookIds = new Set(
      booksData?.map((item: any) => item.chapter?.book_id).filter(Boolean) || []
    )

    return {
      data: {
        chaptersRead: progressData?.length || 0,
        chaptersCompleted: completedData?.length || 0,
        booksInProgress: uniqueBookIds.size,
        completionRate: progressData?.length
          ? Math.round((completedData?.length || 0) / progressData.length * 100)
          : 0,
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
