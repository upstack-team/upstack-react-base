import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: string
      formateurId?: string
      etudiantId?: string
    }
  }

  interface User {
    id: string
    email: string
    role: string
    formateurId?: string
    etudiantId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    formateurId?: string
    etudiantId?: string
  }
}
