import { NextAuthOptions } from 'next-auth'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    // Configuration des providers d'authentification
    // À configurer selon vos besoins
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        // Récupérer les informations utilisateur depuis la DB
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            formateur: true,
            etudiant: true
          }
        })
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          session.user.formateurId = user.formateur?.id
          session.user.etudiantId = user.etudiant?.id
        }
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}