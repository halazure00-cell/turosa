/**
 * AI Provider Abstraction Layer
 * Provides a unified interface for AI chat completions using Ollama
 * Compatible with OpenAI API format for easy migration
 */

export interface AIProviderConfig {
  baseUrl: string
  model: string
  timeout?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  message: string
  model: string
  finishReason?: string
}

export interface ChatCompletionParams {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

/**
 * Get AI provider configuration from environment variables
 */
export function getAIConfig(): AIProviderConfig {
  return {
    baseUrl: process.env.AI_BASE_URL || 'http://localhost:11434',
    model: process.env.AI_MODEL || 'qwen2.5:7b',
    timeout: 60000 // 60 seconds
  }
}

/**
 * Check if AI provider is available and healthy
 */
export async function checkAIHealth(): Promise<{ available: boolean; error?: string; models?: string[] }> {
  const config = getAIConfig()
  
  try {
    // Try to list available models to verify connection
    const response = await fetch(`${config.baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      return {
        available: false,
        error: `Ollama server responded with status ${response.status}`
      }
    }
    
    const data = await response.json()
    const models = data.models?.map((m: any) => m.name) || []
    
    return {
      available: true,
      models
    }
  } catch (error: any) {
    return {
      available: false,
      error: error.message || 'Cannot connect to Ollama server'
    }
  }
}

/**
 * List available models from Ollama
 */
export async function listAvailableModels(): Promise<string[]> {
  const config = getAIConfig()
  
  try {
    const response = await fetch(`${config.baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }
    
    const data = await response.json()
    return data.models?.map((m: any) => m.name) || []
  } catch (error) {
    console.error('Error listing models:', error)
    return []
  }
}

/**
 * Perform chat completion using Ollama
 * Uses OpenAI-compatible endpoint for easy migration
 */
export async function chatCompletion(
  params: ChatCompletionParams
): Promise<ChatResponse> {
  const config = getAIConfig()
  
  const requestBody = {
    model: config.model,
    messages: params.messages,
    stream: false,
    options: {
      temperature: params.temperature || 0.7,
      num_predict: params.maxTokens || 1000
    }
  }
  
  try {
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(config.timeout || 60000)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama API error (${response.status}): ${errorText}`)
    }
    
    const data = await response.json()
    
    // Extract message from OpenAI-compatible response
    const message = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memberikan jawaban.'
    const finishReason = data.choices?.[0]?.finish_reason
    
    return {
      message,
      model: data.model || config.model,
      finishReason
    }
  } catch (error: any) {
    // Handle timeout
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      throw new Error('Request timeout')
    }
    
    // Re-throw with context
    throw new Error(`AI completion failed: ${error.message}`)
  }
}
