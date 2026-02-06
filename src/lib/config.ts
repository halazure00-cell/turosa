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
  ai: {
    baseUrl: boolean
    model: boolean
    configured: boolean
  }
  ocr: {
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

  // Check AI configuration (optional, for AI features)
  const aiBaseUrl = process.env.AI_BASE_URL || 'http://localhost:11434'
  const aiModel = process.env.AI_MODEL || 'qwen2.5:7b'
  
  const aiBaseUrlValid = !!(aiBaseUrl && aiBaseUrl.length > 0)
  const aiModelValid = !!(aiModel && aiModel.length > 0)
  
  if (!aiBaseUrlValid || !aiModelValid) {
    warnings.push('AI_BASE_URL atau AI_MODEL tidak dikonfigurasi - Fitur AI chat dan quiz mungkin tidak berfungsi (akan menggunakan default)')
  }

  // OCR is always configured (Tesseract.js is built-in)
  const ocrConfigured = true

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
    ai: {
      baseUrl: aiBaseUrlValid,
      model: aiModelValid,
      configured: aiBaseUrlValid && aiModelValid
    },
    ocr: {
      configured: ocrConfigured
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

  // AI (Ollama)
  console.group('Ollama AI (Optional - untuk AI features)')
  console.log('Base URL:', status.ai.baseUrl ? '✅' : '⚠️')
  console.log('Model:', status.ai.model ? '✅' : '⚠️')
  console.log('Status:', status.ai.configured ? '✅ Configured' : '⚠️ Not Configured')
  console.groupEnd()

  // OCR (Tesseract.js)
  console.group('Tesseract.js (Built-in - untuk OCR)')
  console.log('Status:', status.ocr.configured ? '✅ Always Available' : '❌ Not Available')
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
