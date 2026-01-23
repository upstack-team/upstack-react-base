// src/app/api/v1/evaluations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const assignationId = url.searchParams.get('assignationId')
    if (!assignationId) return NextResponse.json({ success: false, error: 'ASSIGNATION_ID_REQUIRED' }, { status: 400, headers: CORS_HEADERS })

    const evaluations = await evaluationRepository.listByAssignation(assignationId)
    return NextResponse.json({ success: true, data: evaluations }, { headers: CORS_HEADERS })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS })
  }
}
