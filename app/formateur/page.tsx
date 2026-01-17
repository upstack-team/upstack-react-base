import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'

async function createTravail(formData: FormData) {
  'use server'

  const espaceId = formData.get('espaceId')?.toString()
  const titre = formData.get('titre')?.toString()
  const type = formData.get('type')?.toString()
  const dateLimiteStr = formData.get('dateLimite')?.toString()

  if (!espaceId || !titre || !type || !dateLimiteStr) {
    return
  }

  const dateLimite = new Date(dateLimiteStr)

  await prisma.travail.create({
    data: {
      titre,
      type,
      dateLimite,
      espacePedagogiqueId: espaceId
    }
  })

  revalidatePath('/formateur')
}

export default async function FormateurPage() {
  const formateur = await prisma.user.findFirst({
    where: { email: 'formateur@setice.local' }
  })

  if (!formateur) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">Vue formateur</h1>
          <p className="page-subtitle">Le formateur de seed est introuvable.</p>
        </header>
      </>
    )
  }

  const espaces = await prisma.espacePedagogique.findMany({
    where: { formateurId: formateur.id },
    include: {
      promotion: true,
      travaux: true
    }
  })

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Vue formateur</h1>
        <p className="page-subtitle">
          Connecté en tant que {formateur.firstName} {formateur.lastName} ({formateur.email})
        </p>
      </header>

      {espaces.length === 0 ? (
        <p className="muted">Aucun espace pédagogique trouvé.</p>
      ) : (
        <div className="stacked-cards">
          <div className="space-y-4">
            {espaces.map((espace) => (
              <div key={espace.id} className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      <Link href={`/formateur/espaces/${espace.id}`}>{espace.titre}</Link>
                    </div>
                    <div className="card-subtitle">
                      {espace.matiere} · {espace.promotion.name} ({espace.promotion.academicYear})
                    </div>
                  </div>
                  <span className="badge badge-info">
                    {espace.travaux.length} travail{espace.travaux.length > 1 ? 's' : ''}
                  </span>
                </div>

                {espace.travaux.length > 0 && (
                  <>
                    <div className="divider" />
                    <ul className="list-reset space-y-4">
                      {espace.travaux.map((travail) => (
                        <li key={travail.id}>
                          <div className="card-title">{travail.titre}</div>
                          <div className="card-subtitle">
                            Date limite:{' '}
                            {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Nouveau travail</div>
                <div className="card-subtitle">Créer un devoir pour un espace</div>
              </div>
              <span className="chip chip-primary">Formateur</span>
            </div>
            {espaces.length === 0 ? (
              <p className="muted">Créez d&apos;abord un espace pédagogique.</p>
            ) : (
              <form action={createTravail} className="space-y-4">
                <div>
                  <label>
                    <div className="card-subtitle">Espace</div>
                    <select
                      name="espaceId"
                      style={{
                        width: '100%',
                        marginTop: 4,
                        padding: '0.4rem 0.5rem',
                        borderRadius: 999,
                        border: '1px solid rgba(148,163,184,0.6)',
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        color: '#e5e7eb'
                      }}
                      defaultValue={espaces[0]?.id}
                    >
                      {espaces.map((espace) => (
                        <option key={espace.id} value={espace.id}>
                          {espace.titre} · {espace.promotion.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    <div className="card-subtitle">Titre</div>
                    <input
                      name="titre"
                      type="text"
                      required
                      placeholder="Ex: TP 2 – API REST"
                      style={{
                        width: '100%',
                        marginTop: 4,
                        padding: '0.4rem 0.75rem',
                        borderRadius: 999,
                        border: '1px solid rgba(148,163,184,0.6)',
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        color: '#e5e7eb'
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <div className="card-subtitle">Type</div>
                    <input
                      name="type"
                      type="text"
                      required
                      placeholder="DEVOIR, PROJET..."
                      style={{
                        width: '100%',
                        marginTop: 4,
                        padding: '0.4rem 0.75rem',
                        borderRadius: 999,
                        border: '1px solid rgba(148,163,184,0.6)',
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        color: '#e5e7eb'
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <div className="card-subtitle">Date limite</div>
                    <input
                      name="dateLimite"
                      type="date"
                      required
                      style={{
                        width: '100%',
                        marginTop: 4,
                        padding: '0.4rem 0.75rem',
                        borderRadius: 999,
                        border: '1px solid rgba(148,163,184,0.6)',
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        color: '#e5e7eb'
                      }}
                    />
                  </label>
                </div>
                <button type="submit" className="pill-link">
                  Créer le travail
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
