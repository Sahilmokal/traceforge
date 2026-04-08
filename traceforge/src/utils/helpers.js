// ─── Date formatting ──────────────────────────────────────────────────────────
export function formatTimestamp(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  })
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour12: false })
}

export function timeAgo(ts) {
  if (!ts) return '—'
  const diff = Date.now() - new Date(ts).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

// ─── Confidence helpers ───────────────────────────────────────────────────────
export function confidenceColor(c) {
  if (c >= 0.8) return 'var(--green)'
  if (c >= 0.5) return 'var(--amber)'
  return 'var(--red)'
}

export function confidenceLabel(c) {
  if (c >= 0.85) return 'Very High'
  if (c >= 0.7)  return 'High'
  if (c >= 0.5)  return 'Medium'
  return 'Low'
}

// ─── Severity helpers ─────────────────────────────────────────────────────────
export const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

export function severityColor(sev) {
  const map = { CRITICAL: 'var(--red)', HIGH: 'var(--orange)', MEDIUM: 'var(--amber)', LOW: 'var(--cyan)' }
  return map[sev] || 'var(--text-secondary)'
}

// ─── Log level helpers ────────────────────────────────────────────────────────
export function levelColor(level) {
  const map = { ERROR: 'var(--red)', WARN: 'var(--amber)', INFO: 'var(--cyan)', DEBUG: 'var(--purple)' }
  return map[level] || 'var(--text-secondary)'
}

// ─── Number formatting ────────────────────────────────────────────────────────
export function formatNumber(n) {
  if (!n && n !== 0) return '—'
  return n.toLocaleString()
}

// ─── Truncate string ──────────────────────────────────────────────────────────
export function truncate(str, len = 50) {
  if (!str) return '—'
  return str.length > len ? str.slice(0, len) + '…' : str
}

// ─── Clamp ────────────────────────────────────────────────────────────────────
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
