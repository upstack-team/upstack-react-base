"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Assignation, Livraison, Evaluation } from "@/types"
import { StatutAssignation } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  BookOpen,
  Upload,
  Send,
  Award,
  AlertCircle,
} from "lucide-react"
import { format, isPast, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

const statutConfig = {
  [StatutAssignation.ASSIGNE]: { label: "À rendre", color: "text-blue-600 bg-blue-50" },
  [StatutAssignation.LIVRE]: { label: "Livré", color: "text-amber-600 bg-amber-50" },
  [StatutAssignation.EVALUE]: { label: "Évalué", color: "text-green-600 bg-green-50" },
}

export default function TravailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [assignation, setAssignation] = useState<Assignation | null>(null)
  const [livraison, setLivraison] = useState<Livraison | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [texte, setTexte] = useState("")
  const [fichierUrl, setFichierUrl] = useState("")

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      // 1️⃣ Récupérer assignations
      const assignResp = await api.getMyAssignations()
      const assignations: Assignation[] = assignResp?.success && assignResp.data ? assignResp.data : []
      const found = assignations.find((a) => a.id === id)

      if (!found) {
        toast.error("Travail non trouvé")
        router.push("/etudiant/travaux")
        return
      }
      setAssignation(found)

      // 2️⃣ Récupérer livraison
      if (found.statut !== StatutAssignation.ASSIGNE) {
        const livraisonResp = await api.getLivraison(id)
        if (livraisonResp?.success && livraisonResp.data && livraisonResp.data.length > 0) {
          const livraison_ = livraisonResp.data[0]
          setLivraison(livraison_)
          setTexte(livraison_.texte || "")
          setFichierUrl(livraison_.fichierUrl || "")
        }
      }

      // 3️⃣ Récupérer évaluation
      if (found.statut === StatutAssignation.EVALUE) {
        const evalResp = await api.getMyEvaluations()
        const evaluations : Evaluation[]= evalResp?.success && evalResp.data ? evalResp.data : []
        const eval_ = evaluations.find((e) => e.assignation?.id === id)
        if (eval_) setEvaluation(eval_)
      }
    } catch (error) {
      console.error("❌ [DETAIL] Erreur chargement:", error)
      toast.error("Erreur lors du chargement du travail")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!texte.trim() && !fichierUrl.trim()) {
      toast.error("Veuillez fournir un texte ou un lien vers votre fichier")
      return
    }

    setSubmitting(true)
    
    try {
      console.log("📤 [DETAIL] ========================================")
      console.log("📤 [DETAIL] Début de la livraison")
      console.log("📤 [DETAIL] Assignation ID:", id)
      console.log("📤 [DETAIL] Texte length:", texte.trim().length)
      console.log("📤 [DETAIL] Fichier URL:", fichierUrl.trim() || "aucun")
      console.log("📤 [DETAIL] ========================================")
      
      const result = await api.createLivraison(id, {
        texte: texte.trim() || undefined,
        fichierUrl: fichierUrl.trim() || undefined,
      })
      
      console.log("✅ [DETAIL] ========================================")
      console.log("✅ [DETAIL] Réponse de l'API:")
      console.log("✅ [DETAIL] Success:", result?.success)
      console.log("✅ [DETAIL] Data:", JSON.stringify(result?.data, null, 2))
      console.log("✅ [DETAIL] ========================================")
      
      if (result?.success) {
        // Toast de succès
        toast.success("Travail livré avec succès !", {
          description: "Vous allez être redirigé vers la liste des travaux...",
          duration: 2000,
        })
        
        console.log("🔄 [DETAIL] Attente de 2 secondes avant redirection...")
        
        // Attendre 2 secondes pour que l'utilisateur voie le message
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        console.log("🔄 [DETAIL] Redirection vers /etudiant/travaux")
        
        // Rediriger avec rechargement complet
        window.location.href = "/etudiant/travaux"
      } else {
        // Si l'API répond mais avec success: false
        console.error("❌ [DETAIL] L'API a répondu avec success: false")
        throw new Error(result?.error || "Erreur inconnue lors de la livraison")
      }
      
    } catch (error) {
      console.error("❌ [DETAIL] ========================================")
      console.error("❌ [DETAIL] ERREUR LORS DE LA LIVRAISON")
      console.error("❌ [DETAIL] Type:", error instanceof Error ? error.constructor.name : typeof error)
      console.error("❌ [DETAIL] Message:", error instanceof Error ? error.message : String(error))
      
      if (error instanceof Error) {
        console.error("❌ [DETAIL] Stack:", error.stack)
      }
      
      // Si c'est une erreur réseau/fetch, afficher plus de détails
      if (error && typeof error === 'object' && 'response' in error) {
        console.error("❌ [DETAIL] Response status:", (error as any).response?.status)
        console.error("❌ [DETAIL] Response data:", (error as any).response?.data)
      }
      
      console.error("❌ [DETAIL] Objet complet:", error)
      console.error("❌ [DETAIL] ========================================")
      
      // Toast d'erreur persistant
      toast.error("Erreur lors de la livraison", {
        description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
        duration: 10000, // 10 secondes pour avoir le temps de lire
        action: {
          label: "Réessayer",
          onClick: () => handleSubmit(),
        },
      })
      
      // Ne PAS rediriger en cas d'erreur
    } finally {
      setSubmitting(false)
      console.log("🏁 [DETAIL] Fin de handleSubmit - submitting:", false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (!assignation) return null

  const config = statutConfig[assignation.statut]
  const isLate =
    assignation.statut === StatutAssignation.ASSIGNE &&
    isPast(new Date(assignation.travail.dateLimite))
  const canSubmit = assignation.statut === StatutAssignation.ASSIGNE

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/etudiant/travaux">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{assignation.travail.titre}</h1>
            <Badge className={`${config.color} border-0`}>{config.label}</Badge>
            {isLate && <Badge variant="destructive">En retard</Badge>}
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {assignation.travail.espacePedagogique?.matiere?.nom || "Matière"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Consignes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consignes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{assignation.travail.consignes}</p>
            </CardContent>
          </Card>

          {/* Livrer travail */}
          {canSubmit ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Livrer votre travail
                </CardTitle>
                <CardDescription>
                  Rédigez votre réponse et/ou fournissez un lien vers vos fichiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="texte">Votre réponse</Label>
                  <Textarea
                    id="texte"
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    rows={8}
                    className="resize-none"
                    placeholder="Écrivez votre réponse ici..."
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fichier">Lien vers fichier (optionnel)</Label>
                  <Input
                    id="fichier"
                    type="url"
                    value={fichierUrl}
                    onChange={(e) => setFichierUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Partagez un lien Google Drive, Dropbox, ou autre service de stockage
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Une fois livré, vous ne pourrez plus modifier votre travail
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || (!texte.trim() && !fichierUrl.trim())}
                  >
                    {submitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Livrer le travail
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Indicateur de debug en développement */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border">
                    💡 Mode développement : Ouvrez la console (F12) pour voir les logs détaillés
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Livraison */}
              {livraison && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Votre livraison
                    </CardTitle>
                    <CardDescription>
                      Livrée le{" "}
                      {livraison.dateLivraison
                        ? format(new Date(livraison.dateLivraison), "dd MMM yyyy 'à' HH:mm", { locale: fr })
                        : "En attente"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {livraison.texte && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Votre réponse</Label>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="whitespace-pre-wrap text-sm">{livraison.texte}</p>
                        </div>
                      </div>
                    )}
                    {livraison.fichierUrl && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Fichier joint</Label>
                        <a
                          href={livraison.fichierUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          Voir le fichier
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Evaluation */}
              {evaluation && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Award className="h-5 w-5" />
                      Votre évaluation
                    </CardTitle>
                    <CardDescription>
                      Évaluée le {format(new Date(evaluation.dateEvaluation), "dd MMM yyyy", { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-green-700">{evaluation.note}</span>
                        <span className="text-xl text-green-600">/{assignation.travail.bareme}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">
                  {assignation.travail.type === "INDIVIDUEL" ? "Individuel" : "Collectif"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date limite</span>
                <span className="font-medium">
                  {format(new Date(assignation.travail.dateLimite), "dd MMM yyyy", { locale: fr })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Barème</span>
                <span className="font-medium">{assignation.travail.bareme} points</span>
              </div>
              {assignation.statut === StatutAssignation.ASSIGNE && (
                <>
                  <Separator />
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">
                      {isLate ? "En retard" : "Temps restant"}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {formatDistanceToNow(new Date(assignation.travail.dateLimite), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}