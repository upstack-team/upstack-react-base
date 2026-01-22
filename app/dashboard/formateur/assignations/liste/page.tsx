'use client'

import { useState, useEffect } from 'react'

interface Assignation {
  id: string
  statut: string
  dateAssignation: string
  dateLivraison: string | null
  note: number | null
  travail: {
    titre: string
    bareme: number
    dateLimite: string
    espacePedagogique: {
      nom: string
    }
  }
  etudiant: {
    user: {
      nom: string
      prenom: string
      email: string
    }
  }
}

export default function ListeAssignationsPage() {
  const [assignations, setAssignations] = useState<Assignation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadAssignations()
  }, [])

  const loadAssignations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/assignations')
      if (res.ok) {
        const data = await res.json()
        setAssignations(data.assignations || [])
      }
    } catch (error) {
      console.error('Erreur chargement assignations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssignations = assignations.filter(a => {
    if (filter === 'all') return true
    return a.statut === filter
  })

  const getStatutBadge = (statut: string) => {
    const styles = {
      ASSIGNE: 'bg-blue-100 text-blue-800 border-blue-200',
      LIVRE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      EVALUE: 'bg-green-100 text-green-800 border-green-200'
    }
    const labels = {
      ASSIGNE: '📝 Assigné',
      LIVRE: '📤 Livré',
      EVALUE: '✅ Évalué'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statut as keyof typeof styles]}`}>
        {labels[statut as keyof typeof labels] || statut}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des assignations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Liste des assignations
            </h1>
            <p className="text-gray-600">
              {assignations.length} assignation{assignations.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <a
            href="/dashboard/formateur/assignations"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            ➕ Nouvelle assignation
          </a>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filtrer par statut :</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({assignations.length})
          </button>
          <button
            onClick={() => setFilter('ASSIGNE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'ASSIGNE' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Assignés ({assignations.filter(a => a.statut === 'ASSIGNE').length})
          </button>
          <button
            onClick={() => setFilter('LIVRE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'LIVRE' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Livrés ({assignations.filter(a => a.statut === 'LIVRE').length})
          </button>
          <button
            onClick={() => setFilter('EVALUE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'EVALUE' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Évalués ({assignations.filter(a => a.statut === 'EVALUE').length})
          </button>
        </div>
      </div>

      {/* Liste des assignations */}
      {filteredAssignations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune assignation trouvée
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Commencez par créer une nouvelle assignation'
              : `Aucune assignation avec le statut "${filter}"`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignations.map(assignation => (
            <div key={assignation.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {assignation.travail.titre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📚 {assignation.travail.espacePedagogique.nom}
                  </p>
                </div>
                {getStatutBadge(assignation.statut)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Étudiant</p>
                  <p className="font-semibold text-gray-800">
                    {assignation.etudiant.user.prenom} {assignation.etudiant.user.nom}
                  </p>
                  <p className="text-sm text-gray-600">{assignation.etudiant.user.email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Dates</p>
                  <p className="text-sm text-gray-700">
                    <strong>Assigné le :</strong> {new Date(assignation.dateAssignation).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Date limite :</strong> {new Date(assignation.travail.dateLimite).toLocaleDateString('fr-FR')}
                  </p>
                  {assignation.dateLivraison && (
                    <p className="text-sm text-gray-700">
                      <strong>Livré le :</strong> {new Date(assignation.dateLivraison).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Barème : <strong>{assignation.travail.bareme}/20</strong>
                  </span>
                  {assignation.note !== null && (
                    <span className="text-sm text-gray-600">
                      Note : <strong className="text-green-600">{assignation.note}/20</strong>
                    </span>
                  )}
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                  Voir détails →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
