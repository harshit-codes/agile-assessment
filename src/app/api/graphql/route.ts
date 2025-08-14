import { NextRequest, NextResponse } from 'next/server'
import apolloServerHandler from '../../../lib/graphql/server'

export async function GET(request: NextRequest) {
  try {
    return await apolloServerHandler(request)
  } catch (error) {
    // Log detailed error information for debugging
    console.error('GraphQL GET error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: request.url,
      timestamp: new Date().toISOString(),
      // Don't log sensitive headers in production
      headers: process.env.NODE_ENV === 'development' ? Object.fromEntries(request.headers.entries()) : {},
    })
    
    // Return appropriate error response
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Service temporarily unavailable' 
      : error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString() 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await apolloServerHandler(request)
  } catch (error) {
    // Log detailed error information for debugging
    console.error('GraphQL POST error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: request.url,
      timestamp: new Date().toISOString(),
      // Don't log request body in production for security
      body: process.env.NODE_ENV === 'development' ? await request.text().catch(() => 'Could not read body') : 'Body not logged in production',
    })
    
    // Return appropriate error response
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Service temporarily unavailable' 
      : error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString() 
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Clerk-User-Id',
      'Access-Control-Max-Age': '86400',
    },
  })
}