'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

interface Affiliate {
  id: string
  full_name: string
  email: string
  ref_code: string
  status: string
  website: string
}

interface Referral {
  id: string
  client_name: string
  created_at: string
  invoice_amount: number
  commission_amount: number
  commission_rate: number
  status: string
}

interface Resource {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  cta_text: string
  enabled: boolean
  sort_order: number
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'link', icon: '🔗', label: 'My Referral Code' },
  { id: 'referrals', icon: '📊', label: 'Referrals' },
  { id: 'earnings', icon: '💰', label: 'Earnings' },
  { id: 'resources', icon: '🎓', label: 'Marketing Resources' },
  { id: 'faqs', icon: '❓', label: 'FAQs' },
  { id: 'support', icon: '📞', label: 'Support' },
]

export default function AffiliateDashboard() {
  const { showToast } = useToast()
  const [session, setSession] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from sessionStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const saved = sessionStorage.getItem('yg_aff')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSession(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const loadRefs = useCallback(async (refCode: string) => {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('ref_code', refCode)
      .order('created_at', { ascending: false })
    if (data) setReferrals(data)
  }, [])

  const loadResources = useCallback(async () => {
    const { data } = await supabase
      .from('affiliate_resources')
      .select('*')
      .eq('enabled', true)
      .order('sort_order')
    if (data) setResources(data)
  }, [])

  // Load referrals + resources when session changes
  useEffect(() => {
    if (session?.ref_code) {
      loadRefs(session.ref_code)
      loadResources()
    }
  }, [session, loadRefs, loadResources])

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isMobile, sidebarOpen])

  const login = async () => {
    if (!email || !code) {
      setError('Please enter your email and referral code.')
      return
    }
    setLoading(true)
    setError('')
    const { data } = await supabase
      .from('affiliates')
      .select('*')
      .eq('email', email)
      .eq('ref_code', code.toUpperCase())
      .limit(1)
    if (data && data.length > 0) {
      sessionStorage.setItem('yg_aff', JSON.stringify(data[0]))
      setSession(data[0])
    } else {
      setError('Invalid credentials. Check your email and code.')
    }
    setLoading(false)
  }

  const logout = () => {
    sessionStorage.removeItem('yg_aff')
    setSession(null)
    setReferrals([])
    setResources([])
    setActiveNav('dashboard')
    setSidebarOpen(false)
  }

  const totalPaid = referrals
    .filter(r => r.status === 'paid')
    .reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const pending = referrals
    .filter(r => r.status === 'pending' || r.status === 'approved')
    .reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const totalEarned = totalPaid + pending
  const link = session ? session.ref_code : ''

  const copyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => showToast('Referral code copied to clipboard!', 'success'))
      .catch(() => showToast('Failed to copy', 'error'))
  }

  const statusColor: Record<string, string> = {
    pending: '#ffc107', approved: '#16db64', paid: '#10a1db', rejected: '#ff4d4d',
  }
  const statusBg: Record<string, string> = {
    pending: 'rgba(255,193,7,0.1)', approved: 'rgba(16,219,100,0.1)',
    paid: 'rgba(16,161,219,0.1)', rejected: 'rgba(255,77,77,0.1)',
  }

  const filteredReferrals = referrals.filter(r =>
    r.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Prevent hydration mismatch — don't render until mounted
  if (!mounted) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,161,219,0.15)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  // ============ LOGIN VIEW ============
  if (!session) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, overflow: 'auto' }}>
        <div style={{ padding: '16px 6%', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(6,12,20,0.95)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
          <Link href="/" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', textDecoration: 'none' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Affiliate Dashboard</span>
          <Link href="/affiliate" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>← Back</Link>
        </div>

        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px' }}>Affiliate Login</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>Enter your email and referral code to access your dashboard.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Referral Code"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ ...inputStyle, marginTop: '12px', textTransform: 'uppercase' }}
          />
          {error && <p style={{ fontSize: '0.75rem', color: '#ff5555', margin: '12px 0 0' }}>{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '16px' }}>
            Don&apos;t have an account? <Link href="/affiliate" style={{ color: 'var(--sky)' }}>Apply here →</Link>
          </p>
        </div>
      </div>
    )
  }

  // Sidebar left position — explicit calculation, no CSS override conflict
  const sidebarLeft = isMobile ? (sidebarOpen ? '0' : '-280px') : '0'
  const mainMarginLeft = isMobile ? '0' : '260px'
  const showBackdrop = isMobile && sidebarOpen

  // ============ DASHBOARD VIEW ============
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', display: 'flex', zIndex: 1000, overflow: 'auto' }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: '260px',
          background: 'rgba(6,12,20,0.95)',
          borderRight: '1px solid var(--glass-border)',
          padding: '20px 16px',
          position: 'fixed',
          top: 0,
          left: sidebarLeft,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'left 0.3s ease',
          zIndex: 200,
          backdropFilter: 'blur(20px)',
          overflowY: 'auto',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '32px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Y</div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--white)' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(16,161,219,0.08)' : 'transparent',
                  color: active ? 'var(--sky)' : 'rgba(249,253,254,0.6)',
                  fontFamily: 'Inter,sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  borderLeft: active ? '2px solid var(--sky)' : '2px solid transparent',
                  minHeight: '44px',
                }}
              >
                <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ padding: '10px 14px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '2px' }}>Signed in as</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.full_name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--sky)', fontWeight: 600, marginTop: '2px' }}>{session.ref_code}</div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(255,85,85,0.2)',
              color: '#ff5555',
              fontFamily: 'Inter,sans-serif',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '40px',
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {showBackdrop && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 190,
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        marginLeft: mainMarginLeft,
        padding: isMobile ? '16px' : '24px 32px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>

        {/* MOBILE TOP BAR */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '8px 0',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '14px',
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '10px 14px',
                cursor: 'pointer',
                color: 'var(--white)',
                fontFamily: 'Inter,sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '40px',
              }}
            >
              <span style={{ fontSize: '1rem' }}>☰</span>
              <span>Menu</span>
            </button>
            <div style={{
              fontFamily: 'Syne,sans-serif',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: 'var(--white)',
            }}>
              Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
            </div>
            <div style={{ width: '40px' }} /> {/* spacer for symmetry */}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeNav === 'dashboard' && (
          <>
            <div style={{
              background: 'linear-gradient(135deg,rgba(1,32,76,0.9),rgba(16,161,219,0.25))',
              border: '1px solid rgba(16,161,219,0.25)',
              borderRadius: '20px',
              padding: isMobile ? '24px 20px' : '32px 36px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,161,219,0.15), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '8px' }}>Affiliate Dashboard</div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: isMobile ? '1.5rem' : '2rem', color: 'var(--white)', marginBottom: '10px', letterSpacing: '-1px', lineHeight: 1.15 }}>
                  Welcome back, {session.full_name.split(' ')[0]} 👋
                </h1>
                <p style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', color: 'rgba(249,253,254,0.7)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '20px', fontWeight: 300 }}>
                  Track your referrals, earnings, and access marketing resources — all in one place.
                </p>
                <button
                  onClick={() => setActiveNav('link')}
                  style={{
                    background: 'var(--white)',
                    color: 'var(--dark)',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter,sans-serif',
                  }}
                >
                  View My Referral Code →
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}>
              {[
                { label: 'Total Earned', value: '$' + totalEarned.toFixed(2), sub: 'All time', icon: '💵', color: 'var(--sky)' },
                { label: 'Pending', value: '$' + pending.toFixed(2), sub: 'Awaiting approval', icon: '⏳', color: '#ffc107' },
                { label: 'Paid Out', value: '$' + totalPaid.toFixed(2), sub: 'Total paid', icon: '✅', color: '#16db64' },
                { label: 'Referrals', value: referrals.length.toString(), sub: 'Total tracked', icon: '👥', color: 'var(--purple)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(249,253,254,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: isMobile ? '16px' : '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{s.icon}</div>
                  </div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: isMobile ? '1.3rem' : '1.6rem', color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '6px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <ReferralsTable
              referrals={filteredReferrals}
              total={referrals.length}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusColor={statusColor}
              statusBg={statusBg}
              isMobile={isMobile}
              title="Recent Referrals"
            />
          </>
        )}

        {/* MY REFERRAL CODE TAB */}
        {activeNav === 'link' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>My Referral Code</h1>
            <p style={pageSubStyle}>Share your unique referral code. When a business signs up using it, you earn commission.</p>

            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.1))', border: '1px solid rgba(16,161,219,0.25)', borderRadius: '16px', padding: isMobile ? '20px' : '28px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '12px' }}>Your unique referral code</div>
              <div style={{ background: 'rgba(6,12,20,0.6)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: isMobile ? '20px 12px' : '24px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: isMobile ? '1.6rem' : '2.4rem', color: 'var(--sky)', letterSpacing: '3px', wordBreak: 'break-all' }}>
                  {link}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={copyLink} className="btn-primary" style={{ flex: isMobile ? '1 1 100%' : '0 0 auto', justifyContent: 'center' }}>📋 Copy Code</button>
                <a href={`https://wa.me/?text=${encodeURIComponent('Check out YallaGrow — Lebanon\'s premium marketing agency! Use my referral code: ' + link + ' at yallagrow.net')}`} target="_blank" rel="noopener" className="btn-secondary" style={{ flex: isMobile ? '1 1 100%' : '0 0 auto', justifyContent: 'center' }}>💬 Share on WhatsApp</a>
              </div>
            </div>

            <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: isMobile ? '20px' : '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '14px' }}>How it works</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['1', 'Share your code', 'Post it on social media, send it to a friend, or include it when telling businesses about YallaGrow.'],
                  ['2', 'They visit YallaGrow', 'They mention your code during signup or their consultation call.'],
                  ['3', 'They sign up', 'If they buy any package with your code attached, you earn commission on their first invoice.'],
                  ['4', 'You get paid', 'Once approved, commissions are paid via your preferred method.'],
                ].map(([n, t, d]) => (
                  <div key={n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,161,219,0.1)', border: '1px solid rgba(16,161,219,0.25)', color: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{n}</div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)', marginBottom: '2px' }}>{t}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* REFERRALS TAB */}
        {activeNav === 'referrals' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>All Referrals</h1>
            <p style={pageSubStyle}>Complete history of everyone who signed up through your code.</p>
            <ReferralsTable
              referrals={filteredReferrals}
              total={referrals.length}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusColor={statusColor}
              statusBg={statusBg}
              isMobile={isMobile}
              showRate
            />
          </>
        )}

        {/* EARNINGS TAB */}
        {activeNav === 'earnings' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>Earnings Overview</h1>
            <p style={pageSubStyle}>Track your total earnings, payouts, and pending commissions.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Total Earned', value: '$' + totalEarned.toFixed(2), color: 'var(--white)' },
                { label: 'Pending Approval', value: '$' + pending.toFixed(2), color: '#ffc107' },
                { label: 'Paid Out', value: '$' + totalPaid.toFixed(2), color: '#16db64' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: isMobile ? '20px' : '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '12px' }}>💰 Payout Information</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.7, fontWeight: 300 }}>
                <p style={{ marginBottom: '10px' }}>Commissions are approved once the referred client&apos;s first invoice is paid.</p>
                <p style={{ marginBottom: '10px' }}>Minimum payout threshold is <strong style={{ color: 'var(--white)' }}>$50</strong>. Below that, balances roll over to the following month.</p>
                <p>Payouts are sent via WhatsApp coordination — get in touch when you&apos;re ready to withdraw.</p>
              </div>
              <a href="https://wa.me/447376441603?text=Request+Payout" target="_blank" rel="noopener" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>💬 Request Payout</a>
            </div>
          </>
        )}

        {/* MARKETING RESOURCES TAB */}
        {activeNav === 'resources' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>Marketing Resources</h1>
            <p style={pageSubStyle}>Ready-to-use content to help you promote YallaGrow.</p>

            {resources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.4 }}>📄</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--white)', marginBottom: '4px', fontWeight: 600 }}>Resources coming soon</p>
                <p style={{ fontSize: '0.8rem' }}>We&apos;re preparing the marketing materials — check back soon.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '14px' }}>
                {resources.map(r => (
                  <Link key={r.id} href={`/affiliate/dashboard/resources/${r.slug}`} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{r.icon}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>{r.title}</div>
                    {r.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px', fontWeight: 300 }}>{r.description}</div>}
                    <div style={{ fontSize: '0.72rem', color: 'var(--sky)', fontWeight: 600 }}>{r.cta_text || 'View'} →</div>
                  </Link>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px', background: 'linear-gradient(135deg,rgba(1,32,76,0.4),rgba(106,70,217,0.08))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '14px', padding: isMobile ? '20px' : '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '8px' }}>Need something specific?</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.6 }}>Ask us for custom promotional content — we can create tailored graphics or copy for your audience.</div>
              <a href="https://wa.me/447376441603?text=Request+Custom+Assets" target="_blank" rel="noopener" className="btn-secondary">💬 Request Custom Assets</a>
            </div>
          </>
        )}

        {/* FAQS TAB */}
        {activeNav === 'faqs' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>Frequently Asked Questions</h1>
            <p style={pageSubStyle}>Everything you need to know about the YallaGrow affiliate program.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FAQS.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
            </div>
          </>
        )}

        {/* SUPPORT TAB */}
        {activeNav === 'support' && (
          <>
            <h1 style={pageTitleStyle(isMobile)}>Support</h1>
            <p style={pageSubStyle}>Have a question or need help? Reach out.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
              {[
                { icon: '💬', title: 'WhatsApp', desc: 'Fastest response — typically within an hour.', href: 'https://wa.me/447376441603', cta: 'Open WhatsApp →' },
                { icon: '📧', title: 'Email', desc: 'Send us a detailed inquiry, we\'ll respond within 24h.', href: 'mailto:info@yallagrow.net', cta: 'Send Email →' },
              ].map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener" style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: isMobile ? '20px' : '24px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 300 }}>{s.desc}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 600 }}>{s.cta}</div>
                </a>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ============ SUB-COMPONENTS ============

interface ReferralsTableProps {
  referrals: Referral[]
  total: number
  searchTerm: string
  setSearchTerm: (s: string) => void
  statusColor: Record<string, string>
  statusBg: Record<string, string>
  isMobile: boolean
  title?: string
  showRate?: boolean
}

function ReferralsTable({ referrals, total, searchTerm, setSearchTerm, statusColor, statusBg, isMobile, title, showRate }: ReferralsTableProps) {
  const headers = showRate
    ? ['Client', 'Date', 'Invoice', 'Rate', 'Commission', 'Status']
    : ['Client', 'Date', 'Invoice', 'Commission', 'Status']

  return (
    <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: isMobile ? '16px' : '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {title && <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>{title}</div>}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{total} total referral{total !== 1 ? 's' : ''}</div>
        </div>
        <input
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(249,253,254,0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '9px 14px',
            color: 'var(--white)',
            fontFamily: 'Inter,sans-serif',
            fontSize: '0.8rem',
            outline: 'none',
            width: isMobile ? '100%' : '220px',
          }}
        />
      </div>

      {referrals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.4 }}>📊</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--white)', marginBottom: '4px', fontWeight: 600 }}>No referrals yet</div>
          <div style={{ fontSize: '0.75rem' }}>Share your referral code to get started.</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                {headers.map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(249,253,254,0.03)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.76rem', color: 'rgba(249,253,254,0.6)' }}>{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.76rem', color: 'rgba(249,253,254,0.6)' }}>{r.invoice_amount ? '$' + Number(r.invoice_amount).toFixed(2) : 'Pending'}</td>
                  {showRate && <td style={{ padding: '12px 16px', fontSize: '0.76rem', color: 'rgba(249,253,254,0.6)' }}>{r.commission_rate ? r.commission_rate + '%' : '—'}</td>}
                  <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--sky)', fontWeight: 700 }}>{r.commission_amount ? '$' + Number(r.commission_amount).toFixed(2) : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', background: statusBg[r.status] || 'transparent', color: statusColor[r.status] || 'var(--text-dim)', border: `1px solid ${statusColor[r.status] || 'var(--glass-border)'}40` }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '16px 20px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--white)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          fontFamily: 'Inter,sans-serif',
          minHeight: '48px',
        }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--sky)', fontSize: '1.2rem', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '12px' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.7, fontWeight: 300 }}>
          {a}
        </div>
      )}
    </div>
  )
}

