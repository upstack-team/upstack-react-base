"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, Search, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import type { EspacePedagogique } from "@/types"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import Link from "next/link"

export default function FormateurEspacesPage() {
  const [espaces, setEspaces] = useState<EspacePedagogique[]>([])
  const [filteredEspaces, setFilteredEspaces] = useState<EspacePedagogique[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadEspaces() {
      try {
        const response = await api.getEspacesByFormateur()
        if (response.success && response.data) {
          setEspaces(response.data)
          setFilteredEspaces(response.data)
        }
      } catch (error) {
        console.error("Error loading espaces:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEspaces()
  }, [])

  useEffect(() => {
    const filtered = espaces.filter((espace) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        espace.matiere.libelle.toLowerCase().includes(searchLower) ||
        espace.promotion.libelle.toLowerCase().includes(searchLower) ||
        espace.annee.includes(searchLower)
      )
    })
    setFilteredEspaces(filtered)
  }, [searchTerm, espaces])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mes espaces pédagogiques</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {espaces.length} espace{espaces.length > 1 ? "s" : ""} pédagogique{espaces.length > 1 ? "s" : ""} assigné{espaces.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par matière, promotion ou année..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Espaces List */}
        {filteredEspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {searchTerm ? "Aucun résultat" : "Aucun espace pédagogique"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchTerm
                ? "Aucun espace ne correspond à votre recherche."
                : "Vous n'avez pas encore d'espaces pédagogiques assignés."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEspaces.map((espace) => (
              <Link
                key={espace.id}
                href={`/formateur/espaces/${espace.id}`}
                className="block rounded-lg border border-border bg-card p-6 transition-all duration-150 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {espace.matiere.libelle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {espace.matiere.code} • {espace.matiere.credits} crédits
                      </p>
                    </div>

                    {/* Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{espace.promotion.libelle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Année {espace.annee}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-normal">
                        {espace.etudiants?.length || 0} étudiant{(espace.etudiants?.length || 0) > 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        Code: {espace.promotion.code}
                      </Badge>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}