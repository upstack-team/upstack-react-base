'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    console.log("🚪 [LOGOUT] ========================================")
    console.log("🚪 [LOGOUT] Début de la déconnexion")
    setIsLoading(true)

    try {
      // 1️⃣ Marquer qu'on vient de se déconnecter (pour empêcher reconnexion auto)
      console.log("🏁 [LOGOUT] Définition du flag just_logged_out")
      sessionStorage.setItem('just_logged_out', 'true')
      
      // 2️⃣ Supprimer le token du localStorage
      console.log("🗑️ [LOGOUT] Suppression du token localStorage")
      localStorage.removeItem('token')
      
      // 3️⃣ Supprimer toutes les données du localStorage liées à l'app
      console.log("🗑️ [LOGOUT] Nettoyage du localStorage")
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('user') || 
        key.startsWith('auth') || 
        key.includes('session')
      )
      console.log("🗑️ [LOGOUT] Clés à supprimer:", keysToRemove)
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        console.log(`  ✓ Supprimé: ${key}`)
      })
      
      // Note: On ne supprime PAS 'saved_email' et 'remember_me' si l'utilisateur
      // avait coché "Se souvenir de moi" - c'est un choix utilisateur séparé
      
      // 4️⃣ Appeler l'API de déconnexion si elle existe
      try {
        console.log("📡 [LOGOUT] Appel API de déconnexion")
        const response = await fetch('/api/auth/logout', { 
          method: 'POST',
          credentials: 'include', // Important pour supprimer les cookies
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          console.log("✅ [LOGOUT] API de déconnexion: succès")
        } else {
          console.warn("⚠️ [LOGOUT] API de déconnexion: échec", response.status)
        }
      } catch (error) {
        console.warn("⚠️ [LOGOUT] API de déconnexion non disponible ou erreur:", error)
        // Continuer même si l'API échoue
      }
      
      // 5️⃣ Vider le cache du navigateur (si possible)
      if ('caches' in window) {
        console.log("🗑️ [LOGOUT] Nettoyage du cache")
        try {
          const cacheNames = await caches.keys()
          console.log("🗑️ [LOGOUT] Caches trouvés:", cacheNames.length)
          await Promise.all(cacheNames.map(name => caches.delete(name)))
          console.log("✅ [LOGOUT] Caches supprimés")
        } catch (error) {
          console.warn("⚠️ [LOGOUT] Impossible de supprimer le cache:", error)
        }
      }
      
      console.log("✅ [LOGOUT] Déconnexion réussie")
      console.log("🚪 [LOGOUT] ========================================")
      
      toast.success("Déconnexion réussie", {
        description: "À bientôt !",
      })
      
      // 6️⃣ Redirection avec rechargement complet pour éviter la reconnexion auto
      console.log("🔄 [LOGOUT] Redirection vers /login dans 500ms")
      
      // Attendre un petit moment pour que le toast s'affiche
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Utiliser window.location pour forcer un rechargement complet
      console.log("🔄 [LOGOUT] Exécution de window.location.href")
      window.location.href = '/login'
      
    } catch (error) {
      console.error("❌ [LOGOUT] ========================================")
      console.error("❌ [LOGOUT] Erreur lors de la déconnexion:", error)
      console.error("❌ [LOGOUT] ========================================")
      
      toast.error("Erreur lors de la déconnexion", {
        description: "Veuillez réessayer",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}