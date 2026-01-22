# User Story 6.1 - Assignation d'un travail individuel

## 📋 Implémentation complète

Cette implémentation permet à un formateur d'assigner un travail individuel à un étudiant spécifique avec toutes les vérifications métier requises.

## 🏗️ Architecture

```
src/
├── services/assignation.service.ts    # Logique métier
├── schemas/assignation.schema.ts       # Validation Zod
└── types/assignation.types.ts          # Types TypeScript

app/api/v1/assignations/
└── route.ts                           # API endpoints

prisma/
├── schema-additions.prisma            # Modèles à ajouter
└── migrations/add_assignation_system.sql
```

## 🚀 Installation

### 1. Mise à jour du schéma Prisma

Ajouter le contenu de `prisma/schema-additions.prisma` à votre fichier `prisma/schema.prisma` existant :

```bash
# Copier les modèles, enums et relations dans schema.prisma
# Puis exécuter la migration
npx prisma db push
# ou
npx prisma migrate dev --name add-assignation-system
```

### 2. Vérifier les dépendances

Assurez-vous d'avoir ces packages installés :

```bash
npm install @prisma/client zod next-auth
```

## 📡 API Endpoints

### POST /api/v1/assignations

Assigne un travail individuel à un étudiant (FORMATEUR uniquement).

**Body :**
```json
{
  "travailId": "uuid-du-travail",
  "etudiantId": "uuid-de-letudiant"
}
```

**Réponses :**
- `201` : Assignation réussie
- `400` : Données invalides / Étudiant non inscrit / Travail non individuel
- `401` : Non authentifié
- `403` : Accès refusé / Formateur non responsable
- `404` : Travail non trouvé
- `409` : Travail déjà assigné

### GET /api/v1/assignations

Récupère les assignations selon le rôle :
- **FORMATEUR** : Assignations de ses espaces pédagogiques
- **ETUDIANT** : Ses propres assignations

**Query params optionnels :**
- `etudiantId` : Filtrer par étudiant (formateur uniquement)
- `travailId` : Filtrer par travail
- `statut` : Filtrer par statut (ASSIGNE, LIVRE, EVALUE)

## 🔐 Sécurité

### Vérifications automatiques :

1. **Authentification** : Session NextAuth requise
2. **Autorisation** : Rôle FORMATEUR pour l'assignation
3. **Propriété** : Formateur responsable de l'espace pédagogique
4. **Inscription** : Étudiant inscrit dans l'espace
5. **Type de travail** : Uniquement les travaux INDIVIDUELS
6. **Unicité** : Pas de double assignation (contrainte DB)

## 📧 Notifications

Envoi automatique d'un email à l'étudiant lors de l'assignation avec :
- Titre du travail
- Description
- Date limite
- Barème
- Nom de l'espace pédagogique

## 🧪 Tests

### Test manuel avec curl :

```bash
# Assignation d'un travail
curl -X POST http://localhost:3000/api/v1/assignations \
  -H "Content-Type: application/json" \
  -d '{
    "travailId": "uuid-travail",
    "etudiantId": "uuid-etudiant"
  }'

# Récupération des assignations
curl -X GET http://localhost:3000/api/v1/assignations
```

## 🎯 Critères d'acceptation

✅ **Assignation réussie** : Travail → Étudiant inscrit → Email  
✅ **Étudiant non inscrit** : Erreur "L'étudiant n'est pas inscrit dans cet espace"  
✅ **Assignation en double** : Erreur 409 "Ce travail est déjà assigné"  
✅ **Travail non individuel** : Erreur si travail collectif  
✅ **Rôle FORMATEUR** : Vérification NextAuth  
✅ **Formateur responsable** : Vérification propriété de l'espace  

## 🔄 Prochaines étapes

1. Ajouter les modèles Prisma à votre schéma existant
2. Exécuter la migration de base de données
3. Tester les endpoints
4. Intégrer dans votre interface utilisateur

## 🐛 Dépannage

**Erreur Prisma** : Vérifiez que tous les modèles référencés (User, Formateur, Etudiant, EspacePedagogique) existent dans votre schéma.

**Erreur d'import** : Vérifiez les chemins d'import selon votre structure de projet (notamment `@/lib/prisma` et `@/lib/auth`).

**Erreur email** : Assurez-vous que le service `@/lib/email` est configuré et fonctionnel.