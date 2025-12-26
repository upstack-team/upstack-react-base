import { z } from 'zod'

export const createEtudiantSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  promotionId: z.string().uuid(),
})

export type CreateEtudiantInput = z.infer<typeof createEtudiantSchema>
