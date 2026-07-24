'use client'
import { useState } from 'react'

interface Model1State {
  revenue: number
  expenses: number
  length: 3 | 6 | 12
  stage: 'startup' | 'growing' | 'established'
  complexity: 'low' | 'medium' | 'high'
  growth: number
}

interface Model2State {
  price: number
  margin: number
  sales: number
  length: 3 | 6 | 12
  closeRate: number
  complexity: 'low' | 'medium' | 'high'
  growth: number
}

const stageMultMap = { startup: 1.0, growing: 1.25, established: 1.5 }
const complexityMultMap = { low: 1, medium: 1.15, high: 1.35 }
const contractMultMap: Record<number, number> = { 3: 1, 6: 0.95, 12: 0.9 }

export default function PerformancePartnership() {
  const [activeModel, setActiveModel] = useState<1 | 2>(1)

  const [m1, setM1] = useState<Model1State>({
    revenue: 0, expenses: 0, length: 3, stage: 'startup', complexity: 'low', growth: 20,
  })

  const [m2, setM2] = useState<Model2State>({
    price: 0, margin: 0, sales: 0, length: 3, closeRate: 20, complexity: 'low', growth: 20,
  })

  // ========== MODEL 1 CALCULATIONS ==========
  const netProfit = m1.revenue - m1.expenses
  const m1IsLoss = m1.revenue <= 0 || netProfit <= 0

  let m1Results = { deposit: 0, commissionPct: 0, monthlyCommission: 0, annual: 0, netProfit: 0 }
  if (!m1IsLoss) {
    const stageMult = stageMultMap[m1.stage]
    const complexityMult = complexityMultMap[m1.complexity]
    const contractMult = contractMultMap[m1.length]
    const deposit = Math.round((500 * stageMult * complexityMult * contractMult) / 10) * 10

    let commissionPct: number
    if (netProfit < 5000) commissionPct = 30
    else if (netProfit < 15000) commissionPct = 25
    else if (netProfit < 30000) commissionPct = 20
    else if (netProfit < 75000) commissionPct = 15
    else commissionPct = 10

    const monthlyCommission = netProfit * (commissionPct / 100)
    const annual = deposit + monthlyCommission * 12

    m1Results = { deposit, commissionPct, monthlyCommission, annual, netProfit }
  }

  // ========== MODEL 2 CALCULATIONS ==========
  const monthlyRevenue2 = m2.price * m2.sales
  const monthlyProfit2 = monthlyRevenue2 * (m2.margin / 100)
  const newSales2 = m2.sales * (m2.growth / 100)
  const addRevenue2 = newSales2 * m2.price

  let m2CommissionPct: number
  if (m2.price < 100) m2CommissionPct = 15
  else if (m2.price <= 500) m2CommissionPct = 12
  else if (m2.price <= 2000) m2CommissionPct = 10
  else if (m2.price <= 5000) m2CommissionPct = 8
  else m2CommissionPct = 5

  const m2ComplexityMult = complexityMultMap[m2.complexity]
  const m2ContractMult = contractMultMap[m2.length]
  const volumeMult = m2.sales > 50 ? 1.3 : m2.sales > 20 ? 1.15 : 1
  const m2Deposit = Math.round((400 * m2ComplexityMult * m2ContractMult * volumeMult) / 10) * 10
  const commissionPerSale = m2.price * (m2CommissionPct / 100)
  const m2MonthlyCommission = commissionPerSale * m2.sales
  const annualCommission = m2MonthlyCommission * 12
  const roi = m2Deposit > 0 ? ((m2MonthlyCommission * 12) / m2Deposit) * 100 : 0

  const inputStyle: React.CSSProperties = { background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '11px 14px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%' }
  const labelStyle: React.CSSProperties = { fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }

  return (
    <section style={{ padding: '80px 6% 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', color: '#fff', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '1.5px', padding: '5px 14px', borderRadius: '100px', textTransform: 'uppercase' }}>
          🔒 Invite-Only
        </span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Performance Partnership</span>
        <h2 className="section-title" style={{ marginTop: '8px', marginBottom: '16px' }}>Performance Partnership</h2>
        <p className="section-sub" style={{ margin: '16px auto 0', maxWidth: '640px' }}>
          We don&apos;t just work for you — we grow with you. Instead of paying a large monthly retainer, we combine a strategic upfront deposit with performance-based compensation. Our success is directly tied to yours.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '5px' }} className="pp-tabs-wrapper">
        <button onClick={() => setActiveModel(1)} style={{
          flex: 1, padding: '11px 16px', borderRadius: '10px',
          background: activeModel === 1 ? 'linear-gradient(135deg,var(--sky),var(--purple))' : 'transparent',
          color: activeModel === 1 ? '#fff' : 'var(--text-muted)',
          border: 'none', cursor: 'pointer',
          fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', fontWeight: 700,
          transition: 'all 0.2s',
        }}>Model 1 — Net Profit Share</button>
        <button onClick={() => setActiveModel(2)} style={{
          flex: 1, padding: '11px 16px', borderRadius: '10px',
          background: activeModel === 2 ? 'linear-gradient(135deg,var(--sky),var(--purple))' : 'transparent',
          color: activeModel === 2 ? '#fff' : 'var(--text-muted)',
          border: 'none', cursor: 'pointer',
          fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', fontWeight: 700,
          transition: 'all 0.2s',
        }}>Model 2 — Per Sale Commission</button>
      </div>

      {/* MODEL 1 */}
      {activeModel === 1 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.7, fontWeight: 300, marginBottom: '12px' }}>
              YallaGrow receives an upfront deposit covering strategy, onboarding, creative production, systems setup, and initial execution — plus a percentage of your <strong style={{ color: 'var(--sky)' }}>monthly net profit</strong>, not gross revenue.
            </p>
            <div style={{ display: 'inline-block', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '100px', padding: '6px 16px', fontSize: '0.75rem', color: 'var(--sky)', fontWeight: 600 }}>
              Net Profit = Revenue − Business Expenses
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="pp-calc-grid">
            {/* Inputs */}
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>MONTHLY REVENUE ($)</label>
                <input type="number" placeholder="e.g. 20000" min={0} value={m1.revenue || ''} onChange={e => setM1({ ...m1, revenue: Number(e.target.value) || 0 })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>BUSINESS EXPENSES ($)</label>
                <input type="number" placeholder="e.g. 12000" min={0} value={m1.expenses || ''} onChange={e => setM1({ ...m1, expenses: Number(e.target.value) || 0 })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }} className="pp-field-row">
                <div>
                  <label style={labelStyle}>PARTNERSHIP LENGTH</label>
                  <select value={m1.length} onChange={e => setM1({ ...m1, length: Number(e.target.value) as 3 | 6 | 12 })} style={inputStyle}>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>BUSINESS STAGE</label>
                  <select value={m1.stage} onChange={e => setM1({ ...m1, stage: e.target.value as 'startup' | 'growing' | 'established' })} style={inputStyle}>
                    <option value="startup">Startup</option>
                    <option value="growing">Growing</option>
                    <option value="established">Established</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>MARKETING COMPLEXITY</label>
                <select value={m1.complexity} onChange={e => setM1({ ...m1, complexity: e.target.value as 'low' | 'medium' | 'high' })} style={inputStyle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>EXPECTED MONTHLY GROWTH</label>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--sky)' }}>{m1.growth}%</span>
                </div>
                <input type="range" min={0} max={100} value={m1.growth} onChange={e => setM1({ ...m1, growth: Number(e.target.value) })} style={{ width: '100%', height: '4px', accentColor: 'var(--sky)' }} />
              </div>
            </div>

            {/* Results */}
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.4),rgba(16,161,219,0.05))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '16px', padding: '24px' }}>
              {m1IsLoss ? (
                <div style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: '12px', padding: '20px', color: '#ffc107', fontSize: '0.85rem', lineHeight: 1.6, textAlign: 'center' }}>
                  ⚠️ Your business is currently operating at a loss. We recommend improving profitability before entering a performance partnership.
                </div>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>NET PROFIT</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--white)', letterSpacing: '-1px' }}>${Math.round(m1Results.netProfit).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <ResultCard label="DEPOSIT" value={`$${m1Results.deposit.toLocaleString()}`} />
                    <ResultCard label="COMMISSION" value={`${m1Results.commissionPct}%`} />
                    <ResultCard label="MONTHLY PROFIT SHARE" value={`$${Math.round(m1Results.monthlyCommission).toLocaleString()}`} highlight />
                    <ResultCard label="PROJECTED ANNUAL VALUE" value={`$${Math.round(m1Results.annual).toLocaleString()}`} highlight />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODEL 2 */}
      {activeModel === 2 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
              Instead of charging a percentage of profit, YallaGrow earns a <strong style={{ color: 'var(--sky)' }}>commission for every successful sale</strong> generated through our marketing efforts.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {['Service Businesses', 'High-Ticket Products', 'Consultants', 'Agencies', 'Education', 'Medical', 'Real Estate'].map(c => (
                <span key={c} style={{ background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '100px', padding: '5px 12px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--sky)' }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="pp-calc-grid">
            {/* Inputs */}
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>PRODUCT / SERVICE PRICE ($)</label>
                <input type="number" placeholder="e.g. 800" min={0} value={m2.price || ''} onChange={e => setM2({ ...m2, price: Number(e.target.value) || 0 })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }} className="pp-field-row">
                <div>
                  <label style={labelStyle}>PROFIT MARGIN (%)</label>
                  <input type="number" placeholder="e.g. 40" min={0} max={100} value={m2.margin || ''} onChange={e => setM2({ ...m2, margin: Number(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>AVG. MONTHLY SALES</label>
                  <input type="number" placeholder="e.g. 15" min={0} value={m2.sales || ''} onChange={e => setM2({ ...m2, sales: Number(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }} className="pp-field-row">
                <div>
                  <label style={labelStyle}>AVG. CLOSE RATE (%)</label>
                  <input type="number" placeholder="e.g. 20" min={0} max={100} value={m2.closeRate || ''} onChange={e => setM2({ ...m2, closeRate: Number(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CONTRACT DURATION</label>
                  <select value={m2.length} onChange={e => setM2({ ...m2, length: Number(e.target.value) as 3 | 6 | 12 })} style={inputStyle}>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>MARKETING COMPLEXITY</label>
                <select value={m2.complexity} onChange={e => setM2({ ...m2, complexity: e.target.value as 'low' | 'medium' | 'high' })} style={inputStyle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>EXPECTED SALES INCREASE</label>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--sky)' }}>{m2.growth}%</span>
                </div>
                <input type="range" min={0} max={100} value={m2.growth} onChange={e => setM2({ ...m2, growth: Number(e.target.value) })} style={{ width: '100%', height: '4px', accentColor: 'var(--sky)' }} />
              </div>
            </div>

            {/* Results */}
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.4),rgba(16,161,219,0.05))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Est. Monthly Revenue</span>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)' }}>${Math.round(monthlyRevenue2).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Est. Monthly Profit</span>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)' }}>${Math.round(monthlyProfit2).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Additional Revenue (from growth)</span>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--sky)' }}>${Math.round(addRevenue2).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <ResultCard label="DEPOSIT" value={`$${m2Deposit.toLocaleString()}`} />
                <ResultCard label="COMMISSION" value={`${m2CommissionPct}%`} />
                <ResultCard label="PER SALE" value={`$${commissionPerSale.toFixed(0)}`} />
                <ResultCard label="ROI ESTIMATE" value={`${Math.round(roi)}%`} />
                <ResultCard label="MONTHLY COMMISSION" value={`$${Math.round(m2MonthlyCommission).toLocaleString()}`} highlight />
                <ResultCard label="ANNUAL COMMISSION" value={`$${Math.round(annualCommission).toLocaleString()}`} highlight />
              </div>
            </div>
          </div>
        </div>
      )}

      <p style={{ maxWidth: '760px', margin: '32px auto 0', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.7, fontStyle: 'italic' }}>
        Every Performance Partnership is customized after a discovery call. The estimates above are for illustration purposes only. Final deposits, commission rates, and partnership terms are determined based on business model, operational complexity, growth potential, and projected return on investment.
      </p>

      <style>{`
        @media(max-width:800px){
          .pp-calc-grid{grid-template-columns:1fr!important}
          .pp-tabs-wrapper{flex-direction:column!important}
        }
        @media(max-width:500px){
          .pp-field-row{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  )
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'rgba(16,161,219,0.08)' : 'rgba(249,253,254,0.02)',
      border: `1px solid ${highlight ? 'rgba(16,161,219,0.2)' : 'var(--glass-border)'}`,
      borderRadius: '10px', padding: '14px',
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: highlight ? 'var(--sky)' : 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: highlight ? '1.4rem' : '1.15rem', color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
    </div>
  )
}
