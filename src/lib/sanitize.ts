// Shared input-sanitization helpers used by the public submission endpoints
// (contact, package, career). Two jobs:
//   1. Normalize emails so "Karim@Gmail.com" and "karim@gmail.com" collapse
//      to the same row — prevents duplicate leads and lookup misses.
//   2. HTML-escape ALL user-supplied values before interpolating them into
//      the admin notification email templates. Without this, anyone can
//      inject a clickable phishing link into info@yallagrow.net's inbox
//      via the name/message fields.

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape a string for safe interpolation into HTML (attributes or body). */
export function esc(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s).replace(/[&<>"']/g, ch => ESCAPE_MAP[ch])
}

/** Trim + lowercase, so email identity is consistent across tables. */
export function normalizeEmail(s: string | null | undefined): string {
  return String(s ?? '').trim().toLowerCase()
}

/** Minimal RFC-ish email validation (matches the client-side regex). */
export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}
