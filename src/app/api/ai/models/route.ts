import { NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/ai-providers'

/**
 * GET /api/ai/models
 * List all available models from all providers
 */
export async function GET() {
  try {
    const manager = getProviderManager()
    const models = await manager.listAllModels()
    
    // Group models by provider
    const grouped = {
      openrouter: models.filter(m => m.provider === 'openrouter'),
      ollama: models.filter(m => m.provider === 'ollama')
    }
    
    return NextResponse.json({
      models,
      grouped,
      total: models.length,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to fetch models',
        message: error.message
      },
      { status: 500 }
    )
  }
}
