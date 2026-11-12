export default function Home() {
  return (
    <main className="container" style={{textAlign: 'center', paddingTop: '4rem'}}>
      <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>Video Affiliate</h1>
      <p style={{color: '#94a3b8', marginBottom: '2rem'}}>
        Kelola link affiliate video di <a href="/admin" style={{color: '#2563eb'}}>/admin</a>
      </p>
      <p style={{fontSize: '0.875rem', color: '#64748b'}}>
        Player: <code>/v/[slug]</code>
      </p>
    </main>
  )
}
