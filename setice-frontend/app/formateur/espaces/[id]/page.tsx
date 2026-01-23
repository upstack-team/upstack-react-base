"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BookOpen, Users, ClipboardList, ArrowLeft, Plus, Calendar, Award } from "lucide-react"
import { api } from "@/lib/api"
import type { EspacePedagogique, Travail } from "@/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import Link from "next/link"

export default function FormateurEspaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const espaceId = params?.id as string

  const [espace, setEspace] = useState<EspacePedagogique | null>(null)
  const [travaux, setTravaux] = useState<Travail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [espaceResponse, travauxResponse] = await Promise.all([
          api.getEspaceById(espaceId),
          api.getTravauxByEspace(espaceId),
        ])

        if (espaceResponse.success && espaceResponse.data) {
          setEspace(espaceResponse.data)
        }

        if (travauxResponse.success && travauxResponse.data) {
          setTravaux(travauxResponse.data)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (espaceId) {
      loadData()
    }
  }, [espaceId])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!espace) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Espace pédagogique non trouvé</p>
          <Button variant="link" onClick={() => router.back()} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">
              {espace.matiere.libelle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {espace.promotion.libelle} • Année {espace.annee}
            </p>
          </div>
          <Link href={`/formateur/travaux/create?espaceId=${espace.id}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau travail
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-foreground">
                  {espace.etudiants?.length || 0}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Étudiants</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-foreground">
                  {travaux.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Travaux</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-foreground">
                  {espace.matiere.credits}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Crédits</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Travaux */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Travaux récents</h3>
              <Link href={`/formateur/travaux?espaceId=${espace.id}`}>
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
            <div className="p-4">
              {travaux.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucun travail créé pour cet espace
                  </p>
                  <Link href={`/formateur/travaux/create?espaceId=${espace.id}`}>
                    <Button variant="link" size="sm" className="mt-2">
                      Créer un travail
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {travaux.slice(0, 5).map((travail) => (
                    <Link
                      key={travail.id}
                      href={`/formateur/travaux/${travail.id}`}
                      className="block rounded-md border border-border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {travail.titre}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {travail.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {travail.bareme} pts
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Étudiants */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium text-foreground">
                Liste des étudiants ({espace.etudiants?.length || 0})
              </h3>
            </div>
            <div className="p-4">
              {!espace.etudiants || espace.etudiants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucun étudiant inscrit dans cet espace
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {espace.etudiants.map((etudiant) => (
                    <div
                      key={etudiant.id}
                      className="flex items-center gap-3 rounded-md border border-border p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {etudiant.user.prenom[0]}
                        {etudiant.user.nom[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {etudiant.user.prenom} {etudiant.user.nom}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {etudiant.matricule}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}