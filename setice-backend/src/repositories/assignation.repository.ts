// src/repositories/assignation.repository.ts
import { getDataSource } from '@/src/lib/db'
import { Assignation, StatutAssignation } from '@/src/entities/Assignation'

export const assignationRepository = {
  async create(assignation: Partial<Assignation>) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    const entity = repo.create(assignation)
    await repo.save(entity)
    
    // ✅ Rechargez l'assignation avec toutes les relations
    const assignationComplete = await repo.findOne({
      where: { id: entity.id },
      relations: [
        'etudiant',
        'etudiant.user',
        'travail',
      ]
    })
    
    return assignationComplete || entity
  },

  async findById(id: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).findOne({ 
      where: { id },
      relations: [
        'etudiant',
        'etudiant.user',
        'travail',
      ]
    })
  },

  async listByEtudiant(etudiantId: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).find({
      where: { etudiant: { id: etudiantId } },
      relations: [
        'travail',
        'travail.espacePedagogique',
        'travail.espacePedagogique.matiere',
      ],
      order: { createdAt: 'DESC' },
    })
  },

  // ✅ NOUVELLE MÉTHODE : Filtrer les assignations par promotion
  async listByEtudiantWithPromotionFilter(etudiantId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    
    console.log('🔍 [REPO] Récupération des assignations pour l\'étudiant:', etudiantId)
    
    // 1️⃣ Récupérer toutes les assignations avec les relations nécessaires
    const assignations = await repo.find({
      where: { etudiant: { id: etudiantId } },
      relations: [
        'travail',
        'travail.espacePedagogique',
        'travail.espacePedagogique.matiere',
        'travail.espacePedagogique.promotion',
        'etudiant',
        'etudiant.promotion',
      ],
      order: { createdAt: 'DESC' },
    })

    console.log('📊 [REPO] Assignations trouvées:', assignations.length)

    // 2️⃣ Filtrer pour ne garder que celles de la même promotion
    const filteredAssignations = assignations.filter(assignation => {
      const etudiantPromotionId = assignation.etudiant.promotion?.id
      const travailPromotionId = assignation.travail.espacePedagogique?.promotion?.id

      console.log('🔎 [REPO] Vérification assignation:', {
        assignationId: assignation.id,
        travailTitre: assignation.travail.titre,
        etudiantPromotionId,
        travailPromotionId,
        match: etudiantPromotionId === travailPromotionId
      })

      // ✅ Ne garder que si les promotions correspondent
      return etudiantPromotionId === travailPromotionId
    })

    console.log('✅ [REPO] Assignations filtrées:', filteredAssignations.length)

    return filteredAssignations
  },

  async listByTravail(travailId: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).find({
      where: { travail: { id: travailId } },
      relations: [
        'etudiant',   
        'etudiant.user',
        'etudiant.promotion',
        'travail',
        'travail.espacePedagogique',
      ],
      order: { createdAt: 'DESC' },
    })
  },

  async markAsDelivered(assignationId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    
    // 1️⃣ Récupérer l'assignation
    const assign = await repo.findOne({ where: { id: assignationId } })
    if (!assign) return null

    // 2️⃣ Mettre à jour le statut
    assign.statut = StatutAssignation.LIVRE
    assign.dateLivraison = new Date()
    await repo.save(assign)

    // 3️⃣ ✅ IMPORTANT: Recharger l'assignation complète avec toutes les relations
    const assignationComplete = await repo.findOne({
      where: { id: assignationId },
      relations: [
        'travail',
        'travail.espacePedagogique',
        'travail.espacePedagogique.matiere',
        'etudiant',
        'etudiant.user',
      ]
    })

    return assignationComplete
  },

  async markAsEvaluated(assignationId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    
    // 1️⃣ Récupérer l'assignation
    const assign = await repo.findOne({ where: { id: assignationId } })
    if (!assign) return null

    // 2️⃣ Mettre à jour le statut
    assign.statut = StatutAssignation.EVALUE
    await repo.save(assign)

    // 3️⃣ ✅ IMPORTANT: Recharger l'assignation complète avec toutes les relations
    const assignationComplete = await repo.findOne({
      where: { id: assignationId },
      relations: [
        'travail',
        'travail.espacePedagogique',
        'travail.espacePedagogique.matiere',
        'etudiant',
        'etudiant.user',
      ]
    })

    return assignationComplete
  },
}