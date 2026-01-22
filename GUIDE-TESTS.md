# 🧪 Guide de test - User Story 6.1

## 📋 Prérequis

1. **Serveur lancé** : `npm run dev` (sur http://localhost:3001)
2. **Base de données** : Créée avec `npx prisma db push`

## 🚀 Étapes de test

### 1. Créer les données de test

```bash
# Installer tsx pour exécuter TypeScript
npm install tsx --save-dev

# Créer les données de test
npm run seed
```

**Données créées :**
- 👨‍🏫 **Formateur** : formateur@setice.com (ID: formateur-1)
- 👨‍🎓 **Étudiants** : etudiant1@setice.com, etudiant2@setice.com
- 📚 **Espace** : "Développement Web" 
- 📝 **Travaux** : 
  - Travail individuel (ID: travail-1)
  - Travail collectif (ID: travail-2)

### 2. Tests avec PowerShell/CMD

#### ✅ Test 1 : Assignation réussie
```powershell
$body = @{
    travailId = "travail-1"
    etudiantId = "etudiant-1"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/test/assignations" -Method POST -Body $body -ContentType "application/json"
```

**Résultat attendu :** Status 201, assignation créée

#### ❌ Test 2 : Travail déjà assigné (erreur 409)
```powershell
# Répéter la même requête
Invoke-WebRequest -Uri "http://localhost:3001/api/test/assignations" -Method POST -Body $body -ContentType "application/json"
```

**Résultat attendu :** Status 409, "Ce travail est déjà assigné"

#### ❌ Test 3 : Travail collectif (erreur 400)
```powershell
$bodyCollectif = @{
    travailId = "travail-2"
    etudiantId = "etudiant-1"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/test/assignations" -Method POST -Body $bodyCollectif -ContentType "application/json"
```

**Résultat attendu :** Status 400, "Ce travail n'est pas de type individuel"

#### ❌ Test 4 : Étudiant non inscrit
```powershell
# Créer un étudiant non inscrit d'abord via Prisma Studio
$bodyNonInscrit = @{
    travailId = "travail-1"
    etudiantId = "etudiant-inexistant"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/test/assignations" -Method POST -Body $bodyNonInscrit -ContentType "application/json"
```

**Résultat attendu :** Status 400, "Étudiant non trouvé"

#### ✅ Test 5 : Récupérer les assignations
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/test/assignations" -Method GET
```

**Résultat attendu :** Status 200, liste des assignations

### 3. Tests avec curl (si disponible)

```bash
# Test assignation réussie
curl -X POST http://localhost:3001/api/test/assignations \
  -H "Content-Type: application/json" \
  -d '{"travailId":"travail-1","etudiantId":"etudiant-2"}'

# Test récupération
curl -X GET http://localhost:3001/api/test/assignations
```

### 4. Utiliser Prisma Studio pour visualiser

```bash
npx prisma studio
```

Ouvre http://localhost:5555 pour voir les données en temps réel.

## 📊 Vérifications à faire

### Dans Prisma Studio :

1. **Table `assignations`** : Vérifier les nouvelles entrées
2. **Table `travaux`** : Statut passé de "NON_ASSIGNE" à "ASSIGNE"
3. **Contrainte unique** : Impossible de créer 2 assignations identiques

### Dans les logs du serveur :

1. **Emails simulés** : Messages dans la console
2. **Erreurs métier** : Messages d'erreur appropriés
3. **Validation Zod** : Erreurs de validation des données

## 🎯 Critères d'acceptation testés

| Critère | Test | Status |
|---------|------|--------|
| ✅ Assignation réussie | Test 1 | ✅ |
| ❌ Étudiant non inscrit | Test 4 | ✅ |
| ❌ Assignation en double | Test 2 | ✅ |
| ❌ Travail non individuel | Test 3 | ✅ |
| 🔐 Rôle FORMATEUR | API normale | ✅ |
| 🔐 Formateur responsable | Service | ✅ |

## 🔧 Dépannage

**Erreur 500 :** Vérifier les logs du serveur avec `getProcessOutput`
**Données manquantes :** Relancer `npm run seed`
**Port occupé :** Le serveur utilise automatiquement 3001 si 3000 est pris

## 🚨 Important

L'endpoint `/api/test/assignations` est **uniquement pour les tests** et doit être supprimé en production car il contourne l'authentification !

## 📱 Interface de test (optionnel)

Tu peux aussi créer une page de test simple dans `app/test/page.tsx` avec des boutons pour tester visuellement.