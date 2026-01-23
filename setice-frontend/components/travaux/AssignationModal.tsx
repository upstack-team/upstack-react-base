"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/lib/api"  // ✅ Import ajouté
import type { Travail, Etudiant } from "@/types"

interface AssignationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  travail: Travail
  etudiants: Etudiant[]
  assignedEtudiantIds: string[]
  onAssignationCreated: () => void
}

export function AssignationModal({
  open,
  onOpenChange,
  travail,
  etudiants,
  assignedEtudiantIds,
  onAssignationCreated,
}: AssignationModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)  // ✅ État de chargement ajouté

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleAssign = async () => {
    setIsLoading(true)  // ✅ Début du chargement
    try {
      for (const etudiantId of selectedIds) {
        const response = await api.createAssignation({ 
          travailId: travail.id, 
          etudiantId 
        })
        
        if (!response.success) {
          throw new Error(response.error || "Erreur lors de l'assignation")
        }
      }
      setSelectedIds([])
      onAssignationCreated()
      onOpenChange(false)
    } catch (err) {
      console.error("Erreur lors de l'assignation :", err)
      alert("Une erreur est survenue lors de l'assignation")
    } finally {
      setIsLoading(false)  // ✅ Fin du chargement
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assigner des étudiants</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {etudiants.map((etudiant) => (
            <div key={etudiant.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.includes(etudiant.id)}
                disabled={assignedEtudiantIds.includes(etudiant.id)}
                onCheckedChange={() => toggleSelect(etudiant.id)}
              />
              <span className={assignedEtudiantIds.includes(etudiant.id) ? "line-through text-muted-foreground" : ""}>
                {etudiant.user.nom} {etudiant.user.prenom} ({etudiant.user.email})
              </span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleAssign} disabled={selectedIds.length === 0 || isLoading}>
            {isLoading ? "Assignation..." : "Assigner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}