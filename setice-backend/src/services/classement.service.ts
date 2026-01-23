// src/services/classement.service.ts
import { getDataSource } from '@/src/lib/db'
import { Promotion } from '@/src/entities/Promotion'
import { Etudiant } from '@/src/entities/Etudiant'
import { Evaluation } from '@/src/entities/Evaluation'

interface PromotionStats {
  promotion: {
    id: string
    code: string
    libelle: string
    annee: string
  }
  stats: {
    nbEtudiants: number
    nbEvaluations: number
    moyennePromotion: number
    totalPoints: number
    totalBareme: number
    meilleureMoyenne: number
    plusFaibleMoyenne: number
    tauxReussite: number // % d'étudiants avec moyenne >= 10
  }
  rang: number
}

export async function getClassementPromotions(): Promise<PromotionStats[]> {
  console.log('📊 [CLASSEMENT] Calcul du classement des promotions...')
  
  const db = await getDataSource()
  const promotionRepo = db.getRepository(Promotion)
  const etudiantRepo = db.getRepository(Etudiant)
  const evaluationRepo = db.getRepository(Evaluation)

  // 1️⃣ Récupérer toutes les promotions
  const promotions = await promotionRepo.find({
    order: { annee: 'DESC', libelle: 'ASC' }
  })

  console.log(`✅ ${promotions.length} promotion(s) trouvée(s)`)

  // 2️⃣ Pour chaque promotion, calculer les stats
  const promotionsWithStats: Omit<PromotionStats, 'rang'>[] = await Promise.all(
    promotions.map(async (promotion) => {
      console.log(`📍 Calcul pour ${promotion.libelle}...`)

      // Récupérer tous les étudiants de la promotion
      const etudiants = await etudiantRepo.find({
        where: { promotion: { id: promotion.id } },
        relations: ['user']
      })

      if (etudiants.length === 0) {
        return {
          promotion: {
            id: promotion.id,
            code: promotion.code,
            libelle: promotion.libelle,
            annee: promotion.annee
          },
          stats: {
            nbEtudiants: 0,
            nbEvaluations: 0,
            moyennePromotion: 0,
            totalPoints: 0,
            totalBareme: 0,
            meilleureMoyenne: 0,
            plusFaibleMoyenne: 0,
            tauxReussite: 0
          }
        }
      }

      // Récupérer toutes les évaluations des étudiants de la promotion
      const etudiantIds = etudiants.map(e => e.id)
      
      const evaluations = await evaluationRepo
        .createQueryBuilder('evaluation')
        .leftJoinAndSelect('evaluation.assignation', 'assignation')
        .leftJoinAndSelect('assignation.etudiant', 'etudiant')
        .leftJoinAndSelect('assignation.travail', 'travail')
        .where('etudiant.id IN (:...ids)', { ids: etudiantIds })
        .getMany()

      console.log(`  ✅ ${evaluations.length} évaluation(s) trouvée(s)`)

      if (evaluations.length === 0) {
        return {
          promotion: {
            id: promotion.id,
            code: promotion.code,
            libelle: promotion.libelle,
            annee: promotion.annee
          },
          stats: {
            nbEtudiants: etudiants.length,
            nbEvaluations: 0,
            moyennePromotion: 0,
            totalPoints: 0,
            totalBareme: 0,
            meilleureMoyenne: 0,
            plusFaibleMoyenne: 0,
            tauxReussite: 0
          }
        }
      }

      // Calculer les moyennes de chaque étudiant
      const etudiantMoyennes = etudiantIds.map(etudiantId => {
        const evalEtudiant = evaluations.filter(
          e => e.assignation.etudiant.id === etudiantId
        )

        if (evalEtudiant.length === 0) return 0

        const totalPoints = evalEtudiant.reduce((sum, e) => sum + e.note, 0)
        const totalBareme = evalEtudiant.reduce(
          (sum, e) => sum + (e.assignation.travail.bareme || 20),
          0
        )

        return totalBareme > 0 ? (totalPoints / totalBareme) * 20 : 0
      })

      const moyennesPositives = etudiantMoyennes.filter(m => m > 0)

      // Calcul des stats
      const totalPoints = evaluations.reduce((sum, e) => sum + e.note, 0)
      const totalBareme = evaluations.reduce(
        (sum, e) => sum + (e.assignation.travail.bareme || 20),
        0
      )
      const moyennePromotion = totalBareme > 0 ? (totalPoints / totalBareme) * 20 : 0
      const meilleureMoyenne = moyennesPositives.length > 0 ? Math.max(...moyennesPositives) : 0
      const plusFaibleMoyenne = moyennesPositives.length > 0 ? Math.min(...moyennesPositives) : 0
      const nbEtudiantsReussis = moyennesPositives.filter(m => m >= 10).length
      const tauxReussite = etudiants.length > 0 ? (nbEtudiantsReussis / etudiants.length) * 100 : 0

      return {
        promotion: {
          id: promotion.id,
          code: promotion.code,
          libelle: promotion.libelle,
          annee: promotion.annee
        },
        stats: {
          nbEtudiants: etudiants.length,
          nbEvaluations: evaluations.length,
          moyennePromotion: Math.round(moyennePromotion * 10) / 10,
          totalPoints: Math.round(totalPoints * 10) / 10,
          totalBareme,
          meilleureMoyenne: Math.round(meilleureMoyenne * 10) / 10,
          plusFaibleMoyenne: Math.round(plusFaibleMoyenne * 10) / 10,
          tauxReussite: Math.round(tauxReussite * 10) / 10
        }
      }
    })
  )

  // 3️⃣ Trier par moyenne décroissante et attribuer les rangs
  const sorted = promotionsWithStats
    .filter(p => p.stats.nbEvaluations > 0) // Exclure les promotions sans évaluations
    .sort((a, b) => b.stats.moyennePromotion - a.stats.moyennePromotion)

  const withRangs: PromotionStats[] = sorted.map((promo, index) => ({
    ...promo,
    rang: index + 1
  }))

  console.log('✅ [CLASSEMENT] Calcul terminé')
  console.log(`   Top 1: ${withRangs[0]?.promotion.libelle} - ${withRangs[0]?.stats.moyennePromotion}/20`)

  return withRangs
}

