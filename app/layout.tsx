import type { ReactNode } from 'react'
import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'Setice App',
  description: 'Application pédagogique connectée à PostgreSQL'
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header-inner">
              <div className="app-logo">
                <span className="app-logo-badge">SE</span>
                <span>Setice App</span>
              </div>
              <nav className="app-nav">
                <Link href="/#dashboard" className="app-nav-link">
                  Tableau de bord
                </Link>
                <Link href="/#formateur" className="app-nav-link">
                  Espace formateur
                </Link>
                <Link href="/#etudiant" className="app-nav-link">
                  Espace étudiant
                </Link>
              </nav>
            </div>
          </header>
          <main className="app-main">{props.children}</main>
        </div>
      </body>
    </html>
  )
}
