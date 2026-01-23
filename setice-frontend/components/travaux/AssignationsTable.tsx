"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, Filter, Eye, FileEdit, Star, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AssignationsListResponse, StatutAssignation } from "@/types"

interface AssignationsTableProps {
  data: AssignationsListResponse
  onEvaluer: (assignationId: string) => void
  onVoir: (assignationId: string) => void
}

export function AssignationsTable({ data, onEvaluer, onVoir }: AssignationsTableProps) {
  console.log("📊 [ASSIGNATIONS_TABLE] Rendu du tableau:", {
    total: data.total,
    assignations: data.assignations.length
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("nom")

  const filteredAssignations = useMemo(() => {
    let filtered = data.assignations.filter((assignation) => {
      const fullName = `${assignation.etudiant.user.nom} ${assignation.etudiant.user.prenom}`.toLowerCase()
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        fullName.includes(query) ||
        assignation.etudiant.matricule.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || assignation.statut === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "nom":
          return a.etudiant.user.nom.localeCompare(b.etudiant.user.nom)
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "note":
          const noteA = a.evaluation?.note ?? -1
          const noteB = b.evaluation?.note ?? -1
          return noteB - noteA
        default:
          return 0
      }
    })

    return filtered
  }, [data.assignations, searchQuery, statusFilter, sortBy])

  const getStatutBadge = (statut: StatutAssignation, note?: number) => {
    console.log("🏷️ [ASSIGNATIONS_TABLE] getStatutBadge:", { statut, note })

    switch (statut) {
      case "ASSIGNE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Assigné
          </Badge>
        )
      case "LIVRE":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Livré
          </Badge>
        )
      case "EVALUE":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {note !== undefined ? `${note}/${data.travail.bareme}` : "Évalué"}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const stats = useMemo(() => {
    const total = data.assignations.length
    const aNoter = data.assignations.filter((a) => a.statut === "LIVRE").length
    const evalues = data.assignations.filter((a) => a.statut === "EVALUE").length
    return { total, aNoter, evalues }
  }, [data.assignations])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-45">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ASSIGNE">Assigné</SelectItem>
            <SelectItem value="LIVRE">Livré</SelectItem>
            <SelectItem value="EVALUE">Évalué</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-37.5">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nom">Nom</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Assigné le</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune assignation trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignations.map((assignation) => {
                console.log("📝 [ASSIGNATIONS_TABLE] Ligne:", {
                  id: assignation.id.slice(0, 8),
                  etudiant: `${assignation.etudiant.user.nom} ${assignation.etudiant.user.prenom}`,
                  statut: assignation.statut,
                  hasEvaluation: !!assignation.evaluation,
                  evaluationNote: assignation.evaluation?.note
                })

                const isEvalue = assignation.statut === "EVALUE"
                const isLivre = assignation.statut === "LIVRE"
                const canEvaluate = isLivre && !isEvalue

                return (
                  <TableRow key={assignation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {assignation.etudiant.user.nom.toUpperCase()}{" "}
                          {assignation.etudiant.user.prenom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignation.etudiant.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {assignation.etudiant.matricule}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(assignation.createdAt), "d MMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>
                      {getStatutBadge(assignation.statut, assignation.evaluation?.note)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Bouton Noter (seulement si LIVRE et pas évalué) */}
                        {canEvaluate && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              console.log("📝 [ASSIGNATIONS_TABLE] Noter cliqué:", assignation.id)
                              onEvaluer(assignation.id)
                            }}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            Noter
                          </Button>
                        )}

                        {/* Bouton Voir (toujours disponible si livré ou évalué) */}
                        {(isLivre || isEvalue) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log("👁️ [ASSIGNATIONS_TABLE] Voir cliqué:", assignation.id)
                              onVoir(assignation.id)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                        )}

                        {/* Badge pour les évalués */}
                        {isEvalue && !canEvaluate && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Déjà noté
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        {stats.total} assignations • {stats.aNoter} à noter • {stats.evalues} évaluées
      </div>
    </div>
  )
}