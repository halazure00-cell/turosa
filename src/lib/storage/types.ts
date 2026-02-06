/**
 * Storage Types and Interfaces
 */

export interface UploadOptions {
  bucket: string
  path: string
  file: File | Blob
  contentType?: string
  cacheControl?: string
  upsert?: boolean
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  success: boolean
  path?: string
  url?: string
  size?: number
  error?: string
}

export interface StorageStats {
  totalSize: number
  fileCount: number
  bucketName: string
}

export interface CompressionResult {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  blob: Blob
}
