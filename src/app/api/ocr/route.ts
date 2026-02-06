import { NextRequest, NextResponse } from 'next/server'
import { performOCRWithOptions } from '@/lib/ocr-provider'
import { isValidUrl } from '@/lib/validation'

// Request timeout in milliseconds
// Tesseract.js processes images locally on the CPU, which typically takes 2-3x longer
// than cloud-based OCR services. Increased to 60s to accommodate larger/complex images.
const REQUEST_TIMEOUT = 60000 // 60 seconds

export async function POST(request: NextRequest) {
  try {
    // Tesseract.js is built-in, no credentials needed
    // Parse the request body with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
    )

    const body = await Promise.race([
      request.json(),
      timeoutPromise
    ]) as { imageUrl?: string; imageBase64?: string; multiLang?: boolean; language?: string }

    const { imageUrl, imageBase64, multiLang = false, language = 'ara' } = body

    // Validate input
    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { 
          error: 'Parameter tidak valid',
          message: 'imageUrl atau imageBase64 harus disediakan' 
        },
        { status: 400 }
      )
    }

    // Validate URL format if provided
    if (imageUrl && !isValidUrl(imageUrl)) {
      return NextResponse.json(
        { 
          error: 'URL tidak valid',
          message: 'Format URL gambar tidak valid' 
        },
        { status: 400 }
      )
    }

    // Validate base64 size (max 10MB)
    if (imageBase64 && imageBase64.length > 10 * 1024 * 1024 * 1.37) { // Base64 is ~1.37x original
      return NextResponse.json(
        { 
          error: 'Ukuran file terlalu besar',
          message: 'Ukuran gambar tidak boleh melebihi 10MB' 
        },
        { status: 413 }
      )
    }

    // Determine image source for Tesseract.js
    const imageSource = imageUrl || imageBase64

    if (!imageSource) {
      return NextResponse.json(
        { 
          error: 'Parameter tidak valid',
          message: 'imageUrl atau imageBase64 harus disediakan' 
        },
        { status: 400 }
      )
    }

    // Perform OCR using Tesseract.js
    const result = await Promise.race([
      performOCRWithOptions(imageSource, { language, multiLang }),
      timeoutPromise
    ]) as any

    if (!result || !result.text) {
      return NextResponse.json(
        {
          text: '',
          message: 'Tidak ada teks yang terdeteksi pada gambar',
          confidence: null,
          language: multiLang ? 'ara+ind' : language,
          detectionCount: 0
        },
        { status: 200 }
      )
    }

    // Return the extracted text and metadata
    return NextResponse.json({
      text: result.text,
      confidence: result.confidence,
      language: result.language,
      detectionCount: result.detectionCount,
    })
  } catch (error: any) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('OCR Error:', error)
    }

    // Handle specific errors
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        {
          error: 'Permintaan timeout',
          message: 'Proses OCR memakan waktu terlalu lama, silakan coba lagi dengan gambar yang lebih kecil',
        },
        { status: 504 }
      )
    }

    // Don't expose internal error details in production
    return NextResponse.json(
      {
        error: 'Gagal melakukan OCR',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Terjadi kesalahan saat memproses gambar',
      },
      { status: 500 }
    )
  }
}
