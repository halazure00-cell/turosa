import { NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/ai-providers'

export async function GET() {
  // Basic health check endpoint for monitoring
  const manager = getProviderManager()
  const providers = await manager.checkAllProviders()
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    ai: {
      mode: manager.getMode(),
      providers: providers.map(p => ({
        type: p.provider,
        available: p.available,
        error: p.error
      }))
    }
  }

  return NextResponse.json(health, { status: 200 })
}
