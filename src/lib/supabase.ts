import { createClient } from '@supabase/supabase-js'
import { isValidEmail } from './validation'

// Get environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Warn in development if credentials are missing
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn('Warning: Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export async function signIn(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      return { 
        data: null, 
        error: { message: 'Email dan password harus diisi' } 
      }
    }

    if (!isValidEmail(email)) {
      return { 
        data: null, 
        error: { message: 'Format email tidak valid' } 
      }
    }

    if (password.length < 6) {
      return { 
        data: null, 
        error: { message: 'Password minimal 6 karakter' } 
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function signUp(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      return { 
        data: null, 
        error: { message: 'Email dan password harus diisi' } 
      }
    }

    if (!isValidEmail(email)) {
      return { 
        data: null, 
        error: { message: 'Format email tidak valid' } 
      }
    }

    if (password.length < 6) {
      return { 
        data: null, 
        error: { message: 'Password minimal 6 karakter' } 
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error }
  }
}
