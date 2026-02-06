import { NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/ai-providers'

/**
 * GET /api/ai/providers
 * List available AI providers and their status
 */
export async function GET() {
  try {
    const manager = getProviderManager()
    const checks = await manager.checkAllProviders()
    
    const providers = checks.map(check => ({
      type: check.provider,
      name: check.provider === 'openrouter' ? 'OpenRouter (Free)' : 'Ollama (Local)',
      available: check.available,
      models: check.models || [],
      error: check.error,
      latency: check.latency,
      description: check.provider === 'openrouter' 
        ? 'Free tier AI with excellent Arabic support - cloud-based'
        : 'Local AI for privacy and offline use - requires installation'
    }))
    
    return NextResponse.json({
      mode: manager.getMode(),
      providers,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to fetch providers',
        message: error.message
      },
      { status: 500 }
    )
  }
}
