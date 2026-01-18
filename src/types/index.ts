// src/types/index.ts

// Définir UserRole comme objet const
export const UserRole = {
  DIRECTEUR_ETUDES: 'DIRECTEUR_ETUDES',
  FORMATEUR: 'FORMATEUR',
  ETUDIANT: 'ETUDIANT',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Interface pour l'utilisateur authentifié
export interface AuthUser {
  id: string;
  email: string;
  role: UserRoleType;
  nom: string;
  prenom: string;
}

// Interface Promotion
export interface Promotion {
  id: string;
  nom: string;
  anneeDebut: number;
  anneeFin: number;
}

// Interface AnneeAcademique
export interface AnneeAcademique {
  id: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  code?: string;
  isActive?: boolean;
}

// Interface FiltresClassement
export interface FiltresClassement {
  promotionId: string;
  anneeAcademique: string;
}

// Interface ClassementItem
export interface ClassementItem {
  rang: number;
  etudiantId: string;
  nom: string;
  prenom: string;
  totalPoints: number;
  nombreEvaluations: number;
  moyenne: number;
  promotionId: string;
  anneeAcademique: string;
}