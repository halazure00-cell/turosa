# Supabase Storage Optimization Guide

## Overview

This guide covers best practices for optimizing PDF storage in Turosa using Supabase Storage. Proper optimization reduces costs, improves upload/download speeds, and enhances user experience.

## Storage Architecture

Turosa uses Supabase Storage with the following buckets:

- **book-covers**: Stores book cover images (small files)
- **book-files**: Stores PDF files (large files, primary focus)

## Optimization Strategies

### 1. File Size Management

#### Recommended Limits

```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024  // 50MB max
const WARN_FILE_SIZE = 20 * 1024 * 1024  // 20MB warning threshold
const IDEAL_FILE_SIZE = 10 * 1024 * 1024 // 10MB ideal target
```

#### Implementation

```typescript
import { uploadFile } from '@/lib/storage'

// Upload with automatic validation
const result = await uploadFile({
  bucket: 'book-files',
  path: `books/${bookId}.pdf`,
  file: pdfFile,
  contentType: 'application/pdf'
})

if (!result.success) {
  console.error('Upload failed:', result.error)
}
```

### 2. Compression Detection

The storage module automatically detects if a PDF is already compressed:

```typescript
import { analyzePDF, isPDFCompressed } from '@/lib/storage'

// Check if compression is needed
const isCompressed = isPDFCompressed(pdfFile)

// Get detailed analysis
const analysis = await analyzePDF(pdfFile)
console.log(analysis.message)
// "File is already well optimized."
```

### 3. Cache Control

Optimize CDN caching for faster delivery:

```typescript
// PDFs are immutable - cache for 1 year
const CACHE_CONTROL_LONG = '31536000'

// Covers might change - cache for 1 hour
const CACHE_CONTROL_SHORT = '3600'

await uploadFile({
  bucket: 'book-files',
  path: `books/${bookId}.pdf`,
  file: pdfFile,
  cacheControl: CACHE_CONTROL_LONG  // Auto-applied for PDFs
})
```

### 4. Upload Optimization

#### Progress Tracking

```typescript
await uploadFile({
  bucket: 'book-files',
  path: 'path/to/file.pdf',
  file: pdfFile,
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`)
    // Update UI progress bar
  }
})
```

#### Chunked Uploads (Large Files)

For files over 6MB, the storage module optimizes the upload:

```typescript
const CHUNK_SIZE = 6 * 1024 * 1024  // 6MB chunks

// Automatically handled by uploadFile()
// No code changes needed
```

### 5. File Type Validation

Always validate file types before upload:

```typescript
import { isValidFileType } from '@/lib/storage'

const allowedTypes = ['application/pdf']
const isValid = isValidFileType(file, allowedTypes)

if (!isValid) {
  throw new Error('Only PDF files are allowed')
}
```

## Best Practices

### 1. Pre-Upload Checks

```typescript
// Complete upload workflow
async function uploadBook(file: File) {
  // 1. Validate file type
  if (!isValidFileType(file, ['application/pdf'])) {
    throw new Error('Invalid file type')
  }
  
  // 2. Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 50MB)')
  }
  
  // 3. Analyze compression
  const analysis = await analyzePDF(file)
  if (analysis.recommendCompression) {
    console.warn(analysis.message)
  }
  
  // 4. Upload with progress
  const result = await uploadFile({
    bucket: 'book-files',
    path: `books/${bookId}.pdf`,
    file,
    onProgress: (p) => setProgress(p)
  })
  
  return result
}
```

### 2. Storage Monitoring

Track storage usage to stay within Supabase limits:

```typescript
import { getStorageStats, formatFileSize } from '@/lib/storage'

// Get bucket statistics
const stats = await getStorageStats('book-files')

console.log(`Total size: ${formatFileSize(stats.totalSize)}`)
console.log(`File count: ${stats.fileCount}`)
```

### 3. Efficient File Paths

Organize files for better management:

```
Good:
books/
  ├── 2024/
  │   ├── 01/
  │   │   └── book-123.pdf
  │   └── 02/
  │       └── book-456.pdf
  └── 2025/
      └── 01/
          └── book-789.pdf

Avoid:
books/
  ├── book-1.pdf
  ├── book-2.pdf
  └── ... (1000s of files in one folder)
```

### 4. Public URL Generation

```typescript
import { getPublicUrl } from '@/lib/storage'

// Get CDN-optimized URL
const url = getPublicUrl('book-files', 'books/2024/01/book-123.pdf')

// URL is automatically cached via CDN
// Subsequent requests served from edge
```

### 5. Cleanup Old Files

Implement cleanup for deleted books:

```typescript
import { deleteFile } from '@/lib/storage'

// Delete file when book is removed
async function deleteBook(bookId: string) {
  // Delete PDF
  await deleteFile('book-files', `books/${bookId}.pdf`)
  
  // Delete cover
  await deleteFile('book-covers', `covers/${bookId}.jpg`)
}
```

## PDF Compression

### When to Compress

Compress PDFs when:
- File size > 20MB
- Multiple high-resolution images
- Scanned documents (not OCR'd)
- Uploading in bulk

### Compression Options

#### Client-Side (Limited)

Browser-based compression has limitations. For significant compression, use server-side tools.

#### Server-Side (Recommended)

Use external tools before uploading:

**Ghostscript:**
```bash
gs -sDEVICE=pdfwrite \
   -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=compressed.pdf \
   original.pdf
```

**PDF Settings:**
- `/screen` - Low quality (72 dpi)
- `/ebook` - Medium quality (150 dpi) ⭐ Recommended
- `/printer` - High quality (300 dpi)
- `/prepress` - Highest quality (300+ dpi)

#### Online Tools

For non-technical users, suggest:
- iLovePDF (free tier available)
- Smallpdf (limited free)
- PDF Compressor

### Compression Recommendations

```typescript
import { getCompressionRecommendation } from '@/lib/storage'

