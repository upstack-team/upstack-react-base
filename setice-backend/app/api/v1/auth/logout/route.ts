// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  console.log("🚪 [API LOGOUT] Début de la déconnexion côté serveur")
  
  try {
    // Supprimer tous les cookies d'authentification
    const cookieStore = cookies()
    
    // Liste des cookies potentiels à supprimer
    const authCookies = [
      'token',
      'auth_token',
      'session',
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
    ]
    
    authCookies.forEach(async cookieName => {
      try {
        (await cookieStore).delete(cookieName)
        console.log(`🗑️ [API LOGOUT] Cookie supprimé: ${cookieName}`)
      } catch (error) {
        console.warn(`⚠️ [API LOGOUT] Impossible de supprimer ${cookieName}:`, error)
      }
    })
    
    console.log("✅ [API LOGOUT] Déconnexion côté serveur réussie")
    
    const response = NextResponse.json(
      { success: true, message: 'Déconnexion réussie' },
      { status: 200 }
    )
    
    // S'assurer que les cookies sont bien supprimés dans la réponse
    authCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire immédiatement
        path: '/',
      })
    })
    
    return response
    
  } catch (error) {
    console.error("❌ [API LOGOUT] Erreur:", error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}

// Permettre OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}