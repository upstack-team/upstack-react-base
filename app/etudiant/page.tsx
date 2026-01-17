import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'

async function markAssignationAsSubmitted(formData: FormData) {
  'use server'

  const assignationId = formData.get('assignationId')?.toString()

  if (!assignationId) {
    return
  }

  await prisma.assignation.update({
    where: { id: assignationId },
    data: {
      statut: 'RENDU',
      soumisLe: new Date()
    }
  })

  revalidatePath('/etudiant')
}

export default async function EtudiantPage() {
  const etudiant = await prisma.user.findFirst({
    where: { email: 'etudiant@setice.local' }
  })

  if (!etudiant) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">Vue étudiant</h1>
          <p className="page-subtitle">L&apos;étudiant de seed est introuvable.</p>
        </header>
      </>
    )
  }

  const assignations = await prisma.assignation.findMany({
    where: { etudiantId: etudiant.id },
    include: {
      travail: {
        include: {
          espacePedagogique: {
            include: {
              promotion: true,
              formateur: true
            }
          }
        }
      }
    }
  })

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Vue étudiant</h1>
        <p className="page-subtitle">
          Connecté en tant que {etudiant.firstName} {etudiant.lastName} ({etudiant.email})
        </p>
      </header>

      {assignations.length === 0 ? (
        <p className="muted">Aucune assignation trouvée.</p>
      ) : (
        <div className="stacked-cards">
          <div className="space-y-4">
            {assignations.map((assignation) => {
              const travail = assignation.travail
              const espace = travail.espacePedagogique

              return (
                <div key={assignation.id} className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{travail.titre}</div>
                      <div className="card-subtitle">
                        {espace.titre} · {espace.matiere}
                      </div>
                    </div>
                    <span
                      className={
                        assignation.statut === 'A_RENDRE'
                          ? 'badge badge-warning'
                          : 'badge badge-success'
                      }
                    >
                      {assignation.statut}
                    </span>
                  </div>

                  <div className="divider" />

                  <p className="card-subtitle">
                    Promotion: {espace.promotion.name} ({espace.promotion.academicYear})
                  </p>
                  <p className="card-subtitle">
                    Formateur: {espace.formateur.firstName} {espace.formateur.lastName} (
                    {espace.formateur.email})
                  </p>
                  <p className="card-subtitle">
                    Date limite:{' '}
                    {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
                  </p>

                  <div className="pill-row">
                    {assignation.note != null && (
                      <span className="pill">
                        Note: <strong style={{ marginLeft: 4 }}>{assignation.note}</strong>
                      </span>
                    )}
                    {assignation.soumisLe && (
                      <span className="pill">
                        Soumis le:{' '}
                        {new Date(assignation.soumisLe).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {assignation.statut === 'A_RENDRE' && (
                      <form action={markAssignationAsSubmitted}>
                        <input type="hidden" name="assignationId" value={assignation.id} />
                        <button type="submit" className="pill-link">
                          Marquer comme rendu
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Conseil</div>
                <div className="card-subtitle">Organisation de tes travaux</div>
              </div>
              <span className="chip chip-primary">Étudiant</span>
            </div>
            <p className="muted">
              Utilise cette vue comme tableau de bord de tes travaux à rendre. Tu peux facilement
              repérer les dates limites, la promotion et le formateur associé à chaque travail.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
