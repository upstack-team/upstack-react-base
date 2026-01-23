// src/services/assignation.service.ts
import { User, Role } from '@/src/entities/User'
import { assignationRepository } from '@/src/repositories/assignation.repository'
import { Travail } from '@/src/entities/Travail'
import { Etudiant } from '@/src/entities/Etudiant'

interface AssignTravailInput {
  travail: Travail
  etudiant: Etudiant
  formateur: User // Données du JWT
}

export async function assignTravail(input: AssignTravailInput) {
  if (input.formateur.role !== Role.FORMATEUR) {
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent assigner un travail')
  }

  // Vérifier que l'étudiant est inscrit à l'espace pédagogique
  const etudiants = input.travail.espacePedagogique?.etudiants || []
  const inscrit = etudiants.some(e => e.id === input.etudiant.id)
  
  if (!inscrit) {
    console.log('❌ Étudiant non inscrit:', {
      etudiantId: input.etudiant.id,
      espaceId: input.travail.espacePedagogique?.id,
      etudiantsInscrits: etudiants.map(e => e.id),
    })
    throw new Error('ETUDIANT_NOT_INSCRIT')
  }

  // ✅ CORRECTION : Ne passez que les IDs, pas les objets complets
  const assignation = await assignationRepository.create({
    travail: input.travail,
    etudiant: input.etudiant,
    formateur: input.formateur // ✅ Utilisez l'ID du formateur
  })

  return assignation
}

// ... reste du code

export async function deliverTravail(assignationId: string, student: User) {
  if (student.role !== Role.ETUDIANT) {
    throw new Error('FORBIDDEN: Seuls les étudiants peuvent livrer un travail')
  }

  const assign = await assignationRepository.findById(assignationId)
  if (!assign) throw new Error('ASSIGNATION_NOT_FOUND')
  if (assign.etudiant.user.id !== student.id) {
    throw new Error('FORBIDDEN: Vous ne pouvez pas livrer le travail ')
  }

  if (new Date() > assign.travail.dateLimite) {
    throw new Error('DATE_EXCEEDED: La date limite est dépassée')
  }

  return assignationRepository.markAsDelivered(assignationId)
}

// ✅ CORRECTION : Filtrer les assignations par promotion de l'étudiant
export async function listAssignationsByEtudiant(etudiantId: string) {
  return assignationRepository.listByEtudiantWithPromotionFilter(etudiantId)
}

export async function listAssignationsByTravail(travailId: string) {
  return assignationRepository.listByTravail(travailId)
}