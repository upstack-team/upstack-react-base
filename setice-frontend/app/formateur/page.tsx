"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardList, BookOpen, Users, Plus, ArrowRight } from "lucide-react"


import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import type { EspacePedagogique } from "@/types"

export default function FormateurDashboard() {
  const { user } = useAuth()
  const [espaces, setEspaces] = useState<EspacePedagogique[]>([])
  const [travaux, setTravaux] = useState<any[]>([]) // tu peux typer selon ton modèle

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.getEspacesByFormateur()
        if (response.success && response.data) {
          setEspaces(response.data)
        }

        
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-30 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-75 rounded-lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Bonjour, {user?.prenom} {user?.nom}
            </h1>
            <p className="text-muted-foreground">
              Bienvenue sur votre tableau de bord formateur
            </p>
          </div>
          <Link href="/formateur/travaux/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau travail
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Espaces pédagogiques"
            value={espaces.length}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Travaux créés"
            value={travaux.length}
            icon={ClipboardList}
          />
          <StatsCard
            title="Étudiants total"
            value={espaces.reduce((acc, e) => acc + (e.etudiants?.length || 0), 0)}
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mes espaces pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              {espaces.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Vous n'avez pas encore d'espaces pédagogiques assignés.
                </p>
              ) : (
                <div className="space-y-3">
                  {espaces.slice(0, 3).map((espace) => (
                    <div
                      key={espace.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{espace.matiere.libelle}</p>
                        <p className="text-sm text-muted-foreground">
                          {espace.promotion.libelle} - {espace.annee}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {espace.etudiants?.length || 0} étudiants
                      </div>
                    </div>
                  ))}
                  {espaces.length > 3 && (
                    <Link
                      href="/formateur"
                      className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                    >
                      Voir tous les espaces
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/formateur/travaux/create" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un travail
                </Button>
              </Link>
              <Link href="/formateur/travaux" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Voir mes travaux
                </Button>
              </Link>
              <Link href="/formateur" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Gérer mes espaces
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
