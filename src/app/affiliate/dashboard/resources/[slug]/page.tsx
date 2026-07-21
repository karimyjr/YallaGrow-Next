'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Resource {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  enabled: boolean
}

interface Item {
  id: string
  type: 'text' | 'file' | 'link'
  title: string
  content: string
  url: string
  file_size: string
  sort_order: number
}

export default function ResourcePage() {
  const params = useParams()
  const slug = params.slug as string
  const [resource, setResource] = useState<Resource | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    // Check session first
    const saved = sessionStorage.getItem('yg_aff')
    if (!saved) { setLoading(false); return }
    setAuthed(true)

    // Load resource
    const load = async () => {
      const { data: r } = await supabase.from('affiliate_resources').select('*').eq('slug', slug).eq('enabled', true).single()
      if (r) {
        setResource(r)
        const { data: itemsData } = await supabase.from('affiliate_resource_items').select('*').eq('resource_id', r.id).order('sort_order')
        if (itemsData) setItems(itemsData)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'))
  }

  if (!authed) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '10px' }}>Sign in required</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>You need to be signed in to view this resource.</p>
        <Link href="/affiliate/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,161,219,0.15)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!resource) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '10px' }}>Resource not found</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>This resource doesn&apos;t exist or has been disabled.</p>
        <Link href="/affiliate/dashboard" className="btn-primary">← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, overflow: 'auto' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 6%', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(6,12,20,0.95)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <Link href="/affiliate/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--sky)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>
        <Link href="/" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </Link>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 20px 80px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(16,161,219,0.08))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'rgba(16,161,219,0.1)', border: '1px solid rgba(16,161,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
              {resource.icon}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '8px' }}>{resource.title}</h1>
              {resource.description && <p style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.6, fontWeight: 300 }}>{resource.description}</p>}
            </div>
          </div>
        </div>

        {/* Content blocks */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.4 }}>📄</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--white)', marginBottom: '4px', fontWeight: 600 }}>Content coming soon</p>
            <p style={{ fontSize: '0.8rem' }}>Check back later — we&apos;re updating this section.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map(item => (
              <div key={item.id}>
                {item.type === 'text' && (
                  <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '24px' }}>
                    {item.title && <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)', marginBottom: '14px' }}>{item.title}</h3>}
                    <div style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontWeight: 300 }}>{item.content}</div>
                    {item.content && (
                      <button onClick={() => copyText(item.content)} style={{ marginTop: '16px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--sky)', padding: '7px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        📋 Copy Text
                      </button>
                    )}
                  </div>
                )}

                {item.type === 'file' && (
                  <a href={item.url} target="_blank" rel="noopener" download style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(16,219,100,0.03)', border: '1px solid rgba(16,219,100,0.2)', borderRadius: '14px', padding: '20px', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,219,100,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,219,100,0.2)'; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ fontSize: '2rem' }}>📎</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: 600, marginBottom: '4px' }}>{item.title || 'Download File'}</div>
                      {item.file_size && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.file_size}</div>}
                    </div>
                    <div style={{ color: '#16db64', fontSize: '0.82rem', fontWeight: 700 }}>Download ↓</div>
                  </a>
                )}

                {item.type === 'link' && (
                  <a href={item.url} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(106,70,217,0.03)', border: '1px solid rgba(106,70,217,0.2)', borderRadius: '14px', padding: '20px', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(106,70,217,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(106,70,217,0.2)'; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ fontSize: '2rem' }}>🔗</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: 600, marginBottom: '4px' }}>{item.title || 'External Link'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', wordBreak: 'break-all' }}>{item.url}</div>
                    </div>
                    <div style={{ color: 'var(--purple)', fontSize: '0.82rem', fontWeight: 700 }}>Open ↗</div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--glass-border)' }}>
          <Link href="/affiliate/dashboard" className="btn-secondary">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
