'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

interface Rates {
  staticPost: number
  carousel: number
  reel: number
  adMgmt: number
  branding: number
  copy: number
  photo: number
  video: number
  strategy: number
  reports: number
  competitor: number
}

const DEFAULT_RATES: Rates = {
  staticPost: 5, carousel: 6.5, reel: 25, adMgmt: 30,
  branding: 120, copy: 80, photo: 100, video: 150,
  strategy: 90, reports: 60, competitor: 70,
}

const CONSULTANCY_PRICE = 139

const ADDON_INFO: Record<string, { name: string; key: keyof Rates }> = {
  branding: { name: 'Branding', key: 'branding' },
  copy: { name: 'Copywriting', key: 'copy' },
  photo: { name: 'Photography', key: 'photo' },
  video: { name: 'Videography', key: 'video' },
  strategy: { name: 'Strategy Sessions', key: 'strategy' },
  reports: { name: 'Monthly Reports', key: 'reports' },
  competitor: { name: 'Competitor Analysis', key: 'competitor' },
}

interface BuilderState {
  staticPosts: number
  carousel: number
  reels: number
  reelScript: number
  reelEdit: number
  marketing: '' | 'organic' | 'paid' | 'both'
  platforms: { meta: boolean; tiktok: boolean }
  budgets: { meta: number; tiktok: number }
  web: 'none' | 'yes' | 'consultancy'
  webBudget: number
  addons: Record<string, boolean>
}

const INITIAL_STATE: BuilderState = {
  staticPosts: 8, carousel: 0, reels: 0, reelScript: 10, reelEdit: 15,
  marketing: '', platforms: { meta: false, tiktok: false }, budgets: { meta: 0, tiktok: 0 },
  web: 'none', webBudget: 0, addons: {},
}

// Website tier previews
function getWebTier(budget: number) {
  if (budget <= 0) return null
  if (budget <= 150) return {
    name: 'Starter Site',
    icon: '🚀',
    color: '#10a1db',
    features: [
      'Single-page website',
      'Fully mobile responsive',
      '1-2 sections (hero + contact)',
      'Basic contact form',
      'Delivered in 3-5 days',
    ],
    ideal: 'Perfect for freelancers, personal brands, or businesses that just need a professional online presence.',
  }
  if (budget <= 300) return {
    name: 'Business Site',
    icon: '💼',
    color: '#6a46d9',
    features: [
      'Up to 5 pages',
      'Fully mobile responsive',
      'Contact form + WhatsApp integration',
      'Basic SEO setup',
      'Google Analytics installed',
      'Delivered in 1-2 weeks',
    ],
    ideal: 'Great for small businesses, service providers, and local shops that need a proper online home.',
  }
  if (budget <= 600) return {
    name: 'Advanced Site',
    icon: '⚡',
    color: '#16db64',
    features: [
      'Up to 10 pages',
      'Custom animations & interactions',
      'Blog / CMS integration',
      'Advanced SEO optimization',
      'Newsletter signup',
      'Multi-language support',
      'Priority delivery in 2-3 weeks',
    ],
    ideal: 'Ideal for growing brands, e-commerce stores, and businesses ready to scale their online presence.',
  }
  return null // > 600 handled separately
}

