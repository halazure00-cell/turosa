import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'

export async function POST(request: NextRequest) {
  try {
    // Validate Google Cloud credentials
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const projectId = process.env.GOOGLE_PROJECT_ID

    if (!clientEmail || !privateKey || !projectId) {
      return NextResponse.json(
        {
          error: 'Google Cloud Credentials belum dikonfigurasi. Silakan cek file .env.local',
          details: 'GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, dan GOOGLE_PROJECT_ID diperlukan'
        },
        { status: 500 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { imageUrl, imageBase64 } = body

    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { error: 'imageUrl atau imageBase64 harus disediakan' },
        { status: 400 }
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
    const [result] = await client.documentTextDetection({
      image: imageSource,
      imageContext: {
        languageHints: ['ar'], // Arabic language for Kitab texts
      },
    })

    const detections = result.textAnnotations
    const fullTextDetection = result.fullTextAnnotation

    if (!detections || detections.length === 0) {
      return NextResponse.json(
        {
          text: '',
          message: 'Tidak ada teks yang terdeteksi pada gambar',
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
    
    return NextResponse.json(
      {
        error: 'Gagal melakukan OCR',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan saat memproses gambar',
      },
      { status: 500 }
    )
  }
}
