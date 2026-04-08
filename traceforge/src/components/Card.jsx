import React from 'react'

// ─── Base Card ────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Card Header ──────────────────────────────────────────────────────────────
export function CardHeader({ title, right, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.015)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--text-secondary)',
        }}>
          {title}
        </span>
      </div>
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ value, label, color = 'var(--text-primary)', icon, accent }) {
  return (
    <Card style={{
      padding: '14px 18px',
      position: 'relative',
      overflow: 'hidden',
      borderColor: accent ? `${accent}30` : 'var(--border)',
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px', fontWeight: 800,
            color, lineHeight: 1.1, letterSpacing: '-0.5px',
          }}>
            {value}
          </div>
          <div style={{
            fontSize: '10px', letterSpacing: '1px',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            marginTop: 4,
          }}>
            {label}
          </div>
        </div>
        {icon && <span style={{ fontSize: 22, opacity: 0.5 }}>{icon}</span>}
      </div>
    </Card>
  )
}
