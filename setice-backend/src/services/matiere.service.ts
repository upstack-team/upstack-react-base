import { getDataSource } from '@/src/lib/db'
import { Matiere } from '@/src/entities/Matiere'
import { CreateMatiereInput } from '@/src/schemas/matiere.schema'

export async function createMatiere(input: CreateMatiereInput) {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  // 1️⃣ Vérifier unicité du code
  const exists = await matiereRepo.findOne({
    where: { code: input.code },
  })

  if (exists) {
    throw new Error('MATIERE_ALREADY_EXISTS')
  }

  // 2️⃣ Créer matière
  const matiere = matiereRepo.create({
    code: input.code,
    libelle: input.libelle,
  } as Partial<Matiere>)

  await matiereRepo.save(matiere)

  return {
    id: matiere.id,
    code: matiere.code,
    libelle: matiere.libelle,
  }
}
