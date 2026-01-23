"use client"

import { EtudiantSidebar } from "@/components/etudiant/etudiant-sidebar"

export default function EtudiantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <EtudiantSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-60">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}