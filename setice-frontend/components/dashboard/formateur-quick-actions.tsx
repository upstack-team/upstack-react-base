"use client"

import { useRouter } from "next/navigation"
import { Plus, ClipboardList, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
  label: string
  icon: typeof Plus
  onClick: () => void
}

export function FormateurQuickActions() {
  const router = useRouter()

  const actions: QuickAction[] = [
    { 
      label: "Créer un travail", 
      icon: Plus, 
      onClick: () => router.push("/formateur/travaux/create") 
    },
    { 
      label: "Voir mes travaux", 
      icon: ClipboardList, 
      onClick: () => router.push("/formateur/travaux") 
    },
    { 
      label: "Gérer mes espaces", 
      icon: BookOpen, 
      onClick: () => router.push("/formateur") 
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Actions rapides</h3>
      </div>
      <div className="divide-y divide-border">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-muted-foreground",
              "transition-colors duration-150 hover:bg-accent hover:text-foreground",
            )}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}