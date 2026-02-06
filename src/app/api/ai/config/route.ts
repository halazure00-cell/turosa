import { NextRequest, NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/ai-providers'

/**
 * GET /api/ai/config
 * Get current AI provider configuration
 */
export async function GET() {
  try {
    const manager = getProviderManager()
    const mode = manager.getMode()
    const activeProvider = await manager.getActiveProvider()
    
    return NextResponse.json({
      mode,
      activeProvider: activeProvider ? {
        type: activeProvider.type,
        name: activeProvider.name
      } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to get config',
        message: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai/config
 * Update AI provider configuration (mode and preferred provider)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, preferredProvider } = body
    
    const manager = getProviderManager()
    
    if (mode && ['openrouter', 'ollama', 'hybrid', 'auto'].includes(mode)) {
      manager.setMode(mode)
    }
    
    if (preferredProvider !== undefined) {
      manager.setPreferredProvider(preferredProvider)
    }
    
    return NextResponse.json({
      success: true,
      mode: manager.getMode(),
      message: 'Configuration updated successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to update config',
        message: error.message
      },
      { status: 500 }
    )
  }
}
