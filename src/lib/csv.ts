// Tiny CSV exporter — no dependencies.
// Handles strings with commas, quotes, and newlines by RFC 4180 rules.

function escapeCell(v: unknown): string {
  if (v === null || v === undefined) return ''
  let s: string
  if (typeof v === 'object') {
    try { s = JSON.stringify(v) } catch { s = String(v) }
  } else {
    s = String(v)
  }
  // Must be quoted if it contains comma, quote, CR or LF
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

/**
 * Turn an array of records into a CSV string. Column order is the union
 * of keys from every row, with the first row's keys leading.
 */
export function rowsToCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const keys: string[] = []
  const seen = new Set<string>()
  for (const r of rows) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) { seen.add(k); keys.push(k) }
    }
  }
  const header = keys.map(escapeCell).join(',')
  const body = rows.map(r => keys.map(k => escapeCell(r[k])).join(',')).join('\n')
  return header + '\n' + body
}

/**
 * Trigger a browser download of `rows` as a CSV file named `filename`.
 * Dates get prefixed to the name so repeated exports don't clobber each
 * other in the Downloads folder.
 */
export function downloadCSV(rows: Record<string, unknown>[], filename: string): void {
  const csv = rowsToCSV(rows)
  const stamp = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
  const safe = filename.replace(/\.csv$/i, '')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safe}-${stamp}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
