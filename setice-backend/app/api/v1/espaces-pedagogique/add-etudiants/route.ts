export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { addEtudiantsFromPromotion, getEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { addEtudiantsSchema } from '@/src/schemas/add-etudiants.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔵 ADD ETUDIANTS - Début') // ✅ LOG
    
    requireRole(req, ['DIRECTEUR_ETUDES', 'FORMATEUR'])
    console.log('🔵 ADD ETUDIANTS - Auth OK') // ✅ LOG

    const body = await req.json()
    console.log('🔵 ADD ETUDIANTS - Body reçu:', body) // ✅ LOG

    const data = addEtudiantsSchema.parse(body)
    console.log('🔵 ADD ETUDIANTS - Validation OK:', data) // ✅ LOG

    const result = await addEtudiantsFromPromotion(
      data.espacePedagogiqueId,
      data.promotionId
    )
    console.log('🔵 ADD ETUDIANTS - Résultat:', result) // ✅ LOG

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (e: any) {
    console.error('❌ ADD ETUDIANTS ERROR:', e) // ✅ LOG
    console.error('❌ Error message:', e.message) // ✅ LOG
    console.error('❌ Error name:', e.name) // ✅ LOG
    
    let status = 400
    let error = e.message

    if (e.message === 'MISSING_TOKEN') {
      status = 401
      error = 'Token manquant'
    }

    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') {
      status = 401
      error = 'Token invalide'
    }

    if (e.message === 'FORBIDDEN') {
      status = 403
      error = 'Accès refusé - Réservé au Directeur des Études'
    }

    if (e.message === 'ESPACE_NOT_FOUND') {
      status = 404
      error = 'Espace pédagogique introuvable'
    }

    if (e.message === 'PROMOTION_NOT_FOUND') {
      status = 404
      error = 'Promotion introuvable'
    }
    
    // ✅ AJOUT pour la validation de promotion
    if (e.message?.includes('PROMOTION_MISMATCH')) {
      status = 400
      error = e.message
    }

    if (e.message === 'NO_STUDENTS_IN_PROMOTION') {
      status = 404
      error = 'Aucun étudiant dans cette promotion'
    }

    if (e.name === 'ZodError') {
      status = 400
      error = `Validation échouée: ${JSON.stringify(e.errors)}`
    }

    return NextResponse.json(
      { success: false, error },
      {
        status,
        headers: corsHeaders,
      }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const espace = await getEspacePedagogique(params.id)

  return NextResponse.json({
    success: true,
    data: espace,
  })
}