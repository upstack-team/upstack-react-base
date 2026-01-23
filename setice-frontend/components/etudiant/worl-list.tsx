"use client"

import Link from "next/link"
import { type Assignation } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkListProps {
  assignations: Assignation[]
  isLoading?: boolean
}

export function WorkList({ assignations, isLoading }: WorkListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Travaux à rendre</h3>
      </div>
      <div className="divide-y divide-border">
        {assignations.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun travail en attente
          </div>
        ) : (
          assignations.slice(0, 5).map((assignation) => (
            <Link
              key={assignation.id}
              href={`/etudiant/travaux/${assignation.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 hover:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">
                  {assignation.travail?.titre}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {assignation.travail?.espacePedagogique?.matiere?.libelle || "Matière"}
                </p>
              </div>
              <div className="ml-4 shrink-0 text-right">
                <p className="text-xs font-medium text-orange-600">
                  {new Date(assignation.travail?.dateLimite).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-xs text-muted-foreground">Date limite</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}