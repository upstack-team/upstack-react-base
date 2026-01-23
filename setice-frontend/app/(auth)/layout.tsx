"use client"

import type React from "react"
import { usePathname } from "next/navigation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // ✅ La key force React à recréer complètement le composant
  // quand l'URL change (activate → login)
  return <div key={pathname}>{children}</div>
}