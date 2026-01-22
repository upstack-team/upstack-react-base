import { Assignation, Travail, Etudiant, User, EspacePedagogique, Formateur, TravailType, TravailStatut, AssignationStatut } from '@prisma/client'

/**
 * Type pour une assignation complète avec toutes les relations
 */
export type AssignationComplete = Assignation & {
  travail: Travail & {
    espacePedagogique: EspacePedagogique
    formateur: Formateur & {
      user: User
    }
  }
  etudiant: Etudiant & {
    user: User
  }
}

/**
 * Type pour un travail complet avec toutes les relations
 */
export type TravailComplete = Travail & {
  espacePedagogique: EspacePedagogique
  formateur: Formateur & {
    user: User
  }
  assignations: (Assignation & {
    etudiant: Etudiant & {
      user: User
    }
  })[]
}

/**
 * Type pour les statistiques d'assignation
 */
export interface StatistiquesAssignation {
  totalAssignations: number
  assignationsParStatut: {
    [key in AssignationStatut]: number
  }
  tauxCompletion: number
  notesMoyennes: number | null
}

/**
 * Type pour les filtres de recherche d'assignations
 */
export interface FiltresAssignation {
  etudiantId?: string
  travailId?: string
  espacePedagogiqueId?: string
  statut?: AssignationStatut
  dateDebut?: Date
  dateFin?: Date
}

/**
 * Type pour la réponse API d'assignation
 */
export interface ApiResponseAssignation {
  success: boolean
  data?: AssignationComplete | AssignationComplete[]
  message: string
  errors?: any[]
}

export { TravailType, TravailStatut, AssignationStatut }