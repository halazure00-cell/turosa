'use client'

import { useEffect } from 'react'
import { logConfigurationStatus } from '@/lib/config'

/**
 * Configuration Logger Component
 * This component logs the configuration status to the console
 * Only runs in development mode for debugging
 */
export default function ConfigLogger() {
  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      logConfigurationStatus()
    }
  }, [])

  return null // This component doesn't render anything
}
