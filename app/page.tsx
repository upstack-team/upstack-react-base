import { prisma } from '../lib/prisma'
import SpaView from './components/SpaView'
import { revalidatePath } from 'next/cache'

export default async function HomePage() {
  const [
    usersCount,
    promotionsCount,
    espacesCount,
    travauxCount,
    assignationsCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.promotion.count(),
    prisma.espacePedagogique.count(),
    prisma.travail.count(),
    prisma.assignation.count()
  ])

  const formateur = await prisma.user.findFirst({
    where: { email: 'formateur@setice.local' }
  })

  const etudiant = await prisma.user.findFirst({
    where: { email: 'etudiant@setice.local' }
  })

  const espaces = formateur
    ? await prisma.espacePedagogique.findMany({
        where: { formateurId: formateur.id },
        include: {
          promotion: true,
          travaux: true,
          inscriptions: {
            include: { etudiant: true }
          }
        }
      })
    : []

  const assignations = etudiant
    ? await prisma.assignation.findMany({
        where: { etudiantId: etudiant.id },
        include: {
          travail: {
            include: {
              espacePedagogique: {
                include: {
                  promotion: true,
                  formateur: true
                }
              }
            }
          }
        }
      })
    : []

  async function createTravail(formData: FormData) {
    'use server'
    const espaceId = formData.get('espaceId')?.toString()
    const titre = formData.get('titre')?.toString()
    const type = formData.get('type')?.toString()
    const dateLimiteStr = formData.get('dateLimite')?.toString()
    if (!espaceId || !titre || !type || !dateLimiteStr) return
    if (!formateur) return
    const espace = await prisma.espacePedagogique.findUnique({
      where: { id: espaceId }
    })
    if (!espace || espace.formateurId !== formateur.id) return
    const dateLimite = new Date(dateLimiteStr)
    await prisma.travail.create({
      data: {
        titre,
        type,
        dateLimite,
        espacePedagogiqueId: espaceId
      }
    })
    revalidatePath('/')
  }

  async function markAssignationAsSubmitted(formData: FormData) {
    'use server'
    const assignationId = formData.get('assignationId')?.toString()
    if (!assignationId) return
    if (!etudiant) return
    const assignation = await prisma.assignation.findUnique({
      where: { id: assignationId }
    })
    if (!assignation || assignation.etudiantId !== etudiant.id) return
    await prisma.assignation.update({
      where: { id: assignationId },
      data: {
        statut: 'RENDU',
        soumisLe: new Date()
      }
    })
    revalidatePath('/')
  }

  return (
    <SpaView
      counts={{
        users: usersCount,
        promotions: promotionsCount,
        espaces: espacesCount,
        travaux: travauxCount,
        assignations: assignationsCount
      }}
      formateur={formateur ?? null}
      etudiant={etudiant ?? null}
      espaces={espaces}
      assignations={assignations}
      actions={{
        createTravail,
        markAssignationAsSubmitted
      }}
    />
  )
}
