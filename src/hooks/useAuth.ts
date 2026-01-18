// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
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