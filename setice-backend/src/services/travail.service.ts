import { Travail } from '@/src/entities/Travail'
import { travailRepository } from '@/src/repositories/travail.repository'
import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { StatutTravail, TypeTravail } from '@/src/entities/Travail'

interface CreateTravailInput {
  titre: string
  consignes: string
  type: TypeTravail
  dateLimite: string
  bareme: number
  espacePedagogiqueId: string
  formateur: User
}

export async function createTravail(input: CreateTravailInput) {
  if (input.formateur.role !== Role.FORMATEUR) {
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent créer des travaux')
  }

  const db = await getDataSource()
  const espaceRepo = db.getRepository(EspacePedagogique)
  const espace = await espaceRepo.findOne({
    where: { id: input.espacePedagogiqueId },
    relations: ['etudiants', 'matiere', 'promotion'],
  })

  if (!espace) throw new Error('ESPACE_NOT_FOUND')

  const travail = await travailRepository.createTravail({
    titre: input.titre,
    consignes: input.consignes,
    type: input.type,
    dateLimite: new Date(input.dateLimite),
    bareme: input.bareme,
    statut: StatutTravail.BROUILLON,
    espacePedagogique: espace,
    formateur: { id: input.formateur.id } as User,
  })

  return travail
}

// 🔹 Liste des travaux d'un espace
export async function listTravauxByEspace(espaceId: string) {
  const db = await getDataSource()
  return db.getRepository(Travail).find({
    where: { espacePedagogique: { id: espaceId } },
    relations: ['formateur', 'espacePedagogique', 'espacePedagogique.matiere', 'espacePedagogique.promotion', 'espacePedagogique.etudiants'],
    order: { dateLimite: 'ASC' },
  })
}

// 🔹 Récupérer un travail précis avec LOGS DE DEBUG
export async function getTravailById(travailId: string) {
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 [SERVICE] getTravailById appelé')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📥 Input:')
  console.log('   travailId:', travailId)
  console.log('   Type:', typeof travailId)
  console.log('   Longueur:', travailId?.length)

  try {
    // ========================================
    // 1️⃣ Obtenir la connexion DB
    // ========================================
    console.log('')
    console.log('💾 [DB] Connexion à la base de données...')
    const db = await getDataSource()
    console.log('✅ [DB] Connexion établie')

    const repo = db.getRepository(Travail)
    console.log('✅ [DB] Repository Travail obtenu')

    // ========================================
    // 2️⃣ DEBUG: Lister tous les travaux
    // ========================================
    console.log('')
    console.log('📚 [DEBUG] Liste de TOUS les travaux en base:')
    
    const allTravaux = await repo.find({
      select: ['id', 'titre', 'type'],
      take: 10 // Limite à 10 pour ne pas surcharger les logs
    })
    
    console.log(`   Total trouvé: ${allTravaux.length}`)
    
    if (allTravaux.length > 0) {
      console.log('   Liste:')
      allTravaux.forEach((t, index) => {
        const isMatch = t.id === travailId
        console.log(`   ${index + 1}. ${isMatch ? '👉 ' : '   '}${t.id} - "${t.titre}" (${t.type})${isMatch ? ' ← MATCH!' : ''}`)
      })
    } else {
      console.log('   ⚠️  Aucun travail dans la base!')
    }

    // ========================================
    // 3️⃣ Requête principale
    // ========================================
    console.log('')
    console.log('🔎 [QUERY] Recherche du travail spécifique...')
    console.log('   WHERE id =', travailId)
    
    const result = await repo.findOne({
      where: { id: travailId },
      relations: [
        'formateur', 
        'espacePedagogique', 
        'espacePedagogique.matiere', 
        'espacePedagogique.promotion', 
        'espacePedagogique.etudiants.user'
      ],
    })

    // ========================================
    // 4️⃣ Analyse du résultat
    // ========================================
    console.log('')
    console.log('📊 [RESULT] Résultat de la requête:')
    
    if (result) {
      console.log('   ✅ Travail trouvé!')
      console.log('   ID:', result.id)
      console.log('   Titre:', result.titre)
      console.log('   Type:', result.type)
      console.log('   Statut:', result.statut)
      console.log('   Barème:', result.bareme)
      console.log('   Date limite:', result.dateLimite)
      
      if (result.espacePedagogique) {
        console.log('   Espace pédagogique:')
        console.log('     - ID:', result.espacePedagogique.id)
        console.log('     - Matière:', result.espacePedagogique.matiere?.libelle)
        console.log('     - Promotion:', result.espacePedagogique.promotion?.libelle)
        console.log('     - Nb étudiants:', result.espacePedagogique.etudiants?.length || 0)
      }
      
      if (result.formateur) {
        console.log('   Formateur:')
        console.log('     - ID:', result.formateur.id)
        console.log('     - Email:', result.formateur.email)
      }

      console.log('')
      console.log('🔍 [VALIDATION] Vérification de cohérence:')
      console.log('   ID demandé:', travailId)
      console.log('   ID retourné:', result.id)
      
      if (result.id === travailId) {
        console.log('   ✅ MATCH PARFAIT!')
      } else {
        console.error('   🚨 ERREUR: LES IDs NE CORRESPONDENT PAS!')
        console.error('   Cela ne devrait JAMAIS arriver!')
      }
    } else {
      console.log('   ❌ Aucun travail trouvé avec cet ID')
      console.log('   Vérifiez que l\'ID existe bien dans la base')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')

    return result

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('')
    console.error('💥 [ERROR] Erreur dans getTravailById:')
    console.error('   Message:', error?.message)
    console.error('   Stack:', error?.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('')
    
    throw error
  }
}