export async function getClassementPromotion(promotionId: string) {
  console.log('📊 [CLASSEMENT] Calcul du classement pour promotion:', promotionId)
  
  const db = await getDataSource()
  const etudiantRepo = db.getRepository(Etudiant)
  const evaluationRepo = db.getRepository(Evaluation)

  // Récupérer tous les étudiants de la promotion
  const etudiants = await etudiantRepo.find({
    where: { promotion: { id: promotionId } },
    relations: ['user', 'promotion']
  })

  if (etudiants.length === 0) {
    throw new Error('PROMOTION_VIDE')
  }

  // Calculer les stats de chaque étudiant
  const etudiantStats = await Promise.all(
    etudiants.map(async (etudiant) => {
      const evaluations = await evaluationRepo
        .createQueryBuilder('evaluation')
        .leftJoinAndSelect('evaluation.assignation', 'assignation')
        .leftJoinAndSelect('assignation.travail', 'travail')
        .leftJoinAndSelect('assignation.etudiant', 'etudiant')
        .where('etudiant.id = :etudiantId', { etudiantId: etudiant.id })
        .getMany()

      if (evaluations.length === 0) {
        return {
          etudiant,
          totalPoints: 0,
          totalBareme: 0,
          moyenne: 0,
          nombreEvaluations: 0
        }
      }

      const totalPoints = evaluations.reduce((sum, e) => sum + e.note, 0)
      const totalBareme = evaluations.reduce(
        (sum, e) => sum + (e.assignation.travail.bareme || 20),
        0
      )
      const moyenne = totalBareme > 0 ? (totalPoints / totalBareme) * 20 : 0

      return {
        etudiant,
        totalPoints: Math.round(totalPoints * 10) / 10,
        totalBareme,
        moyenne: Math.round(moyenne * 10) / 10,
        nombreEvaluations: evaluations.length
      }
    })
  )

  // Trier et attribuer les rangs
  const sorted = etudiantStats
    .filter(s => s.nombreEvaluations > 0)
    .sort((a, b) => b.moyenne - a.moyenne)

  const classement = sorted.map((stat, index) => ({
    rang: index + 1,
    etudiant: stat.etudiant,
    moyenne: stat.moyenne,
    totalPoints: stat.totalPoints,
    totalBareme: stat.totalBareme,
    nombreEvaluations: stat.nombreEvaluations
  }))

  return {
    promotion: etudiants[0].promotion,
    classement
  }
}