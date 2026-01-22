export default function HomePage() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    }}>
      <div style={{ 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        padding: '1rem', 
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>🎓 SETICE - User Story 6.1</h1>
        <p style={{ margin: '0.5rem 0 0 0' }}>Assignation d'un travail individuel à un étudiant</p>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: '#28a745', marginTop: 0 }}>✅ Fonctionnalités implémentées</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>Service d'assignation avec toutes les vérifications métier</li>
          <li>API endpoints POST/GET pour les assignations</li>
          <li>Validation Zod des données d'entrée</li>
          <li>Gestion complète des erreurs</li>
          <li>Notification email automatique</li>
          <li>Contrôles d'accès et sécurité</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: '#0066cc', marginTop: 0 }}>📡 API Endpoints disponibles</h2>
        <div style={{ 
          fontFamily: 'monospace', 
          backgroundColor: 'white', 
          padding: '1rem', 
          borderRadius: '4px', 
          margin: '0.5rem 0',
          border: '1px solid #ddd'
        }}>
          <strong style={{ color: '#28a745' }}>POST</strong> /api/v1/assignations<br/>
          <small style={{ color: '#666' }}>Assigne un travail individuel à un étudiant (FORMATEUR uniquement)</small>
        </div>
        <div style={{ 
          fontFamily: 'monospace', 
          backgroundColor: 'white', 
          padding: '1rem', 
          borderRadius: '4px', 
          margin: '0.5rem 0',
          border: '1px solid #ddd'
        }}>
          <strong style={{ color: '#007bff' }}>GET</strong> /api/v1/assignations<br/>
          <small style={{ color: '#666' }}>Récupère les assignations selon le rôle utilisateur</small>
        </div>
        <div style={{ 
          fontFamily: 'monospace', 
          backgroundColor: 'white', 
          padding: '1rem', 
          borderRadius: '4px', 
          margin: '0.5rem 0',
          border: '1px solid #ddd'
        }}>
          <strong style={{ color: '#ffc107' }}>TEST</strong> /api/test/assignations<br/>
          <small style={{ color: '#666' }}>Endpoints de test sans authentification</small>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: '#856404', marginTop: 0 }}>🎯 Tests réussis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong style={{ color: '#28a745' }}>✅ Assignation réussie</strong><br/>
            <small>Status 201 + Email envoyé</small>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong style={{ color: '#dc3545' }}>❌ Assignation en double</strong><br/>
            <small>Status 409 "Déjà assigné"</small>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong style={{ color: '#dc3545' }}>❌ Travail collectif</strong><br/>
            <small>Status 400 "Non individuel"</small>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong style={{ color: '#28a745' }}>✅ Récupération</strong><br/>
            <small>Status 200 + Données</small>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '1.5rem', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#0c5460', marginTop: 0 }}>🚀 Implémentation complète !</h2>
        <p style={{ margin: '0 0 1rem 0', fontSize: '1.1em' }}>
          Toutes les fonctionnalités de la User Story 6.1 sont opérationnelles et testées.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <a 
            href="/dashboard/formateur" 
            style={{ 
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            👨‍🏫 Dashboard Formateur
          </a>
          <a 
            href="/dashboard/formateur/assignations" 
            style={{ 
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            ➕ Créer une assignation
          </a>
        </div>
      </div>
    </div>
  )
}