/**
 * PDF Compression Utilities
 * Note: Browser-based PDF compression is limited
 * This module provides basic optimization strategies
 */

import { CompressionResult } from './types'

/**
 * Check if a PDF appears to be already compressed
 * by examining its compression ratio estimate
 */
export function isPDFCompressed(file: File): boolean {
  // PDFs with less than 50KB per page are likely compressed
  // This is a heuristic, not precise
  const estimatedPages = Math.max(1, Math.floor(file.size / (1024 * 1024))) // Rough estimate
  const bytesPerPage = file.size / estimatedPages
  
  return bytesPerPage < 50000 // 50KB per page threshold
}

/**
 * Analyze PDF file and provide compression recommendations
 */
export async function analyzePDF(file: File): Promise<{
  size: number
  estimatedPages: number
  recommendCompression: boolean
  message: string
}> {
  const size = file.size
  const estimatedPages = Math.max(1, Math.floor(size / (1024 * 1024)))
  const bytesPerPage = size / estimatedPages
  
  let recommendCompression = false
  let message = ''
  
  if (bytesPerPage > 100000) {
    recommendCompression = true
    message = 'File appears to have high-quality images. Consider compressing before upload.'
  } else if (bytesPerPage > 50000) {
    recommendCompression = false
    message = 'File size is acceptable. Compression optional.'
  } else {
    recommendCompression = false
    message = 'File is already well optimized.'
  }
  
  return {
    size,
    estimatedPages,
    recommendCompression,
    message
  }
}

/**
 * Simulate compression result (actual compression requires server-side processing)
 * This is a placeholder that returns the original file
 * 
 * For real compression, consider:
 * 1. Server-side tools like Ghostscript, PDFtk, or pdf-lib
 * 2. External APIs like iLovePDF, Smallpdf (requires API keys)
 * 3. Client-side libraries (limited effectiveness)
 */
export async function compressPDF(file: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<CompressionResult> {
  // Browser-based PDF compression is very limited
  // Return original file with a note
  console.warn('PDF compression requires server-side processing. Returning original file.')
  
  return {
    originalSize: file.size,
    compressedSize: file.size,
    compressionRatio: 1.0,
    blob: file
  }
}

/**
 * Optimize PDF metadata (remove unnecessary metadata)
 * This is a placeholder - actual implementation requires PDF parsing
 */
export async function optimizePDFMetadata(file: File): Promise<Blob> {
  // Requires PDF parsing library like pdf-lib
  // For now, return original file
  return file
}

/**
 * Get compression quality recommendation based on file size
 */
export function getCompressionRecommendation(fileSize: number): {
  shouldCompress: boolean
  recommendedQuality: 'low' | 'medium' | 'high'
  reason: string
} {
  if (fileSize < 5 * 1024 * 1024) { // < 5MB
    return {
      shouldCompress: false,
      recommendedQuality: 'high',
      reason: 'File size is already small'
    }
  } else if (fileSize < 20 * 1024 * 1024) { // < 20MB
    return {
      shouldCompress: true,
      recommendedQuality: 'medium',
      reason: 'Moderate compression recommended for faster uploads'
    }
  } else { // >= 20MB
    return {
      shouldCompress: true,
      recommendedQuality: 'low',
      reason: 'High compression recommended for large files'
    }
  }
}

/**
 * Calculate estimated upload time based on file size
 * Assumes average upload speed of 1 Mbps
 */
export function estimateUploadTime(fileSize: number, speedMbps: number = 1): {
  seconds: number
  formatted: string
} {
  const bits = fileSize * 8
  const megabits = bits / (1024 * 1024)
  const seconds = Math.ceil(megabits / speedMbps)
  
  let formatted = ''
  if (seconds < 60) {
    formatted = `${seconds} seconds`
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60)
    formatted = `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    const hours = Math.ceil(seconds / 3600)
    formatted = `${hours} hour${hours > 1 ? 's' : ''}`
  }
  
  return { seconds, formatted }
}
