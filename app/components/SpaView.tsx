'use client'

import { useEffect, useMemo, useState } from 'react'

type Counts = {
  users: number
  promotions: number
  espaces: number
  travaux: number
  assignations: number
}

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
}

type Promotion = {
  id: string
  name: string
  academicYear: string
}

type Travail = {
  id: string
  titre: string
  type: string
  dateLimite: string | Date
}

type Inscription = {
  id: string
  etudiant: User
}

type Espace = {
  id: string
  titre: string
  matiere: string
  promotion: Promotion
  travaux: Travail[]
  inscriptions: Inscription[]
}

type Assignation = {
  id: string
  statut: string
  note?: number | null
  soumisLe?: string | Date | null
  travail: {
    id: string
    titre: string
    dateLimite: string | Date
    espacePedagogique: {
      titre: string
      matiere: string
      promotion: Promotion
      formateur: User
    }
  }
}

type Actions = {
  createTravail: (formData: FormData) => Promise<void>
  markAssignationAsSubmitted: (formData: FormData) => Promise<void>
}

type Props = {
  counts: Counts
  formateur: User | null
  etudiant: User | null
  espaces: Espace[]
  assignations: Assignation[]
  actions: Actions
}

type View = 'dashboard' | 'formateur' | 'etudiant' | 'espaceDetail'

