import React from 'react'

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 16 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--border)`,
      borderTopColor: 'var(--cyan)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}

// ─── Loading state ────────────────────────────────────────────────────────────
export function LoadingState({ message = 'Fetching data...' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: '56px 24px', color: 'var(--text-muted)',
    }}>
      <Spinner />
      <span style={{ fontSize: 12, letterSpacing: '0.5px' }}>{message}</span>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = '◻', message = 'No data found', sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 24px', gap: 8,
    }}>
      <span style={{ fontSize: 28, opacity: 0.3 }}>{icon}</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>{message}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{sub}</span>}
    </div>
  )
}

// ─── Mock data notice ─────────────────────────────────────────────────────────
export function MockNotice() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', marginBottom: 16,
      background: 'rgba(255,184,0,0.05)',
      border: '1px solid rgba(255,184,0,0.18)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 11, color: 'var(--amber)',
    }}>
      <span>⚠</span>
      <span>
        Backend unreachable — displaying demo data.
        Set <code style={{ background: 'rgba(255,184,0,0.1)', padding: '0 4px', borderRadius: 2 }}>VITE_API_URL</code> in{' '}
        <code style={{ background: 'rgba(255,184,0,0.1)', padding: '0 4px', borderRadius: 2 }}>.env</code> to connect your backend.
      </span>
    </div>
  )
}
