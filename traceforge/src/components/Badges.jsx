import React from 'react'
import { severityColor, levelColor } from '../utils/helpers'

// ─── Log Level Badge ──────────────────────────────────────────────────────────
export function LevelBadge({ level }) {
  const styles = {
    ERROR: { bg: 'var(--red-dim)',    border: 'rgba(255,61,90,0.30)',   color: 'var(--red)' },
    WARN:  { bg: 'var(--amber-dim)',  border: 'rgba(255,184,0,0.30)',   color: 'var(--amber)' },
    INFO:  { bg: 'var(--cyan-dim)',   border: 'rgba(0,212,255,0.25)',   color: 'var(--cyan)' },
    DEBUG: { bg: 'var(--purple-dim)', border: 'rgba(176,106,255,0.25)', color: 'var(--purple)' },
  }
  const s = styles[level] || styles.DEBUG
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '9px', fontWeight: 700, letterSpacing: '1px',
      padding: '2px 7px', borderRadius: '3px',
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: 'var(--font-mono)',
    }}>
      {level}
    </span>
  )
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
export function SeverityBadge({ severity }) {
  const bgMap = {
    CRITICAL: 'rgba(255,61,90,0.12)',
    HIGH:     'rgba(255,124,66,0.12)',
    MEDIUM:   'rgba(255,184,0,0.10)',
    LOW:      'rgba(0,212,255,0.08)',
  }
  const borderMap = {
    CRITICAL: 'rgba(255,61,90,0.35)',
    HIGH:     'rgba(255,124,66,0.30)',
    MEDIUM:   'rgba(255,184,0,0.28)',
    LOW:      'rgba(0,212,255,0.25)',
  }
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px',
      padding: '2px 8px', borderRadius: '3px',
      background: bgMap[severity] || 'var(--bg-elevated)',
      border: `1px solid ${borderMap[severity] || 'var(--border)'}`,
      color: severityColor(severity),
      fontFamily: 'var(--font-mono)',
    }}>
      {severity}
    </span>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    NEW:          { bg: 'rgba(255,61,90,0.10)',   border: 'rgba(255,61,90,0.25)',   color: 'var(--red)',   dot: 'var(--red)'   },
    ACKNOWLEDGED: { bg: 'rgba(255,184,0,0.09)',   border: 'rgba(255,184,0,0.25)',   color: 'var(--amber)', dot: 'var(--amber)' },
    RESOLVED:     { bg: 'rgba(0,255,153,0.07)',   border: 'rgba(0,255,153,0.20)',   color: 'var(--green)', dot: 'var(--green)' },
  }
  const s = map[status] || map.NEW
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px',
      padding: '2px 8px 2px 6px', borderRadius: '10px',
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: 'var(--font-mono)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

// ─── Mode Badge ───────────────────────────────────────────────────────────────
export function ModeBadge({ mode }) {
  const isRealtime = mode === 'realtime'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px',
      padding: '3px 9px', borderRadius: '4px',
      background: isRealtime ? 'var(--green-dim)' : 'var(--cyan-dim)',
      border: `1px solid ${isRealtime ? 'rgba(0,255,153,0.2)' : 'rgba(0,212,255,0.2)'}`,
      color: isRealtime ? 'var(--green)' : 'var(--cyan)',
    }}>
      {isRealtime && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--green)', flexShrink: 0,
          animation: 'pulse-dot 2s infinite',
        }} />
      )}
      {mode?.toUpperCase()}
    </span>
  )
}
