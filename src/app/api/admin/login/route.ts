// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { rateLimit, getClientIp, makeKey } from '@/lib/rate-limit'

// SECURITY NOTE:
// - Password is NEVER sent to the client
// - Only a hash comparison runs on the server
// - Admin username and password HASH live in env vars, not source code
// - Rate-limited to prevent brute force

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 login attempts per 15 minutes per IP
  const ip = getClientIp(req)
  const limit = rateLimit(makeKey(ip, 'admin-login'), 5, 15 * 60 * 1000)
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const expectedUsername = process.env.ADMIN_USERNAME
    const expectedHash = process.env.ADMIN_PASSWORD_HASH

    if (!expectedUsername || !expectedHash) {
      console.error('Admin credentials not configured in env vars')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const providedHash = hashPassword(password)

    // Use timing-safe comparison to prevent timing attacks
    const usernameOk = crypto.timingSafeEqual(
      Buffer.from(username.padEnd(32).slice(0, 32)),
      Buffer.from(expectedUsername.padEnd(32).slice(0, 32))
    )
    const passwordOk = crypto.timingSafeEqual(
      Buffer.from(providedHash),
      Buffer.from(expectedHash)
    )

    if (!usernameOk || !passwordOk) {
      // Deliberate 500ms delay to slow down any brute force
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Create a session token (random, not reversible to credentials)
    const token = crypto.randomBytes(32).toString('hex')

    const res = NextResponse.json({ success: true })

    // HttpOnly cookie — cannot be read by JavaScript (prevents XSS token theft)
    res.cookies.set('yg_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
