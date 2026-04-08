import React, { useState, useCallback } from 'react'
import { fetchLogs } from '../services/api'
import { MOCK_LOGS } from '../services/mockData'
import { useAsync } from '../hooks/useAsync'
import { formatTimestamp } from '../utils/helpers'
import { LevelBadge } from '../components/Badges'
import { Card, CardHeader } from '../components/Card'
import { LoadingState, EmptyState, MockNotice } from '../components/States'
import { FilterSelect, Pagination, IconButton } from '../components/Controls'

const SERVICE_OPTIONS = [
  { value: 'inventory-service',    label: 'inventory-service' },
  { value: 'order-service',        label: 'order-service' },
  { value: 'auth-service',         label: 'auth-service' },
  { value: 'payment-service',      label: 'payment-service' },
  { value: 'gateway-service',      label: 'gateway-service' },
  { value: 'notification-service', label: 'notification-service' },
]

const LEVEL_OPTIONS = [
  { value: 'ERROR', label: 'ERROR' },
  { value: 'WARN',  label: 'WARN' },
  { value: 'INFO',  label: 'INFO' },
  { value: 'DEBUG', label: 'DEBUG' },
]

const LEVEL_ROW_TINT = {
  ERROR: 'rgba(255,61,90,0.03)',
  WARN:  'rgba(255,184,0,0.015)',
}

export default function LogsPage({ usingMock }) {
  const [page, setPage]      = useState(1)
  const [service, setService] = useState('')
  const [level, setLevel]    = useState('')
  const [sortOrder, setSort] = useState('desc')

  const fetcher = useCallback(async () => {
    // Always use mock if no backend configured
    if (usingMock) return filterMock(MOCK_LOGS, service, level)
    const params = { page, size: 20, sort_field: 'timestamp', sort_order: sortOrder }
    if (service) params.service = service
    if (level)   params.level   = level
    try { return await fetchLogs(params) }
    catch { return filterMock(MOCK_LOGS, service, level) }
  }, [page, service, level, sortOrder, usingMock])

  const { data, loading, refetch } = useAsync(fetcher, [page, service, level, sortOrder, usingMock])

  const setFilter = (setter) => (val) => { setter(val); setPage(1) }
  const totalPages  = data ? Math.ceil(data.total / data.size) : 1
  const errorCount  = data?.data?.filter(l => l.logLevel === 'ERROR').length ?? 0
  const errorPct    = data?.data?.length ? Math.round((errorCount / data.data.length) * 100) : 0
  const svcCount    = data ? [...new Set(data.data?.map(l => l.serviceName))].length : 0

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {usingMock && <MockNotice />}

      {/* Stats */}
      <div className="stat-grid-4">
        {[
          { label: 'Total Logs',   value: data?.total?.toLocaleString() ?? '—', color: 'var(--cyan)' },
          { label: 'Error Rate',   value: data ? `${errorPct}%`          : '—', color: 'var(--red)' },
          { label: 'Services',     value: data ? svcCount                 : '—', color: 'var(--amber)' },
          { label: 'Page',         value: `${page} / ${totalPages}`,           color: 'var(--text-secondary)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div className="stat-val-display" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <FilterSelect value={service} onChange={setFilter(setService)} options={SERVICE_OPTIONS} placeholder="All Services" />
        <FilterSelect value={level}   onChange={setFilter(setLevel)}   options={LEVEL_OPTIONS}   placeholder="All Levels" />
        <IconButton onClick={() => setSort(o => o === 'desc' ? 'asc' : 'desc')}>
          {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </IconButton>
        <div style={{ marginLeft: 'auto' }}>
          <IconButton onClick={refetch}>↻ Refresh</IconButton>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader
          title="Log Stream" icon="▤"
          right={data && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{data.total.toLocaleString()} entries</span>}
        />
        {loading
          ? <LoadingState message="Fetching logs..." />
          : !data?.data?.length
            ? <EmptyState icon="▤" message="No logs found" sub="Try adjusting filters" />
            : (
              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {[
                        { label: 'Timestamp', cls: '' },
                        { label: 'Service',   cls: '' },
                        { label: 'Level',     cls: '' },
                        { label: 'Message',   cls: '' },
                        { label: 'Trace ID',  cls: 'col-hide-xs' },
                      ].map(({ label, cls }) => (
                        <th key={label} className={cls} style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                          color: 'var(--text-muted)', padding: '9px 12px', textAlign: 'left',
                          borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.012)',
                          whiteSpace: 'nowrap',
                        }}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((log, i) => (
                      <tr key={log.id || i}
                        style={{ background: LEVEL_ROW_TINT[log.logLevel] || 'transparent', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = LEVEL_ROW_TINT[log.logLevel] || 'transparent')}
                      >
                        <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </td>
                        <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{log.serviceName}</span>
                        </td>
                        <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}>
                          <LevelBadge level={log.logLevel} />
                        </td>
                        <td style={{
                          padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)',
                          maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontSize: 12, color: 'var(--text-primary)',
                        }}>{log.message}</td>
                        <td className="col-hide-xs" style={{ padding: '9px 12px', borderBottom: '1px solid rgba(26,45,64,0.5)' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {log.traceId?.slice(0, 14)}…
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        <Pagination page={page} totalPages={totalPages} total={data?.total || 0} size={data?.size || 20} onChange={setPage} />
      </Card>
    </div>
  )
}

// Filter mock data client-side when no backend
function filterMock(mockData, service, level) {
  let filtered = [...mockData.data]
  if (service) filtered = filtered.filter(l => l.serviceName === service)
  if (level)   filtered = filtered.filter(l => l.logLevel === level)
  return { ...mockData, data: filtered, total: filtered.length }
}
