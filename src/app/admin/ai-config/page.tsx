'use client'

import { useState, useEffect } from 'react'
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Settings,
  Zap,
  Shield,
  Cloud,
  HardDrive,
  DollarSign
} from 'lucide-react'

interface Provider {
  type: string
  name: string
  available: boolean
  models: string[]
  error?: string
  latency?: number
  description: string
}

interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string
  contextWindow?: number
  pricing?: {
    prompt: number
    completion: number
  }
  capabilities?: string[]
}

interface ProvidersResponse {
  mode: string
  providers: Provider[]
  timestamp: string
}

interface ModelsResponse {
  models: ModelInfo[]
  grouped: {
    openrouter: ModelInfo[]
    ollama: ModelInfo[]
  }
  total: number
}

export default function AIConfigPage() {
  const [providersData, setProvidersData] = useState<ProvidersResponse | null>(null)
  const [modelsData, setModelsData] = useState<ModelsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<string>('auto')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [providersRes, modelsRes] = await Promise.all([
        fetch('/api/ai/providers'),
        fetch('/api/ai/models')
      ])
      
      if (!providersRes.ok || !modelsRes.ok) {
        throw new Error('Failed to fetch AI configuration')
      }
      
      const providers = await providersRes.json()
      const models = await modelsRes.json()
      
      setProvidersData(providers)
      setModelsData(models)
      setSelectedMode(providers.mode || 'auto')
    } catch (err: any) {
      setError(err.message || 'Failed to load AI configuration')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleModeChange = async (mode: string) => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const response = await fetch('/api/ai/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update configuration')
      }
      
      setSelectedMode(mode)
      setSaveMessage('Configuration saved successfully!')
      setTimeout(() => setSaveMessage(null), 3000)
      
      // Refresh data
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    )
  }

  const getProviderIcon = (type: string) => {
    return type === 'openrouter' ? (
      <Cloud className="w-6 h-6 text-blue-600" />
    ) : (
      <HardDrive className="w-6 h-6 text-purple-600" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            AI Provider Configuration
          </h1>
          <p className="text-accent">
            Configure and manage AI providers for chat and quiz generation
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh Status'}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 card p-4 border-2 border-green-200 bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{saveMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card p-4 mb-6 border-2 border-red-200 bg-red-50">
            <div className="flex gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !providersData && (
          <div className="card p-8 text-center">
            <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-accent">Loading configuration...</p>
          </div>
        )}

        {/* Configuration Content */}
        {providersData && (
          <div className="space-y-6">
            {/* Provider Mode Selection */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Provider Mode</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Auto Mode */}
                <button
                  onClick={() => handleModeChange('auto')}
                  disabled={isSaving}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'auto'
                      ? 'border-primary bg-primary/10'
                      : 'border-secondary-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Auto</span>
                  </div>
                  <p className="text-sm text-accent">
                    Smart selection with automatic fallback
                  </p>
                </button>

                {/* OpenRouter Mode */}
                <button
                  onClick={() => handleModeChange('openrouter')}
                  disabled={isSaving}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'openrouter'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-secondary-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">OpenRouter</span>
                  </div>
                  <p className="text-sm text-accent">
                    Free cloud AI with Arabic support
                  </p>
                </button>

                {/* Ollama Mode */}
                <button
                  onClick={() => handleModeChange('ollama')}
                  disabled={isSaving}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'ollama'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-secondary-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Ollama</span>
                  </div>
                  <p className="text-sm text-accent">
                    Local AI for privacy & offline
                  </p>
                </button>

                {/* Hybrid Mode */}
                <button
                  onClick={() => handleModeChange('hybrid')}
                  disabled={isSaving}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'hybrid'
                      ? 'border-green-500 bg-green-50'
                      : 'border-secondary-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Hybrid</span>
                  </div>
                  <p className="text-sm text-accent">
                    Best of both with fallback
                  </p>
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Mode:</strong> {selectedMode.toUpperCase()} - 
                  {selectedMode === 'auto' && ' Automatically selects best available provider'}
                  {selectedMode === 'openrouter' && ' Uses OpenRouter free tier only'}
                  {selectedMode === 'ollama' && ' Uses local Ollama server only'}
                  {selectedMode === 'hybrid' && ' Tries both providers with intelligent fallback'}
                </p>
              </div>
            </div>

            {/* Provider Status */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Provider Status</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {providersData.providers.map((provider) => (
                  <div
                    key={provider.type}
                    className={`p-4 rounded-lg border-2 ${
                      provider.available
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getProviderIcon(provider.type)}
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-xs text-accent">{provider.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(provider.available)}
                    </div>
                    
                    {provider.available ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">Available</span>
                        </div>
                        {provider.latency && (
                          <div className="text-sm text-accent">
                            Latency: {provider.latency}ms
                          </div>
                        )}
                        {provider.models.length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Models: </span>
                            <span className="text-accent">{provider.models.length} available</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-700">Unavailable</span>
                        </div>
                        {provider.error && (
                          <p className="text-xs text-red-600">{provider.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Models */}
            {modelsData && modelsData.models.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Available Models</h2>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">All Free!</span>
                  </div>
                </div>
                
                {/* OpenRouter Models */}
                {modelsData.grouped.openrouter.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-blue-600" />
                      OpenRouter Free Models
                    </h3>
                    <div className="space-y-2">
                      {modelsData.grouped.openrouter.map((model) => (
                        <div key={model.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h4 className="font-medium text-sm">{model.name}</h4>
                              <p className="text-xs text-accent">{model.description}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Free
                            </span>
                          </div>
                          {model.capabilities && model.capabilities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {model.capabilities.map((cap) => (
                                <span key={cap} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {cap}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Ollama Models */}
                {modelsData.grouped.ollama.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-purple-600" />
                      Ollama Local Models
                    </h3>
                    <div className="space-y-2">
                      {modelsData.grouped.ollama.map((model) => (
                        <div key={model.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h4 className="font-medium text-sm">{model.name}</h4>
                              <p className="text-xs text-accent">{model.description}</p>
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Local
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Setup Instructions */}
            <div className="card p-6 border-2 border-blue-200 bg-blue-50">
              <h3 className="font-bold text-blue-900 mb-3">💡 Setup Instructions</h3>
              <div className="space-y-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-semibold mb-1">OpenRouter (Recommended):</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a></li>
                    <li>Create a free account and generate an API key</li>
                    <li>Add <code className="bg-blue-100 px-1 rounded">OPENROUTER_API_KEY</code> to your environment variables</li>
                    <li>Restart the application</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ollama (Privacy-Focused):</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Install Ollama from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline">ollama.com</a></li>
                    <li>Run <code className="bg-blue-100 px-1 rounded">ollama pull qwen2.5:7b</code></li>
                    <li>Start Ollama server: <code className="bg-blue-100 px-1 rounded">ollama serve</code></li>
                    <li>Configure <code className="bg-blue-100 px-1 rounded">AI_BASE_URL</code> and <code className="bg-blue-100 px-1 rounded">AI_MODEL</code></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
