/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

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
    const id = url.pathname.split('/').pop() // Récupère l'id depuis l'URL
    const db = await getDataSource()
    const repo = db.getRepository(EspacePedagogique)
    const espace = await repo.findOne({
      where: { id },
      relations: ['etudiants'],
    })

    if (!espace) {
      return NextResponse.json({ success: false, error: 'ESPACE_NOT_FOUND' }, { status: 404, headers: CORS_HEADERS })
    }

    return NextResponse.json({ success: true, data: espace }, { headers: CORS_HEADERS })
  } catch (err: any) {
    console.error('GET ESPACE ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS })
  }
}
