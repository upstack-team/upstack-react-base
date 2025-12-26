import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Matiere } from '@/src/entities/Matiere'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { CreateEspacePedagogiqueInput } from '@/src/schemas/espace-pedagogique.schema'

export async function createEspacePedagogique(
  input: CreateEspacePedagogiqueInput
) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const promotionRepo = db.getRepository(Promotion)
  const formateurRepo = db.getRepository(Formateur)
  const matiereRepo = db.getRepository(Matiere)
  const espaceRepo = db.getRepository(EspacePedagogique)

  // ⚠️ Pour l’instant : directeur hardcodé / simulé
  const directeur = await userRepo.findOne({
    where: { role: Role.DIRECTEUR_ETUDES },
  })

  if (!directeur) {
    throw new Error('DIRECTEUR_NOT_FOUND')
  }

  // 1️⃣ Promotion
  const promotion = await promotionRepo.findOne({
    where: { id: input.promotionId },
  })
  if (!promotion) throw new Error('PROMOTION_NOT_FOUND')

  // 2️⃣ Formateur
  const formateur = await formateurRepo.findOne({
    where: { id: input.formateurId },
  })
  if (!formateur) throw new Error('FORMATEUR_NOT_FOUND')

  // 3️⃣ Matière
  const matiere = await matiereRepo.findOne({
    where: { id: input.matiereId },
  })
  if (!matiere) throw new Error('MATIERE_NOT_FOUND')

  // 4️⃣ Création
  const espace = espaceRepo.create({
    promotion,
    formateur,
    matiere,
  } as Partial<EspacePedagogique>)

  await espaceRepo.save(espace)

  return {
    id: espace.id,
    promotion: {
      id: promotion.id,
      code: promotion.code,
      libelle: promotion.libelle,
    },
    matiere: {
      id: matiere.id,
      libelle: matiere.libelle,
    },
    formateur: {
      id: formateur.id,
    },
  }
}
