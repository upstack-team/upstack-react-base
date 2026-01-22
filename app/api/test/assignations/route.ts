import { NextRequest, NextResponse } from 'next/server'
import { assignationService } from '@/src/services/assignation.service'
import { assignerTravailSchema } from '@/src/schemas/assignation.schema'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/test/assignations
 * Version de test SANS authentification pour tester les fonctionnalités
 * ⚠️ À SUPPRIMER EN PRODUCTION
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test d\'assignation sans authentification')
    
    // Validation des données d'entrée
    const body = await request.json()
    const validatedData = assignerTravailSchema.parse(body)

    // Assignation du travail avec un formateur de test
    const assignation = await assignationService.assignerTravailIndividuel({
      ...validatedData,
      formateurId: body.formateurId || 'auto' // Sera résolu automatiquement
    })

    return NextResponse.json(
      {
        success: true,
        data: assignation,
        message: 'Travail assigné avec succès (mode test)'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation (test):', error?.message || error)

    // Gestion des erreurs de validation Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          errors: error.errors
        },
        { status: 400 }
      )
    }

    // Gestion des erreurs métier
    if (error instanceof Error) {
      const message = error.message

      // Erreurs spécifiques avec codes de statut appropriés
      if (message === 'Travail non trouvé') {
        return NextResponse.json(
          {
            success: false,
            message: 'Travail non trouvé'
          },
          { status: 404 }
        )
      }

      if (message === 'L\'étudiant n\'est pas inscrit dans cet espace') {
        return NextResponse.json(
          {
            success: false,
            message: 'L\'étudiant n\'est pas inscrit dans cet espace'
          },
          { status: 400 }
        )
      }

      if (message === 'Ce travail est déjà assigné') {
        return NextResponse.json(
          {
            success: false,
            message: 'Ce travail est déjà assigné'
          },
          { status: 409 }
        )
      }

      if (message === 'Ce travail n\'est pas de type individuel') {
        return NextResponse.json(
          {
            success: false,
            message: 'Ce travail n\'est pas de type individuel'
          },
          { status: 400 }
        )
      }

      if (message === 'Vous n\'êtes pas autorisé à assigner ce travail') {
        return NextResponse.json(
          {
            success: false,
            message: 'Vous n\'êtes pas autorisé à assigner ce travail'
          },
          { status: 403 }
        )
      }

      // Erreur générique avec le message d'erreur
      return NextResponse.json(
        {
          success: false,
          message: message
        },
        { status: 500 }
      )
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne du serveur'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/test/assignations
 * Récupère toutes les assignations (mode test)
 */
export async function GET() {
  try {
    console.log('🧪 Récupération des assignations (mode test)')
    
    // Récupérer le premier formateur disponible
    const formateur = await prisma.formateur.findFirst()
    if (!formateur) {
      throw new Error('Aucun formateur trouvé')
    }
    
    // Récupérer toutes les assignations avec les relations
    const assignations = await assignationService.getAssignationsFormateur(formateur.id)

    return NextResponse.json(
      {
        success: true,
        data: assignations,
        message: 'Assignations récupérées avec succès (mode test)'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Erreur lors de la récupération (test):', error?.message || error)

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne du serveur'
      },
      { status: 500 }
    )
  }
}