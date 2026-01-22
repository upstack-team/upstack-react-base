export default function TestSimple() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ Page de test simple</h1>
      <p>Si tu vois cette page, Next.js fonctionne correctement !</p>
      <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h2>🚀 Serveur SETICE opérationnel</h2>
        <p><strong>URL :</strong> http://localhost:3001/test-simple</p>
        <p><strong>Status :</strong> ✅ Fonctionnel</p>
      </div>
    </div>
  )
}