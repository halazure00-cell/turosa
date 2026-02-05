import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import { isValidUrl } from '@/lib/validation'

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000 // 30 seconds

export async function POST(request: NextRequest) {
  try {
    // Validate Google Cloud credentials
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const projectId = process.env.GOOGLE_PROJECT_ID

    if (!clientEmail || !privateKey || !projectId) {
      return NextResponse.json(
        {
          error: 'Google Cloud Credentials belum dikonfigurasi',
          message: 'Layanan OCR tidak tersedia saat ini'
        },
        { status: 503 }
      )
    }

    // Parse the request body with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
    )

    const body = await Promise.race([
      request.json(),
      timeoutPromise
    ]) as { imageUrl?: string; imageBase64?: string }

    const { imageUrl, imageBase64 } = body

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

    // Initialize Google Cloud Vision client with credentials
    const client = new ImageAnnotatorClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      projectId: projectId,
    })

    // Prepare the request for Vision API
    const imageSource = imageUrl
      ? { source: { imageUri: imageUrl } }
      : { content: imageBase64 }

    // Perform OCR using documentTextDetection for better results on dense text
    const [result] = await Promise.race([
      client.documentTextDetection({
        image: imageSource,
        imageContext: {
          languageHints: ['ar'], // Arabic language for Kitab texts
        },
      }),
      timeoutPromise
    ]) as any

    const detections = result.textAnnotations
    const fullTextDetection = result.fullTextAnnotation

    if (!detections || detections.length === 0) {
      return NextResponse.json(
        {
          text: '',
          message: 'Tidak ada teks yang terdeteksi pada gambar',
          confidence: null,
        },
        { status: 200 }
      )
    }

    // Extract the detected text
    // The first annotation contains all detected text
    const extractedText = detections[0]?.description || ''

    // Return the extracted text and additional metadata
    return NextResponse.json({
      text: extractedText,
      confidence: fullTextDetection?.pages?.[0]?.confidence || null,
      language: 'ar',
      detectionCount: detections.length,
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