export default function SpaView(props: Props) {
  const [view, setView] = useState<View>('dashboard')
  const [selectedEspaceId, setSelectedEspaceId] = useState<string | null>(null)

  const selectedEspace = useMemo(() => {
    return props.espaces.find((e) => e.id === selectedEspaceId) ?? null
  }, [selectedEspaceId, props.espaces])

  useEffect(() => {
    const initial = window.location.hash.replace('#', '')
    if (initial === 'formateur' || initial === 'etudiant' || initial === 'dashboard') {
      setView(initial as View)
    }
    const onHash = () => {
      const next = window.location.hash.replace('#', '')
      if (next === 'formateur' || next === 'etudiant' || next === 'dashboard') {
        setView(next as View)
        setSelectedEspaceId(null)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">
          {view === 'dashboard' && 'Tableau de bord'}
          {view === 'formateur' && 'Espace formateur'}
          {view === 'etudiant' && 'Espace étudiant'}
          {view === 'espaceDetail' && selectedEspace?.titre}
        </h1>
        <p className="page-subtitle">
          {view === 'dashboard' &&
            'Vue globale des données actuellement stockées dans PostgreSQL.'}
          {view === 'formateur' &&
            (props.formateur
              ? `Connecté en tant que ${props.formateur.firstName} ${props.formateur.lastName} (${props.formateur.email})`
              : `Gestion des espaces et des travaux`)}
          {view === 'etudiant' &&
            (props.etudiant
              ? `Connecté en tant que ${props.etudiant.firstName} ${props.etudiant.lastName} (${props.etudiant.email})`
              : `Consultation des travaux et assignations`)}
          {view === 'espaceDetail' &&
            selectedEspace &&
            `${selectedEspace.matiere} · ${selectedEspace.promotion.name} (${selectedEspace.promotion.academicYear})`}
        </p>
      </header>

      {view === 'dashboard' && (
        <>
          <div className="grid grid-cols-2-sm grid-cols-3-lg">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Utilisateurs</div>
                  <div className="card-subtitle">Admin, formateurs et étudiants</div>
                </div>
                <span className="chip chip-primary">Global</span>
              </div>
              <div className="card-value">{props.counts.users}</div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Promotions</div>
                  <div className="card-subtitle">Années académiques actives</div>
                </div>
                <span className="chip chip-accent">Pédagogie</span>
              </div>
              <div className="card-value">{props.counts.promotions}</div>
            </div>

            <button
              type="button"
              className="card"
              onClick={() => setView('formateur')}
              style={{ textAlign: 'left' }}
            >
              <div className="card-header">
                <div>
                  <div className="card-title">Espaces pédagogiques</div>
                  <div className="card-subtitle">Matières et cours</div>
                </div>
              </div>
              <div className="card-value">{props.counts.espaces}</div>
            </button>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Travaux</div>
                  <div className="card-subtitle">Devoirs et projets</div>
                </div>
              </div>
              <div className="card-value">{props.counts.travaux}</div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Assignations</div>
                  <div className="card-subtitle">Travaux attribués aux étudiants</div>
                </div>
              </div>
              <div className="card-value">{props.counts.assignations}</div>
            </div>
          </div>

          <section className="section">
            <h2 className="section-title">Accès rapide</h2>
            <p className="muted">Choisis une vue à ouvrir dans cette même page.</p>
            <div className="pill-row">
              <button className="pill-link" onClick={() => setView('formateur')}>
                Espace formateur
              </button>
              <button className="pill-link pill-link-secondary" onClick={() => setView('etudiant')}>
                Espace étudiant
              </button>
            </div>
          </section>
        </>
      )}

      {view === 'formateur' && (
        <>
          {props.espaces.length === 0 ? (
            <p className="muted">Aucun espace pédagogique trouvé.</p>
          ) : (
            <div className="stacked-cards">
              <div className="space-y-4">
                {props.espaces.map((espace) => (
                  <div key={espace.id} className="card">
                    <div className="card-header">
                      <div>
                        <button
                          className="card-title"
                          onClick={() => {
                            setSelectedEspaceId(espace.id)
                            setView('espaceDetail')
                          }}
                          style={{ background: 'transparent', border: 0, padding: 0, color: 'inherit', cursor: 'pointer' }}
                        >
                          {espace.titre}
                        </button>
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
                                Date limite: {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
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
                {props.espaces.length === 0 ? (
                  <p className="muted">Créez d&apos;abord un espace pédagogique.</p>
                ) : (
                  <form action={props.actions.createTravail} className="space-y-4">
                    <div>
                      <label>
                        <div className="card-subtitle">Espace</div>
                        <select
                          name="espaceId"
                          defaultValue={props.espaces[0]?.id}
                          style={{
                            width: '100%',
                            marginTop: 4,
                            padding: '0.4rem 0.5rem',
                            borderRadius: 999,
                            border: '1px solid rgba(148,163,184,0.6)',
                            backgroundColor: 'rgba(15,23,42,0.9)',
                            color: '#e5e7eb'
                          }}
                        >
                          {props.espaces.map((espace) => (
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

          <section className="section">
            <button className="pill-link" onClick={() => setView('dashboard')}>
              Retour au tableau de bord
            </button>
          </section>
        </>
      )}

      {view === 'etudiant' && (
        <>
          {props.assignations.length === 0 ? (
            <p className="muted">Aucune assignation trouvée.</p>
          ) : (
            <div className="stacked-cards">
              <div className="space-y-4">
                {props.assignations.map((assignation) => {
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
                        Date limite: {new Date(travail.dateLimite).toLocaleDateString('fr-FR')}
                      </p>

                      <div className="pill-row">
                        {assignation.note != null && (
                          <span className="pill">
                            Note: <strong style={{ marginLeft: 4 }}>{assignation.note}</strong>
                          </span>
                        )}
                        {assignation.soumisLe && (
                          <span className="pill">
                            Soumis le: {new Date(assignation.soumisLe).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                        {assignation.statut === 'A_RENDRE' && (
                          <form action={props.actions.markAssignationAsSubmitted}>
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
                  Utilise cette vue comme tableau de bord de tes travaux à rendre. Tu peux
                  facilement repérer les dates limites, la promotion et le formateur associé à
                  chaque travail.
                </p>
              </div>
            </div>
          )}

          <section className="section">
            <button className="pill-link" onClick={() => setView('dashboard')}>
              Retour au tableau de bord
            </button>
          </section>
        </>
      )}

      {view === 'espaceDetail' && selectedEspace && (
        <>
          <div className="stacked-cards">
            <div className="space-y-4">
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Travaux</div>
                    <div className="card-subtitle">Tous les travaux de cet espace</div>
                  </div>
                  <span className="badge badge-info">
                    {selectedEspace.travaux.length} travail
                    {selectedEspace.travaux.length > 1 ? 's' : ''}
                  </span>
                </div>
                {selectedEspace.travaux.length === 0 ? (
                  <p className="muted">Aucun travail pour le moment.</p>
                ) : (
                  <ul className="list-reset space-y-4">
                    {selectedEspace.travaux.map((travail) => (
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
                  {selectedEspace.inscriptions.length} étudiant
                  {selectedEspace.inscriptions.length > 1 ? 's' : ''}
                </span>
              </div>

              {selectedEspace.inscriptions.length === 0 ? (
                <p className="muted">Aucun étudiant inscrit pour le moment.</p>
              ) : (
                <ul className="list-reset space-y-4">
                  {selectedEspace.inscriptions.map((inscription) => (
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
            <div className="pill-row">
              <button className="pill-link" onClick={() => setView('formateur')}>
                Retour à la vue formateur
              </button>
              <button
                className="pill-link pill-link-secondary"
                onClick={() => {
                  setSelectedEspaceId(null)
                  setView('dashboard')
                }}
              >
                Retour au tableau de bord
              </button>
            </div>
          </section>
        </>
      )}
    </>
  )
}
