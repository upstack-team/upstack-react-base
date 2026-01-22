import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'SETICE - Système d\'Évaluation du Travail Individuel et Collectif Estudiantin',
  description: 'Plateforme de gestion des travaux étudiants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <Providers>
          <header className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SETICE
                  </h1>
                  <p className="text-sm text-gray-600">Système d'Évaluation du Travail Individuel et Collectif Estudiantin</p>
                </div>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}