export default function PackageBuilder() {
  const { showToast } = useToast()
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES)
  const [step, setStep] = useState(1)
  const [s, setS] = useState<BuilderState>(INITIAL_STATE)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })

  useEffect(() => {
    supabase.from('site_config').select('value').eq('key', 'rates').single().then(({ data }) => {
      if (data?.value) {
        try { setRates({ ...DEFAULT_RATES, ...JSON.parse(data.value) }) } catch {}
      }
    })
  }, [])

  // Pricing calculation
  const reelPerUnit = s.reels > 0 ? s.reelScript + s.reelEdit : rates.reel
  const staticCost = s.staticPosts * rates.staticPost
  const carouselCost = s.carousel * rates.carousel
  const reelCost = s.reels * reelPerUnit
  const hasPaid = s.marketing === 'paid' || s.marketing === 'both'
  const paidMgmt = hasPaid ? rates.adMgmt : 0
  const metaBudget = s.platforms.meta ? s.budgets.meta : 0
  const tiktokBudget = s.platforms.tiktok ? s.budgets.tiktok : 0
  const addonCost = Object.entries(s.addons).filter(([, on]) => on).reduce((sum, [k]) => sum + rates[ADDON_INFO[k].key], 0)
  const consultancyCost = s.web === 'consultancy' ? CONSULTANCY_PRICE : 0
  const monthlyTotal = staticCost + carouselCost + reelCost + paidMgmt + metaBudget + tiktokBudget + addonCost + consultancyCost
  const showWebBudget = s.web === 'yes' && s.webBudget > 0 && s.webBudget <= 600
  const showCustomWebBudget = s.web === 'yes' && s.webBudget > 600

  const submit = async () => {
    if (!form.name || !form.email) { showToast('Please enter your name and email.', 'error'); return }
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'package-builder',
          name: form.name, email: form.email, whatsapp: form.whatsapp,
          'static-posts': String(s.staticPosts), carousels: String(s.carousel), 'ugc-reels': String(s.reels),
          'marketing-type': s.marketing,
          'ad-platforms': Object.entries(s.platforms).filter(([, v]) => v).map(([k]) => k).join(', '),
          'meta-budget': String(s.budgets.meta), 'tiktok-budget': String(s.budgets.tiktok),
          'website-tier': s.web, 'website-budget': String(s.webBudget),
          'add-ons': Object.entries(s.addons).filter(([, v]) => v).map(([k]) => k).join(', '),
          'estimated-monthly': String(monthlyTotal),
        }).toString(),
      })
      setSent(true)
    } catch { setSent(true) }
  }

  const reset = () => { setS(INITIAL_STATE); setStep(1); setSent(false); setForm({ name: '', email: '', whatsapp: '' }) }

  const inputStyle = { background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', outline: 'none', width: '100%' } as React.CSSProperties
  const sliderStyle = { width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(249,253,254,0.08)', outline: 'none', appearance: 'none' as const, marginTop: '12px', accentColor: 'var(--sky)' }

  const currentTier = s.web === 'yes' ? getWebTier(s.webBudget) : null

  return (
    <section style={{ padding: '80px 6% 100px' }}>
      <div id="builderSection">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Custom</span>
          <h2 className="section-title" style={{ margin: '12px auto' }}>Build Your Own Package</h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>Customize step by step and get a live price estimate instantly.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }} className="builder-grid">

          {/* LEFT: Steps */}
          <div>
            {/* Progress dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: n < 6 ? 1 : 0 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: n < step ? 'var(--sky)' : n === step ? 'linear-gradient(135deg,var(--sky),var(--purple))' : 'rgba(249,253,254,0.04)',
                    border: n === step ? 'none' : '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: n <= step ? '#fff' : 'var(--text-dim)',
                    flexShrink: 0, cursor: n < step ? 'pointer' : 'default',
                  }} onClick={() => n < step && setStep(n)}>
                    {n < step ? '✓' : n}
                  </div>
                  {n < 6 && <div style={{ flex: 1, height: '1px', background: n < step ? 'var(--sky)' : 'rgba(249,253,254,0.08)' }} />}
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '32px' }}>

              {/* STEP 1 — Posts */}
              {step === 1 && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>How many posts per month?</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 300 }}>Choose your monthly content volume. Mix static posts and carousels based on your needs.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }} className="posts-grid">
                    <div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--sky)', lineHeight: 1 }}>{s.staticPosts}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>static posts (${rates.staticPost} each)</div>
                      <input type="range" min={0} max={30} value={s.staticPosts} onChange={e => setS({ ...s, staticPosts: +e.target.value })} style={sliderStyle} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--sky)', lineHeight: 1 }}>{s.carousel}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>carousels (${rates.carousel} each)</div>
                      <input type="range" min={0} max={20} value={s.carousel} onChange={e => setS({ ...s, carousel: +e.target.value })} style={sliderStyle} />
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2 — Reels */}
              {step === 2 && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>How many UGC reels per month?</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 300 }}>Each reel starts at <strong style={{ color: 'var(--sky)' }}>${rates.reel}</strong> — you can increase the budget per reel for better production quality.</p>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--sky)', lineHeight: 1 }}>{s.reels}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>UGC reels per month</div>
                    <input type="range" min={0} max={16} value={s.reels} onChange={e => setS({ ...s, reels: +e.target.value })} style={sliderStyle} />
                  </div>
                  {s.reels > 0 && (
                    <>
                      <div style={{ background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px 16px', marginTop: '14px', marginBottom: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                        <div style={{ color: 'var(--white)', fontWeight: 600, marginBottom: '6px' }}>Base reel (${s.reelScript + s.reelEdit}) includes:</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>📝 Script writing</span><span style={{ color: 'var(--sky)', fontWeight: 600 }}>${s.reelScript}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>✂️ Editing</span><span style={{ color: 'var(--sky)', fontWeight: 600 }}>${s.reelEdit}</span></div>
                      </div>
                      <div style={{ background: 'rgba(16,161,219,0.04)', border: '1px solid rgba(16,161,219,0.12)', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--white)', marginBottom: '12px' }}>🎛 Optional: Upgrade production quality</div>
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>📝 Script writing budget per reel</span>
                            <span style={{ color: 'var(--sky)', fontWeight: 700 }}>${s.reelScript}</span>
                          </div>
                          <input type="range" min={10} max={150} value={s.reelScript} onChange={e => setS({ ...s, reelScript: +e.target.value })} style={sliderStyle} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>✂️ Editing budget per reel</span>
                            <span style={{ color: 'var(--sky)', fontWeight: 700 }}>${s.reelEdit}</span>
                          </div>
                          <input type="range" min={15} max={60} value={s.reelEdit} onChange={e => setS({ ...s, reelEdit: +e.target.value })} style={sliderStyle} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '10px' }}>
                          Cost per reel: <strong style={{ color: 'var(--white)' }}>${reelPerUnit}</strong> · Total for {s.reels} reels: <strong style={{ color: 'var(--sky)' }}>${reelCost}</strong>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* STEP 3 — Marketing */}
              {step === 3 && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>What kind of marketing?</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 300 }}>Choose your approach.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }} className="mkt-grid">
                    {[
                      { v: 'organic', l: 'Organic Only', icon: '🌱' },
                      { v: 'paid', l: 'Paid Advertising', icon: '🚀' },
                      { v: 'both', l: 'Organic + Paid', icon: '⚡' },
                    ].map(o => (
                      <div key={o.v} onClick={() => setS({ ...s, marketing: o.v as 'organic' | 'paid' | 'both' })} style={{
                        background: s.marketing === o.v ? 'rgba(16,161,219,0.08)' : 'rgba(249,253,254,0.02)',
                        border: s.marketing === o.v ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                        borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{o.icon}</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--white)' }}>{o.l}</div>
                      </div>
                    ))}
                  </div>

                  {(s.marketing === 'paid' || s.marketing === 'both') && (
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: '12px' }}>Which platforms? (${rates.adMgmt}/mo management fee applies)</div>
                      {[
                        { k: 'meta', label: 'Meta Ads (Facebook + Instagram)', icon: '📘', cpm: 3, ctr: 0.02, conv: 0.045 },
                        { k: 'tiktok', label: 'TikTok Ads', icon: '🎵', cpm: 2.5, ctr: 0.015, conv: 0.035 },
                      ].map(p => (
                        <div key={p.k} style={{ marginBottom: '10px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px 16px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={s.platforms[p.k as 'meta' | 'tiktok']} onChange={e => setS({ ...s, platforms: { ...s.platforms, [p.k]: e.target.checked } })} style={{ width: '18px', height: '18px', accentColor: 'var(--sky)' }} />
                            <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 500 }}>{p.label}</span>
                          </label>
                          {s.platforms[p.k as 'meta' | 'tiktok'] && (
                            <div style={{ marginTop: '10px', paddingLeft: '30px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: 'var(--sky)', fontWeight: 700 }}>$</span>
                                <input type="number" placeholder="Budget/mo (min 50)" min={50} value={s.budgets[p.k as 'meta' | 'tiktok'] || ''} onChange={e => setS({ ...s, budgets: { ...s.budgets, [p.k]: +e.target.value || 0 } })}
                                  style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.85rem', width: '150px' }} />
                              </div>
                              {s.budgets[p.k as 'meta' | 'tiktok'] >= 50 && (
                                <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(16,161,219,0.05)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '10px', fontSize: '0.76rem', lineHeight: 1.6 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Est. reach/mo</span>
                                    <span style={{ color: 'var(--sky)', fontWeight: 700 }}>{Math.round((s.budgets[p.k as 'meta' | 'tiktok'] / p.cpm) * 1000).toLocaleString()}+</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Est. leads/mo</span>
                                    <span style={{ color: 'var(--sky)', fontWeight: 700 }}>
                                      {(() => {
                                        const leads = Math.round((s.budgets[p.k as 'meta' | 'tiktok'] / p.cpm) * 1000 * p.ctr * p.conv)
                                        return `${leads} – ${leads * 2}`
                                      })()}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '6px' }}>Estimates based on Lebanon market averages. Actual results vary. ⚠️ Leads ≠ guaranteed sales.</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 4 — Website */}
              {step === 4 && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Do you need a website?</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 300 }}>We build fast, beautiful, conversion-focused websites — or audit and consult on your existing one.</p>
                  
                  {/* Three options: none / build / consultancy */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }} className="web-grid">
                    <div onClick={() => setS({ ...s, web: 'none', webBudget: 0 })} style={{
                      background: s.web === 'none' ? 'rgba(16,161,219,0.08)' : 'rgba(249,253,254,0.02)',
                      border: s.web === 'none' ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                      borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>✖️</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: '4px' }}>No thanks</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>I already have one</div>
                    </div>
                    <div onClick={() => setS({ ...s, web: 'yes' })} style={{
                      background: s.web === 'yes' ? 'rgba(16,161,219,0.08)' : 'rgba(249,253,254,0.02)',
                      border: s.web === 'yes' ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                      borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🌐</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: '4px' }}>Build me one</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>New site or landing page</div>
                    </div>
                    <div onClick={() => setS({ ...s, web: 'consultancy', webBudget: 0 })} style={{
                      background: s.web === 'consultancy' ? 'rgba(106,70,217,0.1)' : 'rgba(249,253,254,0.02)',
                      border: s.web === 'consultancy' ? '1.5px solid var(--purple)' : '1.5px solid var(--glass-border)',
                      borderRadius: '12px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', top: '-8px', right: '10px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', color: '#fff', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '1px', padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>+ Free Audit</div>
                      <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🎓</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: '4px' }}>Consultancy</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--purple)', fontWeight: 700 }}>${CONSULTANCY_PRICE} one-time</div>
                    </div>
                  </div>

                  {/* CONSULTANCY DETAILS */}
                  {s.web === 'consultancy' && (
                    <div style={{ marginTop: '20px', background: 'linear-gradient(135deg,rgba(106,70,217,0.08),rgba(16,161,219,0.05))', border: '1px solid rgba(106,70,217,0.25)', borderRadius: '14px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.4rem' }}>🎓</span>
                        <div>
                          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--white)' }}>Website Consultancy + Free Audit</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--purple)', fontWeight: 700 }}>${CONSULTANCY_PRICE} one-time — added to your monthly total</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
                        A comprehensive review of your existing website — what&apos;s working, what&apos;s broken, and exactly what to fix to increase conversions.
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {[
                          '🔍 Full technical + UX audit of your current site',
                          '📊 Conversion rate analysis with real fixes',
                          '⚡ Page speed + SEO review',
                          '📱 Mobile experience audit',
                          '💬 60-min strategy call with actionable roadmap',
                          '📄 Written report you can share with your team',
                        ].map(f => (
                          <div key={f} style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.7)' }}>
                            <span style={{ color: 'var(--purple)', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BUILD-ME-ONE budget input + previews */}
                  {s.web === 'yes' && (
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: '10px' }}>Your website budget (one-time, USD):</div>
                      <input type="number" placeholder="e.g. 300" min={50} value={s.webBudget || ''} onChange={e => setS({ ...s, webBudget: +e.target.value || 0 })} style={inputStyle} />

                      {/* Tier preview */}
                      {currentTier && (
                        <div style={{ marginTop: '20px', background: 'rgba(249,253,254,0.02)', border: `1px solid ${currentTier.color}40`, borderRadius: '14px', padding: '24px', animation: 'fadeIn 0.3s ease' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${currentTier.color}18`, border: `1px solid ${currentTier.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{currentTier.icon}</div>
                            <div>
                              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)' }}>{currentTier.name}</div>
                              <div style={{ fontSize: '0.7rem', color: currentTier.color, fontWeight: 700 }}>${s.webBudget} one-time · Included in your package</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.6, fontWeight: 300, marginBottom: '14px', fontStyle: 'italic' }}>{currentTier.ideal}</div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: currentTier.color, marginBottom: '10px' }}>What&apos;s included:</div>
                          <div style={{ display: 'grid', gap: '7px' }}>
                            {currentTier.features.map(f => (
                              <div key={f} style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'rgba(249,253,254,0.7)' }}>
                                <span style={{ color: currentTier.color, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Budget > $600 — attractive CTA */}
                      {s.webBudget > 600 && (
                        <div style={{ marginTop: '20px', background: 'linear-gradient(135deg,rgba(1,32,76,0.7),rgba(16,161,219,0.15))', border: '1.5px solid var(--sky)', borderRadius: '16px', padding: '28px', textAlign: 'center', boxShadow: '0 8px 32px rgba(16,161,219,0.15)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,161,219,0.15)', border: '1px solid rgba(16,161,219,0.3)', color: 'var(--sky)', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '1.5px', padding: '4px 14px', borderRadius: '100px', marginBottom: '16px', textTransform: 'uppercase' }}>💎 Custom Project</div>
                          <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--white)', marginBottom: '10px', letterSpacing: '-0.5px' }}>Let&apos;s Build Something Serious</h4>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.6, fontWeight: 300, marginBottom: '20px', maxWidth: '380px', margin: '0 auto 20px' }}>
                            For a ${s.webBudget}+ budget, we build fully custom sites tailored to your business. Book a free 30-min call and let&apos;s design your project together.
                          </p>
                          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'var(--sky)', color: 'var(--dark)', padding: '14px 32px',
                            borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none',
                            fontFamily: 'Inter,sans-serif', transition: 'all 0.2s',
                            boxShadow: '0 4px 20px rgba(16,161,219,0.4)',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(16,161,219,0.55)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,161,219,0.4)' }}>
                            📞 Book a Free Strategy Call →
                          </a>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '12px' }}>No commitment · 30 min · Get a proper quote</div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* STEP 5 — Add-ons */}
              {step === 5 && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Any add-ons?</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 300 }}>Optional extras — mix and match what you need.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="addon-grid">
                    {Object.entries(ADDON_INFO).map(([k, info]) => (
                      <div key={k} onClick={() => setS({ ...s, addons: { ...s.addons, [k]: !s.addons[k] } })} style={{
                        background: s.addons[k] ? 'rgba(16,161,219,0.08)' : 'rgba(249,253,254,0.02)',
                        border: s.addons[k] ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                        borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s',
                      }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${s.addons[k] ? 'var(--sky)' : 'var(--glass-border)'}`, background: s.addons[k] ? 'var(--sky)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', color: 'var(--dark)', fontWeight: 800 }}>
                          {s.addons[k] && '✓'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>{info.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--sky)', fontWeight: 500 }}>+${rates[info.key]}/mo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 6 — Summary */}
              {step === 6 && !sent && (
                <>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Your Custom Package</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 300 }}>Review your selections. All prices are estimates — confirmed in your free consultation.</p>

                  <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '16px', fontSize: '0.82rem', lineHeight: 1.9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Static posts</span><span style={{ color: 'var(--white)' }}>{s.staticPosts} × ${rates.staticPost} = ${staticCost}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Carousels</span><span style={{ color: 'var(--white)' }}>{s.carousel} × ${rates.carousel} = ${carouselCost}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>UGC Reels</span><span style={{ color: 'var(--white)' }}>{s.reels} × ${reelPerUnit} = ${reelCost}</span></div>
                    {s.marketing && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Marketing</span><span style={{ color: 'var(--white)' }}>{s.marketing === 'organic' ? 'Organic Only' : s.marketing === 'paid' ? 'Paid Advertising' : 'Organic + Paid'}</span></div>}
                    {hasPaid && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Ads mgmt</span><span style={{ color: 'var(--white)' }}>${rates.adMgmt}</span></div>}
                    {metaBudget > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Meta ad budget</span><span style={{ color: 'var(--white)' }}>${metaBudget}</span></div>}
                    {tiktokBudget > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>TikTok ad budget</span><span style={{ color: 'var(--white)' }}>${tiktokBudget}</span></div>}
                    {s.web === 'consultancy' && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Website Consultancy + Audit</span><span style={{ color: 'var(--purple)', fontWeight: 700 }}>${CONSULTANCY_PRICE}</span></div>}
                    {Object.entries(s.addons).filter(([, on]) => on).map(([k]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>{ADDON_INFO[k].name}</span><span style={{ color: 'var(--white)' }}>${rates[ADDON_INFO[k].key]}</span></div>
                    ))}
                    {showWebBudget && <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid var(--glass-border)' }}><span style={{ color: 'var(--text-muted)' }}>Website (one-time)</span><span style={{ color: 'var(--sky)' }}>+${s.webBudget}</span></div>}
                    {showCustomWebBudget && <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid var(--glass-border)' }}><span style={{ color: 'var(--text-muted)' }}>Custom website</span><span style={{ color: 'var(--sky)' }}>Quote after call</span></div>}
                  </div>

                  <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(16,161,219,0.08))', border: '1px solid rgba(16,161,219,0.3)', borderRadius: '14px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.8rem', color: 'var(--white)', letterSpacing: '-2px', lineHeight: 1 }}>
                      <span style={{ fontSize: '1.4rem', color: 'var(--sky)' }}>~$</span>{monthlyTotal}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      estimated / month
                      {showWebBudget && <> + ${s.webBudget} website (one-time)</>}
                      {showCustomWebBudget && <> + custom website (quote after call)</>}
                    </div>
                    <div style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--sky)', background: 'rgba(16,161,219,0.1)', padding: '3px 10px', borderRadius: '6px' }}>Estimate — confirmed in consultation</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                    <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                  </div>
                  <input placeholder="WhatsApp Number (optional)" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} style={{ ...inputStyle, marginBottom: '14px' }} />
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '12px' }}>By submitting, you agree to our <Link href="/privacy" style={{ color: 'var(--sky)' }}>Privacy Policy</Link>.</p>
                  <button onClick={submit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}>Book Your Free Consultation →</button>
                  <button onClick={reset} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Start Over</button>
                </>
              )}

              {step === 6 && sent && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '10px' }}>Request Received!</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>We&apos;ll reach out within 24 hours to set up your consultation.</p>
                  <button onClick={reset} className="btn-secondary">Build Another →</button>
                </div>
              )}

              {/* NAV */}
              {step < 6 && !sent && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                  {step > 1 ? <button onClick={() => setStep(step - 1)} className="btn-secondary">← Back</button> : <div />}
                  <button onClick={() => setStep(step + 1)} className="btn-primary">{step === 5 ? 'See Summary →' : 'Next →'}</button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live estimate sidebar */}
          <div style={{ position: 'sticky', top: '100px' }} className="builder-sidebar">
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.1))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Live Estimate</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '3rem', color: 'var(--white)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '4px' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--sky)' }}>~$</span>{monthlyTotal}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '20px' }}>per month</div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {staticCost > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>{s.staticPosts} static posts</span><span style={{ color: 'var(--white)' }}>${staticCost}</span></div>}
                {carouselCost > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>{s.carousel} carousels</span><span style={{ color: 'var(--white)' }}>${carouselCost}</span></div>}
                {reelCost > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>{s.reels} UGC reels</span><span style={{ color: 'var(--white)' }}>${reelCost}</span></div>}
                {paidMgmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>Ads mgmt</span><span style={{ color: 'var(--white)' }}>${paidMgmt}</span></div>}
                {metaBudget > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>Meta budget</span><span style={{ color: 'var(--white)' }}>${metaBudget}</span></div>}
                {tiktokBudget > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>TikTok budget</span><span style={{ color: 'var(--white)' }}>${tiktokBudget}</span></div>}
                {consultancyCost > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>Web consultancy</span><span style={{ color: 'var(--purple)', fontWeight: 700 }}>${consultancyCost}</span></div>}
                {Object.entries(s.addons).filter(([, on]) => on).map(([k]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}><span>{ADDON_INFO[k].name}</span><span style={{ color: 'var(--white)' }}>${rates[ADDON_INFO[k].key]}</span></div>
                ))}
                {monthlyTotal === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>Start building above →</div>}
                {showWebBudget && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid var(--glass-border)' }}><span>Website (one-time)</span><span style={{ color: 'var(--sky)' }}>+${s.webBudget}</span></div>}
                {showCustomWebBudget && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid var(--glass-border)' }}><span>Custom website</span><span style={{ color: 'var(--sky)' }}>Quote after call</span></div>}
              </div>

              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.5, marginTop: '20px' }}>Website cost (if selected) is a one-time fee shown separately. Final pricing confirmed in your free consultation.</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @media(max-width:900px){
          .builder-grid{grid-template-columns:1fr!important}
          .builder-sidebar{position:static!important;margin-top:20px}
          .posts-grid,.mkt-grid,.addon-grid,.web-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  )
}