// ============ STYLES ============

const inputStyle: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid var(--glass-border)',
  borderRadius: '10px',
  padding: '12px 14px',
  color: 'var(--white)',
  fontFamily: 'Inter,sans-serif',
  fontSize: '0.85rem',
  outline: 'none',
  width: '100%',
}

const pageTitleStyle = (isMobile: boolean): React.CSSProperties => ({
  fontFamily: 'Syne,sans-serif',
  fontWeight: 800,
  fontSize: isMobile ? '1.3rem' : '1.6rem',
  color: 'var(--white)',
  marginBottom: '8px',
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
})

const pageSubStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  marginBottom: '20px',
  lineHeight: 1.6,
}

const FAQS = [
  { q: 'When do I get paid?', a: 'Commissions are approved once the referred client\'s first invoice clears. Payouts start when your balance reaches $50.' },
  { q: 'How much can I earn?', a: 'You earn 20% on invoices $179–$999, and 35% on invoices of $1,000+. There\'s no cap on how many referrals you can bring.' },
  { q: 'How is a referral tracked?', a: 'When someone uses your referral code during signup or their consultation, we credit the referral to your account.' },
  { q: 'Can I refer myself?', a: 'No. Self-referrals are strictly prohibited and result in account termination.' },
  { q: 'What if a referral is refunded?', a: 'Commission is not paid for refunded or cancelled purchases within the refund period.' },
  { q: 'How do I get paid?', a: 'Reach out via WhatsApp when you\'re ready to withdraw. We coordinate payouts individually.' },
  { q: 'Can I promote on paid ads?', a: 'Please contact us before running paid ads promoting YallaGrow — we need to approve creative to protect the brand.' },
]
