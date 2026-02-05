// Configuration checker utility
// This file helps validate that all required environment variables are properly set

export interface ConfigStatus {
  isValid: boolean
  errors: string[]
  warnings: string[]
  supabase: {
    url: boolean
    anonKey: boolean
    configured: boolean
  }
  openai: {
    apiKey: boolean
    configured: boolean
  }
  google: {
    clientEmail: boolean
    privateKey: boolean
    projectId: boolean
    configured: boolean
  }
}

export function checkConfiguration(): ConfigStatus {
  const errors: string[] = []
  const warnings: string[] = []

  // Check Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabaseUrlValid = !!(supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.includes('supabase.co'))
  const supabaseKeyValid = !!(supabaseKey && supabaseKey !== 'placeholder-key' && supabaseKey.length > 20)
  
  if (!supabaseUrlValid) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL tidak dikonfigurasi atau tidak valid')
  }
  if (!supabaseKeyValid) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY tidak dikonfigurasi atau tidak valid')
  }

  // Check OpenAI configuration (optional, for AI features)
  const openaiKey = process.env.OPENAI_API_KEY
  const openaiValid = !!(openaiKey && openaiKey.length > 20)
  
  if (!openaiValid) {
    warnings.push('OPENAI_API_KEY tidak dikonfigurasi - Fitur AI chat dan quiz tidak akan berfungsi')
  }

  // Check Google Cloud Vision configuration (optional, for OCR)
  const googleEmail = process.env.GOOGLE_CLIENT_EMAIL
  const googleKey = process.env.GOOGLE_PRIVATE_KEY
  const googleProjectId = process.env.GOOGLE_PROJECT_ID
  
  const googleEmailValid = !!(googleEmail && googleEmail.includes('@'))
  const googleKeyValid = !!(googleKey && googleKey.includes('BEGIN PRIVATE KEY'))
  const googleProjectValid = !!(googleProjectId && googleProjectId.length > 0)
  
  if (!googleEmailValid || !googleKeyValid || !googleProjectValid) {
    warnings.push('Google Cloud Vision API tidak dikonfigurasi lengkap - Fitur OCR tidak akan berfungsi')
  }

  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    warnings,
    supabase: {
      url: supabaseUrlValid,
      anonKey: supabaseKeyValid,
      configured: supabaseUrlValid && supabaseKeyValid
    },
    openai: {
      apiKey: openaiValid,
      configured: openaiValid
    },
    google: {
      clientEmail: googleEmailValid,
      privateKey: googleKeyValid,
      projectId: googleProjectValid,
      configured: googleEmailValid && googleKeyValid && googleProjectValid
    }
  }
}

// Log configuration status (only in development)
export function logConfigurationStatus() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return // Don't log in production or server-side
  }

  const status = checkConfiguration()

  console.group('🔧 Configuration Status')
  
  if (status.isValid) {
    console.log('✅ Konfigurasi dasar valid')
  } else {
    console.error('❌ Konfigurasi tidak lengkap!')
  }

  console.group('📊 Detail Konfigurasi')
  
  // Supabase
  console.group('Supabase (Required)')
  console.log('URL:', status.supabase.url ? '✅' : '❌')
  console.log('Anon Key:', status.supabase.anonKey ? '✅' : '❌')
  console.log('Status:', status.supabase.configured ? '✅ Configured' : '❌ Not Configured')
  console.groupEnd()

  // OpenAI
  console.group('OpenAI (Optional - untuk AI features)')
  console.log('API Key:', status.openai.apiKey ? '✅' : '⚠️')
  console.log('Status:', status.openai.configured ? '✅ Configured' : '⚠️ Not Configured')
  console.groupEnd()

  // Google Cloud Vision
  console.group('Google Cloud Vision (Optional - untuk OCR)')
  console.log('Client Email:', status.google.clientEmail ? '✅' : '⚠️')
  console.log('Private Key:', status.google.privateKey ? '✅' : '⚠️')
  console.log('Project ID:', status.google.projectId ? '✅' : '⚠️')
  console.log('Status:', status.google.configured ? '✅ Configured' : '⚠️ Not Configured')
  console.groupEnd()

  console.groupEnd()

  // Show errors
  if (status.errors.length > 0) {
    console.group('❌ Errors (CRITICAL)')
    status.errors.forEach(error => console.error(`  - ${error}`))
    console.groupEnd()
  }

  // Show warnings
  if (status.warnings.length > 0) {
    console.group('⚠️ Warnings')
    status.warnings.forEach(warning => console.warn(`  - ${warning}`))
    console.groupEnd()
  }

  console.groupEnd()

  return status
}

// Get user-friendly configuration message
export function getConfigurationMessage(): string {
  const status = checkConfiguration()

  if (status.isValid) {
    if (status.warnings.length > 0) {
      return 'Konfigurasi dasar sudah benar. Beberapa fitur opsional belum dikonfigurasi.'
    }
    return 'Semua konfigurasi sudah lengkap dan valid.'
  }

  return 'Konfigurasi sistem tidak lengkap. Periksa environment variables.'
}
