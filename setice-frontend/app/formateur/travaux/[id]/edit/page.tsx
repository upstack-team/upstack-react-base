"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Travail, EspacePedagogique } from "@/types"

export default function EditTravailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const travailId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [travail, setTravail] = useState<Travail | null>(null)
  const [espaces, setEspaces] = useState<EspacePedagogique[]>([])

  const [formData, setFormData] = useState({
    titre: "",
    consignes: "",
    type: "INDIVIDUEL",
    dateLimite: "",
    bareme: 20,
    espacePedagogiqueId: "",
    statut: "BROUILLON",
  })

  useEffect(() => {
    async function loadData() {
      try {
        // Charger le travail
        const travailResponse = await api.getTravailById(travailId)
        if (travailResponse.success && travailResponse.data) {
          const travailData = travailResponse.data
          setTravail(travailData)

          // Formatter la date pour l'input datetime-local
          const dateLimite = new Date(travailData.dateLimite)
          const formattedDate = format(dateLimite, "yyyy-MM-dd'T'HH:mm")

          setFormData({
            titre: travailData.titre,
            consignes: travailData.consignes,
            type: travailData.type,
            dateLimite: formattedDate,
            bareme: travailData.bareme,
            espacePedagogiqueId: travailData.espacePedagogique.id,
            statut: travailData.statut,
          })
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger le travail",
            variant: "destructive",
          })
          router.push("/formateur/travaux")
        }

        // Charger les espaces
        const espacesResponse = await api.getEspacesByFormateur()
        if (espacesResponse.success && espacesResponse.data) {
          setEspaces(espacesResponse.data)
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement",
          variant: "destructive",
        })
        router.push("/formateur/travaux")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [travailId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titre || !formData.consignes || !formData.dateLimite || !formData.espacePedagogiqueId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await api.updateTravail(travailId, {
        ...formData,
        bareme: Number(formData.bareme),
      })

      if (response.success) {
        toast({
          title: "Succès",
          description: "Le travail a été modifié avec succès",
        })
        router.push(`/formateur/travaux/${travailId}`)
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de modifier le travail",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Modifier le travail</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du travail
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations du travail</CardTitle>
              <CardDescription>
                Les champs marqués d'un * sont obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Espace pédagogique */}
              <div className="space-y-2">
                <Label htmlFor="espace">Espace pédagogique *</Label>
                <Select
                  value={formData.espacePedagogiqueId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, espacePedagogiqueId: value })
                  }
                >
                  <SelectTrigger id="espace">
                    <SelectValue placeholder="Sélectionner un espace" />
                  </SelectTrigger>
                  <SelectContent>
                    {espaces.map((espace) => (
                      <SelectItem key={espace.id} value={espace.id}>
                        {espace.matiere.libelle} - {espace.promotion.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="titre">Titre du travail *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                  placeholder="Ex: TP1 - Introduction à React"
                  required
                />
              </div>

              {/* Consignes */}
              <div className="space-y-2">
                <Label htmlFor="consignes">Consignes *</Label>
                <Textarea
                  id="consignes"
                  value={formData.consignes}
                  onChange={(e) =>
                    setFormData({ ...formData, consignes: e.target.value })
                  }
                  placeholder="Décrivez les consignes du travail..."
                  rows={6}
                  required
                />
              </div>

              {/* Type et Barème */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de travail *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDIVIDUEL">Individuel</SelectItem>
                      <SelectItem value="COLLECTIF">Collectif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bareme">Barème (points) *</Label>
                  <Input
                    id="bareme"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.bareme}
                    onChange={(e) =>
                      setFormData({ ...formData, bareme: Number(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              {/* Date limite et Statut */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateLimite">Date limite *</Label>
                  <Input
                    id="dateLimite"
                    type="datetime-local"
                    value={formData.dateLimite}
                    onChange={(e) =>
                      setFormData({ ...formData, dateLimite: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut *</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value) =>
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger id="statut">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BROUILLON">Brouillon</SelectItem>
                      <SelectItem value="PUBLIE">Publié</SelectItem>
                      <SelectItem value="CLOTURE">Clôturé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}