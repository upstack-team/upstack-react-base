/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { UserRole } from '../types';

// Corrigez l'interface AuthUser pour inclure la propriété 'role'
interface AuthUser {
  id: string;
  email: string;
  role: string; // Ajoutez cette ligne
  nom: string;
  prenom: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage ou l'API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const isDirecteurEtudes = user?.role === UserRole.DIRECTEUR_ETUDES;
  const isFormateur = user?.role === UserRole.FORMATEUR;
  const isEtudiant = user?.role === UserRole.ETUDIANT;

  return {
    user,
    loading,
    isDirecteurEtudes,
    isFormateur,
    isEtudiant,
  };
};