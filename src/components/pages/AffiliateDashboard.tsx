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
  { id: 'resources', icon: '🎓', label: 'Resources' },
  { id: 'faqs', icon: '❓', label: 'FAQs' },
  { id: 'support', icon: '📞', label: 'Support' },
]

const FAQS = [
  { q: 'When do I get paid?', a: "Commissions are approved once the referred client's first invoice clears. Payouts start when your balance reaches $50." },
  { q: 'How much can I earn?', a: "You earn 20% on invoices $179–$999, and 35% on invoices of $1,000+. No cap." },
  { q: 'How is a referral tracked?', a: 'When someone uses your referral code during signup or their consultation, we credit it to your account.' },
  { q: 'Can I refer myself?', a: 'No. Self-referrals are strictly prohibited.' },
  { q: 'What if a referral is refunded?', a: 'Commission is not paid for refunded or cancelled purchases.' },
  { q: 'How do I get paid?', a: "Reach out via WhatsApp when you're ready to withdraw." },
  { q: 'Can I promote on paid ads?', a: 'Please contact us first — we need to approve creative to protect the brand.' },
]

export default function AffiliateDashboard() {
  const [session, setSession] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [copyMsg, setCopyMsg] = useState('')

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('yg_aff')
      if (saved) {
        const parsed = JSON.parse(saved) as Affiliate
        setSession(parsed)
        supabase
          .from('referrals')
          .select('*')
          .eq('ref_code', parsed.ref_code)
          .order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setReferrals(data) })
        supabase
          .from('affiliate_resources')
          .select('*')
          .eq('enabled', true)
          .order('sort_order')
          .then(({ data }) => { if (data) setResources(data) })
      }
    } catch {}
  }, [])

  const login = async () => {
    if (!email || !code) {
      setLoginError('Enter your email and referral code.')
      return
    }
    setLoading(true)
    setLoginError('')
    try {
      const { data } = await supabase
        .from('affiliates')
        .select('*')
        .eq('email', email)
        .eq('ref_code', code.toUpperCase())
        .limit(1)
      if (data && data.length > 0) {
        const aff = data[0] as Affiliate
        sessionStorage.setItem('yg_aff', JSON.stringify(aff))
        setSession(aff)
        const { data: refs } = await supabase
          .from('referrals').select('*').eq('ref_code', aff.ref_code).order('created_at', { ascending: false })
        if (refs) setReferrals(refs)
        const { data: res } = await supabase
          .from('affiliate_resources').select('*').eq('enabled', true).order('sort_order')
        if (res) setResources(res)
      } else {
        setLoginError('Invalid credentials. Check your email and code.')
      }
    } catch {
      setLoginError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  const logout = () => {
    try { sessionStorage.removeItem('yg_aff') } catch {}
    setSession(null)
    setReferrals([])
    setResources([])
    setActiveNav('dashboard')
    setSidebarOpen(false)
  }

  const copyCode = async () => {
    if (!session) return
    try {
      await navigator.clipboard.writeText(session.ref_code)
      setCopyMsg('Copied!')
      setTimeout(() => setCopyMsg(''), 2000)
    } catch {
      setCopyMsg('Copy failed')
      setTimeout(() => setCopyMsg(''), 2000)
    }
  }

  const totalPaid = referrals.filter(r => r.status === 'paid').reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const pending = referrals.filter(r => r.status === 'pending' || r.status === 'approved').reduce((a, r) => a + Number(r.commission_amount || 0), 0)
  const totalEarned = totalPaid + pending

  const statusColor: Record<string, string> = { pending: '#ffc107', approved: '#16db64', paid: '#10a1db', rejected: '#ff4d4d' }
  const statusBg: Record<string, string> = { pending: 'rgba(255,193,7,0.1)', approved: 'rgba(16,219,100,0.1)', paid: 'rgba(16,161,219,0.1)', rejected: 'rgba(255,77,77,0.1)' }

  if (!session) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, overflow: 'auto' }}>
        <div style={{ padding: '16px 6%', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(6,12,20,0.95)', zIndex: 100 }}>
          <Link href="/" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', textDecoration: 'none' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Affiliate Dashboard</span>
          <Link href="/affiliate" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>← Back</Link>
        </div>
        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px' }}>Affiliate Login</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '28px' }}>Enter your email and referral code.</p>
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input placeholder="Referral Code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && login()} style={{ ...inputStyle, marginTop: '12px', textTransform: 'uppercase' }} />
          {loginError && <p style={{ fontSize: '0.75rem', color: '#ff5555', margin: '12px 0 0' }}>{loginError}</p>}
          <button onClick={login} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '16px' }}>
            No account? <Link href="/affiliate" style={{ color: 'var(--sky)' }}>Apply here →</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--dark2)', zIndex: 1000, overflow: 'auto', display: 'flex' }}>

      <div className="aff-mobile-header" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 150,
        padding: '12px 16px', background: 'rgba(6,12,20,0.95)',
        borderBottom: '1px solid var(--glass-border)',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => setSidebarOpen(true)} style={{
          background: 'var(--glass)', border: '1px solid var(--glass-border)',
          borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
          color: 'var(--white)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Inter,sans-serif',
        }}>☰ Menu</button>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, color: 'var(--white)', fontSize: '0.95rem' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </div>
        <div style={{ width: '70px' }} />
      </div>

      <aside className={sidebarOpen ? 'aff-sidebar aff-sidebar-open' : 'aff-sidebar'} style={{
        width: '260px', background: 'rgba(6,12,20,0.95)',
        borderRight: '1px solid var(--glass-border)', padding: '20px 16px',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '28px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#fff' }}>Y</div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--white)' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id
            return (
              <button key={item.id}
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(16,161,219,0.08)' : 'transparent',
                  color: active ? 'var(--sky)' : 'rgba(249,253,254,0.6)',
                  fontFamily: 'Inter,sans-serif', fontSize: '0.88rem',
                  fontWeight: active ? 600 : 500, textAlign: 'left',
                  borderLeft: active ? '2px solid var(--sky)' : '2px solid transparent',
                }}>
                <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '14px', marginTop: '14px' }}>
          <div style={{ padding: '8px 14px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Signed in as</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.full_name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--sky)', fontWeight: 600, marginTop: '2px' }}>{session.ref_code}</div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px',
            background: 'transparent', border: '1px solid rgba(255,85,85,0.2)',
            color: '#ff5555', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter,sans-serif',
          }}>🚪 Sign Out</button>
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="aff-backdrop" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 190,
        }} />
      )}

      <main className="aff-main" style={{ flex: 1, marginLeft: '260px', padding: '24px 32px', minHeight: '100vh' }}>

        {activeNav === 'dashboard' && (
          <>
            <div style={{
              background: 'linear-gradient(135deg,rgba(1,32,76,0.9),rgba(16,161,219,0.25))',
              border: '1px solid rgba(16,161,219,0.25)', borderRadius: '20px',
              padding: '28px 32px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '8px' }}>Affiliate Dashboard</div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--white)', marginBottom: '10px' }}>
                Welcome back, {session.full_name.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.6, marginBottom: '16px' }}>
                Track your referrals, earnings, and marketing resources.
              </p>
              <button onClick={() => setActiveNav('link')} style={{
                background: 'var(--white)', color: 'var(--dark)',
                padding: '10px 20px', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              }}>View My Referral Code →</button>
            </div>

            <div className="aff-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
              <StatCard label="Total Earned" value={'$' + totalEarned.toFixed(2)} color="var(--sky)" icon="💵" />
              <StatCard label="Pending" value={'$' + pending.toFixed(2)} color="#ffc107" icon="⏳" />
              <StatCard label="Paid Out" value={'$' + totalPaid.toFixed(2)} color="#16db64" icon="✅" />
              <StatCard label="Referrals" value={referrals.length.toString()} color="var(--purple)" icon="👥" />
            </div>

            <ReferralsBox referrals={referrals} statusColor={statusColor} statusBg={statusBg} />
          </>
        )}

        {activeNav === 'link' && (
          <>
            <h1 style={titleStyle}>My Referral Code</h1>
            <p style={subStyle}>Share your unique code to earn commission.</p>
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.1))', border: '1px solid rgba(16,161,219,0.25)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '12px' }}>Your code</div>
              <div style={{ background: 'rgba(6,12,20,0.6)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,5vw,2.4rem)', color: 'var(--sky)', letterSpacing: '3px', wordBreak: 'break-all' }}>
                  {session.ref_code}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={copyCode} className="btn-primary">📋 Copy Code</button>
                <a href={`https://wa.me/?text=${encodeURIComponent('Check out YallaGrow! Use my referral code: ' + session.ref_code + ' at yallagrow.net')}`} target="_blank" rel="noopener" className="btn-secondary">💬 Share on WhatsApp</a>
                {copyMsg && <span style={{ fontSize: '0.78rem', color: '#16db64' }}>✓ {copyMsg}</span>}
              </div>
            </div>
          </>
        )}

        {activeNav === 'referrals' && (
          <>
            <h1 style={titleStyle}>All Referrals</h1>
            <p style={subStyle}>Complete history of your referrals.</p>
            <ReferralsBox referrals={referrals} statusColor={statusColor} statusBg={statusBg} />
          </>
        )}

        {activeNav === 'earnings' && (
          <>
            <h1 style={titleStyle}>Earnings Overview</h1>
            <p style={subStyle}>Track your total earnings and payouts.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }} className="aff-stats">
              <StatCard label="Total Earned" value={'$' + totalEarned.toFixed(2)} color="var(--white)" />
              <StatCard label="Pending" value={'$' + pending.toFixed(2)} color="#ffc107" />
              <StatCard label="Paid Out" value={'$' + totalPaid.toFixed(2)} color="#16db64" />
            </div>
            <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '10px' }}>💰 Payout Information</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.7, marginBottom: '12px' }}>Minimum $50 to withdraw. Payouts via WhatsApp coordination.</p>
              <a href="https://wa.me/447376441603?text=Request+Payout" target="_blank" rel="noopener" className="btn-primary">💬 Request Payout</a>
            </div>
          </>
        )}

        {activeNav === 'resources' && (
          <>
            <h1 style={titleStyle}>Marketing Resources</h1>
            <p style={subStyle}>Ready-to-use content for promoting YallaGrow.</p>
            {resources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.4 }}>📄</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--white)', marginBottom: '4px', fontWeight: 600 }}>Resources coming soon</p>
                <p style={{ fontSize: '0.8rem' }}>Check back soon.</p>
              </div>
            ) : (
              <div className="aff-resources" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
                {resources.map(r => (
                  <Link key={r.id} href={`/affiliate/dashboard/resources/${r.slug}`} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', textDecoration: 'none' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{r.icon}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>{r.title}</div>
                    {r.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{r.description}</div>}
                    <div style={{ fontSize: '0.72rem', color: 'var(--sky)', fontWeight: 600 }}>{r.cta_text || 'View'} →</div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeNav === 'faqs' && (
          <>
            <h1 style={titleStyle}>Frequently Asked Questions</h1>
            <p style={subStyle}>Everything about the YallaGrow affiliate program.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '14px 18px', cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textAlign: 'left', fontFamily: 'Inter,sans-serif',
                  }}>
                    <span>{f.q}</span>
                    <span style={{ color: 'var(--sky)', fontSize: '1.1rem', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 18px 14px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.7 }}>{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeNav === 'support' && (
          <>
            <h1 style={titleStyle}>Support</h1>
            <p style={subStyle}>Need help? Reach out.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }} className="aff-support">
              <a href="https://wa.me/447376441603" target="_blank" rel="noopener" style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '22px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>💬</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>WhatsApp</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>Fastest response — usually within an hour.</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 600 }}>Open WhatsApp →</div>
              </a>
              <a href="mailto:info@yallagrow.net" style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '22px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>📧</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '6px' }}>Email</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>We respond within 24 hours.</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 600 }}>Send Email →</div>
              </a>
            </div>
          </>
        )}

      </main>

      <style>{`
        @media (max-width: 900px) {
          .aff-sidebar { left: -280px !important; transition: left 0.3s ease; }
          .aff-sidebar-open { left: 0 !important; }
          .aff-main { margin-left: 0 !important; padding: 70px 16px 20px !important; }
          .aff-mobile-header { display: flex !important; }
          .aff-stats { grid-template-columns: 1fr 1fr !important; }
          .aff-resources, .aff-support { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon?: string }) {
  return (
    <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{label}</div>
        {icon && <div style={{ fontSize: '1rem' }}>{icon}</div>}
      </div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

function ReferralsBox({ referrals, statusColor, statusBg }: { referrals: Referral[]; statusColor: Record<string, string>; statusBg: Record<string, string> }) {
  return (
    <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)' }}>Referrals</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{referrals.length} total</div>
      </div>
      {referrals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.4 }}>📊</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--white)', marginBottom: '4px', fontWeight: 600 }}>No referrals yet</div>
          <div style={{ fontSize: '0.75rem' }}>Share your code to get started.</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                {['Client', 'Date', 'Invoice', 'Commission', 'Status'].map(h => (
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

const inputStyle: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)',
  borderRadius: '10px', padding: '12px 14px', color: 'var(--white)',
  fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%',
}
const titleStyle: React.CSSProperties = {
  fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem',
  color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px',
}
const subStyle: React.CSSProperties = {
  fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px',
}
