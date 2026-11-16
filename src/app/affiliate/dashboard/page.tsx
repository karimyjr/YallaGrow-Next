// Affiliate self-service dashboard route.
// Mounts the real dashboard component — login if no session, else
// KPIs + referrals pulled from /api/affiliate/me.
import AffiliateDashboard from '@/components/pages/AffiliateDashboard'

export const metadata = {
  title: 'Affiliate Dashboard',
  description: 'Track your YallaGrow referrals, commissions, and payouts.',
}

export default function AffiliateDashboardPage() {
  return <AffiliateDashboard />
}
