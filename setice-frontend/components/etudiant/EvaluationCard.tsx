"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, MessageSquare, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Evaluation } from "@/types"

interface EvaluationCardProps {
  evaluation: Evaluation
  onViewDetails?: () => void
}

export function EvaluationCard({ evaluation, onViewDetails }: EvaluationCardProps) {
  console.log("🎴 [EVAL_CARD] Rendu de la carte d'évaluation:", {
    id: evaluation.id,
    note: evaluation.note,
    travailTitre: evaluation.travail?.titre,
    bareme: evaluation.travail?.bareme,
    commentaire: evaluation.commentaire?.substring(0, 50) + "...",
    dateEvaluation: evaluation.dateEvaluation,
    espace: evaluation.espace
  })

  const getNoteColor = (note: number, bareme: number) => {
    const percentage = (note / bareme) * 100
    
    console.log("🎨 [EVAL_CARD] Calcul de la couleur:", {
      note,
      bareme,
      percentage: percentage.toFixed(2) + "%"
    })

    if (percentage >= 80) return "bg-emerald-100 text-emerald-800"
    if (percentage >= 60) return "bg-blue-100 text-blue-800"
    if (percentage >= 40) return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  const bareme = evaluation.travail?.bareme || 20
  const noteColor = getNoteColor(evaluation.note, bareme)

  console.log("🎨 [EVAL_CARD] Couleur finale:", noteColor)

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">
                {evaluation.travail?.titre || "Travail sans titre"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {evaluation.espace?.matiere || "Matière inconnue"} • {evaluation.espace?.promotion || "Promotion inconnue"}
              </p>
            </div>
          </div>
          <Badge className={`${noteColor} shrink-0`}>
            {evaluation.note}/{bareme}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(evaluation.dateEvaluation), "d MMM yyyy", { locale: fr })}
            </span>
          </div>
          {evaluation.points !== undefined && (
            <Badge variant="secondary">{evaluation.points} points</Badge>
          )}
        </div>

        {evaluation.commentaire && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground italic line-clamp-3">
                "{evaluation.commentaire}"
              </p>
            </div>
          </div>
        )}

        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => {
              console.log("👁️ [EVAL_CARD] Bouton 'Voir détails' cliqué pour:", evaluation.id)
              onViewDetails()
            }}
          >
            Voir les détails
          </Button>
        )}
      </CardContent>
    </Card>
  )
}