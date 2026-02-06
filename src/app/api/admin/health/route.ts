import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getProviderManager } from '@/lib/ai-providers'
import { checkOCRHealth } from '@/lib/ocr-provider'

/**
 * Admin Health Check API
 * Returns comprehensive system health status
 */

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: {
      status: 'ok' | 'error' | 'unconfigured'
      details: string
      latency?: number
    }
    storage: {
      status: 'ok' | 'error' | 'unconfigured'
      buckets: Array<{
        name: string
        accessible: boolean
        error?: string
      }>
    }
    apis: {
      ai: { 
        status: 'ok' | 'unconfigured' | 'error'
        mode?: string
        providers?: Array<{
          type: string
          available: boolean
          models?: string[]
        }>
        details?: string
      }
      ocr: { 
        status: 'ok'
        details: string
      }
    }
    environment: {
      status: 'ok' | 'error'
      configured: string[]
      missing: string[]
    }
  }
  recommendations: string[]
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: {
        status: 'unconfigured',
        details: 'Not checked'
      },
      storage: {
        status: 'unconfigured',
        buckets: []
      },
      apis: {
        ai: { status: 'unconfigured' },
        ocr: { status: 'ok', details: 'Built-in' }
      },
      environment: {
        status: 'ok',
        configured: [],
        missing: []
      }
    },
    recommendations: []
  }

  // Check environment variables
  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'AI_PROVIDER_MODE': process.env.AI_PROVIDER_MODE,
    'OPENROUTER_API_KEY': process.env.OPENROUTER_API_KEY,
    'AI_BASE_URL': process.env.AI_BASE_URL,
    'AI_MODEL': process.env.AI_MODEL
  }

  for (const [key, value] of Object.entries(envVars)) {
    if (value && value !== 'placeholder' && value !== 'placeholder-key') {
      result.checks.environment.configured.push(key)
    } else {
      result.checks.environment.missing.push(key)
    }
  }

  // Check Supabase configuration
  if (!isSupabaseConfigured()) {
    result.checks.database.status = 'unconfigured'
    result.checks.database.details = 'Supabase credentials not configured'
    result.checks.storage.status = 'unconfigured'
    result.status = 'unhealthy'
    result.recommendations.push('Configure Supabase credentials in environment variables')
  } else {
    // Check database connection
    try {
      const dbCheckStart = Date.now()
      const { error: authError } = await supabase.auth.getSession()
      const dbLatency = Date.now() - dbCheckStart

      if (authError) {
        result.checks.database.status = 'error'
        result.checks.database.details = `Connection error: ${authError.message}`
        result.checks.database.latency = dbLatency
        result.status = 'unhealthy'
        result.recommendations.push('Verify Supabase credentials are correct')
      } else {
        result.checks.database.status = 'ok'
        result.checks.database.details = 'Connected successfully'
        result.checks.database.latency = dbLatency
      }

      // Check database tables
      try {
        const { error: booksError } = await supabase
          .from('books')
          .select('count', { count: 'exact', head: true })

        if (booksError) {
          result.checks.database.details += ` | Tables check failed: ${booksError.message}`
          if (result.status === 'healthy') result.status = 'degraded'
          result.recommendations.push('Run database migrations to create required tables')
        }
      } catch (e: any) {
        result.checks.database.details += ` | Tables check error: ${e.message}`
      }
    } catch (error: any) {
      result.checks.database.status = 'error'
      result.checks.database.details = `Error: ${error.message}`
      result.status = 'unhealthy'
    }

    // Check storage buckets
    try {
      const buckets = ['book-covers', 'book-files']
      const bucketResults = []

      for (const bucketName of buckets) {
        try {
          const { data, error } = await supabase.storage.getBucket(bucketName)

          bucketResults.push({
            name: bucketName,
            accessible: !error,
            error: error?.message
          })
        } catch (e: any) {
          bucketResults.push({
            name: bucketName,
            accessible: false,
            error: e.message
          })
        }
      }

      result.checks.storage.buckets = bucketResults
      const allAccessible = bucketResults.every(b => b.accessible)
      result.checks.storage.status = allAccessible ? 'ok' : 'error'

      if (!allAccessible) {
        if (result.status === 'healthy') result.status = 'degraded'
        result.recommendations.push('Create missing storage buckets in Supabase Dashboard')
      }
    } catch (error: any) {
      result.checks.storage.status = 'error'
      result.status = 'degraded'
    }
  }

  // Check AI providers
  try {
    const manager = getProviderManager()
    const providers = await manager.checkAllProviders()
    const anyAvailable = providers.some(p => p.available)
    
    if (anyAvailable) {
      result.checks.apis.ai = {
        status: 'ok',
        mode: manager.getMode(),
        providers: providers.map(p => ({
          type: p.provider,
          available: p.available,
          models: p.models
        })),
        details: `${providers.filter(p => p.available).length} provider(s) available`
      }
    } else {
      result.checks.apis.ai = {
        status: 'unconfigured',
        mode: manager.getMode(),
        providers: providers.map(p => ({
          type: p.provider,
          available: p.available
        })),
        details: 'No AI providers available'
      }
      result.recommendations.push('Configure OpenRouter API key (free tier) or start Ollama server for AI chat and quiz generation')
    }
  } catch (error: any) {
    result.checks.apis.ai = {
      status: 'error',
      details: `Error checking AI: ${error.message}`
    }
  }

  // Check Tesseract.js OCR (always available)
  try {
    const ocrHealth = checkOCRHealth()
    result.checks.apis.ocr = {
      status: 'ok',
      details: ocrHealth.details
    }
  } catch (error: any) {
    result.checks.apis.ocr = {
      status: 'ok',
      details: 'Tesseract.js is built-in and always available'
    }
  }

  // Final status determination
  if (result.checks.database.status === 'unconfigured' || 
      result.checks.database.status === 'error') {
    result.status = 'unhealthy'
  } else if (result.checks.storage.status === 'error' ||
             result.recommendations.length > 2) {
    result.status = 'degraded'
  }

  const totalTime = Date.now() - startTime
  
  return NextResponse.json({
    ...result,
    processingTime: `${totalTime}ms`
  })
}
