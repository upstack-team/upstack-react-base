import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/travaux
 * Récupère la liste des travaux (avec filtres optionnels)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const espacePedagogiqueId = searchParams.get('espacePedagogiqueId')

    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (espacePedagogiqueId) {
      where.espacePedagogiqueId = espacePedagogiqueId
    }

    const travaux = await prisma.travail.findMany({
      where,
      include: {
        espacePedagogique: {
          select: {
            id: true,
            nom: true
          }
        },
        formateur: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        }
      },
      orderBy: {
        dateLimite: 'asc'
      }
    })

    return NextResponse.json({
      travaux,
      count: travaux.length
    })

  } catch (error) {
    console.error('Erreur API travaux GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
