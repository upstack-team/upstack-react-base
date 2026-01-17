import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.assignation.deleteMany()
  await prisma.travail.deleteMany()
  await prisma.inscription.deleteMany()
  await prisma.espacePedagogique.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.user.deleteMany()

  const adminHashed = await bcrypt.hash('changeme-admin', 10)
  const formateurHashed = await bcrypt.hash('changeme-formateur', 10)
  const etudiantHashed = await bcrypt.hash('changeme-etudiant', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@setice.local',
      hashedPassword: adminHashed,
      firstName: 'Admin',
      lastName: 'Setice',
      role: 'ADMIN',
      isActive: true
    }
  })

  const formateur = await prisma.user.create({
    data: {
      email: 'formateur@setice.local',
      hashedPassword: formateurHashed,
      firstName: 'Alice',
      lastName: 'Formateur',
      role: 'FORMATEUR',
      isActive: true
    }
  })

  const etudiant = await prisma.user.create({
    data: {
      email: 'etudiant@setice.local',
      hashedPassword: etudiantHashed,
      firstName: 'Bob',
      lastName: 'Etudiant',
      role: 'ETUDIANT',
      isActive: true
    }
  })

  const promotion = await prisma.promotion.create({
    data: {
      name: 'L1 Informatique',
      academicYear: '2024-2025'
    }
  })

  const espace = await prisma.espacePedagogique.create({
    data: {
      titre: 'Programmation Web',
      matiere: 'Développement Web',
      promotion: { connect: { id: promotion.id } },
      formateur: { connect: { id: formateur.id } }
    }
  })

  await prisma.inscription.create({
    data: {
      espacePedagogique: { connect: { id: espace.id } },
      etudiant: { connect: { id: etudiant.id } }
    }
  })

  const travail = await prisma.travail.create({
    data: {
      titre: 'TP 1 – Application Next.js',
      type: 'DEVOIR',
      dateLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      espacePedagogique: { connect: { id: espace.id } }
    }
  })

  await prisma.assignation.create({
    data: {
      travail: { connect: { id: travail.id } },
      etudiant: { connect: { id: etudiant.id } },
      statut: 'A_RENDRE'
    }
  })

  console.log('Base PostgreSQL initialisée avec des données de test.')
  console.log('Admin:', admin.email)
  console.log('Formateur:', formateur.email)
  console.log('Étudiant:', etudiant.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
