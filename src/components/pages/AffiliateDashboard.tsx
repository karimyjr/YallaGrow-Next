'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Affiliate {
  id: string
  full_name: string
  email: string
  ref_code: string
  status: string
  country?: string
  created_at?: string
}

interface Referral {
  id: string
  client_name: string
  client_email?: string
  created_at: string
  invoice_amount: number
  commission_amount: number
  commission_rate: number
  status: string
}

type Tab = 'dashboard' | 'link' | 'referrals' | 'earnings' | 'resources' | 'faqs' | 'support'

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'link', icon: '🔗', label: 'My Referral Link' },
  { id: 'referrals', icon: '📊', label: 'Referrals' },
  { id: 'earnings', icon: '💰', label: 'Earnings' },
  { id: 'resources', icon: '🎓', label: 'Marketing Resources' },
  { id: 'faqs', icon: '❓', label: 'FAQs' },
  { id: 'support', icon: '📞', label: 'Support' },
]

export default function AffiliateDashboard() {
  const [session, setSession] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('yg_aff')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSession(parsed)
      loadRefs(parsed.ref_code)
    }
  }, [])

  const login = async () => {
    if (!email || !code) { setError('Please enter your email and referral code.'); return }
    setLoading(true); setError('')
    const { data } = await supabase.from('affiliates').select('*').eq('email', email).eq('ref_code', code.toUpperCase()).limit(1)
    if (data && data.length > 0) {
      sessionStorage.setItem('yg_aff', JSON.stringify(data[0]))
      setSession(data[0]); loadRefs(data[0].ref_code)
    } else { setError('Invalid credentials. Check your email and code.') }
    setLoading(false)
  }

  const loadRefs = async (refCode: string) => {
    const { data } = await supabase.from('referrals').select('*').eq('ref_code', refCode).order('created_at', { ascending: false })
    if (data) setReferrals(data)
  }

  const logout = () => { sessionStorage.removeItem('yg_aff'); setSession(null); setReferrals([]); setTab('dashboard') }

  const total = referrals.filter(r => r.status === 'paid').reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const pending = referrals.filter(r => r.status === 'pending' || r.status === 'approved').reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const totalEarned = referrals.reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const link = session ? `https://yallagrow.net/?ref=${session.ref_code}` : ''

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const statusColor: { [k: string]: string } = { pending: '#ffc107', approved: '#16db64', paid: '#10a1db', rejected: '#ff4d4d' }
  const statusBg: { [k: string]: string } = { pending: 'rgba(255,193,7,0.1)', approved: 'rgba(16,219,100,0.1)', paid: 'rgba(16,161,219,0.1)', rejected: 'rgba(255,77,77,0.1)' }

  const filteredRefs = referrals.filter(r =>
    !search || r.client_name?.toLowerCase().includes(search.toLowerCase()) || r.status?.toLowerCase().includes(search.toLowerCase())
  )

  // ============ LOGIN VIEW ============
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 6%', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', textDecoration: 'none' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
          <Link href="/affiliate" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>← Back</Link>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg,rgba(16,161,219,0.15),rgba(106,70,217,0.1))', border: '1px solid rgba(16,161,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 20px' }}>🔐</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px' }}>Affiliate Login</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>Enter your email and referral code to access your dashboard.</p>
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              style={{ background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%', marginBottom: '12px' }} />
            <input placeholder="Referral Code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && login()}
              style={{ background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%', marginBottom: '4px', textTransform: 'uppercase' }} />
            {error && <p style={{ fontSize: '0.75rem', color: '#ff5555', margin: '8px 0' }}>{error}</p>}
            <button onClick={login} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>{loading ? 'Signing in…' : 'Sign In →'}</button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '16px' }}>Don&apos;t have an account? <Link href="/affiliate" style={{ color: 'var(--sky)' }}>Apply here →</Link></p>
          </div>
        </div>
      </div>
    )
  }

  // ============ DASHBOARD VIEW ============
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex' }}>
      {/* SIDEBAR */}
      <aside className="aff-sidebar" style={{
        width: '260px', background: 'rgba(6,12,20,0.95)', borderRight: '1px solid var(--glass-border)',
        padding: '20px 12px', display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px 20px', textDecoration: 'none', borderBottom: '1px solid var(--glass-border)', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Y</div>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'var(--white)' }}>YallaGrow</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--sky)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Affiliates</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                background: tab === item.id ? 'var(--glass)' : 'transparent',
                border: tab === item.id ? '1px solid var(--glass-border)' : '1px solid transparent',
                color: tab === item.id ? 'var(--white)' : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: tab === item.id ? 600 : 500,
                fontFamily: 'Inter,sans-serif', textAlign: 'left', transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'var(--glass)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--sky),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
              {session.full_name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.full_name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{session.status}</div>
            </div>
          </div>
          <button onClick={logout} style={{ marginTop: '8px', width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,85,85,0.2)', background: 'transparent', color: '#ff5555', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Sign Out</button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} />
      )}

      {/* MAIN CONTENT */}
      <main className="aff-main" style={{ flex: 1, padding: '24px 32px', minWidth: 0 }}>
        {/* Mobile top bar */}
        <div className="aff-mobile-top" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--white)', cursor: 'pointer' }}>☰ Menu</button>
          <Link href="/" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <>
            {/* Welcome banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(1,32,76,0.7), rgba(16,161,219,0.15))',
              border: '1px solid rgba(16,161,219,0.25)',
              borderRadius: '18px', padding: '32px', marginBottom: '24px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'radial-gradient(ellipse at top right, rgba(16,161,219,0.15), transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                  Welcome back, {session.full_name.split(' ')[0]} 👋
                </h1>
                <p style={{ fontSize: '0.88rem', color: 'rgba(249,253,254,0.65)', maxWidth: '480px', lineHeight: 1.6, fontWeight: 300, marginBottom: '20px' }}>
                  Track your referrals, earnings, and grow with YallaGrow. Every successful referral means real income for you.
                </p>
                <button onClick={() => setTab('link')} style={{ background: 'var(--white)', color: 'var(--dark)', padding: '10px 22px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Get my referral link →</button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="aff-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Total Earned', value: '$' + totalEarned.toFixed(2), sub: 'All time', icon: '💰', color: '#10a1db' },
                { label: 'Pending', value: '$' + pending.toFixed(2), sub: 'Awaiting approval', icon: '⏳', color: '#ffc107' },
                { label: 'Paid Out', value: '$' + total.toFixed(2), sub: 'Successfully paid', icon: '✅', color: '#16db64' },
                { label: 'Total Referrals', value: referrals.length.toString(), sub: 'People referred', icon: '👥', color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>{s.icon}</div>
                  </div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '6px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Referrals table */}
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)' }}>Recent Referrals</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>See all your referrals and their status</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '6px 12px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>🔍</span>
                  <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', outline: 'none', width: '160px' }} />
                </div>
              </div>
              {filteredRefs.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>📊</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{search ? 'No referrals match your search.' : 'No referrals yet. Share your link to get started!'}</p>
                  {!search && <button onClick={() => setTab('link')} className="btn-primary" style={{ marginTop: '16px', fontSize: '0.78rem' }}>Get my link →</button>}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Client', 'Date', 'Invoice', 'Commission', 'Rate', 'Status'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', background: 'rgba(249,253,254,0.01)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRefs.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(249,253,254,0.03)' }}>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.75)', fontWeight: 500 }}>{r.client_name || '—'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.75)' }}>{r.invoice_amount ? '$' + Number(r.invoice_amount).toFixed(2) : 'Pending'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 700 }}>{r.commission_amount ? '$' + Number(r.commission_amount).toFixed(2) : '—'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.commission_rate ? r.commission_rate + '%' : '—'}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '0.62rem', fontWeight: 700, background: statusBg[r.status] || 'transparent', color: statusColor[r.status] || 'var(--text-dim)', border: `1px solid ${statusColor[r.status] || 'var(--glass-border)'}30`, textTransform: 'capitalize' }}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* REFERRAL LINK TAB */}
        {tab === 'link' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>My Referral Link</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Share your unique link with anyone interested in YallaGrow&apos;s services.</p>

            <div style={{ background: 'linear-gradient(135deg, rgba(1,32,76,0.5), rgba(16,161,219,0.08))', border: '1px solid rgba(16,161,219,0.25)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '10px' }}>Your Referral Link</div>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--white)', wordBreak: 'break-all', marginBottom: '14px' }}>{link}</div>
              <button onClick={copyLink} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.82rem' }}>{linkCopied ? '✓ Copied!' : '📋 Copy Link'}</button>
            </div>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '22px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '8px' }}>Your Referral Code</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--white)', letterSpacing: '2px' }}>{session.ref_code}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>Use this code anytime someone asks how they found YallaGrow.</p>
            </div>

            <div style={{ background: 'rgba(16,161,219,0.05)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)', marginBottom: '6px' }}>How it works</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Share your link. When someone signs up through it and becomes a paying client, you earn your commission automatically. The tracking cookie lasts 60 days.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* REFERRALS TAB */}
        {tab === 'referrals' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>All Referrals</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Complete history of everyone you&apos;ve referred to YallaGrow.</p>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{referrals.length} total referral{referrals.length !== 1 ? 's' : ''}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '6px 12px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>🔍</span>
                  <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', outline: 'none', width: '160px' }} />
                </div>
              </div>
              {filteredRefs.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No referrals yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Client', 'Date', 'Invoice', 'Commission', 'Rate', 'Status'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', background: 'rgba(249,253,254,0.01)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRefs.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(249,253,254,0.03)' }}>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.75)', fontWeight: 500 }}>{r.client_name || '—'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.75)' }}>{r.invoice_amount ? '$' + Number(r.invoice_amount).toFixed(2) : 'Pending'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 700 }}>{r.commission_amount ? '$' + Number(r.commission_amount).toFixed(2) : '—'}</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.commission_rate ? r.commission_rate + '%' : '—'}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '0.62rem', fontWeight: 700, background: statusBg[r.status] || 'transparent', color: statusColor[r.status] || 'var(--text-dim)', border: `1px solid ${statusColor[r.status] || 'var(--glass-border)'}30`, textTransform: 'capitalize' }}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* EARNINGS TAB */}
        {tab === 'earnings' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Earnings</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Track your commissions and payout history.</p>

            <div className="aff-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Total Earned', value: '$' + totalEarned.toFixed(2), color: '#10a1db' },
                { label: 'Pending', value: '$' + pending.toFixed(2), color: '#ffc107' },
                { label: 'Paid Out', value: '$' + total.toFixed(2), color: '#16db64' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(16,161,219,0.05)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>💰</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)', marginBottom: '6px' }}>How Payouts Work</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Commissions are paid once the referred client&apos;s first invoice clears. Payouts are made monthly via bank transfer, Whish Money, or Wise. Minimum payout: <strong style={{ color: 'var(--white)' }}>$50</strong>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MARKETING RESOURCES TAB */}
        {tab === 'resources' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Marketing Resources</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Everything you need to promote YallaGrow effectively.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
              {[
                { icon: '📝', title: 'Sales Scripts', desc: 'Ready-to-use scripts for DMs, WhatsApp, and emails.', status: 'Coming soon' },
                { icon: '🎨', title: 'Branded Graphics', desc: 'Instagram posts, stories, and banners you can share.', status: 'Coming soon' },
                { icon: '📊', title: 'Case Studies', desc: 'Real client results to share with potential referrals.', status: 'Coming soon' },
                { icon: '🎥', title: 'Explainer Videos', desc: 'Short videos explaining YallaGrow&apos;s services.', status: 'Coming soon' },
              ].map(r => (
                <div key={r.title} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{r.icon}</div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>{r.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{r.desc}</p>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '0.62rem', fontWeight: 700, background: 'rgba(255,193,7,0.1)', color: '#ffc107', border: '1px solid rgba(255,193,7,0.2)' }}>{r.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAQs TAB */}
        {tab === 'faqs' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Frequently Asked Questions</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Everything you need to know about the affiliate program.</p>

            {[
              { q: 'When do I get paid?', a: 'Commissions are paid once the referred client\'s first invoice clears successfully. Payouts happen monthly, provided you\'ve reached the $50 minimum.' },
              { q: 'How long does the referral cookie last?', a: 'The referral tracking cookie lasts 60 days from the moment someone clicks your link. If they sign up within that window, you get credit.' },
              { q: 'What if a client cancels or refunds?', a: 'No commission is paid on refunded or canceled purchases within the refund window. This protects the program from fraud and keeps it sustainable.' },
              { q: 'Can I refer myself or my own business?', a: 'No. Self-referrals are strictly prohibited and result in immediate program termination. The program is for genuine third-party referrals only.' },
              { q: 'How do I get higher commission rates?', a: 'The 35% tier applies automatically when the referred client\'s first invoice is $1,000 or above. No action needed on your end.' },
              { q: 'Do I need to file taxes on my earnings?', a: 'Yes. Affiliate income is taxable. You\'re responsible for reporting your earnings according to your local tax laws.' },
            ].map((f, i) => (
              <details key={i} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden' }}>
                <summary style={{ padding: '18px 22px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none' }}>
                  {f.q}
                  <span style={{ color: 'var(--sky)', marginLeft: '12px' }}>+</span>
                </summary>
                <div style={{ padding: '0 22px 20px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>{f.a}</div>
              </details>
            ))}
          </>
        )}

        {/* SUPPORT TAB */}
        {tab === 'support' && (
          <>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Support</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Need help? We&apos;re here for you.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px' }}>
              {[
                { icon: '💬', title: 'WhatsApp', desc: 'Fastest response — usually within an hour', href: 'https://wa.me/447376441603', cta: 'Message us' },
                { icon: '📧', title: 'Email', desc: 'For detailed questions and account issues', href: 'mailto:hello@yallagrow.net', cta: 'Send email' },
                { icon: '📅', title: 'Book a Call', desc: 'Schedule a 15-min chat with the team', href: process.env.NEXT_PUBLIC_BOOKING_URL || '#', cta: 'Book now' },
              ].map(c => (
                <a key={c.title} href={c.href} target="_blank" rel="noopener" style={{ display: 'block', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '24px', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{c.icon}</div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>{c.desc}</p>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sky)' }}>{c.cta} →</span>
                </a>
              ))}
            </div>
          </>
        )}
      </main>

      <style>{`
        @media(max-width:900px){
          .aff-sidebar{
            position:fixed!important;left:${sidebarOpen ? '0' : '-260px'};top:0;bottom:0;height:100vh!important;z-index:100;
            transition:left 0.3s;
          }
          .aff-main{padding:16px 20px!important;width:100%;}
          .aff-mobile-top{display:flex!important}
          .aff-stats-grid{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:500px){
          .aff-stats-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
