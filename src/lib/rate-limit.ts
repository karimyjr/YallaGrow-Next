// src/lib/rate-limit.ts
// Simple in-memory rate limiter.
// For a small site this is fine. For high traffic, swap to Upstash Redis.

type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

// Clean up old entries every 10 minutes so the map doesn't grow forever
if (typeof globalThis !== 'undefined' && !(globalThis as unknown as { __rateLimitCleanup?: NodeJS.Timeout }).__rateLimitCleanup) {
  (globalThis as unknown as { __rateLimitCleanup: NodeJS.Timeout }).__rateLimitCleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 10 * 60 * 1000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a key has exceeded its rate limit.
 * @param key - Unique identifier (usually IP address + route)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // Start fresh window
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/**
 * Get client IP from a NextRequest.
 * Vercel adds x-forwarded-for; fall back to a default if nothing is available.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

/**
 * Convenience: build a key from the IP and route name.
 */
export function makeKey(ip: string, route: string): string {
  return `${route}:${ip}`
}
