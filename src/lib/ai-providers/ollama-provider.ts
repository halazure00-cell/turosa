/**
 * Ollama AI Provider Implementation
 * Local, private, offline-capable AI using Ollama
 */

import {
  AIProvider,
  ChatCompletionParams,
  ChatResponse,
  ModelInfo,
  ProviderHealthCheck,
  ProviderType
} from './types'

export class OllamaProvider implements AIProvider {
  readonly type: ProviderType = 'ollama'
  readonly name = 'Ollama (Local)'
  
  private baseUrl: string
  private defaultModel: string
  private timeout: number
  
  constructor(config?: { baseUrl?: string; model?: string; timeout?: number }) {
    this.baseUrl = config?.baseUrl || process.env.AI_BASE_URL || 'http://localhost:11434'
    this.defaultModel = config?.model || process.env.AI_MODEL || 'qwen2.5:7b'
    this.timeout = config?.timeout || 60000
  }
  
  async checkHealth(): Promise<ProviderHealthCheck> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      
      if (!response.ok) {
        return {
          available: false,
          provider: this.type,
          error: `Ollama server responded with status ${response.status}`,
          latency
        }
      }
      
      const data = await response.json()
      const models = data.models?.map((m: any) => m.name) || []
      
      return {
        available: true,
        provider: this.type,
        models,
        latency
      }
    } catch (error: any) {
      return {
        available: false,
        provider: this.type,
        error: error.message || 'Cannot connect to Ollama server'
      }
    }
  }
  
  async listModels(): Promise<ModelInfo[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }
      
      const data = await response.json()
      const models: ModelInfo[] = (data.models || []).map((m: any) => ({
        id: m.name,
        name: m.name,
        provider: this.type,
        description: `Local Ollama model`,
        contextWindow: 8192, // Default, varies by model
        pricing: { prompt: 0, completion: 0 }, // Free - local
        capabilities: ['chat', 'completion']
      }))
      
      return models
    } catch (error) {
      console.error('Error listing Ollama models:', error)
      return []
    }
  }
  
  async chatCompletion(params: ChatCompletionParams): Promise<ChatResponse> {
    const model = params.model || this.defaultModel
    
    const requestBody = {
      model,
      messages: params.messages,
      stream: false,
      options: {
        temperature: params.temperature || 0.7,
        num_predict: params.maxTokens || 1000
      }
    }
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error (${response.status}): ${errorText}`)
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
        throw new Error('Request timeout - Ollama took too long to respond')
      }
      throw new Error(`Ollama completion failed: ${error.message}`)
    }
  }
  
  async estimateCost(_params: ChatCompletionParams): Promise<number> {
    // Ollama is free (local)
    return 0
  }
}
