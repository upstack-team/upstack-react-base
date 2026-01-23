import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'  // 🔹 import du provider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'SETICE - Plateforme E-Learning',
  description: 'Système de Gestion Académique - Gestion des travaux, évaluations et classements',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider> {/* 🔹 Wrap ici */}
          {children}
          <Toaster richColors position="top-right" />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
