import React from 'react'

const SELECT_STYLE = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  padding: '6px 10px',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.15s',
  minWidth: 140,
}

// ─── Filter Select ────────────────────────────────────────────────────────────
export function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={SELECT_STYLE}
      onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-card)' }}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// ─── Icon Button ──────────────────────────────────────────────────────────────
export function IconButton({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--cyan)'
        e.currentTarget.style.color = 'var(--cyan)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-bright)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
    >
      {children}
    </button>
  )
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
export function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--cyan-dim)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
        color: active ? 'var(--cyan)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px', fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

// ─── Action Button ────────────────────────────────────────────────────────────
export function ActionButton({ onClick, variant = 'default', children, disabled }) {
  const variants = {
    ack: {
      bg: 'rgba(255,184,0,0.07)', border: 'rgba(255,184,0,0.28)', color: 'var(--amber)',
      hoverBg: 'rgba(255,184,0,0.16)',
    },
    resolve: {
      bg: 'rgba(0,255,153,0.06)', border: 'rgba(0,255,153,0.22)', color: 'var(--green)',
      hoverBg: 'rgba(0,255,153,0.14)',
    },
    default: {
      bg: 'var(--bg-card)', border: 'var(--border)', color: 'var(--text-secondary)',
      hoverBg: 'var(--bg-hover)',
    },
  }
  const v = variants[variant] || variants.default
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        background: v.bg, border: `1px solid ${v.border}`, color: v.color,
        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.3px', cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.15s', opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = v.hoverBg }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = v.bg }}
    >
      {children}
    </button>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, total, size, onChange }) {
  const pages = []
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  for (let i = start; i <= Math.min(start + 4, totalPages); i++) pages.push(i)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '10px 16px', borderTop: '1px solid var(--border)',
      fontSize: 11, color: 'var(--text-muted)',
    }}>
      <PageBtn disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</PageBtn>
      {pages.map(p => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
      ))}
      <PageBtn disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next →</PageBtn>
      <span style={{ marginLeft: 'auto' }}>
        Showing {Math.min(size, total)} of {total?.toLocaleString()}
      </span>
    </div>
  )
}

function PageBtn({ active, disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '3px 10px', borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--cyan-dim)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
        color: active ? 'var(--cyan)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)', fontSize: '11px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.3 : 1, transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  )
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────
export function ConfidenceBar({ value, width = 70, height = 5, showLabel = true }) {
  const pct = Math.round((value || 0) * 100)
  const color = value >= 0.8 ? 'var(--green)' : value >= 0.5 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width, height, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      {showLabel && <span style={{ fontSize: 11, color, minWidth: 32, fontWeight: 600 }}>{pct}%</span>}
    </div>
  )
}
