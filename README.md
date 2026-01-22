# 🎓 SETICE - User Story 6.1

**Assignation d'un travail individuel à un étudiant**

## 🚀 Démarrage rapide

```bash
# 1. Générer les données de test
npm run seed

# 2. Lancer l'application
npm run dev

# 3. Ouvrir dans le navigateur
http://localhost:3000
```

## 📍 Pages principales

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil |
| `/dashboard/formateur` | Dashboard formateur |
| `/dashboard/formateur/assignations` | **⭐ Assigner un travail** |
| `/dashboard/formateur/assignations/liste` | Liste des assignations |

## 🎯 Test rapide

1. Aller sur `/dashboard/formateur/assignations`
2. Sélectionner **"TP2 - API REST avec Next.js"**
3. Sélectionner **"Pierre Bernard"**
4. Cliquer **"✓ Assigner le travail"**
5. ✅ Message : "Travail assigné avec succès !"

## 📊 Données de test

Le script `npm run seed` crée :

- **1 formateur** : formateur@setice.fr
- **5 étudiants** : Marie, Pierre, Sophie, Lucas, Emma
- **2 espaces pédagogiques**
- **4 travaux** (3 individuels, 1 collectif)

## 📡 API Endpoints

```typescript
GET  /api/v1/travaux?type=INDIVIDUEL
GET  /api/v1/etudiants?espacePedagogiqueId={id}
POST /api/v1/assignations
GET  /api/v1/assignations
```

## 🔧 Commandes utiles

```bash
npm run seed        # Régénérer les données
npm run db:studio   # Ouvrir Prisma Studio
npm run db:push     # Mettre à jour le schéma
```

## 📁 Structure du projet

```
app/
├── api/v1/
│   ├── assignations/route.ts    # POST/GET assignations
│   ├── travaux/route.ts          # GET travaux
│   └── etudiants/route.ts        # GET étudiants
└── dashboard/formateur/
    ├── page.tsx                  # Dashboard
    └── assignations/
        ├── page.tsx              # Interface d'assignation
        └── liste/page.tsx        # Liste des assignations

src/
├── services/assignation.service.ts
├── schemas/assignation.schema.ts
└── types/assignation.types.ts
```

## ✅ Fonctionnalités

- ✅ Assignation de travaux individuels
- ✅ Vérification des inscriptions
- ✅ Prévention des doublons
- ✅ Notification par email
- ✅ Interface responsive
- ✅ Messages d'erreur contextuels

## 📚 Documentation détaillée

- **START-HERE.md** - Démarrage ultra-rapide
- **DEMARRAGE-RAPIDE.md** - Guide complet
- **README-US6.1.md** - Documentation technique backend
- **GUIDE-TESTS.md** - Guide des tests
- **test-interface.html** - Testeur API

## 🐛 Dépannage

### Tailwind CSS
Si vous avez des erreurs Tailwind, consultez **SOLUTION-TAILWIND.md** ou **FIX-TAILWIND.md**.

### Base de données
```bash
npm run db:generate  # Régénérer le client Prisma
npm run seed         # Recharger les données
```

## 🎉 Status

✅ Backend API complet  
✅ Interface frontend fonctionnelle  
✅ Tous les critères d'acceptation validés  
✅ Documentation complète  
✅ Prêt à l'emploi  

---

**Développé pour SETICE**  
*Système d'Évaluation du Travail Individuel et Collectif Estudiantin*
