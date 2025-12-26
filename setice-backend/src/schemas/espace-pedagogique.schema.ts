import { z } from 'zod'

export const createEspacePedagogiqueSchema = z.object({
  promotionId: z.string().uuid(),
  matiereId: z.string().uuid(),
  formateurId: z.string().uuid(),
})

export type CreateEspacePedagogiqueInput =
  z.infer<typeof createEspacePedagogiqueSchema>
