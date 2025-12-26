import { z } from 'zod'

export const createMatiereSchema = z.object({
  code: z.string().min(1),
  libelle: z.string().min(1),
})

export type CreateMatiereInput = z.infer<typeof createMatiereSchema>
