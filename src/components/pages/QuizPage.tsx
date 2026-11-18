'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icons'

interface SingleStep {
  type: 'single'
  key: string
  q: string
  sub: string
  options: { v: string; l: string; d: string; icon: string }[]
}

interface MultiStep {
  type: 'multi'
  key: string
  q: string
  sub: string
  options: { v: string; l: string; icon: string }[]
}

type Step = SingleStep | MultiStep

const STEPS: Step[] = [
  {
    type: 'single',
    key: 'type',
    q: 'What best describes your business?',
    sub: 'This helps us tailor everything to your specific context.',
    options: [
      { v: 'local', l: 'Local Business', d: 'Restaurant, salon, clinic, shop — serving your community', icon: 'building' },
      { v: 'startup', l: 'Startup', d: 'Early-stage, building a product or service from scratch', icon: 'rocket' },
      { v: 'ecommerce', l: 'E-commerce', d: 'Selling products online', icon: 'package' },
      { v: 'service', l: 'Service Business', d: 'Freelancer, agency, consultant, B2B', icon: 'briefcase' },
      { v: 'personal', l: 'Personal Brand', d: 'Creator, influencer, coach, speaker', icon: 'megaphone' },
    ],
  },
  {
    type: 'single',
    key: 'goal',
    q: "What's your #1 goal right now?",
    sub: "Pick the one that matters most — we'll optimize for it.",
    options: [
      { v: 'awareness', l: 'Get discovered', d: 'Build brand awareness and reach new audiences', icon: 'megaphone' },
      { v: 'leads', l: 'Generate leads', d: 'Turn social into a consistent source of inquiries', icon: 'target' },
      { v: 'sales', l: 'Drive sales', d: 'Convert followers and ad traffic into paying customers', icon: 'dollar' },
      { v: 'presence', l: 'Build a professional presence', d: 'Look credible, consistent, and trustworthy online', icon: 'sparkle' },
      { v: 'scale', l: "Scale what's already working", d: 'Amplify existing momentum with strategy and ads', icon: 'chart-up' },
    ],
  },
  {
    type: 'single',
    key: 'state',
    q: 'Where are you with marketing right now?',
    sub: 'Honest answer helps us give you the right recommendation.',
    options: [
      { v: 'none', l: 'Starting from zero', d: 'No social presence, no strategy — starting fresh', icon: 'dot-red' },
      { v: 'inconsistent', l: 'Posting inconsistently', d: 'Active sometimes, but no real strategy or system', icon: 'dot-yellow' },
      { v: 'active', l: 'Posting regularly', d: 'Consistent presence but not seeing strong results', icon: 'dot-green' },
      { v: 'scaling', l: 'Already running ads + content', d: 'Want to optimize, scale, or hand off to professionals', icon: 'dot-blue' },
    ],
  },
  {
    type: 'multi',
    key: 'services',
    q: 'What services are you looking for?',
    sub: 'Select all that apply — no pressure to know exactly.',
    options: [
      { v: 'posts', l: 'Social Media Posts', icon: 'camera' },
      { v: 'reels', l: 'Reels & Video Content', icon: 'film' },
      { v: 'ads', l: 'Paid Advertising (Meta/TikTok)', icon: 'chart-up' },
      { v: 'strategy', l: 'Marketing Strategy', icon: 'target' },
      { v: 'branding', l: 'Branding & Identity', icon: 'palette' },
      { v: 'copy', l: 'Copywriting', icon: 'pen' },
      { v: 'web', l: 'Website Development', icon: 'globe' },
      { v: 'analytics', l: 'Analytics & Reports', icon: 'bar-chart' },
    ],
  },
  {
    type: 'single',
    key: 'involvement',
    q: 'How involved do you want to be?',
    sub: "There's no wrong answer — this helps us set the right expectations.",
    options: [
      { v: 'handoff', l: 'Fully hand it off', d: 'I trust you — just keep me updated monthly', icon: 'handshake' },
      { v: 'collab', l: 'Collaborate together', d: 'I want to review and approve content before it goes live', icon: 'users' },
      { v: 'guided', l: 'Guide my team', d: 'Strategy and oversight — my team does execution', icon: 'target' },
    ],
  },
  {
    type: 'single',
    key: 'budget',
    q: "What's your approximate monthly budget?",
    sub: 'This is a soft signal — not a commitment. It helps us recommend the right starting point.',
    options: [
      { v: 'low', l: 'Under $200/month', d: 'Starting lean — want maximum value for budget', icon: 'dot-green' },
      { v: 'mid', l: '$200 – $400/month', d: 'Ready to invest in consistent, quality marketing', icon: 'dot-yellow' },
      { v: 'high', l: '$400+/month', d: 'Serious about scaling with a full-service approach', icon: 'dot-blue' },
      { v: 'unsure', l: 'Not sure yet', d: 'Let the recommendation guide me', icon: 'help' },
    ],
  },
]

