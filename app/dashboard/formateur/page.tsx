'use client'

import Link from 'next/link'

export default function DashboardFormateurPage() {
  const cards = [
    {
      title: '📋 Assigner un travail',
      description: 'Créer une nouvelle assignation de travail individuel à un étudiant',
      href: '/dashboard/formateur/assignations',
      color: 'from-blue-500 to-indigo-600',
      icon: '➕'
    },
    {
      title: '📊 Liste des assignations',
      description: 'Consulter et gérer toutes les assignations existantes',
      href: '/dashboard/formateur/assignations/liste',
      color: 'from-purple-500 to-pink-600',
      icon: '📝'
    },
    {
      title: '👥 Mes étudiants',
      description: 'Voir la liste des étudiants inscrits dans vos espaces',
      href: '/dashboard/formateur/etudiants',
      color: 'from-green-500 to-teal-600',
      icon: '🎓'
    },
    {
      title: '📚 Mes travaux',
      description: 'Gérer les travaux créés dans vos espaces pédagogiques',
      href: '/dashboard/formateur/travaux',
      color: 'from-orange-500 to-red-600',
      icon: '📖'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          👨‍🏫 Tableau de bord Formateur
        </h1>
        <p className="text-lg text-gray-600">
          Bienvenue sur votre espace de gestion des travaux et assignations
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-3xl font-bold mb-1">-</div>
          <div className="text-sm opacity-90">Assignations actives</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold mb-1">-</div>
          <div className="text-sm opacity-90">Travaux évalués</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-3xl font-bold mb-1">-</div>
          <div className="text-sm opacity-90">Étudiants inscrits</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-3xl font-bold mb-1">-</div>
          <div className="text-sm opacity-90">Espaces pédagogiques</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Informations US 6.1 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          ℹ️ User Story 6.1 - Assignation d'un travail individuel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">✅ Fonctionnalités implémentées :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Assignation de travaux individuels</li>
              <li>Vérification des inscriptions</li>
              <li>Prévention des doublons</li>
              <li>Notification par email</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔒 Contrôles de sécurité :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Authentification requise</li>
              <li>Rôle FORMATEUR vérifié</li>
              <li>Propriété de l'espace validée</li>
              <li>Type de travail contrôlé</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
