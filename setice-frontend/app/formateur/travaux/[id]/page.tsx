"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Plus, Calendar, Target, FileText, Users } from "lucide-react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AssignationModal } from "@/components/travaux/AssignationModal"
import { AssignationsTable } from "@/components/travaux/AssignationsTable"
import { EvaluationModal } from "@/components/travaux/EvaluationModal"

import { api } from "@/lib/api"
import type { Travail, AssignationsListResponse, Etudiant } from "@/types"

export default function TravailDetailPage() {
  const params = useParams()
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined

  const [travail, setTravail] = useState<Travail | null>(null)
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [assignationsData, setAssignationsData] = useState<AssignationsListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [evalModalOpen, setEvalModalOpen] = useState(false)
  const [selectedAssignationId, setSelectedAssignationId] = useState<string>("")

  // ✅ useRef pour éviter les problèmes de dépendances
  const loadingRef = useRef(false)

  // ✅ useEffect qui se déclenche TOUJOURS quand l'ID change
  useEffect(() => {
    console.log("")
    console.log("🔄 [EFFECT] ========================================")
    console.log("🔄 [EFFECT] useEffect DÉCLENCHÉ")
    console.log("🔄 [EFFECT] Timestamp:", new Date().toISOString())
    console.log("🔄 [EFFECT] ID actuel:", id)
    console.log("🔄 [EFFECT] travail?.id actuel:", travail?.id)
    console.log("🔄 [EFFECT] ========================================")
    
    if (!id) {
      console.warn("⏳ [EFFECT] Pas d'ID - En attente...")
      return
    }

    // Éviter les chargements multiples
    if (loadingRef.current) {
      console.warn("⚠️ [EFFECT] Chargement déjà en cours - Annulation")
      return
    }

    console.log("✅ [EFFECT] Lancement du chargement...")
    loadingRef.current = true

    // Fonction de chargement inline pour éviter les problèmes de dépendances
    const loadData = async () => {
      console.log("")
      console.log("📥 [LOAD] ========================================")
      console.log("📥 [LOAD] DÉBUT DU CHARGEMENT")
      console.log("📥 [LOAD] ID demandé:", id)
      console.log("📥 [LOAD] ========================================")
      
      setIsLoading(true)
      
      // Réinitialiser l'état
      console.log("🧹 [LOAD] Réinitialisation de l'état...")
      setTravail(null)
      setEtudiants([])
      setAssignationsData(null)
      
      try {
        // 1️⃣ Charger le travail
        console.log("📖 [LOAD] Chargement du travail...")
        const travailResp = await api.getTravailById(id)
        
        console.log("📖 [LOAD] Réponse:", {
          success: travailResp.success,
          id: travailResp.data?.id,
          titre: travailResp.data?.titre
        })
        
        if (travailResp.success && travailResp.data) {
          // Vérification critique
          if (travailResp.data.id !== id) {
            console.error("❌ [LOAD] ERREUR: L'API a renvoyé le mauvais travail!")
            console.error("❌ [LOAD] Demandé:", id)
            console.error("❌ [LOAD] Reçu:", travailResp.data.id)
          }
          
          console.log("✅ [LOAD] Travail chargé:", travailResp.data.titre)
          setTravail(travailResp.data)

          // 2️⃣ Étudiants
          if (travailResp.data.espacePedagogique?.etudiants) {
            console.log("👥 [LOAD] Étudiants:", travailResp.data.espacePedagogique.etudiants.length)
            setEtudiants(travailResp.data.espacePedagogique.etudiants)
          } else if (travailResp.data.espacePedagogique?.id) {
            console.log("🔄 [LOAD] Chargement via getEspaceById...")
            try {
              const espaceResp = await api.getEspaceById(travailResp.data.espacePedagogique.id)
              if (espaceResp.success && espaceResp.data?.etudiants) {
                console.log("✅ [LOAD] Étudiants chargés:", espaceResp.data.etudiants.length)
                setEtudiants(espaceResp.data.etudiants)
              }
            } catch (err) {
              console.error("❌ [LOAD] Erreur chargement étudiants:", err)
            }
          }

          // 3️⃣ Assignations
          console.log("📋 [LOAD] Chargement des assignations...")
          const assignResp = await api.getAssignationsByTravail(id)
          if (assignResp.success && assignResp.data) {
            console.log("✅ [LOAD] Assignations:", assignResp.data.total)
            setAssignationsData(assignResp.data)
          }
        }
      } catch (err) {
        console.error("❌ [LOAD] Erreur:", err)
      } finally {
        setIsLoading(false)
        loadingRef.current = false
        console.log("🏁 [LOAD] FIN DU CHARGEMENT")
        console.log("")
      }
    }

    loadData()

    // Cleanup
    return () => {
      console.log("🧹 [EFFECT] Cleanup - Annulation du chargement en cours")
      loadingRef.current = false
    }
  }, [id]) // ✅ SEULEMENT id comme dépendance

  const handleEvaluer = (assignationId: string) => {
    console.log("📝 [ACTION] Évaluer:", assignationId)
    setSelectedAssignationId(assignationId)
    setEvalModalOpen(true)
  }

  const handleVoir = (assignationId: string) => {
    console.log("👁️ [ACTION] Voir:", assignationId)
    setSelectedAssignationId(assignationId)
  }

  const assignedEtudiantIds = assignationsData?.assignations.map(a => a.etudiant.id) || []
  const selectedAssignation = assignationsData?.assignations.find(a => a.id === selectedAssignationId)

  if (isLoading) {
    console.log("⏳ [RENDER] Skeleton")
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-50 w-full rounded-lg" />
          <Skeleton className="h-100 w-full rounded-lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!travail) {
    console.log("❌ [RENDER] Travail non trouvé")
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Travail non trouvé</p>
          <Link href="/formateur/travaux">
            <Button variant="link">Retour aux travaux</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  console.log("🎨 [RENDER] Page - ID:", travail.id, "Titre:", travail.titre)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back */}
        <Link
          href="/formateur/travaux"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous mes travaux
        </Link>

        {/* Travail info */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{travail.titre}</CardTitle>
                  {/* Badge DEBUG */}
                  <Badge variant="outline" className="text-xs font-mono">
                    {travail.id.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {travail.type === "INDIVIDUEL" ? "Individuel" : "Collectif"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{travail.bareme} points</span>
                </div>
              </div>
              <Button onClick={() => setAssignModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assigner
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date limite</p>
                  <p className="font-medium">
                    {format(new Date(travail.dateLimite), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Espace pédagogique</p>
                  <p className="font-medium">
                    {travail.espacePedagogique.matiere.libelle} - {travail.espacePedagogique.promotion.libelle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignations</p>
                  <p className="font-medium">{assignationsData?.total || 0} étudiant(s)</p>
                </div>
              </div>
            </div>

            {travail.consignes && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-2">Consignes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{travail.consignes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="assignations">
          <TabsList>
            <TabsTrigger value="assignations">Assignations ({assignationsData?.total || 0})</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="assignations" className="mt-4">
            {assignationsData?.assignations.length ? (
              <AssignationsTable data={assignationsData} onEvaluer={handleEvaluer} onVoir={handleVoir} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune assignation</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Ce travail n'a pas encore été assigné à des étudiants.
                  </p>
                  <Button onClick={() => setAssignModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Assigner un étudiant
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="statistiques" className="mt-4">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Les statistiques seront bientôt disponibles.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AssignationModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        travail={travail}
        etudiants={etudiants}
        assignedEtudiantIds={assignedEtudiantIds}
        onAssignationCreated={() => {
          console.log("🔄 [MODAL] Assignation créée - pas de rechargement, attendre navigation")
        }}
      />

      {selectedAssignation && (
        <EvaluationModal
          open={evalModalOpen}
          onOpenChange={setEvalModalOpen}
          assignation={selectedAssignation}
          bareme={travail.bareme}
          onEvaluationCreated={() => {
            console.log("🔄 [MODAL] Évaluation créée - pas de rechargement, attendre navigation")
          }}
        />
      )}
    </DashboardLayout>
  )
}