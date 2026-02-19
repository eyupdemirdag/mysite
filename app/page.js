import Image from 'next/image'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      color: '#fff',
    }}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={120}
        style={{ marginBottom: '1.5rem' }}
      />
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        My Travel Blog
      </h1>
      <p style={{ opacity: 0.9 }}>
        Coming soon – photo gallery and stories.
      </p>
    </main>
  )
}