const rec = getCompressionRecommendation(file.size)

if (rec.shouldCompress) {
  console.log(`Recommend ${rec.recommendedQuality} quality compression`)
  console.log(`Reason: ${rec.reason}`)
}
```

## Performance Optimization

### 1. Upload Time Estimation

```typescript
import { estimateUploadTime } from '@/lib/storage'

// Estimate upload time (assumes 1 Mbps)
const estimate = estimateUploadTime(file.size, 1)
console.log(`Estimated upload time: ${estimate.formatted}`)

// With faster connection (10 Mbps)
const fastEstimate = estimateUploadTime(file.size, 10)
```

### 2. Lazy Loading

For book listings, use lazy loading:

```typescript
// Load cover images progressively
<img 
  src={coverUrl} 
  loading="lazy"
  alt="Book cover"
/>
```

### 3. CDN Optimization

Supabase Storage uses a global CDN. Optimize with:

```typescript
// 1. Long cache times for immutable files
cacheControl: '31536000'  // 1 year

// 2. Correct content types
contentType: 'application/pdf'

// 3. Use public URLs (cached at edge)
const url = getPublicUrl(bucket, path)
```

### 4. Bandwidth Monitoring

Track bandwidth to stay within Supabase limits:

```javascript
// Supabase Free Tier:
// - 2GB storage
// - 50GB bandwidth/month

// Monitor in Supabase dashboard
// Set up alerts for 80% usage
```

## Supabase Storage Limits

### Free Tier

- **Storage**: 2GB
- **Bandwidth**: 50GB/month
- **Max File Size**: 50MB
- **Requests**: Generous (no hard limit)

### Optimization for Free Tier

1. **Compress PDFs** before upload
2. **Delete unused files** regularly
3. **Use CDN caching** to reduce bandwidth
4. **Monitor usage** in Supabase dashboard

### When to Upgrade

Consider Pro tier ($25/month) when:
- Storage > 2GB
- Bandwidth > 50GB/month
- Need larger file sizes
- Want automatic backups

## Security Best Practices

### 1. File Upload Validation

```typescript
// Server-side validation
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // Validate type
  if (!file.type === 'application/pdf') {
    return Response.json({ error: 'Invalid file type' }, { status: 400 })
  }
  
  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'File too large' }, { status: 400 })
  }
  
  // Validate content (check magic bytes)
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  if (bytes[0] !== 0x25 || bytes[1] !== 0x50) {  // %PDF
    return Response.json({ error: 'Not a valid PDF' }, { status: 400 })
  }
  
  // Upload
  return await uploadFile({...})
}
```

### 2. Access Control

Configure Supabase Storage policies:

```sql
-- Public read access for book files
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-files');

-- Authenticated write access
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'book-files' 
  AND auth.role() = 'authenticated'
);
```

### 3. Malware Scanning

For production, consider:
- Supabase Storage virus scanning (paid feature)
- External scanning APIs
- Client-side file validation

## Troubleshooting

### Upload Fails

**Error: "File too large"**
```typescript
// Solution: Compress PDF or increase limit
const MAX_FILE_SIZE = 100 * 1024 * 1024  // Increase to 100MB
```

**Error: "Invalid bucket"**
```typescript
// Solution: Create bucket in Supabase dashboard
// Navigate to Storage → Create new bucket
```

**Error: "Permission denied"**
```sql
-- Solution: Update storage policies
-- Check authentication status
```

### Slow Uploads

**Large files taking too long**
- Compress PDF before upload
- Check network connection
- Use wired connection vs WiFi
- Upload during off-peak hours

**Bandwidth exceeded**
- Monitor usage in dashboard
- Delete unused files
- Upgrade to Pro tier

### CDN Issues

**Updates not reflecting**
- CDN cache may be stale
- Wait for cache expiry (max 1 year for PDFs)
- Use versioned filenames: `book-v2.pdf`

## Example Implementation

Complete upload component:

```typescript
'use client'

import { useState } from 'react'
import { uploadFile, analyzePDF, formatFileSize } from '@/lib/storage'

export default function PDFUpload() {
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState<string>('')
  
  async function handleUpload(file: File) {
    // Analyze
    const result = await analyzePDF(file)
    setAnalysis(result.message)
    
    // Upload
    const upload = await uploadFile({
      bucket: 'book-files',
      path: `books/${Date.now()}.pdf`,
      file,
      onProgress: setProgress
    })
    
    if (upload.success) {
      console.log('Uploaded:', upload.url)
    }
  }
  
  return (
    <div>
      <input type="file" accept=".pdf" onChange={e => {
        const file = e.target.files?.[0]
        if (file) handleUpload(file)
      }} />
      
      <p>Size: {formatFileSize(file.size)}</p>
      <p>Analysis: {analysis}</p>
      <progress value={progress} max={100} />
    </div>
  )
}
```

## Resources

- Supabase Storage Docs: [supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)
- PDF Compression Tools: [ilovepdf.com](https://www.ilovepdf.com/compress_pdf)
- Ghostscript: [ghostscript.com](https://www.ghostscript.com/)
- Turosa Storage Utils: `/src/lib/storage/`

## Summary

✅ Validate files before upload  
✅ Compress large PDFs (>20MB)  
✅ Use long cache times for immutable files  
✅ Monitor storage and bandwidth usage  
✅ Organize files with logical paths  
✅ Delete unused files regularly  
✅ Use CDN for faster delivery  
✅ Implement proper access controls  

Following these practices ensures efficient, secure, and cost-effective PDF storage in Turosa! 📚
