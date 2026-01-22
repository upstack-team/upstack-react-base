import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding des données de test...')

  // Nettoyer les données existantes (optionnel - commentez si vous voulez garder les données)
  console.log('🧹 Nettoyage des données existantes...')
  await prisma.assignation.deleteMany()
  await prisma.inscription.deleteMany()
  await prisma.travail.deleteMany()
  await prisma.espacePedagogique.deleteMany()
  await prisma.etudiant.deleteMany()
  await prisma.formateur.deleteMany()
  await prisma.user.deleteMany()

  // 1. Créer un formateur
  console.log('👨‍🏫 Création du formateur...')
  const userFormateur = await prisma.user.create({
    data: {
      email: 'formateur@setice.fr',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'FORMATEUR'
    }
  })

  const formateur = await prisma.formateur.create({
    data: {
      userId: userFormateur.id
    }
  })

  // 2. Créer des étudiants
  console.log('👨‍🎓 Création des étudiants...')
  const etudiants = []
  
  const etudiantsData = [
    { email: 'marie.martin@etudiant.fr', nom: 'Martin', prenom: 'Marie' },
    { email: 'pierre.bernard@etudiant.fr', nom: 'Bernard', prenom: 'Pierre' },
    { email: 'sophie.dubois@etudiant.fr', nom: 'Dubois', prenom: 'Sophie' },
    { email: 'lucas.petit@etudiant.fr', nom: 'Petit', prenom: 'Lucas' },
    { email: 'emma.robert@etudiant.fr', nom: 'Robert', prenom: 'Emma' }
  ]

  for (const data of etudiantsData) {
    const userEtudiant = await prisma.user.create({
      data: {
        ...data,
        role: 'ETUDIANT'
      }
    })

    const etudiant = await prisma.etudiant.create({
      data: {
        userId: userEtudiant.id
      }
    })

    etudiants.push(etudiant)
  }

  // 3. Créer des espaces pédagogiques
  console.log('📚 Création des espaces pédagogiques...')
  const espace1 = await prisma.espacePedagogique.create({
    data: {
      nom: 'Développement Web Avancé',
      description: 'Formation sur React, Next.js et TypeScript',
      formateurId: formateur.id
    }
  })

  const espace2 = await prisma.espacePedagogique.create({
    data: {
      nom: 'Base de données et SQL',
      description: 'Conception et gestion de bases de données',
      formateurId: formateur.id
    }
  })

  // 4. Inscrire les étudiants dans les espaces
  console.log('✍️ Inscription des étudiants...')
  
  // Tous les étudiants dans l'espace 1
  for (const etudiant of etudiants) {
    await prisma.inscription.create({
      data: {
        etudiantId: etudiant.id,
        espacePedagogiqueId: espace1.id
      }
    })
  }

  // 3 premiers étudiants dans l'espace 2
  for (let i = 0; i < 3; i++) {
    await prisma.inscription.create({
      data: {
        etudiantId: etudiants[i].id,
        espacePedagogiqueId: espace2.id
      }
    })
  }

  // 5. Créer des travaux individuels
  console.log('📝 Création des travaux...')
  
  const travail1 = await prisma.travail.create({
    data: {
      titre: 'TP1 - Composants React',
      description: 'Créer une application React avec des composants réutilisables',
      type: 'INDIVIDUEL',
      dateLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 jours
      bareme: 20,
      statut: 'NON_ASSIGNE',
      espacePedagogiqueId: espace1.id,
      formateurId: formateur.id
    }
  })

  const travail2 = await prisma.travail.create({
    data: {
      titre: 'TP2 - API REST avec Next.js',
      description: 'Développer une API REST complète avec Next.js App Router',
      type: 'INDIVIDUEL',
      dateLimite: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // +21 jours
      bareme: 20,
      statut: 'NON_ASSIGNE',
      espacePedagogiqueId: espace1.id,
      formateurId: formateur.id
    }
  })

  const travail3 = await prisma.travail.create({
    data: {
      titre: 'Projet - Modélisation BDD',
      description: 'Concevoir un schéma de base de données pour une application e-commerce',
      type: 'INDIVIDUEL',
      dateLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
      bareme: 20,
      statut: 'NON_ASSIGNE',
      espacePedagogiqueId: espace2.id,
      formateurId: formateur.id
    }
  })

  // Créer aussi un travail collectif (pour tester le rejet)
  await prisma.travail.create({
    data: {
      titre: 'Projet Collectif - Application Web',
      description: 'Développer une application web complète en équipe',
      type: 'COLLECTIF',
      dateLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      bareme: 20,
      statut: 'NON_ASSIGNE',
      espacePedagogiqueId: espace1.id,
      formateurId: formateur.id
    }
  })

  // 6. Créer une assignation de test
  console.log('✅ Création d\'une assignation de test...')
  await prisma.assignation.create({
    data: {
      travailId: travail1.id,
      etudiantId: etudiants[0].id,
      statut: 'ASSIGNE',
      dateAssignation: new Date()
    }
  })

  console.log('✨ Seeding terminé avec succès!')
  console.log('\n📊 Résumé des données créées:')
  console.log(`- 1 formateur: ${userFormateur.email}`)
  console.log(`- ${etudiants.length} étudiants`)
  console.log(`- 2 espaces pédagogiques`)
  console.log(`- 4 travaux (3 individuels, 1 collectif)`)
  console.log(`- 1 assignation de test`)
  console.log('\n🔐 Identifiants de test:')
  console.log(`Formateur: ${userFormateur.email}`)
  console.log(`Étudiant 1: ${etudiantsData[0].email}`)
  console.log('\n🚀 Vous pouvez maintenant tester l\'application!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
