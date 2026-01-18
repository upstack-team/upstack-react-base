# 🔐 Sécurité & Authentification Frontend (React + TypeScript)

Ce document décrit **la mise en place complète de l’authentification, de la gestion des rôles et de la protection des routes** côté frontend.

L’objectif est de garantir que :

* ✅ **Seul le DIRECTEUR DES ÉTUDES** accède aux pages sensibles
* ✅ Les **FORMATEURS** et **ÉTUDIANTS** ont des interfaces protégées
* ✅ Les routes sont sécurisées dans `App.tsx`
* ✅ Les tokens sont gérés correctement (login, refresh, logout)

---

## 🧩 Rôles disponibles

```ts
DIRECTEUR_ETUDES
FORMATEUR
ETUDIANT
```

---

## 🔌 Connexion au Backend

### 📡 Variables d’environnement

Créer le fichier `.env.local` à la racine :

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 📚 Endpoints utilisés

### Authentification

* `POST /auth/login`
* `POST /auth/logout`
* `POST /auth/refresh`
* `GET /auth/profile`

### Données

* `GET /classements/promotions`
* `GET /classements/promotions/{id}`
* `GET /promotions`
* `GET /annees-academiques`

---

## 🧠 Architecture de Sécurité Frontend

```txt
src/
├── auth/
│   ├── AuthContext.tsx
│   ├── PrivateRoute.tsx
│   ├── RoleGuard.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── ClassementPage.tsx
│
├── services/
│   ├── authService.ts
│   └── api.ts
```

---

## 1️⃣ AuthContext – Gestion de Session

Responsable de :

* Stockage du token
* Chargement du profil
* Login / Logout
* Refresh automatique

```ts
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
```

Le token est stocké de façon sécurisée :

```ts
localStorage.setItem('access_token', token)
```

---

## 2️⃣ Page de Login

📄 `src/pages/LoginPage.tsx`

* Formulaire email / mot de passe
* Appel API `/auth/login`
* Redirection selon le rôle

```ts
if (user.role === 'DIRECTEUR_ETUDES') navigate('/admin')
```

---

## 3️⃣ PrivateRoute – Protection Générale

📄 `src/auth/PrivateRoute.tsx`

Utilisé pour **bloquer l’accès aux utilisateurs non connectés**.

```tsx
<PrivateRoute>
  <ClassementPage />
</PrivateRoute>
```

Fonction :

* ❌ Non connecté → `/login`
* ✅ Connecté → page autorisée

---

## 4️⃣ RoleGuard – Protection par Rôle

📄 `src/auth/RoleGuard.tsx`

Permet de limiter l’accès selon le rôle.

```tsx
<RoleGuard requiredRole="DIRECTEUR_ETUDES">
  <AdminDashboard />
</RoleGuard>
```

### Cas d’usage

| Page                | Rôle requis      |
| ------------------- | ---------------- |
| Dashboard Directeur | DIRECTEUR_ETUDES |
| UI Formateur        | FORMATEUR        |
| UI Étudiant         | ETUDIANT         |

---

## 5️⃣ Protection des Routes – App.tsx

```tsx
<Route
  path="/admin"
  element={
    <PrivateRoute>
      <RoleGuard requiredRole="DIRECTEUR_ETUDES">
        <AdminLayout />
      </RoleGuard>
    </PrivateRoute>
  }
/>
```

✅ Double sécurité :

* Authentification
* Vérification du rôle

---

## 6️⃣ AuthService – Communication API

📄 `src/services/authService.ts`

Responsabilités :

* login
* logout
* refresh token
* profile

```ts
axios.post('/auth/login', credentials)
```

---

## 🔄 Gestion des Tokens & Session

| Fonctionnalité | Statut         |
| -------------- | -------------- |
| Stockage Token | ✅ localStorage |
| Refresh Token  | ✅ automatique  |
| Expiration     | ✅ interceptée  |
| Déconnexion    | ✅ logout       |

### Intercepteur Axios

```ts
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response.status === 401) {
      await refreshToken()
    }
  }
)
```

---

## 📊 ClassementPage – Appel API Sécurisé

📄 `src/pages/ClassementPage.tsx`

* Appel API via `api.ts`
* Données visibles uniquement si connecté

```ts
useEffect(() => {
  api.get('/classements/promotions')
}, [])
```

---

## 🛡️ Résumé Sécurité

✔ Routes protégées
✔ Rôles respectés
✔ Backend sécurisé
✔ Accès Directeur exclusif
✔ UI Étudiant & Formateur isolées

---

## 🚀 Prochaine Étape

* Ajout de permissions fines (READ / WRITE)
* Journalisation des accès
* Timeout automatique

---

✍️ **Document de référence – Projet Frontend Sécurisé**
