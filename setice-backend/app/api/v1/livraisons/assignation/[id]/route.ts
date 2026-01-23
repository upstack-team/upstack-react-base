// src/app/api/v1/livraisons/assignation/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { livraisonRepository } from '@/src/repositories/livraison.repository'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const livraison = await livraisonRepository.findByAssignation(params.id)
    return NextResponse.json({ success: true, data: livraison }, { headers: CORS_HEADERS })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS })
  }
}
