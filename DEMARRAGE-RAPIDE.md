# 🚀 Démarrage Rapide - US 6.1

## ⚡ En 3 commandes

```bash
# 1. Installer les dépendances (si pas déjà fait)
npm install

# 2. Générer les données de test
npm run seed

# 3. Lancer l'application
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## 📍 URLs importantes

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/` | Vue d'ensemble avec liens |
| 👨‍🏫 Dashboard | `/dashboard/formateur` | Tableau de bord formateur |
| ➕ Assigner | `/dashboard/formateur/assignations` | **Interface principale d'assignation** |
| 📊 Liste | `/dashboard/formateur/assignations/liste` | Voir toutes les assignations |
| 🧪 Test HTML | `/test-interface.html` | Testeur d'API standalone |

## 🎯 Test rapide de l'interface

### Scénario 1 : Assignation réussie ✅

1. Aller sur `/dashboard/formateur/assignations`
2. Sélectionner **"TP2 - API REST avec Next.js"**
3. Sélectionner **"Pierre Bernard"**
4. Cliquer sur **"✓ Assigner le travail"**
5. ✅ Message vert : "Travail assigné avec succès !"

### Scénario 2 : Assignation en double ❌

1. Aller sur `/dashboard/formateur/assignations`
2. Sélectionner **"TP1 - Composants React"**
3. Sélectionner **"Marie Martin"** (déjà assigné)
4. Cliquer sur **"✓ Assigner le travail"**
5. ❌ Message rouge : "Ce travail est déjà assigné à cet étudiant"

## 📊 Données de test créées

Le script `npm run seed` crée :

### 👨‍🏫 Formateur
- **Email:** formateur@setice.fr
- **Nom:** Jean Dupont

### 👥 Étudiants (5)
1. Marie Martin (marie.martin@etudiant.fr)
2. Pierre Bernard (pierre.bernard@etudiant.fr)
3. Sophie Dubois (sophie.dubois@etudiant.fr)
4. Lucas Petit (lucas.petit@etudiant.fr)
5. Emma Robert (emma.robert@etudiant.fr)

### 📚 Espaces pédagogiques (2)
1. **Développement Web Avancé** (5 étudiants inscrits)
2. **Base de données et SQL** (3 étudiants inscrits)

### 📝 Travaux (4)
1. TP1 - Composants React (INDIVIDUEL) ✅ Déjà assigné à Marie
2. TP2 - API REST avec Next.js (INDIVIDUEL)
3. Projet - Modélisation BDD (INDIVIDUEL)
4. Projet Collectif - Application Web (COLLECTIF) ⚠️ Non assignable

## 🎨 Fonctionnalités de l'interface

### ✨ Interface d'assignation
- ✅ Sélection travail avec détails automatiques
- ✅ Filtrage automatique (travaux INDIVIDUELS uniquement)
- ✅ Sélection étudiant (inscrits dans l'espace uniquement)
- ✅ Messages de succès/erreur clairs
- ✅ États de chargement avec spinners
- ✅ Bouton de réinitialisation
- ✅ Design moderne et responsive

### 📊 Liste des assignations
- ✅ Filtres par statut (Tous, Assignés, Livrés, Évalués)
- ✅ Cartes détaillées avec toutes les infos
- ✅ Compteurs par statut
- ✅ Badges de statut colorés

### 🎯 Dashboard formateur
- ✅ Vue d'ensemble avec statistiques
- ✅ Actions rapides (cartes cliquables)
- ✅ Navigation intuitive

## 🧪 Test avec l'interface HTML

Si vous préférez tester l'API directement :

1. Ouvrir `test-interface.html` dans votre navigateur
2. Suivre les tests dans l'ordre :
   - Test 1 : Charger les travaux
   - Test 2 : Charger les étudiants
   - Test 3 : Créer une assignation
   - Test 4 : Voir les assignations

## 📡 API Endpoints

```bash
# Récupérer les travaux individuels
GET /api/v1/travaux?type=INDIVIDUEL

# Récupérer les étudiants d'un espace
GET /api/v1/etudiants?espacePedagogiqueId={id}

# Créer une assignation
POST /api/v1/assignations
Body: { "travailId": "...", "etudiantId": "..." }

# Récupérer les assignations
GET /api/v1/assignations
```

## 🔧 Commandes utiles

```bash
# Régénérer les données de test
npm run seed

# Ouvrir Prisma Studio (interface DB)
npm run db:studio

# Mettre à jour le schéma Prisma
npm run db:push

# Générer le client Prisma
npm run db:generate
```

## 🐛 Problèmes courants

### Les travaux ne s'affichent pas
```bash
# Vérifier que les données sont créées
npm run db:studio
# Ou régénérer
npm run seed
```

### Erreur Prisma
```bash
# Régénérer le client
npm run db:generate
npm run db:push
```

### Port 3000 déjà utilisé
```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

## 📚 Documentation complète

- **[GUIDE-INTERFACE.md](./GUIDE-INTERFACE.md)** - Guide détaillé de l'interface
- **[README-US6.1.md](./README-US6.1.md)** - Documentation technique backend
- **[GUIDE-TESTS.md](./GUIDE-TESTS.md)** - Guide des tests

## ✅ Checklist de vérification

- [ ] `npm install` exécuté
- [ ] `npm run seed` exécuté avec succès
- [ ] `npm run dev` lancé
- [ ] Page d'accueil accessible sur http://localhost:3000
- [ ] Dashboard formateur accessible
- [ ] Interface d'assignation fonctionne
- [ ] Assignation réussie testée
- [ ] Assignation en double testée
- [ ] Liste des assignations affichée

## 🎉 C'est tout !

Vous avez maintenant une interface complète et fonctionnelle pour l'US 6.1 !

**Prochaines étapes suggérées :**
1. Configurer NextAuth pour l'authentification réelle
2. Ajouter l'interface étudiant
3. Implémenter la livraison de travaux
4. Ajouter l'évaluation et la notation

---

**Développé pour SETICE**  
*User Story 6.1 : Assignation d'un travail individuel à un étudiant*
