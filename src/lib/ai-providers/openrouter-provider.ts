/**
 * OpenRouter AI Provider Implementation
 * Free tier AI models with excellent Arabic support
 */

import {
  AIProvider,
  ChatCompletionParams,
  ChatResponse,
  ModelInfo,
  ProviderHealthCheck,
  ProviderType
} from './types'

// Free models available on OpenRouter
const FREE_MODELS: ModelInfo[] = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B Instruct (Free)',
    provider: 'openrouter',
    description: 'Fast and efficient model, great for Arabic language tasks',
    contextWindow: 131072,
    pricing: { prompt: 0, completion: 0 },
    capabilities: ['chat', 'completion', 'multilingual', 'arabic']
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B Instruct (Free)',
    provider: 'openrouter',
    description: 'Larger model with excellent Arabic understanding',
    contextWindow: 131072,
    pricing: { prompt: 0, completion: 0 },
    capabilities: ['chat', 'completion', 'multilingual', 'arabic']
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B IT (Free)',
    provider: 'openrouter',
    description: 'Google\'s efficient model with good multilingual support',
    contextWindow: 8192,
    pricing: { prompt: 0, completion: 0 },
    capabilities: ['chat', 'completion', 'multilingual']
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free)',
    provider: 'openrouter',
    description: 'Fast alternative with good performance',
    contextWindow: 32768,
    pricing: { prompt: 0, completion: 0 },
    capabilities: ['chat', 'completion', 'fast']
  },
  {
    id: 'nousresearch/hermes-3-llama-3.1-405b:free',
    name: 'Hermes 3 Llama 3.1 405B (Free)',
    provider: 'openrouter',
    description: 'Advanced model with superior reasoning capabilities',
    contextWindow: 8192,
    pricing: { prompt: 0, completion: 0 },
    capabilities: ['chat', 'completion', 'reasoning', 'advanced']
  }
]

export class OpenRouterProvider implements AIProvider {
  readonly type: ProviderType = 'openrouter'
  readonly name = 'OpenRouter (Free)'
  
  private apiKey: string
  private baseUrl: string
  private defaultModel: string
  private timeout: number
  private appName: string
  
  constructor(config?: {
    apiKey?: string
    baseUrl?: string
    model?: string
    timeout?: number
    appName?: string
  }) {
    this.apiKey = config?.apiKey || process.env.OPENROUTER_API_KEY || ''
    this.baseUrl = config?.baseUrl || 'https://openrouter.ai/api/v1'
    this.defaultModel = config?.model || 'meta-llama/llama-3.1-8b-instruct:free'
    this.timeout = config?.timeout || 60000
    this.appName = config?.appName || 'Turosa'
  }
  
  async checkHealth(): Promise<ProviderHealthCheck> {
    if (!this.apiKey) {
      return {
        available: false,
        provider: this.type,
        error: 'OpenRouter API key not configured'
      }
    }
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const startTime = Date.now()
      
      // Test with a minimal request to check API key validity
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://turosa.app',
          'X-Title': this.appName
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      
      if (!response.ok) {
        return {
          available: false,
          provider: this.type,
          error: `OpenRouter API error: ${response.status}`,
          latency
        }
      }
      
      return {
        available: true,
        provider: this.type,
        models: FREE_MODELS.map(m => m.id),
        latency
      }
    } catch (error: any) {
      return {
        available: false,
        provider: this.type,
        error: error.message || 'Cannot connect to OpenRouter'
      }
    }
  }
  
  async listModels(): Promise<ModelInfo[]> {
    // Return our curated list of free models
    return FREE_MODELS
  }
  
  async chatCompletion(params: ChatCompletionParams): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured')
    }
    
    const model = params.model || this.defaultModel
    
    const requestBody = {
      model,
      messages: params.messages,
      temperature: params.temperature || 0.7,
      max_tokens: params.maxTokens || 1000
    }
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://turosa.app',
          'X-Title': this.appName
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`)
      }
      
      const data = await response.json()
      
      const message = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memberikan jawaban.'
      const finishReason = data.choices?.[0]?.finish_reason
      
      return {
        message,
        model: data.model || model,
        provider: this.type,
        finishReason,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined
      }
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request timeout - OpenRouter took too long to respond')
      }
      throw new Error(`OpenRouter completion failed: ${error.message}`)
    }
  }
  
  async estimateCost(_params: ChatCompletionParams): Promise<number> {
    // Using free models, so cost is $0
    return 0
  }
}
