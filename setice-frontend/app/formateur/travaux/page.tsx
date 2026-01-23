"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Plus, ClipboardList, Search, Filter, Pencil, Trash2, MoreVertical } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { EspacePedagogique, Travail } from "@/types"

const Loading = () => null

export default function TravauxPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [espaces, setEspaces] = useState<EspacePedagogique[]>([])
  const [travaux, setTravaux] = useState<Travail[]>([])
  const [selectedEspace, setSelectedEspace] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    travailId: string | null
    titre: string
  }>({
    open: false,
    travailId: null,
    titre: "",
  })

  useEffect(() => {
    async function loadData() {
      const espacesResponse = await api.getEspacesByFormateur()
      if (espacesResponse.success && espacesResponse.data) {
        setEspaces(espacesResponse.data)

        const allTravaux: Travail[] = []
        for (const espace of espacesResponse.data) {
          const travauxResponse = await api.getTravauxByEspace(espace.id)
          if (travauxResponse.success && travauxResponse.data) {
            allTravaux.push(...travauxResponse.data)
          }
        }
        setTravaux(allTravaux)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredTravaux = travaux.filter((travail) => {
    const matchesSearch = travail.titre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEspace = selectedEspace === "all" || travail.espacePedagogique.id === selectedEspace
    return matchesSearch && matchesEspace
  })

  const handleEdit = (e: React.MouseEvent, travailId: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/formateur/travaux/${travailId}/edit`)
  }

  const openDeleteDialog = (e: React.MouseEvent, travail: Travail) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteDialog({
      open: true,
      travailId: travail.id,
      titre: travail.titre,
    })
  }

  const handleDelete = async () => {
    if (!deleteDialog.travailId) return

    try {
      const response = await api.deleteTravail(deleteDialog.travailId)
      
      if (response.success) {
        setTravaux(travaux.filter((t) => t.id !== deleteDialog.travailId))
        toast({
          title: "Travail supprimé",
          description: "Le travail a été supprimé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de supprimer le travail",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog({ open: false, travailId: null, titre: "" })
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "BROUILLON":
        return <Badge variant="secondary">Brouillon</Badge>
      case "PUBLIE":
        return <Badge className="bg-primary text-primary-foreground">Publié</Badge>
      case "CLOTURE":
        return <Badge variant="outline">Clôturé</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type === "INDIVIDUEL" ? "Individuel" : "Collectif"}
      </Badge>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mes travaux</h1>
            <p className="text-muted-foreground">
              Gérez les travaux de vos espaces pédagogiques
            </p>
          </div>
          <Link href="/formateur/travaux/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau travail
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un travail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedEspace} onValueChange={setSelectedEspace}>
            <SelectTrigger className="w-full sm:w-62.5">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par espace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les espaces</SelectItem>
              {espaces.map((espace) => (
                <SelectItem key={espace.id} value={espace.id}>
                  {espace.matiere.libelle} - {espace.promotion.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <Suspense fallback={<Loading />}>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-50 rounded-lg" />
              ))}
            </div>
          ) : filteredTravaux.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun travail trouvé</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery || selectedEspace !== "all"
                    ? "Aucun travail ne correspond à vos critères de recherche."
                    : "Commencez par créer votre premier travail."}
                </p>
                {!searchQuery && selectedEspace === "all" && (
                  <Link href="/formateur/travaux/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un travail
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTravaux.map(
                (travail) =>
                  travail.id && (
                    <div key={travail.id} className="relative group">
                      <Link href={`/formateur/travaux/${travail.id}`}>
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg line-clamp-2 pr-8">
                                {travail.titre}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatutBadge(travail.statut)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {getTypeBadge(travail.type)}
                              <span className="text-xs text-muted-foreground">
                                {travail.bareme} points
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {travail.consignes}
                            </p>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Espace:</span>
                                <span>{travail.espacePedagogique.matiere.libelle}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Date limite:</span>
                                <span>
                                  {format(
                                    new Date(travail.dateLimite),
                                    "d MMM yyyy 'à' HH:mm",
                                    { locale: fr }
                                  )}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>

                      {/* Actions Menu */}
                      <div className="absolute top-4 right-4 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => handleEdit(e, travail.id)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => openDeleteDialog(e, travail)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </Suspense>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, travailId: null, titre: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer le travail "{deleteDialog.titre}".
              Cette action est irréversible et supprimera également toutes les
              assignations et évaluations associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}