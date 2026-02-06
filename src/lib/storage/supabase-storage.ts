/**
 * Supabase Storage Optimization Utilities
 * Efficient PDF upload, compression, and management
 */

import { supabase } from '../supabase'
import { UploadOptions, UploadResult, StorageStats } from './types'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const CHUNK_SIZE = 6 * 1024 * 1024 // 6MB chunks for large files
const CACHE_CONTROL_LONG = '31536000' // 1 year for PDFs (immutable)
const CACHE_CONTROL_SHORT = '3600' // 1 hour for frequently changing files

/**
 * Upload file to Supabase Storage with optimization
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { bucket, path, file, contentType, cacheControl, upsert = false, onProgress } = options
  
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }
    }
    
    // Determine cache control
    const finalCacheControl = cacheControl || 
      (contentType?.includes('pdf') ? CACHE_CONTROL_LONG : CACHE_CONTROL_SHORT)
    
    // For small files, upload directly
    if (file.size < CHUNK_SIZE) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: contentType || file.type,
          cacheControl: finalCacheControl,
          upsert
        })
      
      if (error) {
        return {
          success: false,
          error: error.message
        }
      }
      
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      
      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl,
        size: file.size
      }
    }
    
    // For large files, use chunked upload (if supported)
    // Note: Supabase doesn't natively support chunked uploads, 
    // but we can still optimize with proper settings
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        cacheControl: finalCacheControl,
        upsert
      })
    
    if (error) {
      return {
        success: false,
        error: error.message
      }
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    if (onProgress) {
      onProgress(100)
    }
    
    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      size: file.size
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed'
    }
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get storage statistics for a bucket
 */
export async function getStorageStats(bucket: string): Promise<StorageStats> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list()
    
    if (error) {
      throw error
    }
    
    const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
    
    return {
      totalSize,
      fileCount: data.length,
      bucketName: bucket
    }
  } catch (error) {
    return {
      totalSize: 0,
      fileCount: 0,
      bucketName: bucket
    }
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

/**
 * Check if file exists in storage
 */
export async function fileExists(bucket: string, path: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'))
    
    if (error) return false
    
    const fileName = path.split('/').pop()
    return data.some(file => file.name === fileName)
  } catch {
    return false
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })
}
