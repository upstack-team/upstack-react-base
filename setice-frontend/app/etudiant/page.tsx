'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, CheckCircle, Clock, GraduationCap } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { api } from '@/lib/api'
import { Role, type Assignation, type Evaluation, StatutAssignation } from '@/types/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { LogoutButton } from '@/components/LogoutButton'

export default function EtudiantDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [assignations, setAssignations] = useState<Assignation[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== Role.ETUDIANT) return

      setIsLoading(true)
      try {
        const [assignationsRes, evaluationsRes] = await Promise.all([
          api.getMyAssignations(),
          api.getMyEvaluations(),
        ])

        if (assignationsRes.success && assignationsRes.data) setAssignations(assignationsRes.data)
        if (evaluationsRes.success && evaluationsRes.data) setEvaluations(evaluationsRes.data)
      } catch (error) {
        console.error('Erreur fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-10 w-10 text-teal-600" />
      </div>
    )
  }

  if (user.role !== Role.ETUDIANT) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500 font-semibold text-lg">Accès refusé</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-10 w-10 text-teal-600" />
      </div>
    )
  }

  const pendingAssignations = assignations.filter(a => a.statut === StatutAssignation.ASSIGNE)
  const deliveredAssignations = assignations.filter(a => a.statut === StatutAssignation.LIVRE)
  const evaluatedAssignations = assignations.filter(a => a.statut === StatutAssignation.EVALUE)

  const averageGrade =
    evaluations.length > 0
      ? (evaluations.reduce((acc, e) => acc + e.note, 0) / evaluations.length).toFixed(2)
      : '---'

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bonjour, {user.prenom} 👋</h1>
          <p className="text-gray-500 mt-1">Bienvenue sur votre tableau de bord étudiant</p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
          <Link href="/etudiant/evaluations" className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Voir mes notes
          </Link>
        </Button>
        <LogoutButton />

      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">À rendre</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{pendingAssignations.length}</div>
            <p className="text-xs text-gray-400 mt-1">Travaux en attente</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Livrés</CardTitle>
            <ClipboardList className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{deliveredAssignations.length}</div>
            <p className="text-xs text-gray-400 mt-1">En cours de correction</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Évalués</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{evaluatedAssignations.length}</div>
            <p className="text-xs text-gray-400 mt-1">Travaux notés</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Moyenne</CardTitle>
            <GraduationCap className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{averageGrade}</div>
            <p className="text-xs text-gray-400 mt-1">Sur {evaluations.length} notes</p>
          </CardContent>
        </Card>
      </div>

      {/* Travaux et Notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Travaux à rendre</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pendingAssignations.length === 0 ? (
              <p className="text-center text-gray-400 py-4">Aucun travail en attente</p>
            ) : (
              pendingAssignations.slice(0, 5).map(assignation => (
                <Link
                  key={assignation.id}
                  href={`etudiant/travaux/${assignation.travail?.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-800">{assignation.travail?.titre}</p>
                    <p className="text-sm text-gray-500">
                      {assignation.travail?.espacePedagogique?.matiere?.libelle || 'Matière'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {new Date(assignation.travail?.dateLimite).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-400">Date limite</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {evaluations.length === 0 ? (
              <p className="text-center text-gray-400 py-4">Aucune évaluation</p>
            ) : (
              evaluations.slice(0, 5).map(evaluation => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{evaluation.assignation?.travail?.titre}</p>
                    <p className="text-sm text-gray-500">
                      {evaluation.assignation?.travail?.espacePedagogique?.matiere?.libelle || 'Matière'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-teal-600">
                      {evaluation.note}/{evaluation.assignation?.travail?.bareme}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
