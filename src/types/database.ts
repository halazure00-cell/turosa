// Database type definitions for Turosa

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
}

export interface Book {
  id: string
  title: string
  author: string | null
  description: string | null
  pdf_url: string | null
  cover_image_url: string | null
  created_at: string
  uploader_id: string | null
  category?: string | null
}

export interface Chapter {
  id: string
  book_id: string
  title: string
  order_index: number
  content: string | null
}

export interface UserProgress {
  id: string
  user_id: string
  chapter_id: string
  is_completed: boolean
  last_read_at: string
}

export interface Discussion {
  id: string
  book_id: string
  user_id: string
  content: string
  parent_id: string | null
  created_at: string
}
