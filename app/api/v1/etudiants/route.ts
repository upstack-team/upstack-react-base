import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/etudiants
 * Récupère la liste des étudiants (avec filtres optionnels)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const espacePedagogiqueId = searchParams.get('espacePedagogiqueId')

    let etudiants

    if (espacePedagogiqueId) {
      // Récupérer uniquement les étudiants inscrits dans l'espace pédagogique
      const inscriptions = await prisma.inscription.findMany({
        where: {
          espacePedagogiqueId
        },
        include: {
          etudiant: {
            include: {
              user: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                  email: true
                }
              }
            }
          }
        }
      })

      etudiants = inscriptions.map(inscription => inscription.etudiant)
    } else {
      // Récupérer tous les étudiants
      etudiants = await prisma.etudiant.findMany({
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        },
        orderBy: {
          user: {
            nom: 'asc'
          }
        }
      })
    }

    return NextResponse.json({
      etudiants,
      count: etudiants.length
    })

  } catch (error) {
    console.error('Erreur API etudiants GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
