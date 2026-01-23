'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { api } from '@/lib/api'
import { Role, type Evaluation } from '@/types/index'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface EvaluationWithDetails extends Evaluation {
  percentage: number
  trend?: 'up' | 'down' | 'stable'
}

export default function EtudiantEvaluationsPage() {
  const { user, isLoading: authLoading, hasAccess } = useAuth([Role.ETUDIANT])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const fetchEvaluations = async () => {
    try {
      const response = await api.getMyEvaluations()
      
      if (response.success && response.data) {
        setEvaluations(response.data)
      } else {
        console.error('Erreur API:', response.error)
        setEvaluations([])
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error)
      setEvaluations([])
    } finally {
      setIsLoading(false)
    }
  }

  if (hasAccess) {
    fetchEvaluations()
  }
}, [hasAccess])

  const stats = useMemo(() => {
    if (evaluations.length === 0) {
      return {
        moyenne: 0,
        totalPoints: 0,
        totalBareme: 0,
        best: null as Evaluation | null,
        worst: null as Evaluation | null,
        evaluationsWithDetails: [] as EvaluationWithDetails[],
        byMatiere: {} as Record<
          string,
          { notes: number[]; baremes: number[]; matiere: string }
        >,
      }
    }

    const totalPoints = evaluations.reduce((acc, e) => acc + e.note, 0)
    const totalBareme = evaluations.reduce(
      (acc, e) => acc + (e.assignation?.travail?.bareme || 20),
      0
    )
    const moyenne = totalBareme > 0 ? (totalPoints / totalBareme) * 20 : 0

    // Sort by percentage to find best and worst
    const sorted = [...evaluations].sort((a, b) => {
      const percA = (a.note / (a.assignation?.travail?.bareme || 20)) * 100
      const percB = (b.note / (b.assignation?.travail?.bareme || 20)) * 100
      return percB - percA
    })

    // Group by matiere
    const byMatiere: Record<
      string,
      { notes: number[]; baremes: number[]; matiere: string }
    > = {}
    evaluations.forEach((e) => {
      const matiere =
        e.assignation?.travail?.espacePedagogique?.matiere?.nom || 'Autre'
      if (!byMatiere[matiere]) {
        byMatiere[matiere] = { notes: [], baremes: [], matiere }
      }
      byMatiere[matiere].notes.push(e.note)
      byMatiere[matiere].baremes.push(e.assignation?.travail?.bareme || 20)
    })

    // Add details with trend
    const evaluationsWithDetails: EvaluationWithDetails[] = evaluations.map(
      (e, index) => {
        const percentage =
          (e.note / (e.assignation?.travail?.bareme || 20)) * 100
        let trend: 'up' | 'down' | 'stable' | undefined

        if (index < evaluations.length - 1) {
          const prevPerc =
            (evaluations[index + 1].note /
              (evaluations[index + 1].assignation?.travail?.bareme || 20)) *
            100
          if (percentage > prevPerc + 5) trend = 'up'
          else if (percentage < prevPerc - 5) trend = 'down'
          else trend = 'stable'
        }

        return { ...e, percentage, trend }
      }
    )

    return {
      moyenne,
      totalPoints,
      totalBareme,
      best: sorted[0],
      worst: sorted[sorted.length - 1],
      evaluationsWithDetails,
      byMatiere,
    }
  }, [evaluations])

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-teal-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-teal-100'
    if (percentage >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (authLoading || !hasAccess) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Mes evaluations</h1>
        <p className="text-muted-foreground">
          Consultez vos notes et votre progression
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne generale
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${getGradeColor(
                (stats.moyenne / 20) * 100
              )}`}
            >
              {stats.moyenne.toFixed(2)}
              <span className="text-lg text-muted-foreground">/20</span>
            </div>
            <Progress
              value={(stats.moyenne / 20) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des points
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPoints.toFixed(1)}
              <span className="text-lg text-muted-foreground">
                /{stats.totalBareme}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalPoints / stats.totalBareme) * 100 || 0).toFixed(1)}%
              de reussite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure note
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {stats.best ? (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {stats.best.note}
                  <span className="text-lg text-muted-foreground">
                    /{stats.best.assignation?.travail?.bareme || 20}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {stats.best.assignation?.travail?.titre}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">---</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Note a ameliorer
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {stats.worst && evaluations.length > 1 ? (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.worst.note}
                  <span className="text-lg text-muted-foreground">
                    /{stats.worst.assignation?.travail?.bareme || 20}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {stats.worst.assignation?.travail?.titre}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">---</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Moyennes par matiere */}
      {Object.keys(stats.byMatiere).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Moyennes par matiere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stats.byMatiere).map(([matiere, data]) => {
                const matiereTotal = data.notes.reduce((a, b) => a + b, 0)
                const matiereBareme = data.baremes.reduce((a, b) => a + b, 0)
                const matiereMoyenne = (matiereTotal / matiereBareme) * 20
                const percentage = (matiereMoyenne / 20) * 100

                return (
                  <div
                    key={matiere}
                    className={`rounded-lg border p-4 ${getGradeBg(percentage)}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{matiere}</p>
                      <Badge variant="outline">{data.notes.length} notes</Badge>
                    </div>
                    <p
                      className={`mt-2 text-2xl font-bold ${getGradeColor(
                        percentage
                      )}`}
                    >
                      {matiereMoyenne.toFixed(2)}
                      <span className="text-sm text-muted-foreground">/20</span>
                    </p>
                    <Progress value={percentage} className="mt-2 h-1.5" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des evaluations</CardTitle>
          <CardDescription>
            {evaluations.length} evaluation(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <div className="py-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Aucune evaluation pour le moment
              </p>
              <p className="text-sm text-muted-foreground">
                Vos notes apparaitront ici une fois vos travaux evalues
              </p>
            </div>
          ) : (
            <TooltipProvider>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Travail</TableHead>
                      <TableHead>Matiere</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Note</TableHead>
                      <TableHead className="text-center">Tendance</TableHead>
                      <TableHead>Commentaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.evaluationsWithDetails.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium">
                          {evaluation.assignation?.travail?.titre}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {evaluation.assignation?.travail?.espacePedagogique
                              ?.matiere?.nom || 'Matiere'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              evaluation.dateEvaluation
                            ).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className={`inline-flex items-baseline gap-1 rounded-md px-2 py-1 font-bold ${getGradeBg(
                              evaluation.percentage
                            )} ${getGradeColor(evaluation.percentage)}`}
                          >
                            {evaluation.note}
                            <span className="text-xs text-muted-foreground">
                              /
                              {evaluation.assignation?.travail?.bareme || 20}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {evaluation.trend === 'up' && (
                            <Tooltip>
                              <TooltipTrigger>
                                <TrendingUp className="mx-auto h-4 w-4 text-green-600" />
                              </TooltipTrigger>
                              <TooltipContent>En progression</TooltipContent>
                            </Tooltip>
                          )}
                          {evaluation.trend === 'down' && (
                            <Tooltip>
                              <TooltipTrigger>
                                <TrendingDown className="mx-auto h-4 w-4 text-red-500" />
                              </TooltipTrigger>
                              <TooltipContent>En baisse</TooltipContent>
                            </Tooltip>
                          )}
                          {evaluation.trend === 'stable' && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>Stable</TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          {evaluation.commentaire ? (
                            <Accordion type="single" collapsible>
                              <AccordionItem
                                value="comment"
                                className="border-none"
                              >
                                <AccordionTrigger className="py-0 text-sm text-teal-600 hover:no-underline">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Voir
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 text-sm">
                                  {evaluation.commentaire}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