const PROC_STEPS = [
  'Evaluating business type & goals',
  'Assessing marketing maturity',
  'Matching services to your needs',
  'Building your growth plan',
]

const PLANS: Record<string, { name: string; price: number; feats: string[]; reason: string }> = {
  launch: {
    name: 'Launch', price: 149,
    reason: 'You need a solid foundation first. Launch gives you consistent, professional content to build credibility before scaling.',
    feats: ['8 static posts/month', '2 short-form videos', 'Caption writing & hashtag research', 'Monthly performance report'],
  },
  grow: {
    name: 'Grow', price: 299,
    reason: 'Most businesses at your stage see the strongest ROI here. It balances content volume, strategy, and paid advertising.',
    feats: ['12 static posts/month', '4 short-form videos', 'Meta Ads management', 'Monthly strategy call'],
  },
  dominate: {
    name: 'Dominate', price: 499,
    reason: 'Based on your goals and maturity level, Dominate gives you the infrastructure to scale aggressively.',
    feats: ['16 static posts/month', '8 short-form videos', 'Full Meta Ads management', 'Performance dashboard', 'Priority support'],
  },
}

const ADDONS = [
  { id: 'extra_posts', icon: 'camera', label: 'Extra Posts', price: '+$5/post' },
  { id: 'extra_reels', icon: 'film', label: 'Extra Reels', price: '+$25/reel' },
  { id: 'branding', icon: 'palette', label: 'Branding', price: '+$120/mo' },
  { id: 'copy', icon: 'pen', label: 'Copywriting', price: '+$80/mo' },
  { id: 'photography', icon: 'camera', label: 'Photography', price: '+$100/mo' },
  { id: 'videography', icon: 'video', label: 'Videography', price: '+$150/mo' },
  { id: 'seo', icon: 'search', label: 'SEO', price: '+$90/mo' },
  { id: 'reports', icon: 'bar-chart', label: 'Monthly Reports', price: '+$60/mo' },
]

function recommend(answers: Record<string, string | string[]>): string {
  const score = { launch: 0, grow: 0, dominate: 0 }
  if (answers.state === 'none') score.launch += 3
  if (answers.state === 'inconsistent') score.grow += 2
  if (answers.state === 'active') score.grow += 3
  if (answers.state === 'scaling') score.dominate += 4
  if (answers.goal === 'presence') score.launch += 2
  if (answers.goal === 'awareness') score.grow += 2
  if (answers.goal === 'leads') score.grow += 3
  if (answers.goal === 'sales') score.dominate += 2
  if (answers.goal === 'scale') score.dominate += 3
  if (answers.budget === 'low') score.launch += 3
  if (answers.budget === 'mid') score.grow += 2
  if (answers.budget === 'high') score.dominate += 3
  return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0]
}

