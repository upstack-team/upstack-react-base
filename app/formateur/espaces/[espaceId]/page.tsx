import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '../../../../lib/prisma'

type Props = {
  params: {
    espaceId: string
  }
}

export default async function EspaceDetailPage(props: Props) {
  const espace = await prisma.espacePedagogique.findUnique({
    where: { id: props.params.espaceId },
    include: {
      promotion: true,
      formateur: true,
      travaux: true,
      inscriptions: {
        include: {
          etudiant: true
        }
      }
    }
  })

  if (!espace) {
    notFound()
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">{espace.titre}</h1>
        <p className="page-subtitle">
          {espace.matiere} · {espace.promotion.name} ({espace.promotion.academicYear}) ·{' '}
          Formateur: {espace.formateur.firstName} {espace.formateur.lastName}
        </p>
      </header>

      <div className="stacked-cards">
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Travaux</div>
                <div className="card-subtitle">Tous les travaux de cet espace</div>
              </div>
              <span className="badge badge-info">
                {espace.travaux.length} travail{espace.travaux.length > 1 ? 's' : ''}
              </span>
            </div>
            {espace.travaux.length === 0 ? (
              <p className="muted">Aucun travail pour le moment.</p>
            ) : (
              <ul className="list-reset space-y-4">
                {espace.travaux.map((travail) => (
                  <li key={travail.id}>
                    <div className="card-title">{travail.titre}</div>
                    <div className="card-subtitle">
                      Type: {travail.type} · Date limite:{' '}
                      {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Étudiants inscrits</div>
              <div className="card-subtitle">Liste des étudiants de cet espace</div>
            </div>
            <span className="badge badge-success">
              {espace.inscriptions.length} étudiant
              {espace.inscriptions.length > 1 ? 's' : ''}
            </span>
          </div>

          {espace.inscriptions.length === 0 ? (
            <p className="muted">Aucun étudiant inscrit pour le moment.</p>
          ) : (
            <ul className="list-reset space-y-4">
              {espace.inscriptions.map((inscription) => (
                <li key={inscription.id}>
                  <div className="card-title">
                    {inscription.etudiant.firstName} {inscription.etudiant.lastName}
                  </div>
                  <div className="card-subtitle">{inscription.etudiant.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="section">
        <Link href="/formateur" className="pill-link">
          Retour à la vue formateur
        </Link>
      </section>
    </>
  )
}

