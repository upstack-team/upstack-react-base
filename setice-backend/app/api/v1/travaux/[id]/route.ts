// app/api/v1/travaux/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

console.log('✅ Module chargé: /api/v1/travaux/[id]/route.ts')

// ========================================
// OPTIONS - Pre-flight CORS
// ========================================
export async function OPTIONS(req: NextRequest) {
  console.log('🔧 [OPTIONS] Pre-flight pour /api/v1/travaux/[id]')
  console.log('   URL:', req.url)
  
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// ========================================
// GET - Récupérer un travail par ID
// ========================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎯 [ROUTE] GET /api/v1/travaux/[id]')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📍 URL complète:', req.url)
  console.log('🔍 Context reçu:', context)

  try {
    // ========================================
    // 1️⃣ Extraction de l'ID (compatible Next.js 14 et 15)
    // ========================================
    let id: string
    
    // Next.js 15: params est une Promise
    if (context.params instanceof Promise) {
      console.log('⚙️  [PARAMS] Détection Next.js 15 - params est une Promise')
      const params = await context.params
      id = params.id
    } 
    // Next.js 14 et antérieur: params est un objet direct
    else {
      console.log('⚙️  [PARAMS] Détection Next.js 14 - params est un objet')
      id = context.params.id
    }

    console.log('')
    console.log('🔑 [ID] Paramètre extrait:')
    console.log('   Valeur:', id)
    console.log('   Type:', typeof id)
    console.log('   Longueur:', id?.length)
    console.log('   Vide?:', !id)

    // Validation de l'ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('❌ [ID] ID invalide ou manquant!')
      return NextResponse.json(
        { success: false, error: 'ID_REQUIRED' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // ========================================
    // 2️⃣ Import dynamique du service
    // ========================================
    console.log('')
    console.log('📦 [SERVICE] Import du service travail...')
    
    const mod = await import('@/src/services/travail.service')
    console.log('✅ [SERVICE] Module chargé')
    console.log('   Exports disponibles:', Object.keys(mod))

    const getTravailById = mod.getTravailById
    
    if (typeof getTravailById !== 'function') {
      console.error('❌ [SERVICE] getTravailById n\'est pas une fonction!')
      console.error('   Type reçu:', typeof getTravailById)
      return NextResponse.json(
        { success: false, error: 'INTERNAL_ERROR' },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    console.log('✅ [SERVICE] getTravailById est bien une fonction')

    // ========================================
    // 3️⃣ Appel du service
    // ========================================
    console.log('')
    console.log('🔎 [SERVICE] Appel getTravailById...')
    console.log('   Avec ID:', id)
    
    const travail = await getTravailById(id)
    
    console.log('')
    console.log('📋 [SERVICE] Résultat reçu:')
    console.log('   Travail trouvé?:', !!travail)
    
    if (travail) {
      console.log('   ID du travail:', travail.id)
      console.log('   Titre:', travail.titre)
      console.log('   Type:', travail.type)
      console.log('   Barème:', travail.bareme)
      console.log('')
      console.log('🔍 [VALIDATION] Comparaison des IDs:')
      console.log('   ID demandé:', id)
      console.log('   ID retourné:', travail.id)
      console.log('   Match?:', travail.id === id ? '✅ OUI' : '❌ NON')
      
      if (travail.id !== id) {
        console.error('')
        console.error('🚨 ALERTE: L\'API a retourné un travail différent!')
        console.error('   Cela indique un problème dans getTravailById()')
      }
    } else {
      console.log('   ℹ️  Aucun travail trouvé avec cet ID')
    }

    // ========================================
    // 4️⃣ Vérification du résultat
    // ========================================
    if (!travail) {
      console.log('')
      console.log('❌ [RESPONSE] 404 - Travail non trouvé')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
      
      return NextResponse.json(
        { success: false, error: 'TRAVAIL_NOT_FOUND' },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    // ========================================
    // 5️⃣ Retour de la réponse
    // ========================================
    console.log('')
    console.log('✅ [RESPONSE] 200 - Succès')
    console.log('   ID dans response:', travail.id)
    console.log('   Titre dans response:', travail.titre)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')

    return NextResponse.json(
      { 
        success: true, 
        data: travail 
      },
      { 
        status: 200, 
        headers: CORS_HEADERS 
      }
    )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // ========================================
    // ❌ Gestion des erreurs
    // ========================================
    console.error('')
    console.error('💥 [ERROR] Erreur lors du traitement:')
    console.error('   Message:', err?.message)
    console.error('   Stack:', err?.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('')

    return NextResponse.json(
      { 
        success: false, 
        error: err?.message || 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
      },
      { 
        status: 500, 
        headers: CORS_HEADERS 
      }
    )
  }
}