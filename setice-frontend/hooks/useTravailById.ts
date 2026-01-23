"use client"

import { useState, useEffect } from "react"
import type { Travail } from "@/types"
import { api } from "@/lib/api"

export function useTravailById(travailId?: string) {
  const [travail, setTravail] = useState<Travail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!travailId) return

    setIsLoading(true)
    setError(null)

    api.getTravailById(travailId)
      .then(res => {
        if (!res.success || !res.data) throw new Error(res.error || "Travail introuvable")
        setTravail(res.data)
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [travailId])

  return { travail, isLoading, error }
}
