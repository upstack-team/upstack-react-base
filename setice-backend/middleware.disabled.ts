// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGIN = 'http://localhost:3000'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

export function middleware(req: NextRequest) {
  // Répondre aux préflights OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }

  // Laisser Next traiter normalement
  const res = NextResponse.next()

  // Ajouter les headers CORS
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    res.headers.set(k, v as string)
  }

  return res
}

// Appliquer seulement sur les routes API
export const config = {
  matcher: ['/api/:path*'], // ← ajuste selon tes routes
}
