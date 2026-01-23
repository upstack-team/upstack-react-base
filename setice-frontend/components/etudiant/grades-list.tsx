"use client"

import { type Evaluation } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

interface GradesListProps {
  evaluations: Evaluation[]
  isLoading?: boolean
}

export function GradesList({ evaluations, isLoading }: GradesListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Dernières notes</h3>
      </div>
      <div className="divide-y divide-border">
        {evaluations.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune évaluation
          </div>
        ) : (
          evaluations.slice(0, 5).map((evaluation) => (
            <div
              key={evaluation.id}
              className="flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 hover:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">
                  {evaluation.assignation?.travail?.titre}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {evaluation.assignation?.travail?.espacePedagogique?.matiere?.libelle || "Matière"}
                </p>
              </div>
              <div className="ml-4 shrink-0">
                <p className="text-lg font-semibold text-primary">
                  {evaluation.note}/{evaluation.assignation?.travail?.bareme}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}