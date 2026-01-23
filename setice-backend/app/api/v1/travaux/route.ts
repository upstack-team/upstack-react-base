/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { listTravauxByEspace, getTravailById } from '@/src/services/travail.service'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 🔁 PRE-FLIGHT pour CORS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_req: NextRequest) {
  console.log('⚡ OPTIONS appelé pour /api/v1/travaux')
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

// ✅ GET /api/v1/travaux?id=UUID OR ?espaceId=UUID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const espaceId = url.searchParams.get('espaceId')

    // 1️⃣ Récupérer un travail précis si id présent
    if (id) {
      const travail = await getTravailById(id)
      if (!travail) {
        return NextResponse.json(
          { success: false, error: 'TRAVAIL_NOT_FOUND' },
          { status: 404, headers: CORS_HEADERS }
        )
      }
      return NextResponse.json(
        { success: true, data: travail },
        { status: 200, headers: CORS_HEADERS }
      )
    }

    // 2️⃣ Récupérer tous les travaux d’un espace si espaceId présent
    if (espaceId) {
      const travaux = await listTravauxByEspace(espaceId)
      return NextResponse.json(
        { success: true, data: travaux },
        { status: 200, headers: CORS_HEADERS }
      )
    }

    // 3️⃣ Erreur si aucun paramètre fourni
    return NextResponse.json(
      { success: false, error: 'ID_OR_ESPACE_ID_REQUIRED' },
      { status: 400, headers: CORS_HEADERS }
    )
  } catch (err: any) {
    console.error('GET TRAVAUX ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'INTERNAL_ERROR' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
