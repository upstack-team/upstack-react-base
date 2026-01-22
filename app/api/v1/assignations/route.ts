import { NextRequest, NextResponse } from 'next/server'
import { AssignationService } from '@/src/services/assignation.service'
import { assignerTravailSchema } from '@/src/schemas/assignation.schema'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/v1/assignations
 * Assigne un travail individuel à un étudiant (version simplifiée pour tests)
 */
export async function POST(request: NextRequest) {
  try {
    // Valider les données d'entrée avec Zod
    const body = await request.json()
    const validation = assignerTravailSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { travailId, etudiantId } = validation.data

    // Récupérer le formateur du travail pour l'assignation
    const travail = await prisma.travail.findUnique({
      where: { id: travailId },
      select: { formateurId: true }
    })

    if (!travail) {
      return NextResponse.json(
        { error: 'Travail introuvable' },
        { status: 404 }
      )
    }

    // Appeler le service d'assignation
    const result = await AssignationService.assignerTravail({
      travailId,
      etudiantId,
      formateurId: travail.formateurId
    })

    // Gérer le résultat
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode || 400 }
      )
    }

    // Retourner le succès
    return NextResponse.json(
      {
        message: 'Travail assigné avec succès',
        assignation: result.assignation
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur API assignations POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/v1/assignations
 * Récupère toutes les assignations (version simplifiée pour tests)
 */
export async function GET(request: NextRequest) {
  try {
    const assignations = await prisma.assignation.findMany({
      include: {
        travail: {
          include: {
            espacePedagogique: true
          }
        },
        etudiant: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        dateAssignation: 'desc'
      }
    })

    return NextResponse.json({
      assignations
    })

  } catch (error) {
    console.error('Erreur API assignations GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
