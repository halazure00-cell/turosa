'use client'

import { useState, useEffect } from 'react'
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Database, 
  HardDrive, 
  Cloud, 
  Settings,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react'

interface HealthData {
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
  processingTime?: string
}

export default function AdminHealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    database: true,
    storage: true,
    apis: true,
    environment: false
  })
  const [copied, setCopied] = useState(false)

  const fetchHealthData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/health')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setHealthData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch health data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const copyToClipboard = () => {
    if (!healthData) return
    
    const aiProviders = healthData.checks.apis.ai.providers 
      ? healthData.checks.apis.ai.providers.map(p => `  - ${p.type}: ${p.available ? 'available' : 'unavailable'}`).join('\n')
      : `  - Status: ${healthData.checks.apis.ai.status}`
    
    const report = `Turosa Health Report
Generated: ${healthData.timestamp}
Overall Status: ${healthData.status.toUpperCase()}

Database: ${healthData.checks.database.status}
${healthData.checks.database.details}

Storage: ${healthData.checks.storage.status}
${healthData.checks.storage.buckets.map(b => `- ${b.name}: ${b.accessible ? 'OK' : 'ERROR'}`).join('\n')}

APIs:
- AI Providers (Mode: ${healthData.checks.apis.ai.mode || 'unknown'}):
${aiProviders}
- Tesseract.js OCR: ${healthData.checks.apis.ocr.status}

Environment:
- Configured: ${healthData.checks.environment.configured.length}
- Missing: ${healthData.checks.environment.missing.length}

Recommendations:
${healthData.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`
    
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'unhealthy':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'unconfigured':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'unhealthy':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            System Health Dashboard
          </h1>
          <p className="text-accent">
            Monitor system status and configuration
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={fetchHealthData}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking...' : 'Refresh Status'}
          </button>
          
          {healthData && (
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Report
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="card p-4 mb-6 border-2 border-red-200 bg-red-50">
            <div className="flex gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Failed to load health data</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !healthData && (
          <div className="card p-8 text-center">
            <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-accent">Loading health data...</p>
          </div>
        )}

        {/* Health Data */}
        {healthData && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={`card p-6 border-2 ${getStatusColor(healthData.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(healthData.status)}
                  <div>
                    <h2 className="text-xl font-bold">Overall Status</h2>
                    <p className="text-sm opacity-75">
                      Last checked: {new Date(healthData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold uppercase">{healthData.status}</div>
                  {healthData.processingTime && (
                    <div className="text-xs opacity-75">Check time: {healthData.processingTime}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="card">
              <button
                onClick={() => toggleSection('database')}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Database Connection</span>
                  {getStatusIcon(healthData.checks.database.status)}
                </div>
                {expandedSections.database ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.database && (
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`text-sm font-semibold ${getStatusColor(healthData.checks.database.status)}`}>
                        {healthData.checks.database.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Details:</span>
                      <span className="text-sm text-accent">{healthData.checks.database.details}</span>
                    </div>
                    {healthData.checks.database.latency !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Latency:</span>
                        <span className="text-sm text-accent">{healthData.checks.database.latency}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Storage Status */}
            <div className="card">
              <button
                onClick={() => toggleSection('storage')}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Storage Buckets</span>
                  {getStatusIcon(healthData.checks.storage.status)}
                </div>
                {expandedSections.storage ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.storage && (
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="space-y-2">
                    {healthData.checks.storage.buckets.map((bucket) => (
                      <div key={bucket.name} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm font-medium">{bucket.name}</span>
                        <div className="flex items-center gap-2">
                          {bucket.accessible ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              {bucket.error && (
                                <span className="text-xs text-red-600">{bucket.error}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* API Status */}
            <div className="card">
              <button
                onClick={() => toggleSection('apis')}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-primary" />
                  <span className="font-semibold">AI Providers &amp; APIs</span>
                </div>
                {expandedSections.apis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.apis && (
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="space-y-3">
                    {/* OCR Status */}
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm font-medium">Tesseract.js (OCR)</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(healthData.checks.apis.ocr.status)}
                        <span className="text-xs">{healthData.checks.apis.ocr.status}</span>
                      </div>
                    </div>
                    
                    {/* AI Providers */}
                    <div className="p-3 bg-white rounded border border-secondary-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">AI Providers</span>
                        {healthData.checks.apis.ai.mode && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Mode: {healthData.checks.apis.ai.mode}
                          </span>
                        )}
                      </div>
                      
                      {healthData.checks.apis.ai.providers && healthData.checks.apis.ai.providers.length > 0 ? (
                        <div className="space-y-2">
                          {healthData.checks.apis.ai.providers.map((provider) => (
                            <div key={provider.type} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium capitalize">{provider.type}</span>
                                {provider.models && provider.models.length > 0 && (
                                  <span className="text-xs text-accent">
                                    ({provider.models.length} models)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(provider.available ? 'ok' : 'error')}
                                <span className="text-xs">
                                  {provider.available ? 'available' : 'unavailable'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                          <span className="text-sm">AI Status</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(healthData.checks.apis.ai.status)}
                            <span className="text-xs">{healthData.checks.apis.ai.status}</span>
                          </div>
                        </div>
                      )}
                      
                      {healthData.checks.apis.ai.details && (
                        <p className="text-xs text-accent mt-2">{healthData.checks.apis.ai.details}</p>
                      )}
                    </div>
                  </div>
                </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Environment Variables */}
            <div className="card">
              <button
                onClick={() => toggleSection('environment')}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Environment Configuration</span>
                  {getStatusIcon(healthData.checks.environment.status)}
                </div>
                {expandedSections.environment ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.environment && (
                <div className="p-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-2">
                        Configured ({healthData.checks.environment.configured.length}):
                      </p>
                      <div className="space-y-1">
                        {healthData.checks.environment.configured.map((env) => (
                          <div key={env} className="text-xs text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {env}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {healthData.checks.environment.missing.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-yellow-700 mb-2">
                          Missing ({healthData.checks.environment.missing.length}):
                        </p>
                        <div className="space-y-1">
                          {healthData.checks.environment.missing.map((env) => (
                            <div key={env} className="text-xs text-yellow-600 flex items-center gap-2">
                              <AlertCircle className="w-3 h-3" />
                              {env}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {healthData.recommendations.length > 0 && (
              <div className="card p-6 border-2 border-blue-200 bg-blue-50">
                <h3 className="font-bold text-blue-900 mb-3">💡 Recommendations</h3>
                <ul className="space-y-2">
                  {healthData.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
