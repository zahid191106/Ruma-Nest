// app/admin/page.tsx
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Custom Property Management Dashboard</h1>
      <p>Welcome! Here you can operate your properties directly into Sanity.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        {/* Route to your custom creation form */}
        <Link href="/admin/properties/new" style={buttonStyle}>
          ➕ Add New Property
        </Link>
        
        {/* Handy link in case you still need to access the raw Sanity Studio */}
        <Link href="/studio" target="_blank" style={secondaryButtonStyle}>
          ⚙️ Open Raw Sanity Studio
        </Link>
      </div>
    </div>
  )
}

const buttonStyle = { padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', borderRadius: '5px', textDecoration: 'none' }
const secondaryButtonStyle = { padding: '10px 20px', backgroundColor: '#333', color: 'white', borderRadius: '5px', textDecoration: 'none' }