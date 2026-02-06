import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion, checkAIHealth } from '@/lib/ai-provider'
import { sanitizeString, isNonEmptyArray } from '@/lib/validation'

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 60000 // 60 seconds for AI responses

// Max context length to prevent token overflow
const MAX_CONTEXT_LENGTH = 8000
const MAX_MESSAGE_LENGTH = 2000

export async function POST(request: NextRequest) {
  try {
    // Validate AI provider availability
    const healthCheck = await checkAIHealth()
    if (!healthCheck.available) {
      return NextResponse.json(
        {
          error: 'Layanan AI tidak tersedia',
          message: 'Layanan chat AI sedang tidak tersedia saat ini'
        },
        { status: 503 }
      )
    }

    // Parse request body with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
    )

    const body = await Promise.race([
      request.json(),
      timeoutPromise
    ]) as { messages?: any[]; context?: string }

    const { messages, context } = body

    // Validate messages
    if (!messages || !isNonEmptyArray(messages)) {
      return NextResponse.json(
        { 
          error: 'Parameter tidak valid',
          message: 'Parameter messages (array) diperlukan' 
        },
        { status: 400 }
      )
    }

    // Validate message structure and sanitize
    const sanitizedMessages = messages.map((msg) => {
      if (!msg.role || !msg.content) {
        throw new Error('Setiap message harus memiliki role dan content')
      }
      
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        throw new Error('Role harus berupa "user" atau "assistant"')
      }

      return {
        role: msg.role,
        content: sanitizeString(msg.content).substring(0, MAX_MESSAGE_LENGTH)
      }
    })

    // Limit number of messages to prevent token overflow
    const limitedMessages = sanitizedMessages.slice(-10) // Keep last 10 messages

    // Sanitize and limit context
    const sanitizedContext = context 
      ? sanitizeString(context).substring(0, MAX_CONTEXT_LENGTH)
      : ''

    // System prompt engineering - "Ustadz Turosa"
    const systemPrompt = `Anda adalah Ustadz Turosa, asisten belajar Kitab Kuning yang ahli dalam gramatika Arab (Nahwu & Sharaf), terjemahan, dan penjelasan konteks fiqih/akidah.

${sanitizedContext ? `Berikut adalah teks kitab yang sedang dipelajari santri:
---
${sanitizedContext}
---
` : ''}

Tugas Anda:
1. Membantu santri memahami teks Kitab Kuning dengan pendekatan pedagogis pesantren
2. Menjelaskan Nahwu/Sharaf (i'rab, kedudukan kata, dll) jika relevan dengan pertanyaan
3. Memberikan terjemahan harfiah (gandul) dan maknawi jika diminta
4. Menjelaskan konteks fiqih, akidah, atau hadist sesuai dengan teks
5. Selalu merujuk pada konteks teks yang sedang dibaca santri

Prinsip menjawab:
- Sopan dan edukatif dengan bahasa yang mudah dipahami
- Mulai dari konsep dasar jika diperlukan
- Berikan contoh konkret dari teks yang sedang dibaca
- Jika tidak yakin, akui keterbatasan dan sarankan rujukan lebih lanjut
- Gunakan istilah pesantren yang familiar (seperti mubtada', khabar, fa'il, dll)`

    // Prepare messages for AI
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...limitedMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // Call AI provider with timeout
    const completion = await Promise.race([
      chatCompletion({
        messages: chatMessages,
        temperature: 0.7,
        maxTokens: 1000,
      }),
      timeoutPromise
    ])

    const assistantMessage = typeof completion === 'object' && 'message' in completion
      ? completion.message
      : 'Maaf, saya tidak dapat memberikan jawaban.'
    
    const model = typeof completion === 'object' && 'model' in completion
      ? completion.model
      : 'unknown'

    return NextResponse.json({
      message: assistantMessage,
      model: model,
    })
  } catch (error: any) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Chat API Error:', error)
    }

    // Handle specific errors
    if (error.message === 'Request timeout' || error.message?.includes('timeout')) {
      return NextResponse.json(
        {
          error: 'Permintaan timeout',
          message: 'Permintaan memakan waktu terlalu lama, silakan coba lagi',
        },
        { status: 504 }
      )
    }

    // Handle validation errors
    if (error.message && error.message.includes('harus memiliki')) {
      return NextResponse.json(
        {
          error: 'Format data tidak valid',
          message: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Gagal memproses chat',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Terjadi kesalahan saat memproses permintaan',
      },
      { status: 500 }
    )
  }
}
