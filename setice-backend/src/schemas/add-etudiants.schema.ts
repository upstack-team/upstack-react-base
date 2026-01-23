import { z } from 'zod'

export const addEtudiantsSchema = z.object({
  espacePedagogiqueId: z.string().uuid('ID espace invalide'),
  promotionId: z.string().uuid('ID promotion invalide'),
})

export type AddEtudiantsInput = z.infer<typeof addEtudiantsSchema>