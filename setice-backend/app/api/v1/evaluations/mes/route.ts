/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { assignationRepository } from '@/src/repositories/assignation.repository'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

// Headers CORS
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', // ton frontend
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

// Pré-flight OPTIONS
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)

    if (user.role !== 'ETUDIANT') {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    const assignations = await assignationRepository.listByEtudiant(user.id)

    const evaluations = await Promise.all(
      assignations.map(async (assign) => {
        const evals = await evaluationRepository.listByAssignation(assign.id)
        return evals
      })
    )

    const allEvaluations = evaluations.flat()

    return NextResponse.json(
      { success: true, data: allEvaluations },
      { headers: CORS_HEADERS }
    )
  } catch (err: any) {
    console.error('GET MES EVALUATIONS ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
