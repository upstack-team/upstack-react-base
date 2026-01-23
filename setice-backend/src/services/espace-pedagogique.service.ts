import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Matiere } from '@/src/entities/Matiere'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Etudiant } from '@/src/entities/Etudiant'
import { CreateEspacePedagogiqueInput } from '@/src/schemas/espace-pedagogique.schema'
import { espacePedagogiqueRepository } from '../repositories/espace-pedagogique.repository'

export async function createEspacePedagogique(
  input: CreateEspacePedagogiqueInput
) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const promotionRepo = db.getRepository(Promotion)
  const formateurRepo = db.getRepository(Formateur)
  const matiereRepo = db.getRepository(Matiere)
  const espaceRepo = db.getRepository(EspacePedagogique)

  // ⚠️ Pour l'instant : directeur hardcodé / simulé
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

export async function listEspacesPedagogiques() {
  return espacePedagogiqueRepository.findAll()
}

export async function assignFormateur(
  espacePedagogiqueId: string,
  formateurId: string
) {
  const db = await getDataSource()
  
  // Vérifier que l'espace pédagogique existe
  const espaceRepo = db.getRepository(EspacePedagogique)
  const espace = await espaceRepo.findOne({
    where: { id: espacePedagogiqueId }
  })
  
  if (!espace) {
    throw new Error('ESPACE_NOT_FOUND')
  }
  
  // Vérifier que le formateur existe
  const formateurRepo = db.getRepository(Formateur)
  const formateur = await formateurRepo.findOne({
    where: { id: formateurId }
  })
  
  if (!formateur) {
    throw new Error('FORMATEUR_NOT_FOUND')
  }
  
  // Affecter le formateur via le repository
  await espacePedagogiqueRepository.assignFormateur(espacePedagogiqueId, formateurId)
  
  return {
    success: true,
    message: 'Formateur affecté avec succès'
  }
}

export async function addEtudiantsFromPromotion(
  espaceId: string,
  promotionId: string
) {
  const db = await getDataSource()
  const etudiantRepo = db.getRepository(Etudiant)
  const espaceRepo = db.getRepository(EspacePedagogique)

  const espace = await espaceRepo.findOne({ where: { id: espaceId } })
  if (!espace) throw new Error('ESPACE_NOT_FOUND')

  const etudiants = await etudiantRepo.find({
    where: { promotion: { id: promotionId } },
    relations: ['user'],
  })
  if (etudiants.length === 0) throw new Error('NO_STUDENTS_IN_PROMOTION')

  const etudiantIds = etudiants.map(e => e.id)
  const result = await espacePedagogiqueRepository.addEtudiants(espaceId, etudiantIds)

  return {
    success: true,
    message: `${result.inscrits} étudiant(s) inscrit(s) avec succès`,
    data: result,
  }
}
export async function getEspacePedagogique(id: string) {
  const espace = await espacePedagogiqueRepository.findById(id)

  if (!espace) 
    throw new Error('ESPACE_NOT_FOUND')
  
  console.log('DEBUG ESPACE ETUDIANTS:', espace.etudiants.map(e => e.user))
  return espace
}

export async function listEspacesByFormateurUser(userId: string) {
  const db = await getDataSource()
  const espaceRepo = db.getRepository(EspacePedagogique)

  return await espaceRepo
    .createQueryBuilder('espace')
    .leftJoinAndSelect('espace.formateur', 'formateur')
    .leftJoinAndSelect('formateur.user', 'user')
    .leftJoinAndSelect('espace.promotion', 'promotion')
    .leftJoinAndSelect('espace.matiere', 'matiere')
    .leftJoinAndSelect('espace.etudiants', 'etudiants')
    .leftJoinAndSelect('etudiants.user', 'etudiantUser')
    .where('user.id = :userId', { userId })
    .orderBy('espace.createdAt', 'DESC')
    .getMany()
}
