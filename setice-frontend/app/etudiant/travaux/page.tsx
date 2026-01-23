"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Assignation } from "@/types/index"
import { StatutAssignation } from "@/types/index"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Calendar,
  BookOpen,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { format, isPast, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

const statutConfig = {
  [StatutAssignation.ASSIGNE]: {
    label: "A rendre",
    variant: "default" as const,
    icon: ClipboardList,
    color: "text-blue-600 bg-blue-50",
  },
  [StatutAssignation.LIVRE]: {
    label: "Livre",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  [StatutAssignation.EVALUE]: {
    label: "Evalue",
    variant: "outline" as const,
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50",
  },
}

export default function EtudiantTravauxPage() {
  console.log("🔵 [TRAVAUX] Composant rendu - timestamp:", new Date().toISOString())
  
  const router = useRouter()
  const [assignations, setAssignations] = useState<Assignation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    console.log("🔄 [TRAVAUX] useEffect - Premier chargement")
    loadAssignations()

    // Rafraîchir quand la page redevient visible
    const handleVisibilityChange = () => {
      console.log("👁️ [TRAVAUX] visibilitychange - État:", document.visibilityState)
      if (document.visibilityState === 'visible') {
        console.log("✅ [TRAVAUX] Page visible - Rechargement des données")
        loadAssignations()
      }
    }

    // Rafraîchir quand la fenêtre reprend le focus
    const handleFocus = () => {
      console.log("🎯 [TRAVAUX] window focus - Rechargement des données")
      loadAssignations()
    }

    console.log("📡 [TRAVAUX] Ajout des event listeners")
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      console.log("🧹 [TRAVAUX] Nettoyage des event listeners")
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const loadAssignations = async (showRefreshingIndicator = false) => {
    console.log("📥 [TRAVAUX] loadAssignations() appelé - showRefreshing:", showRefreshingIndicator)
    console.log("📅 [TRAVAUX] Timestamp:", new Date().toISOString())
    
    if (showRefreshingIndicator) {
      setRefreshing(true)
      console.log("🔄 [TRAVAUX] Mode rafraîchissement activé")
    } else {
      setLoading(true)
      console.log("⏳ [TRAVAUX] Mode chargement activé")
    }
    
    try {
      console.log("🔍 [TRAVAUX] Appel API: getMyAssignations()")
      const response = await api.getMyAssignations()
      console.log("📊 [TRAVAUX] Réponse API reçue:")
      console.log("  - success:", response.success)
      console.log("  - data:", response.data ? `Array[${response.data.length}]` : "null/undefined")

      if (response.success && response.data) {
        console.log("✅ [TRAVAUX] Données valides - Nombre d'assignations:", response.data.length)
        
        // Log détaillé de chaque assignation
        response.data.forEach((a: Assignation, index: number) => {
          console.log(`📋 [TRAVAUX] Assignation ${index + 1}:`, {
            id: a.id,
            titre: a.travail?.titre,
            statut: a.statut,
            statutLabel: statutConfig[a.statut]?.label
          })
        })
        
        // Compter les statuts
        const counts = {
          ASSIGNE: response.data.filter((a: Assignation) => a.statut === StatutAssignation.ASSIGNE).length,
          LIVRE: response.data.filter((a: Assignation) => a.statut === StatutAssignation.LIVRE).length,
          EVALUE: response.data.filter((a: Assignation) => a.statut === StatutAssignation.EVALUE).length,
        }
        console.log("📊 [TRAVAUX] Répartition des statuts:", counts)
        
        console.log("⚙️ [TRAVAUX] Mise à jour du state avec", response.data.length, "éléments")
        setAssignations(response.data)
        console.log("✅ [TRAVAUX] State mis à jour")
      } else {
        console.warn("⚠️ [TRAVAUX] Réponse API invalide")
        setAssignations([])
      }
    } catch (error) {
      console.error("❌ [TRAVAUX] Erreur lors du chargement:", error)
      if (error instanceof Error) {
        console.error("📍 [TRAVAUX] Message:", error.message)
        console.error("📍 [TRAVAUX] Stack:", error.stack)
      }
      setAssignations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
      console.log("🏁 [TRAVAUX] loadAssignations() terminé")
    }
  }

  const handleRefresh = () => {
    console.log("🔄 [TRAVAUX] Bouton refresh cliqué")
    loadAssignations(true)
  }

  const filteredAssignations = assignations.filter((a) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return a.statut === StatutAssignation.ASSIGNE
    if (activeTab === "submitted") return a.statut === StatutAssignation.LIVRE
    if (activeTab === "evaluated") return a.statut === StatutAssignation.EVALUE
    return true
  })

  const pendingCount = assignations.filter(
    (a) => a.statut === StatutAssignation.ASSIGNE
  ).length
  const submittedCount = assignations.filter((a) => a.statut === StatutAssignation.LIVRE).length
  const evaluatedCount = assignations.filter((a) => a.statut === StatutAssignation.EVALUE).length
  const urgentCount = assignations.filter(
    (a) =>
      a.statut === StatutAssignation.ASSIGNE &&
      isPast(new Date(a.travail.dateLimite))
  ).length

  console.log("📊 [TRAVAUX] État actuel du rendu:", {
    total: assignations.length,
    pending: pendingCount,
    submitted: submittedCount,
    evaluated: evaluatedCount,
    urgent: urgentCount,
    activeTab: activeTab,
    filtered: filteredAssignations.length,
    loading,
    refreshing
  })

  if (loading) {
    console.log("⏳ [TRAVAUX] Affichage du skeleton (loading)")
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  console.log("🎨 [TRAVAUX] Rendu de la page avec", assignations.length, "assignations")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Travaux</h1>
          <p className="text-muted-foreground">
            Consultez et livrez vos travaux assignes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                {urgentCount} travail{urgentCount > 1 ? "x" : ""} en retard
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Actualiser"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignations.length}</div>
            <p className="text-xs text-muted-foreground">travaux assignes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A rendre</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {submittedCount}
            </div>
            <p className="text-xs text-muted-foreground">en correction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evalues</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {evaluatedCount}
            </div>
            <p className="text-xs text-muted-foreground">notes disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous ({assignations.length})</TabsTrigger>
          <TabsTrigger value="pending">A rendre ({pendingCount})</TabsTrigger>
          <TabsTrigger value="submitted">
            Livres ({submittedCount})
          </TabsTrigger>
          <TabsTrigger value="evaluated">
            Evalues ({evaluatedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredAssignations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aucun travail dans cette categorie</p>
                <p className="text-muted-foreground">
                  Les travaux assignes par vos formateurs apparaitront ici
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssignations.map((assignation) => {
                const config = statutConfig[assignation.statut]
                const StatusIcon = config.icon
                const isLate =
                  assignation.statut === StatutAssignation.ASSIGNE &&
                  isPast(new Date(assignation.travail.dateLimite))

                return (
                  <Card
                    key={assignation.id}
                    className={`relative overflow-hidden transition-all hover:shadow-md ${
                      isLate ? "border-red-200" : ""
                    }`}
                  >
                    {isLate && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">
                        En retard
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={config.variant}
                          className={`${config.color} border-0`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                        <Badge variant="outline">
                          {assignation.travail.type === "INDIVIDUEL"
                            ? "Individuel"
                            : "Collectif"}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg mt-2">
                        {assignation.travail.titre}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {assignation.travail.espacePedagogique?.matiere?.nom || "Matiere"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignation.travail.consignes}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(assignation.travail.dateLimite),
                              "dd MMM yyyy",
                              { locale: fr }
                            )}
                          </span>
                        </div>
                        <span className="font-medium">
                          /{assignation.travail.bareme} pts
                        </span>
                      </div>

                      {assignation.statut === StatutAssignation.ASSIGNE && (
                        <p
                          className={`text-xs ${
                            isLate ? "text-red-600 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {isLate
                            ? `Date limite depassee ${formatDistanceToNow(
                                new Date(assignation.travail.dateLimite),
                                { locale: fr, addSuffix: true }
                              )}`
                            : `A rendre ${formatDistanceToNow(
                                new Date(assignation.travail.dateLimite),
                                { locale: fr, addSuffix: true }
                              )}`}
                        </p>
                      )}

                      <Button asChild className="w-full">
                        <Link href={`/etudiant/travaux/${assignation.id}`}>
                          {assignation.statut === StatutAssignation.ASSIGNE
                            ? "Livrer le travail"
                            : "Voir le detail"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}