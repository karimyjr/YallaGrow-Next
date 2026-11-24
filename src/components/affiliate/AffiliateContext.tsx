'use client'
// Context shared across /affiliate/dashboard/* pages so the layout fetches
// session + referrals once and every sub-page reads from one source. The
// sidebar also reads from here for the user card and sign-out.

import { createContext, useContext } from 'react'

export interface Affiliate {
  id: string
  full_name: string
  email: string
  country?: string
  ref_code: string
  status: string
  promotion_plan?: string
}

export interface Referral {
  id: string
  client_name: string
  client_email: string | null
  invoice_amount: number
  commission_rate: number
  commission_amount: number
  status: string
  created_at: string
}

export interface AffiliateContextValue {
  affiliate: Affiliate
  referrals: Referral[]
  /** Re-fetch /me-session and update referrals in context. */
  refresh: () => Promise<void>
  /** POST /signout-session, clear context, redirect to /affiliate/dashboard. */
  signOut: () => Promise<void>
}

const Ctx = createContext<AffiliateContextValue | null>(null)

export const AffiliateProvider = Ctx.Provider

export function useAffiliate(): AffiliateContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAffiliate must be used inside AffiliateProvider')
  return v
}

/** Shared status-color map used across KPI tiles and table badges. */
export function statusColor(s: string): string {
  switch (s) {
    case 'paid': return '#22c55e'
    case 'pending': return '#f59e0b'
    case 'approved': return '#10a1db'
    case 'active': return '#22c55e'
    case 'rejected': return '#ef4444'
    case 'cancelled': return '#ef4444'
    default: return '#9ca3af'
  }
}
