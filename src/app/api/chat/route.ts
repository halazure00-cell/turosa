import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    // Validate OpenAI API Key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'OpenAI API Key belum dikonfigurasi',
          details: 'Silakan tambahkan OPENAI_API_KEY di file .env.local'
        },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { messages, context } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Parameter messages (array) diperlukan' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // System prompt engineering - "Ustadz Turosa"
    const systemPrompt = `Anda adalah Ustadz Turosa, asisten belajar Kitab Kuning yang ahli dalam gramatika Arab (Nahwu & Sharaf), terjemahan, dan penjelasan konteks fiqih/akidah.

${context ? `Berikut adalah teks kitab yang sedang dipelajari santri:
---
${context}
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

    // Prepare messages for OpenAI
    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat memberikan jawaban.'

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage,
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)

    // Handle OpenAI specific errors
    if (error.status === 401) {
      return NextResponse.json(
        {
          error: 'API Key tidak valid',
          details: 'Periksa kembali OPENAI_API_KEY di .env.local'
        },
        { status: 500 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        {
          error: 'Terlalu banyak permintaan',
          details: 'Silakan coba beberapa saat lagi'
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        error: 'Gagal memproses chat',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
