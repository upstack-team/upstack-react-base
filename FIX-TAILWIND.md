# 🔧 Fix Tailwind CSS

## Problème

Tailwind CSS n'est pas correctement installé dans le projet.

## Solution rapide

Exécutez ces commandes dans l'ordre :

```bash
# 1. Installer Tailwind CSS v3 (stable)
npm install -D tailwindcss@3.4.1 postcss autoprefixer

# 2. Créer la configuration Tailwind
npx tailwindcss init -p

# 3. Lancer le serveur
npm run dev
```

## Alternative : Sans Tailwind

Si vous voulez tester rapidement sans Tailwind, remplacez le contenu de `app/globals.css` par :

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Utilitaires de base */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }
.text-center { text-align: center; }
.font-bold { font-weight: bold; }
.rounded { border-radius: 0.5rem; }
.shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.p-4 { padding: 1rem; }
.m-4 { margin: 1rem; }
.bg-white { background-color: white; }
.text-gray-600 { color: #718096; }
```

Puis relancez `npm run dev`.
