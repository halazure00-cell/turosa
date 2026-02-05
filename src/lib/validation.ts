// Input validation utilities for API routes and database operations

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 10000) // Max length to prevent DoS
}

/**
 * Validate and sanitize URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate number is positive integer
 */
export function isPositiveInteger(num: any): boolean {
  return Number.isInteger(num) && num > 0
}

/**
 * Validate array has items
 */
export function isNonEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * Safe division to prevent divide by zero
 */
export function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  if (denominator === 0) return defaultValue
  return numerator / denominator
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
