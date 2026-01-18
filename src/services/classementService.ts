import api from '../utils/api';
import type { ClassementItem } from '../types';

// Fonction pour calculer les rangs avec ex-aequo (version simple)
const calculerRangsAvecExAequo = (donnees: ClassementItem[]): ClassementItem[] => {
  // Trier
  const triees = [...donnees].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.nom !== b.nom) {
      return a.nom.localeCompare(b.nom);
    }
    return a.prenom.localeCompare(b.prenom);
  });

  // Calculer les rangs
  let rang = 1;
  let precedentPoints = triees[0]?.totalPoints;
  
  return triees.map((etudiant, index) => {
    const etudiantCopie = { ...etudiant };
    
    if (index === 0) {
      etudiantCopie.rang = 1;
    } else {
      const estExAequo = Math.abs(etudiantCopie.totalPoints - precedentPoints) < 0.01;
      
      if (estExAequo) {
        // Garder le même rang
        etudiantCopie.rang = rang;
      } else {
        // Nouveau rang = position dans le tableau (index + 1)
        etudiantCopie.rang = index + 1;
        rang = index + 1;
      }
    }
    
    precedentPoints = etudiantCopie.totalPoints;
    return etudiantCopie;
  });
};

export const fetchClassementPromotion = async (
  promotionId: string,
  anneeAcademique: string
): Promise<ClassementItem[]> => {
  try {
    const response = await api.get(`/classements/promotions/${promotionId}`, {
      params: { anneeAcademique },
    });
    
    // Appliquer la logique des rangs avec ex-aequo
    const donneesAvecRangs = calculerRangsAvecExAequo(response.data);
    return donneesAvecRangs;
    
  } catch (error) {
    console.error('Error fetching classement data:', error);
    // Retourner des données simulées pour le développement
    const donneesFiltrees = mockClassementData.filter(
      item => item.promotionId === promotionId && item.anneeAcademique === anneeAcademique
    );
    
    return calculerRangsAvecExAequo(donneesFiltrees);
  }
};

// Fonction pour obtenir le classement avec ex-aequo
export const getClassementAvecExAequo = (donnees: ClassementItem[]): ClassementItem[] => {
  return calculerRangsAvecExAequo(donnees);
};

// Fonction simulée pour les tests avec cas d'ex-aequo
export const mockClassementData: ClassementItem[] = [
  {
    rang: 0,
    etudiantId: '1',
    nom: 'Dupont',
    prenom: 'Jean',
    totalPoints: 95.5,
    nombreEvaluations: 10,
    moyenne: 19.1,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '2',
    nom: 'Martin',
    prenom: 'Marie',
    totalPoints: 95.5, // EX-AEQUO avec Dupont
    nombreEvaluations: 10,
    moyenne: 19.1,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '3',
    nom: 'Bernard',
    prenom: 'Pierre',
    totalPoints: 92.0,
    nombreEvaluations: 10,
    moyenne: 18.4,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '4',
    nom: 'Leroy',
    prenom: 'Sophie',
    totalPoints: 88.5,
    nombreEvaluations: 10,
    moyenne: 17.7,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '5',
    nom: 'Moreau',
    prenom: 'Luc',
    totalPoints: 88.5, // EX-AEQUO avec Leroy
    nombreEvaluations: 10,
    moyenne: 17.7,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '6',
    nom: 'Petit',
    prenom: 'Julie',
    totalPoints: 85.0,
    nombreEvaluations: 10,
    moyenne: 17.0,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
  {
    rang: 0,
    etudiantId: '7',
    nom: 'Durand',
    prenom: 'Paul',
    totalPoints: 82.0,
    nombreEvaluations: 10,
    moyenne: 16.4,
    promotionId: '1',
    anneeAcademique: '2023-2024',
  },
];

// Fonction utilitaire pour tester la logique des ex-aequo
export const testerExAequo = (): ClassementItem[] => {
  console.log('=== TEST LOGIQUE EX-AEQUO ===');
  
  const testData = [
    { totalPoints: 95.5, nom: 'Dupont', prenom: 'Jean' },
    { totalPoints: 95.5, nom: 'Martin', prenom: 'Marie' },
    { totalPoints: 92.0, nom: 'Bernard', prenom: 'Pierre' },
    { totalPoints: 88.5, nom: 'Leroy', prenom: 'Sophie' },
    { totalPoints: 88.5, nom: 'Moreau', prenom: 'Luc' },
    { totalPoints: 85.0, nom: 'Petit', prenom: 'Julie' },
  ].map((item, index) => ({
    rang: 0,
    etudiantId: `test-${index + 1}`,
    nom: item.nom,
    prenom: item.prenom,
    totalPoints: item.totalPoints,
    nombreEvaluations: 10,
    moyenne: item.totalPoints / 5,
    promotionId: 'test',
    anneeAcademique: 'test',
  }));

  const resultat = calculerRangsAvecExAequo(testData);
  
  console.log('Données de test :');
  testData.forEach(e => {
    console.log(`  ${e.prenom} ${e.nom} - ${e.totalPoints} pts`);
  });
  
  console.log('\nRésultat attendu : Rang 1, 1, 3, 4, 4, 6');
  console.log('Résultat obtenu :');
  resultat.forEach(e => {
    console.log(`  Rang ${e.rang}: ${e.prenom} ${e.nom} - ${e.totalPoints} pts`);
  });
  
  // Vérification
  const rangs = resultat.map(e => e.rang);
  const attendu = [1, 1, 3, 4, 4, 6];
  const correct = JSON.stringify(rangs) === JSON.stringify(attendu);
  
  console.log(`\n✅ Test ${correct ? 'PASSÉ' : 'ÉCHOUÉ'}`);
  
  return resultat;
};

// Fonction pour exécuter les tests en développement
export const runTestsEnDev = (): void => {
  // Vérifier si on est en développement (méthode alternative)
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    setTimeout(() => {
      testerExAequo();
    }, 1000);
  }
};

// Fonction pour formater l'affichage dans la console
export const afficherClassementConsole = (donnees: ClassementItem[]): void => {
  console.log('\n📊 CLASSEMENT GÉNÉRAL');
  console.log('='.repeat(80));
  console.log('| Rang | Nom           | Prénom      | Points  | Éval. | Moyenne |');
  console.log('|------|---------------|-------------|---------|-------|---------|');
  
  donnees.forEach(e => {
    console.log(
      `| ${e.rang.toString().padEnd(4)} | ` +
      `${e.nom.padEnd(13)} | ` +
      `${e.prenom.padEnd(11)} | ` +
      `${e.totalPoints.toFixed(2).padStart(7)} | ` +
      `${e.nombreEvaluations.toString().padStart(5)} | ` +
      `${e.moyenne.toFixed(2).padStart(7)} |`
    );
  });
  
  console.log('='.repeat(80));
};

// Exporter toutes les données mock
export const getAllMockData = (): ClassementItem[] => {
  return [...mockClassementData];
};

// Exécuter les tests automatiquement en développement
runTestsEnDev();