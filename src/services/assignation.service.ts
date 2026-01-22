import { prisma } from '@/lib/prisma'

export interface AssignerTravailInput {
  travailId: string
  etudiantId: string
  formateurId: string
}

export interface AssignerTravailResult {
  success: boolean
  assignation?: any
  error?: string
  statusCode?: number
}

export class AssignationService {
  /**
   * Assigne un travail individuel à un étudiant
   * Vérifie toutes les règles métier avant l'assignation
   */
  static async assignerTravail(input: AssignerTravailInput): Promise<AssignerTravailResult> {
    const { travailId, etudiantId, formateurId } = input

    try {
      // 1. Vérifier que le travail existe et est de type INDIVIDUEL
      const travail = await prisma.travail.findUnique({
        where: { id: travailId },
        include: {
          espacePedagogique: true,
          formateur: true
        }
      })

      if (!travail) {
        return {
          success: false,
          error: 'Travail introuvable',
          statusCode: 404
        }
      }

      if (travail.type !== 'INDIVIDUEL') {
        return {
          success: false,
          error: 'Ce travail est collectif, pas individuel',
          statusCode: 400
        }
      }

      // 2. Vérifier que le formateur est bien responsable de ce travail
      if (travail.formateurId !== formateurId) {
        return {
          success: false,
          error: 'Vous n\'êtes pas responsable de ce travail',
          statusCode: 403
        }
      }

      // 3. Vérifier que l'étudiant existe
      const etudiant = await prisma.etudiant.findUnique({
        where: { id: etudiantId },
        include: {
          user: true
        }
      })

      if (!etudiant) {
        return {
          success: false,
          error: 'Étudiant introuvable',
          statusCode: 404
        }
      }

      // 4. Vérifier que l'étudiant est inscrit dans l'espace pédagogique du travail
      const inscription = await prisma.inscription.findUnique({
        where: {
          etudiantId_espacePedagogiqueId: {
            etudiantId: etudiantId,
            espacePedagogiqueId: travail.espacePedagogiqueId
          }
        }
      })

      if (!inscription) {
        return {
          success: false,
          error: 'L\'étudiant n\'est pas inscrit dans cet espace pédagogique',
          statusCode: 400
        }
      }

      // 5. Vérifier qu'il n'y a pas déjà une assignation (pas de doublon)
      const assignationExistante = await prisma.assignation.findUnique({
        where: {
          travailId_etudiantId: {
            travailId: travailId,
            etudiantId: etudiantId
          }
        }
      })

      if (assignationExistante) {
        return {
          success: false,
          error: 'Ce travail est déjà assigné à cet étudiant',
          statusCode: 409
        }
      }

      // 6. Créer l'assignation
      const assignation = await prisma.assignation.create({
        data: {
          travailId: travailId,
          etudiantId: etudiantId,
          statut: 'ASSIGNE',
          dateAssignation: new Date()
        },
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
        }
      })

      // 7. Envoyer une notification email (simulé pour l'instant)
      await this.envoyerNotificationEmail(assignation)

      return {
        success: true,
        assignation: assignation
      }

    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error)
      return {
        success: false,
        error: 'Erreur interne lors de l\'assignation',
        statusCode: 500
      }
    }
  }

  /**
   * Récupère les assignations d'un formateur
   */
  static async getAssignationsFormateur(formateurId: string) {
    try {
      const assignations = await prisma.assignation.findMany({
        where: {
          travail: {
            formateurId: formateurId
          }
        },
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

      return {
        success: true,
        assignations
      }
    } catch (error) {
      console.error('Erreur récupération assignations:', error)
      return {
        success: false,
        error: 'Erreur lors de la récupération des assignations'
      }
    }
  }

  /**
   * Récupère les assignations d'un étudiant
   */
  static async getAssignationsEtudiant(etudiantId: string) {
    try {
      const assignations = await prisma.assignation.findMany({
        where: {
          etudiantId: etudiantId
        },
        include: {
          travail: {
            include: {
              espacePedagogique: true,
              formateur: {
                include: {
                  user: true
                }
              }
            }
          }
        },
        orderBy: {
          dateAssignation: 'desc'
        }
      })

      return {
        success: true,
        assignations
      }
    } catch (error) {
      console.error('Erreur récupération assignations:', error)
      return {
        success: false,
        error: 'Erreur lors de la récupération des assignations'
      }
    }
  }

  /**
   * Envoie un email de notification à l'étudiant
   * (Simulé pour l'instant - à implémenter avec un vrai service email)
   */
  private static async envoyerNotificationEmail(assignation: any) {
    // Simulation d'envoi d'email
    console.log('📧 Email envoyé à:', assignation.etudiant.user.email)
    console.log('Sujet: Nouveau travail assigné -', assignation.travail.titre)
    console.log('Contenu:')
    console.log(`Bonjour ${assignation.etudiant.user.prenom},`)
    console.log(`Un nouveau travail vous a été assigné: ${assignation.travail.titre}`)
    console.log(`Espace pédagogique: ${assignation.travail.espacePedagogique.nom}`)
    console.log(`Date limite: ${new Date(assignation.travail.dateLimite).toLocaleDateString('fr-FR')}`)
    console.log('---')

    // TODO: Implémenter l'envoi réel avec un service email (Resend, SendGrid, etc.)
    // Exemple avec le service email existant:
    // await emailService.envoyerEmail({
    //   to: assignation.etudiant.user.email,
    //   subject: `Nouveau travail assigné - ${assignation.travail.titre}`,
    //   template: 'assignation-travail',
    //   data: { assignation }
    // })

    return true
  }
}
