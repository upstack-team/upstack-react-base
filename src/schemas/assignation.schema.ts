import { z } from 'zod'

/**
 * Schéma de validation pour l'assignation d'un travail
 */
export const assignerTravailSchema = z.object({
  travailId: z.string().uuid('ID de travail invalide'),
  etudiantId: z.string().uuid('ID d\'étudiant invalide')
})

export type AssignerTravailInput = z.infer<typeof assignerTravailSchema>

/**
 * Schéma pour les paramètres de requête GET
 */
export const getAssignationsQuerySchema = z.object({
  etudiantId: z.string().uuid().optional(),
  travailId: z.string().uuid().optional(),
  statut: z.enum(['ASSIGNE', 'LIVRE', 'EVALUE']).optional()
})

export type GetAssignationsQuery = z.infer<typeof getAssignationsQuerySchema>
