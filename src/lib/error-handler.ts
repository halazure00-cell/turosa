/**
 * Centralized Error Handler
 * Provides error classification, user-friendly messages, and recovery strategies
 */

import { logger, LogCategory } from './logger'

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  STORAGE = 'STORAGE',
  DATABASE = 'DATABASE',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType
  message: string
  userMessage: string
  details?: any
  originalError?: Error
  isRetryable: boolean
  suggestedFix?: string
}

/**
 * Classify error based on error message and type
 */
export function classifyError(error: any): ErrorType {
  const message = error?.message?.toLowerCase() || ''
  
  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
    return ErrorType.NETWORK
  }
  
  // Authentication errors
  if (message.includes('unauthorized') || message.includes('invalid credentials') || 
      message.includes('login') || message.includes('authentication')) {
    return ErrorType.AUTHENTICATION
  }
  
  // Authorization errors
  if (message.includes('forbidden') || message.includes('permission') || 
      message.includes('access denied') || message.includes('row-level security')) {
    return ErrorType.AUTHORIZATION
  }
  
  // Validation errors
  if (message.includes('invalid') || message.includes('validation') || 
      message.includes('required') || message.includes('format')) {
    return ErrorType.VALIDATION
  }
  
  // Storage errors
  if (message.includes('storage') || message.includes('upload') || 
      message.includes('bucket') || message.includes('file')) {
    return ErrorType.STORAGE
  }
  
  // Database errors
  if (message.includes('database') || message.includes('query') || 
      message.includes('relation') || message.includes('table')) {
    return ErrorType.DATABASE
  }
  
  // Not found errors
  if (message.includes('not found') || message.includes('404') || 
      error?.status === 404 || error?.statusCode === 404) {
    return ErrorType.NOT_FOUND
  }
  
  // Rate limit errors
  if (message.includes('rate limit') || message.includes('too many requests') || 
      error?.status === 429 || error?.statusCode === 429) {
    return ErrorType.RATE_LIMIT
  }
  
  // Server errors
  if (message.includes('server error') || message.includes('500') || 
      error?.status >= 500 || error?.statusCode >= 500) {
    return ErrorType.SERVER
  }
  
  return ErrorType.UNKNOWN
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(errorType: ErrorType, originalMessage?: string): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.',
    [ErrorType.AUTHENTICATION]: 'Sesi Anda telah berakhir. Silakan login kembali.',
    [ErrorType.AUTHORIZATION]: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
    [ErrorType.VALIDATION]: 'Data yang dimasukkan tidak valid. Periksa kembali formulir Anda.',
    [ErrorType.STORAGE]: 'Gagal mengunggah file. Periksa ukuran dan format file.',
    [ErrorType.DATABASE]: 'Terjadi kesalahan saat menyimpan data. Coba lagi nanti.',
    [ErrorType.NOT_FOUND]: 'Data yang dicari tidak ditemukan.',
    [ErrorType.RATE_LIMIT]: 'Terlalu banyak permintaan. Tunggu sebentar dan coba lagi.',
    [ErrorType.SERVER]: 'Server sedang bermasalah. Coba lagi dalam beberapa saat.',
    [ErrorType.UNKNOWN]: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
  }
  
  return messages[errorType] || messages[ErrorType.UNKNOWN]
}

/**
 * Get suggested fix for error
 */
export function getSuggestedFix(errorType: ErrorType): string | undefined {
  const fixes: Partial<Record<ErrorType, string>> = {
    [ErrorType.NETWORK]: 'Periksa koneksi internet Anda dan refresh halaman.',
    [ErrorType.AUTHENTICATION]: 'Logout dan login kembali ke aplikasi.',
    [ErrorType.AUTHORIZATION]: 'Hubungi administrator jika Anda yakin memiliki akses.',
    [ErrorType.VALIDATION]: 'Pastikan semua field terisi dengan benar dan format sesuai.',
    [ErrorType.STORAGE]: 'Periksa ukuran file (max 50MB untuk PDF, 5MB untuk gambar) dan format yang didukung.',
    [ErrorType.DATABASE]: 'Tunggu beberapa saat dan coba lagi. Jika masalah berlanjut, hubungi support.',
    [ErrorType.RATE_LIMIT]: 'Tunggu 1-2 menit sebelum mencoba lagi.',
    [ErrorType.SERVER]: 'Sistem sedang maintenance. Coba lagi dalam beberapa menit.'
  }
  
  return fixes[errorType]
}

/**
 * Check if error is retryable
 */
export function isRetryable(errorType: ErrorType): boolean {
  const retryableTypes = [
    ErrorType.NETWORK,
    ErrorType.RATE_LIMIT,
    ErrorType.SERVER
  ]
  
  return retryableTypes.includes(errorType)
}

/**
 * Handle error and return AppError
 */
export function handleError(error: any, context?: string): AppError {
  const errorType = classifyError(error)
  const userMessage = getUserMessage(errorType, error?.message)
  const suggestedFix = getSuggestedFix(errorType)
  const isRetryableError = isRetryable(errorType)
  
  const appError: AppError = {
    type: errorType,
    message: error?.message || 'Unknown error',
    userMessage,
    details: error?.details,
    originalError: error instanceof Error ? error : undefined,
    isRetryable: isRetryableError,
    suggestedFix
  }
  
  // Log error
  logger.error(
    LogCategory.ERROR,
    context ? `Error in ${context}` : 'Application error',
    error instanceof Error ? error : new Error(String(error)),
    {
      errorType,
      context,
      isRetryable: isRetryableError
    }
  )
  
  return appError
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const errorType = classifyError(error)
      
      // Don't retry non-retryable errors
      if (!isRetryable(errorType)) {
        throw error
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break
      }
      
      // Wait with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt)
      logger.warn(
        LogCategory.ERROR,
        `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
        { attempt, delay }
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Graceful degradation handler
 */
export function gracefullyDegrade<T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  return fn().catch(error => {
    logger.warn(
      LogCategory.ERROR,
      `Graceful degradation in ${context}`,
      { error: error?.message }
    )
    return fallback
  })
}

/**
 * Error boundary helper for async functions
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: string,
  onError?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    const appError = handleError(error, context)
    if (onError) {
      onError(appError)
    }
    return null
  }
}
