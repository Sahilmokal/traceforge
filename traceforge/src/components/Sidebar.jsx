import React from 'react'
import { useClock } from '../hooks/useAsync'
import { formatTime } from '../utils/helpers'

const NAV_ITEMS = [
  { id: 'logs',      label: 'Logs Explorer', icon: '▤', badge: null },
  { id: 'alerts',    label: 'Alerts',        icon: '⚡', badge: 3 },
  { id: 'anomalies', label: 'Anomalies',     icon: '◈', badge: null },
  { id: 'rca',       label: 'Root Cause',    icon: '⬡', badge: null },
]

export default function Sidebar({ activePage, onNavigate }) {
  const clock = useClock()

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Cyan edge glow */}
      <div style={{
        position: 'absolute', top: 0, right: -1, bottom: 0, width: 1,
        background: 'linear-gradient(180deg, transparent 0%, var(--cyan) 30%, var(--cyan) 70%, transparent 100%)',
        opacity: 0.15, pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="6" fill="var(--bg-elevated)"/>
            <path d="M6 10L16 6L26 10L26 22L16 26L6 22Z" fill="none" stroke="var(--cyan)" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="3" fill="var(--cyan)"/>
            <line x1="16" y1="6" x2="16" y2="13" stroke="var(--cyan)" strokeWidth="1" opacity="0.5"/>
            <line x1="16" y1="19" x2="16" y2="26" stroke="var(--cyan)" strokeWidth="1" opacity="0.5"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>
              Trace<span style={{ color: 'var(--cyan)' }}>Forge</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.8px', textTransform: 'uppercase' }}>AI</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px',
          background: 'var(--green-dim)', border: '1px solid rgba(0,255,153,0.15)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0, animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 10, color: 'var(--green)', letterSpacing: '0.5px' }}>Systems Nominal</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 0', flex: 1, overflow: 'auto' }}>
        <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 18px 8px' }}>Monitoring</div>

        {NAV_ITEMS.map(item => {
          const active = activePage === item.id
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 18px',
              background: active ? 'var(--cyan-dim)' : 'transparent',
              border: 'none', borderLeft: `2px solid ${active ? 'var(--cyan)' : 'transparent'}`,
              color: active ? 'var(--cyan)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: active ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(255,61,90,0.28)', borderRadius: 3 }}>{item.badge}</span>
              )}
            </button>
          )
        })}

        <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
        <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 18px 8px' }}>Infrastructure</div>

        {[
          { label: 'Kafka',         detail: 'broker:9092' },
          { label: 'Elasticsearch', detail: '3 nodes' },
          { label: 'FastAPI AI',    detail: 'port:8001' },
        ].map(({ label, detail }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 18px', fontSize: 11 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: 'var(--green)' }} />
            <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{detail}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', opacity: 0.5, marginBottom: 2 }}>{formatTime(clock)}</div>
        <div>TraceForge AI v2.4.1</div>
        <div style={{ opacity: 0.6, marginTop: 1 }}>© 2025 TraceForge</div>
      </div>
    </div>
  )
}
