import { z } from 'zod'

export const createPromotionSchema = z.object({
  code: z.string().min(1),
  libelle: z.string().min(1),
  annee: z.string().min(4),
})

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
