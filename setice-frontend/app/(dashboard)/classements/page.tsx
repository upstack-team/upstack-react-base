"use client"

import { useEffect, useState } from "react"
import { Trophy, Users, TrendingUp, Award, Download, Medal } from "lucide-react"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import Link from "next/link"

interface PromotionStats {
  promotion: {
    id: string
    code: string
    libelle: string
    annee: string
  }
  stats: {
    nbEtudiants: number
    nbEvaluations: number
    moyennePromotion: number
    totalPoints: number
    totalBareme: number
    meilleureMoyenne: number
    plusFaibleMoyenne: number
    tauxReussite: number
  }
  rang: number
}

export default function ClassementPromotionsPage() {
  const [classement, setClassement] = useState<PromotionStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getClassementPromotions()
        if (response.success && response.data) {
          setClassement(response.data)
        } else {
          toast.error("Erreur lors du chargement du classement")
        }
      } catch (error) {
        console.error("Error fetching classement:", error)
        toast.error("Erreur lors du chargement du classement")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleExportCSV = () => {
    if (!classement) return

    const headers = [
      "Rang",
      "Promotion",
      "Année",
      "Nb Étudiants",
      "Moyenne",
      "Meilleure Moyenne",
      "Plus Faible",
      "Taux Réussite %",
      "Nb Évaluations",
    ]
    const rows = classement.map((entry) => [
      entry.rang,
      entry.promotion.libelle,
      entry.promotion.annee,
      entry.stats.nbEtudiants,
      entry.stats.moyennePromotion.toFixed(2),
      entry.stats.meilleureMoyenne.toFixed(2),
      entry.stats.plusFaibleMoyenne.toFixed(2),
      entry.stats.tauxReussite.toFixed(1),
      entry.stats.nbEvaluations,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `classement_promotions_${new Date().toISOString().split("T")[0]}.csv`)
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Export CSV téléchargé")
  }

  const getMedalColor = (rang: number) => {
    switch (rang) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getRangBadge = (rang: number) => {
    switch (rang) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return ""
    }
  }

  const getMoyenneBadge = (moyenne: number) => {
    if (moyenne >= 16) return "bg-green-100 text-green-800"
    if (moyenne >= 14) return "bg-blue-100 text-blue-800"
    if (moyenne >= 10) return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    )
  }

  if (classement.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Classement des Promotions</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Comparaison des performances entre promotions
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune promotion avec des évaluations disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Stats globales
  const moyenneGlobale =
    classement.reduce((sum, p) => sum + p.stats.moyennePromotion, 0) / classement.length
  const totalEtudiants = classement.reduce((sum, p) => sum + p.stats.nbEtudiants, 0)
  const totalEvaluations = classement.reduce((sum, p) => sum + p.stats.nbEvaluations, 0)
  const tauxReussiteGlobal =
    classement.reduce((sum, p) => sum + p.stats.tauxReussite, 0) / classement.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Classement des Promotions</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Comparaison des performances entre promotions
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promotions
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classement.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total comparées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Étudiants
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEtudiants}</div>
            <p className="text-xs text-muted-foreground mt-1">Total évalués</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne Globale
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moyenneGlobale.toFixed(2)}/20</div>
            <p className="text-xs text-muted-foreground mt-1">{totalEvaluations} évaluations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de Réussite
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxReussiteGlobal.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Moyenne ≥ 10/20</p>
          </CardContent>
        </Card>
      </div>

      {/* Podium Top 3 */}
      {classement.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Podium des Promotions</CardTitle>
            <CardDescription>Les 3 meilleures promotions par moyenne générale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-4 py-4">
              {/* 2ème place */}
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
                <div className="mt-2 h-20 w-32 rounded-t-lg bg-gray-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-gray-700 text-xl">2</p>
                </div>
                <p className="mt-2 text-center text-sm font-medium">
                  {classement[1].promotion.libelle}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  {classement[1].stats.moyennePromotion.toFixed(2)}/20
                </p>
                <p className="text-xs text-muted-foreground">
                  {classement[1].stats.nbEtudiants} étudiants
                </p>
              </div>

              {/* 1ère place */}
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                  <Trophy className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="mt-2 h-28 w-36 rounded-t-lg bg-yellow-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-yellow-700 text-2xl">1</p>
                </div>
                <p className="mt-2 text-center text-sm font-bold">
                  {classement[0].promotion.libelle}
                </p>
                <p className="text-lg font-bold text-yellow-600">
                  {classement[0].stats.moyennePromotion.toFixed(2)}/20
                </p>
                <p className="text-xs text-muted-foreground">
                  {classement[0].stats.nbEtudiants} étudiants
                </p>
              </div>

              {/* 3ème place */}
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Medal className="h-8 w-8 text-amber-600" />
                </div>
                <div className="mt-2 h-16 w-32 rounded-t-lg bg-amber-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-amber-700 text-xl">3</p>
                </div>
                <p className="mt-2 text-center text-sm font-medium">
                  {classement[2].promotion.libelle}
                </p>
                <p className="text-sm font-bold text-amber-600">
                  {classement[2].stats.moyennePromotion.toFixed(2)}/20
                </p>
                <p className="text-xs text-muted-foreground">
                  {classement[2].stats.nbEtudiants} étudiants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau complet */}
      <Card>
        <CardHeader>
          <CardTitle>Classement Complet</CardTitle>
          <CardDescription>Toutes les promotions classées par moyenne générale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rang</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead className="text-center">Année</TableHead>
                  <TableHead className="text-center">Étudiants</TableHead>
                  <TableHead className="text-center">Moyenne</TableHead>
                  <TableHead className="text-center">Meilleure</TableHead>
                  <TableHead className="text-center">Plus Faible</TableHead>
                  <TableHead className="text-center">Taux Réussite</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classement.map((entry) => (
                  <TableRow key={entry.promotion.id} className={entry.rang <= 3 ? "bg-muted/30" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.rang <= 3 ? (
                          <>
                            <Medal className={`h-5 w-5 ${getMedalColor(entry.rang)}`} />
                            <Badge variant="outline" className={getRangBadge(entry.rang)}>
                              {entry.rang}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground ml-2">{entry.rang}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.promotion.libelle}</TableCell>
                    <TableCell className="text-center">{entry.promotion.annee}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{entry.stats.nbEtudiants}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getMoyenneBadge(entry.stats.moyennePromotion)}>
                        {entry.stats.moyennePromotion.toFixed(2)}/20
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-green-600 font-medium">
                      {entry.stats.meilleureMoyenne.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-orange-600 font-medium">
                      {entry.stats.plusFaibleMoyenne.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={entry.stats.tauxReussite >= 50 ? "text-green-600" : "text-red-600"}>
                        {entry.stats.tauxReussite.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/directeur/classements/${entry.promotion.id}`}>
                          Détails
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}