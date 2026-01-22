'use client'

import { useState, useEffect } from 'react'

interface Travail {
  id: string
  titre: string
  description: string | null
  type: string
  dateLimite: string
  bareme: number
  espacePedagogique: {
    id: string
    nom: string
  }
}

interface Etudiant {
  id: string
  user: {
    nom: string
    prenom: string
    email: string
  }
}

export default function AssignationsPage() {
  const [travaux, setTravaux] = useState<Travail[]>([])
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [selectedTravail, setSelectedTravail] = useState('')
  const [selectedEtudiant, setSelectedEtudiant] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Charger les travaux et étudiants au montage
  useEffect(() => {
    loadData()
  }, [])

  // Charger les étudiants quand un travail est sélectionné
  useEffect(() => {
    if (selectedTravail) {
      loadEtudiants(selectedTravail)
    }
  }, [selectedTravail])

  const loadData = async () => {
    try {
      setLoadingData(true)
      const res = await fetch('/api/v1/travaux?type=INDIVIDUEL')
      if (res.ok) {
        const data = await res.json()
        setTravaux(data.travaux || [])
      }
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const loadEtudiants = async (travailId: string) => {
    try {
      const travail = travaux.find(t => t.id === travailId)
      if (!travail) return

      const res = await fetch(`/api/v1/etudiants?espacePedagogiqueId=${travail.espacePedagogique.id}`)
      if (res.ok) {
        const data = await res.json()
        setEtudiants(data.etudiants || [])
      }
    } catch (error) {
      console.error('Erreur chargement étudiants:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTravail || !selectedEtudiant) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un travail et un étudiant' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/v1/assignations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travailId: selectedTravail,
          etudiantId: selectedEtudiant
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Travail assigné avec succès ! L\'étudiant a été notifié par email.' })
        setSelectedTravail('')
        setSelectedEtudiant('')
        setEtudiants([])
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'assignation' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' })
    } finally {
      setLoading(false)
    }
  }

  const selectedTravailData = travaux.find(t => t.id === selectedTravail)

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📋 Assigner un travail individuel
        </h1>
        <p className="text-gray-600">
          Sélectionnez un travail et un étudiant pour créer une assignation
        </p>
      </div>

      {/* Message de feedback */}
      {message && (
        <div className={`rounded-lg p-4 mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-start">
            <span className="text-xl mr-3">
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            <p className="flex-1">{message.text}</p>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Sélection du travail */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1️⃣ Sélectionner un travail individuel
          </label>
          <select
            value={selectedTravail}
            onChange={(e) => {
              setSelectedTravail(e.target.value)
              setSelectedEtudiant('')
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">-- Choisir un travail --</option>
            {travaux.map(travail => (
              <option key={travail.id} value={travail.id}>
                {travail.titre} - {travail.espacePedagogique.nom} (Barème: {travail.bareme}/20)
              </option>
            ))}
          </select>
          {travaux.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucun travail individuel disponible
            </p>
          )}
        </div>

        {/* Détails du travail sélectionné */}
        {selectedTravailData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Détails du travail</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Espace :</strong> {selectedTravailData.espacePedagogique.nom}</p>
              <p><strong>Date limite :</strong> {new Date(selectedTravailData.dateLimite).toLocaleDateString('fr-FR')}</p>
              <p><strong>Barème :</strong> {selectedTravailData.bareme}/20</p>
              {selectedTravailData.description && (
                <p><strong>Description :</strong> {selectedTravailData.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Sélection de l'étudiant */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2️⃣ Sélectionner un étudiant inscrit
          </label>
          <select
            value={selectedEtudiant}
            onChange={(e) => setSelectedEtudiant(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedTravail || loading}
          >
            <option value="">-- Choisir un étudiant --</option>
            {etudiants.map(etudiant => (
              <option key={etudiant.id} value={etudiant.id}>
                {etudiant.user.prenom} {etudiant.user.nom} ({etudiant.user.email})
              </option>
            ))}
          </select>
          {selectedTravail && etudiants.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucun étudiant inscrit dans cet espace pédagogique
            </p>
          )}
          {!selectedTravail && (
            <p className="text-sm text-gray-500 mt-2">
              Sélectionnez d'abord un travail
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              setSelectedTravail('')
              setSelectedEtudiant('')
              setEtudiants([])
              setMessage(null)
            }}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={!selectedTravail || !selectedEtudiant || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assignation en cours...
              </span>
            ) : (
              '✓ Assigner le travail'
            )}
          </button>
        </div>
      </form>

      {/* Informations supplémentaires */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">ℹ️ Informations</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Seuls les travaux de type INDIVIDUEL peuvent être assignés</li>
          <li>L'étudiant doit être inscrit dans l'espace pédagogique du travail</li>
          <li>Un travail ne peut pas être assigné deux fois au même étudiant</li>
          <li>L'étudiant recevra automatiquement un email de notification</li>
        </ul>
      </div>
    </div>
  )
}
