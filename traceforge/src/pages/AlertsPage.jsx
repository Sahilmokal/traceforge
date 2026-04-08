import React, { useState, useCallback } from 'react'
import { fetchAlerts } from '../services/api'
import { MOCK_ALERTS } from '../services/mockData'
import { useAsync } from '../hooks/useAsync'
import { formatTimestamp, timeAgo } from '../utils/helpers'
import { SeverityBadge, StatusBadge } from '../components/Badges'
import { Card, CardHeader } from '../components/Card'
import { LoadingState, EmptyState, MockNotice } from '../components/States'
import { FilterSelect, Pagination, ActionButton, ConfidenceBar } from '../components/Controls'

const SEVERITY_OPTIONS = [
  { value: 'CRITICAL', label: 'CRITICAL' },
  { value: 'HIGH',     label: 'HIGH' },
  { value: 'MEDIUM',   label: 'MEDIUM' },
  { value: 'LOW',      label: 'LOW' },
]
const STATUS_OPTIONS = [
  { value: 'NEW',          label: 'NEW' },
  { value: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
  { value: 'RESOLVED',     label: 'RESOLVED' },
]

export default function AlertsPage({ usingMock }) {
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('')
  const [severity, setSeverity] = useState('')
  const [localAlerts, setLocal] = useState(null)

  const fetcher = useCallback(async () => {
    if (usingMock) return filterMock(MOCK_ALERTS, status, severity)
    const params = { page, size: 20 }
    if (status)   params.status   = status
    if (severity) params.severity = severity
    try { return await fetchAlerts(params) }
    catch { return filterMock(MOCK_ALERTS, status, severity) }
  }, [page, status, severity, usingMock])

  const { data: fetched, loading, refetch } = useAsync(fetcher, [page, status, severity, usingMock])
  const data = localAlerts || fetched

  const handleAction = (id, action) => {
    const next = action === 'ack' ? 'ACKNOWLEDGED' : 'RESOLVED'
    setLocal(prev => {
      const base = prev || fetched
      return { ...base, data: base.data.map(a => a.id === id ? { ...a, status: next } : a) }
    })
  }

  const setFilter = (setter) => (val) => { setter(val); setPage(1); setLocal(null) }
  const alerts     = data?.data || []
  const newCount   = alerts.filter(a => a.status === 'NEW').length
  const ackCount   = alerts.filter(a => a.status === 'ACKNOWLEDGED').length
  const critCount  = alerts.filter(a => a.severity === 'CRITICAL').length
  const totalPages = data ? Math.ceil(data.total / data.size) : 1

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {usingMock && <MockNotice />}

      <div className="stat-grid-4">
        {[
          { label: 'Active Alerts', value: newCount,         color: 'var(--red)' },
          { label: 'Acknowledged',  value: ackCount,         color: 'var(--amber)' },
          { label: 'Critical',      value: critCount,        color: 'var(--red)' },
          { label: 'Total Alerts',  value: data?.total ?? 0, color: 'var(--text-primary)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div className="stat-val-display" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <FilterSelect value={status}   onChange={setFilter(setStatus)}   options={STATUS_OPTIONS}   placeholder="All Statuses" />
        <FilterSelect value={severity} onChange={setFilter(setSeverity)} options={SEVERITY_OPTIONS} placeholder="All Severities" />
        <div style={{ marginLeft: 'auto' }}>
          <ActionButton onClick={() => { setLocal(null); refetch() }} variant="default">↻ Refresh</ActionButton>
        </div>
      </div>

      <Card>
        <CardHeader title="Alert Feed" icon="⚡"
          right={<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{newCount > 0 && <span style={{ color: 'var(--red)', marginRight: 8 }}>● {newCount} new</span>}{data?.total ?? 0} total</span>}
        />
        {loading ? <LoadingState message="Loading alerts..." /> : !alerts.length ? <EmptyState icon="⚡" message="No alerts found" sub="All clear!" /> : (
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Severity','Type','Root Service','Status','Confidence','Detected','Actions'].map((h, i) => (
                    <th key={h} className={i === 1 || i === 4 || i === 5 ? 'col-hide-xs' : ''} style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                      color: 'var(--text-muted)', padding: '9px 12px', textAlign: 'left',
                      borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.012)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={a.id || i} style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}><SeverityBadge severity={a.severity} /></td>
                    <td className="col-hide-xs" style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.anomalyType?.replace(/_/g,' ')}</span>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{a.rootService}</span>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}><StatusBadge status={a.status} /></td>
                    <td className="col-hide-xs" style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}><ConfidenceBar value={a.confidence} width={60} /></td>
                    <td className="col-hide-xs" style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(a.firstDetectedAt)}</div>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {a.status === 'NEW' && <ActionButton variant="ack" onClick={() => handleAction(a.id,'ack')}>ACK</ActionButton>}
                        {a.status !== 'RESOLVED' && <ActionButton variant="resolve" onClick={() => handleAction(a.id,'resolve')}>RESOLVE</ActionButton>}
                        {a.status === 'RESOLVED' && <span style={{ fontSize: 10, color: 'var(--green)', opacity: 0.6 }}>✓</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} total={data?.total ?? 0} size={data?.size ?? 20}
          onChange={(p) => { setPage(p); setLocal(null) }} />
      </Card>
    </div>
  )
}

function filterMock(mock, status, severity) {
  let d = [...mock.data]
  if (status)   d = d.filter(a => a.status === status)
  if (severity) d = d.filter(a => a.severity === severity)
  return { ...mock, data: d, total: d.length }
}
