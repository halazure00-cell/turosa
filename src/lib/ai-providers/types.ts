/**
 * AI Provider Types and Interfaces
 * Shared types for all AI provider implementations
 */

export type ProviderType = 'openrouter' | 'ollama'
export type ProviderMode = 'openrouter' | 'ollama' | 'hybrid' | 'auto'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionParams {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface ChatResponse {
  message: string
  model: string
  provider: ProviderType
  finishReason?: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

export interface ProviderHealthCheck {
  available: boolean
  provider: ProviderType
  models?: string[]
  error?: string
  latency?: number
}

export interface ProviderConfig {
  type: ProviderType
  enabled: boolean
  priority: number
  config: Record<string, any>
}

export interface ModelInfo {
  id: string
  name: string
  provider: ProviderType
  description?: string
  contextWindow?: number
  pricing?: {
    prompt: number
    completion: number
  }
  capabilities?: string[]
}

export interface AIProvider {
  readonly type: ProviderType
  readonly name: string
  
  /**
   * Check if the provider is available and healthy
   */
  checkHealth(): Promise<ProviderHealthCheck>
  
  /**
   * List available models from this provider
   */
  listModels(): Promise<ModelInfo[]>
  
  /**
   * Perform chat completion
   */
  chatCompletion(params: ChatCompletionParams): Promise<ChatResponse>
  
  /**
   * Estimate cost for a chat completion (in USD)
   */
  estimateCost(params: ChatCompletionParams): Promise<number>
}
