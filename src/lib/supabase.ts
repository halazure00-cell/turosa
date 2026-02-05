import { createClient } from '@supabase/supabase-js'
import { isValidEmail } from './validation'

// Get environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co')
}

// Warn in development if credentials are missing
if (typeof window !== 'undefined') {
  if (!isSupabaseConfigured()) {
    console.error('❌ CRITICAL: Supabase credentials not configured!')
    console.error('Please set the following environment variables:')
    console.error('  - NEXT_PUBLIC_SUPABASE_URL')
    console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.error('See .env.example for the required format.')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Validate Supabase connection
export async function validateSupabaseConnection(): Promise<{ isValid: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        isValid: false,
        error: 'Supabase credentials tidak dikonfigurasi. Hubungi administrator untuk mengatur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      }
    }

    // Test connection by checking auth status
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      // Check if it's an invalid API key error
      if (error.message.includes('Invalid API key') || error.message.includes('invalid') || error.message.includes('JWT')) {
        return {
          isValid: false,
          error: 'Konfigurasi Supabase tidak valid. API key atau URL tidak benar. Hubungi administrator.'
        }
      }
      return {
        isValid: false,
        error: `Koneksi Supabase gagal: ${error.message}`
      }
    }
    
    return { isValid: true }
  } catch (error: any) {
    return {
      isValid: false,
      error: `Gagal terhubung ke Supabase: ${error.message}`
    }
  }
}

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
