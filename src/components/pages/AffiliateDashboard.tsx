'use client'
import { useState, useEffect } from 'react'

export default function AffiliateDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#060c14',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      zIndex: 1000,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
        Dashboard Diagnostic
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
        {mounted ? 'Component mounted successfully' : 'Mounting...'}
      </p>
      <a href="/" style={{
        color: '#10a1db',
        padding: '10px 20px',
        border: '1px solid #10a1db',
        borderRadius: '8px',
        textDecoration: 'none',
      }}>
        ← Back to Home
      </a>
    </div>
  )
}
