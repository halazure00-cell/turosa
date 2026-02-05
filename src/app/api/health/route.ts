import { NextResponse } from 'next/server'

export async function GET() {
  // Basic health check endpoint for monitoring
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
  }

  return NextResponse.json(health, { status: 200 })
}