export default function QuizPage() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({ services: [] })
  const [result, setResult] = useState<string | null>(null)
  const [addons, setAddons] = useState<Record<string, boolean>>({})
  const [procStep, setProcStep] = useState(0)

  // Booking capture modal — opens when either Book button is clicked.
  // We collect contact details, POST the full quiz payload, then open
  // the Calendly/booking URL in a new tab.
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookForm, setBookForm] = useState({ name: '', email: '', whatsapp: '' })
  const [bookSubmitting, setBookSubmitting] = useState(false)
  const [bookError, setBookError] = useState<string | null>(null)

  const openBooking = () => {
    setBookError(null)
    setBookingOpen(true)
  }

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookError(null)
    setBookSubmitting(true)
    try {
      const payload = {
        ...bookForm,
        business_type:    answers.type,
        goal:             answers.goal,
        current_state:    answers.state,
        services:         Array.isArray(answers.services) ? answers.services : [],
        involvement:      answers.involvement,
        budget:           answers.budget,
        recommended_plan: result,
        addons:           Object.keys(addons).filter(k => addons[k]),
        booked_call:      true,
      }
      const r = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Could not save.')

      // Only after we've saved, open Calendly in a new tab.
      const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || '#'
      window.open(bookingUrl, '_blank', 'noopener')
      setBookingOpen(false)
    } catch (err) {
      setBookError((err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setBookSubmitting(false)
    }
  }

  useEffect(() => {
    if (step === 7) {
      setProcStep(0)
      const interval = setInterval(() => {
        setProcStep(p => {
          if (p >= PROC_STEPS.length) {
            clearInterval(interval)
            setTimeout(() => {
              setResult(recommend(answers))
              setStep(8)
            }, 400)
            return p
          }
          return p + 1
        })
      }, 600)
      return () => clearInterval(interval)
    }
  }, [step, answers])

  const selectSingle = (key: string, val: string) => {
    const newAnswers = { ...answers, [key]: val }
    setAnswers(newAnswers)
    setTimeout(() => {
      if (step < 6) setStep(step + 1)
      else setStep(7)
    }, 250)
  }

  const toggleMulti = (key: string, val: string) => {
    const current = (answers[key] as string[]) || []
    const newList = current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    setAnswers({ ...answers, [key]: newList })
  }

  const goToProcessing = () => setStep(7)

  const goBack = () => {
    if (step > 1 && step <= 6) setStep(step - 1)
    else if (step === 8) setStep(6)
    else if (step === 9) setStep(8)
    else if (step === 10) setStep(9)
  }

  const reset = () => {
    setStep(1); setAnswers({ services: [] }); setResult(null); setAddons({}); setProcStep(0)
  }

  const plan = result ? PLANS[result] : null
  const otherPlans = result ? Object.entries(PLANS).filter(([k]) => k !== result) : []

  const currentStepData = step >= 1 && step <= 6 ? STEPS[step - 1] : null

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 6% 80px' }}>

      {step >= 1 && step <= 6 && (
        <div style={{ width: '100%', maxWidth: '640px', marginBottom: '40px' }}>
          <div style={{ height: '3px', background: 'rgba(249,253,254,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(step / 6) * 100}%`, background: 'linear-gradient(90deg,var(--sky),var(--purple))', borderRadius: '2px', transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <button onClick={goBack} disabled={step === 1} style={{ background: 'none', border: 'none', color: step === 1 ? 'var(--text-dim)' : 'var(--sky)', fontSize: '0.72rem', cursor: step === 1 ? 'default' : 'pointer', fontFamily: 'Inter,sans-serif' }}>
              {step > 1 && '← Back'}
            </button>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Step {step} of 6</div>
            <div style={{ width: '40px' }} />
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* SINGLE-SELECT */}
        {currentStepData && currentStepData.type === 'single' && (
          <div key={step} style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.2 }}>
              {currentStepData.q}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '28px', fontWeight: 300 }}>{currentStepData.sub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentStepData.options.map(o => (
                <button key={o.v} onClick={() => selectSingle(currentStepData.key, o.v)} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: answers[currentStepData.key] === o.v ? 'rgba(16,161,219,0.07)' : 'rgba(249,253,254,0.03)',
                  border: answers[currentStepData.key] === o.v ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                  borderRadius: '14px', padding: '16px 20px', cursor: 'pointer',
                  transition: 'all 0.2s', textAlign: 'left', width: '100%',
                  fontFamily: 'Inter,sans-serif',
                }}
                  onMouseEnter={e => { if (answers[currentStepData.key] !== o.v) e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)' }}
                  onMouseLeave={e => { if (answers[currentStepData.key] !== o.v) e.currentTarget.style.borderColor = 'var(--glass-border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--sky)' }}>
                    <Icon name={o.icon as any} size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: '2px' }}>{o.l}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 300 }}>{o.d}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/packages" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textDecoration: 'none' }}>
                Skip → View all packages
              </Link>
            </div>
          </div>
        )}

        {/* MULTI-SELECT */}
        {currentStepData && currentStepData.type === 'multi' && (
          <div key={step} style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.2 }}>
              {currentStepData.q}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '28px', fontWeight: 300 }}>{currentStepData.sub}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }} className="quiz-check-grid">
              {currentStepData.options.map(o => {
                const selected = ((answers[currentStepData.key] as string[]) || []).includes(o.v)
                return (
                  <div key={o.v} onClick={() => toggleMulti(currentStepData.key, o.v)} style={{
                    background: selected ? 'rgba(16,161,219,0.07)' : 'rgba(249,253,254,0.03)',
                    border: selected ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                    borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                  }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${selected ? 'var(--sky)' : 'var(--glass-border)'}`, background: selected ? 'var(--sky)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--dark)' }}>
                      {selected && <Icon name="check" size={12} strokeWidth={3} />}
                    </div>
                    <Icon name={o.icon as any} size={16} color="var(--sky)" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 500 }}>{o.l}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(step + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                Skip this step
              </button>
              <button onClick={() => setStep(step + 1)} className="btn-primary">Continue →</button>
            </div>
          </div>
        )}

        {step === 6 && currentStepData && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={goToProcessing} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              Skip → See Results
            </button>
          </div>
        )}

        {/* PROCESSING */}
        {step === 7 && (
          <div style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto 32px', border: '3px solid rgba(16,161,219,0.15)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '32px' }}>
              Analyzing your answers…
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px', margin: '0 auto', textAlign: 'left' }}>
              {PROC_STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: procStep > i ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: procStep > i ? 'rgba(16,161,219,0.15)' : 'transparent', border: `1.5px solid ${procStep > i ? 'var(--sky)' : 'var(--glass-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky)' }}>
                    {procStep > i && <Icon name="check" size={12} strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: procStep > i ? 'var(--white)' : 'var(--text-muted)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === 8 && plan && (
          <div style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(16,161,219,0.08))', border: '1px solid rgba(16,161,219,0.25)', borderRadius: '20px', padding: '32px', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', color: '#fff', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px', marginBottom: '16px' }}>
                <Icon name="star" size={11} /> Best Match
              </div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.5rem', color: 'var(--white)', letterSpacing: '-1px', marginBottom: '4px' }}>{plan.name}</h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--sky)', fontWeight: 600, marginBottom: '12px' }}>${plan.price} / month</div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(249,253,254,0.6)', fontWeight: 300, marginBottom: '20px' }}>{plan.reason}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
                {plan.feats.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', fontWeight: 300 }}>
                    <span style={{ color: 'var(--sky)', display: 'inline-flex' }}><Icon name="check" size={14} /></span>{f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {otherPlans.map(([k, p]) => (
                <div key={k} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>Alt option</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--white)', marginBottom: '2px' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sky)', fontWeight: 600 }}>${p.price}/mo</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={openBooking} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '16px' }}>Book a Free Strategy Call →</button>
              <button onClick={() => setStep(9)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Customize My Plan</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer' }}>← Start Over</button>
            </div>
          </div>
        )}

        {/* CUSTOMIZATION */}
        {step === 9 && plan && (
          <div style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '10px' }}>
              Tweak Your Plan
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 300 }}>
              Your recommended plan is already included. Add or remove extras to match exactly what you need.
            </p>
            <div style={{ background: 'rgba(16,161,219,0.05)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--sky)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="check" size={14} strokeWidth={2.5} />
              Base: {plan.name} Plan — ${plan.price}/mo
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }} className="quiz-check-grid">
              {ADDONS.map(a => (
                <div key={a.id} onClick={() => setAddons({ ...addons, [a.id]: !addons[a.id] })} style={{
                  background: addons[a.id] ? 'rgba(16,161,219,0.07)' : 'rgba(249,253,254,0.03)',
                  border: addons[a.id] ? '1.5px solid var(--sky)' : '1.5px solid var(--glass-border)',
                  borderRadius: '12px', padding: '12px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${addons[a.id] ? 'var(--sky)' : 'var(--glass-border)'}`, background: addons[a.id] ? 'var(--sky)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--dark)' }}>
                    {addons[a.id] && <Icon name="check" size={12} strokeWidth={3} />}
                  </div>
                  <Icon name={a.icon as any} size={15} color="var(--sky)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--white)', fontWeight: 500 }}>{a.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--sky)', fontWeight: 600 }}>{a.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={goBack} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>← Back</button>
              <button onClick={() => setStep(10)} className="btn-primary">See Final Summary →</button>
            </div>
          </div>
        )}

        {/* FINAL CTA */}
        {step === 10 && plan && (
          <div style={{ animation: 'pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.6),rgba(106,70,217,0.15))', border: '1px solid rgba(16,161,219,0.3)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ color: 'var(--sky)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <Icon name="target" size={56} />
              </div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)', color: 'var(--white)', letterSpacing: '-1px', marginBottom: '16px' }}>
                You&apos;re Ready to Grow
              </h1>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(16,161,219,0.1)', border: '1px solid rgba(16,161,219,0.25)', color: 'var(--sky)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', marginBottom: '20px' }}>
                Recommended: {plan.name} Plan — ${plan.price}/mo
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.75, fontWeight: 300, marginBottom: '28px' }}>
                The next step is a free 30-minute strategy call. We&apos;ll walk through your plan, answer every question, and make sure we&apos;re the right fit before you commit to anything.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={openBooking} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}>Book My Free Strategy Call →</button>
                <Link href="/packages" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Browse All Packages First</Link>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '16px', lineHeight: 1.6 }}>
                No commitment. No credit card. Just a conversation about your business.
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer' }}>← Start Over</button>
            </div>
          </div>
        )}

      </div>

      {/* ───────── BOOKING CAPTURE MODAL ───────── */}
      {bookingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !bookSubmitting && setBookingOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(4,8,16,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'pageIn 0.25s ease',
          }}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={submitBooking}
            style={{
              maxWidth: '440px', width: '100%',
              background: 'linear-gradient(180deg, rgba(16,24,40,0.98), rgba(6,12,20,0.98))',
              border: '1px solid rgba(16,161,219,0.25)',
              borderRadius: '18px',
              padding: '26px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>One quick step</div>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', margin: 0 }}>
                  Who are we meeting?
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '6px 0 0' }}>
                  So Karim knows your plan before the call. Takes 10 seconds.
                </p>
              </div>
              <button type="button" onClick={() => setBookingOpen(false)} aria-label="Close" style={{
                background: 'transparent', border: 'none', color: 'var(--text-dim)',
                cursor: 'pointer', padding: '4px', fontSize: '1.2rem', lineHeight: 1,
              }}>×</button>
            </div>

            <label style={modalLabel}>Full name *</label>
            <input
              required autoFocus
              value={bookForm.name}
              onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              style={modalInput}
            />

            <label style={{ ...modalLabel, marginTop: '12px' }}>Email *</label>
            <input
              required type="email"
              value={bookForm.email}
              onChange={e => setBookForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              style={modalInput}
            />

            <label style={{ ...modalLabel, marginTop: '12px' }}>WhatsApp (optional)</label>
            <input
              type="tel"
              value={bookForm.whatsapp}
              onChange={e => setBookForm(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="+961 …"
              style={modalInput}
            />

            {bookError && (
              <div style={{
                marginTop: '12px',
                padding: '9px 12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                color: '#ff8585',
                fontSize: '0.76rem',
              }}>{bookError}</div>
            )}

            <button
              type="submit"
              disabled={bookSubmitting}
              className="btn-primary"
              style={{ marginTop: '18px', width: '100%', justifyContent: 'center', fontSize: '0.92rem', padding: '14px' }}
            >
              {bookSubmitting ? 'Saving…' : 'Continue to booking →'}
            </button>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px', margin: '10px 0 0' }}>
              Your quiz answers will be shared with Karim. No spam.
            </p>
          </form>
        </div>
      )}

      <style>{`
        @keyframes pageIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:600px){
          .quiz-check-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}

const modalLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.66rem',
  fontWeight: 600,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const modalInput: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid var(--glass-border)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: 'var(--white)',
  width: '100%',
  fontFamily: 'Inter,sans-serif',
  fontSize: '0.86rem',
  outline: 'none',
}
