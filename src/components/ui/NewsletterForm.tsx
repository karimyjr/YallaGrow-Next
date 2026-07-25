'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from './Toast'

interface NewsletterFormProps {
  source?: string
  compact?: boolean
}

export default function NewsletterForm({ source = 'footer', compact = false }: NewsletterFormProps) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async () => {
    if (!email.trim()) {
      showToast('Please enter your email.', 'error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.toLowerCase().trim(),
        source,
        user_agent: navigator.userAgent,
      })

      if (error) {
        if (error.code === '23505') {
          // Unique constraint - already subscribed
          showToast("You're already subscribed! 🎉", 'info')
        } else {
          showToast('Something went wrong. Please try again.', 'error')
        }
      } else {
        setSubscribed(true)
        showToast('Thanks for subscribing! 🎉', 'success')
        setEmail('')
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    }
    setLoading(false)
  }

  if (subscribed && !compact) {
    return (
      <div style={{
        background: 'rgba(16,219,100,0.05)',
        border: '1px solid rgba(16,219,100,0.2)',
        borderRadius: '10px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.2rem' }}>✓</span>
        <span style={{ fontSize: '0.82rem', color: '#16db64', fontWeight: 500 }}>
          You&apos;re on the list! Check your inbox soon.
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && subscribe()}
        disabled={loading}
        style={{
          flex: 1,
          minWidth: '180px',
          background: 'rgba(249,253,254,0.04)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
          padding: '11px 14px',
          color: 'var(--white)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'rgba(16,161,219,0.4)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      />
      <button
        onClick={subscribe}
        disabled={loading}
        className="btn-primary"
        style={{ padding: '11px 20px', fontSize: '0.82rem' }}
      >
        {loading ? '...' : compact ? 'Join' : 'Subscribe →'}
      </button>
    </div>
  )
}
