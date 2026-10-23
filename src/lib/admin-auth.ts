// Admin session gate for API routes.
// Matches the pattern in /api/admin/login: the login endpoint sets an
// httpOnly cookie `yg_admin_session` with a random token. Any request
// carrying that cookie is considered admin. There is no server-side
// token store (same as the existing login flow); the cookie's presence
// is the auth signal.
//
// Usage in an API route:
//   const err = requireAdmin(req)
//   if (err) return err
//   // ... admin-only logic ...
import { NextRequest, NextResponse } from 'next/server'

export function requireAdmin(req: NextRequest): NextResponse | null {
  const session = req.cookies.get('yg_admin_session')
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
