/**
 * AI Provider Manager
 * Handles provider selection, fallback logic, and smart routing
 */

import {
  AIProvider,
  ChatCompletionParams,
  ChatResponse,
  ModelInfo,
  ProviderHealthCheck,
  ProviderMode,
  ProviderType
} from './types'
import { OllamaProvider } from './ollama-provider'
import { OpenRouterProvider } from './openrouter-provider'

export class ProviderManager {
  private providers: Map<ProviderType, AIProvider>
  private mode: ProviderMode
  private preferredProvider: ProviderType | null = null
  
  constructor(mode?: ProviderMode) {
    this.mode = mode || this.getConfiguredMode()
    this.providers = new Map()
    
    // Initialize providers
    this.providers.set('ollama', new OllamaProvider())
    this.providers.set('openrouter', new OpenRouterProvider())
  }
  
  /**
   * Get configured provider mode from environment
   */
  private getConfiguredMode(): ProviderMode {
    const envMode = process.env.AI_PROVIDER_MODE?.toLowerCase() as ProviderMode
    
    if (envMode && ['openrouter', 'ollama', 'hybrid', 'auto'].includes(envMode)) {
      return envMode
    }
    
    // Default to auto mode - try OpenRouter first, fallback to Ollama
    return 'auto'
  }
  
  /**
   * Get the provider to use based on mode and availability
   */
  async getActiveProvider(): Promise<AIProvider | null> {
    switch (this.mode) {
      case 'openrouter':
        return this.providers.get('openrouter') || null
        
      case 'ollama':
        return this.providers.get('ollama') || null
        
      case 'hybrid':
      case 'auto':
        // Try to use preferred provider if set
        if (this.preferredProvider) {
          const preferred = this.providers.get(this.preferredProvider)
          if (preferred) {
            const health = await preferred.checkHealth()
            if (health.available) {
              return preferred
            }
          }
        }
        
        // Try OpenRouter first (free tier, reliable)
        const openrouter = this.providers.get('openrouter')
        if (openrouter) {
          const health = await openrouter.checkHealth()
          if (health.available) {
            return openrouter
          }
        }
        
        // Fallback to Ollama (local, private)
        const ollama = this.providers.get('ollama')
        if (ollama) {
          const health = await ollama.checkHealth()
          if (health.available) {
            return ollama
          }
        }
        
        return null
        
      default:
        return null
    }
  }
  
  /**
   * Set preferred provider (user override)
   */
  setPreferredProvider(provider: ProviderType | null) {
    this.preferredProvider = provider
  }
  
  /**
   * Get current provider mode
   */
  getMode(): ProviderMode {
    return this.mode
  }
  
  /**
   * Set provider mode
   */
  setMode(mode: ProviderMode) {
    this.mode = mode
  }
  
  /**
   * Check health of all providers
   */
  async checkAllProviders(): Promise<ProviderHealthCheck[]> {
    const checks: ProviderHealthCheck[] = []
    
    for (const [_type, provider] of this.providers) {
      const health = await provider.checkHealth()
      checks.push(health)
    }
    
    return checks
  }
  
  /**
   * Get a specific provider by type
   */
  getProvider(type: ProviderType): AIProvider | undefined {
    return this.providers.get(type)
  }
  
  /**
   * List all available models from all providers
   */
  async listAllModels(): Promise<ModelInfo[]> {
    const allModels: ModelInfo[] = []
    
    for (const [_type, provider] of this.providers) {
      try {
        const models = await provider.listModels()
        allModels.push(...models)
      } catch (error) {
        console.error(`Error listing models from ${provider.name}:`, error)
      }
    }
    
    return allModels
  }
  
  /**
   * Perform chat completion with automatic fallback
   */
  async chatCompletion(params: ChatCompletionParams): Promise<ChatResponse> {
    const errors: string[] = []
    
    // Try to get active provider
    const provider = await this.getActiveProvider()
    
    if (!provider) {
      throw new Error('No AI provider available. Please configure OpenRouter API key or start Ollama server.')
    }
    
    try {
      return await provider.chatCompletion(params)
    } catch (error: any) {
      errors.push(`${provider.name}: ${error.message}`)
      
      // If in auto/hybrid mode, try fallback
      if (this.mode === 'auto' || this.mode === 'hybrid') {
        const fallbackType = provider.type === 'openrouter' ? 'ollama' : 'openrouter'
        const fallbackProvider = this.providers.get(fallbackType)
        
        if (fallbackProvider) {
          const health = await fallbackProvider.checkHealth()
          if (health.available) {
            try {
              console.log(`Falling back to ${fallbackProvider.name}`)
              return await fallbackProvider.chatCompletion(params)
            } catch (fallbackError: any) {
              errors.push(`${fallbackProvider.name}: ${fallbackError.message}`)
            }
          }
        }
      }
      
      throw new Error(`All providers failed: ${errors.join('; ')}`)
    }
  }
  
  /**
   * Estimate cost for chat completion
   */
  async estimateCost(params: ChatCompletionParams): Promise<{ total: number; byProvider: Record<string, number> }> {
    const costs: Record<string, number> = {}
    let total = 0
    
    const provider = await this.getActiveProvider()
    if (provider) {
      const cost = await provider.estimateCost(params)
      costs[provider.type] = cost
      total = cost
    }
    
    return { total, byProvider: costs }
  }
}

// Singleton instance
let managerInstance: ProviderManager | null = null

/**
 * Get the global provider manager instance
 */
export function getProviderManager(): ProviderManager {
  if (!managerInstance) {
    managerInstance = new ProviderManager()
  }
  return managerInstance
}

/**
 * Reset the provider manager (useful for testing)
 */
export function resetProviderManager() {
  managerInstance = null
}
