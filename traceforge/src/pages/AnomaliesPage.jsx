import React, { useCallback, useEffect, useState } from 'react'
import { fetchAnomalies } from '../services/api'
import { MOCK_ANOMALIES } from '../services/mockData'
import { usePolling } from '../hooks/useAsync'
import { ModeBadge } from '../components/Badges'
import { LoadingState, MockNotice } from '../components/States'
import { IconButton } from '../components/Controls'

function AnomalyCard({ type, icon, variant, active, children }) {
  const map = {
    danger:  { accent:'var(--red)',   border:'rgba(255,61,90,0.22)',  bg:'rgba(255,61,90,0.04)',   label:'var(--red)' },
    warning: { accent:'var(--amber)', border:'rgba(255,184,0,0.2)',   bg:'rgba(255,184,0,0.03)',   label:'var(--amber)' },
    info:    { accent:'var(--cyan)',  border:'rgba(0,212,255,0.2)',   bg:'rgba(0,212,255,0.03)',   label:'var(--cyan)' },
    ok:      { accent:'var(--green)', border:'rgba(0,255,153,0.12)',  bg:'rgba(0,255,153,0.02)',   label:'var(--green)' },
  }
  const c = map[variant] || map.ok
  return (
    <div style={{
      background: active ? c.bg : 'var(--bg-card)',
      border: `1px solid ${active ? c.border : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)', padding: 18,
      position: 'relative', overflow: 'hidden',
      opacity: active ? 1 : 0.4,
      transition: 'all 0.3s',
      boxShadow: active ? `0 0 24px ${c.accent}10` : 'none',
    }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:2,
        background: active ? `linear-gradient(90deg,${c.accent},transparent)` : 'var(--border)' }} />
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10 }}>
        <div style={{ fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color: active ? c.label : 'var(--text-muted)' }}>{type}</div>
        <span style={{ fontSize:20,opacity: active ? 0.8 : 0.2 }}>{icon}</span>
      </div>
      {children}
    </div>
  )
}

function RatioBar({ value, color }) {
  return (
    <div style={{ height:3,background:'var(--border)',borderRadius:2,marginTop:10,overflow:'hidden' }}>
      <div style={{ height:'100%',width:`${Math.min(100,value*100)}%`,background:color,borderRadius:2,transition:'width 0.7s ease' }} />
    </div>
  )
}

export default function AnomaliesPage({ usingMock }) {
  const fetcher = useCallback(async () => {
    if (usingMock) return MOCK_ANOMALIES
    try { return await fetchAnomalies() }
    catch { return MOCK_ANOMALIES }
  }, [usingMock])

  const { data, loading, refetch } = usePolling(fetcher, 10000)
  const [lastUpdate, setLastUpdate] = useState(null)
  useEffect(() => { if (data) setLastUpdate(new Date()) }, [data])

  const d = data || MOCK_ANOMALIES
  const totalActive = [d.errorRate, d.trafficDrop, ...(d.critical||[]), ...(d.rare||[]), ...(d.spike||[])].filter(Boolean).length

  return (
    <div className="animate-fade-in" style={{ display:'flex',flexDirection:'column',gap:14,width:'100%' }}>
      {usingMock && <MockNotice />}

      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,flexWrap:'wrap' }}>
          {data && <ModeBadge mode={d.mode} />}
          {totalActive > 0 && (
            <span style={{ fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:3,background:'var(--red-dim)',color:'var(--red)',border:'1px solid rgba(255,61,90,0.25)' }}>
              {totalActive} anomal{totalActive!==1?'ies':'y'} active
            </span>
          )}
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          {lastUpdate && <span style={{ fontSize:10,color:'var(--text-muted)' }}>Updated: {lastUpdate.toLocaleTimeString('en-US',{hour12:false})}</span>}
          <IconButton onClick={refetch}>↻ Refresh</IconButton>
        </div>
      </div>

      {loading ? <LoadingState message="Detecting anomalies..." /> : (
        <div className="anomaly-grid stagger">
          <AnomalyCard type="Error Rate" icon={d.errorRate?'🔥':'✅'} variant={d.errorRate?'danger':'ok'} active={!!d.errorRate}>
            {d.errorRate ? (
              <>
                <div style={{ fontSize:12,color:'var(--text-primary)',lineHeight:1.5,marginBottom:8 }}>{d.errorRate.message}</div>
                <div style={{ fontSize:10,color:'var(--text-muted)' }}>Ratio: <span style={{ color:'var(--red)',fontWeight:700,fontSize:13 }}>{Math.round(d.errorRate.errorRatio*100)}%</span></div>
                <RatioBar value={d.errorRate.errorRatio} color="linear-gradient(90deg,var(--red),var(--amber))" />
              </>
            ) : <div style={{ fontSize:12,color:'var(--green)' }}>Error rate within normal threshold</div>}
          </AnomalyCard>

          <AnomalyCard type="Traffic Drop" icon={d.trafficDrop?'📉':'📊'} variant={d.trafficDrop?'warning':'ok'} active={!!d.trafficDrop}>
            {d.trafficDrop
              ? <div style={{ fontSize:12,color:'var(--text-primary)',lineHeight:1.5 }}>{d.trafficDrop.message||'Significant traffic drop detected'}</div>
              : <div style={{ fontSize:12,color:'var(--green)' }}>Traffic volume within normal range</div>}
          </AnomalyCard>

          {d.spike?.length>0 ? d.spike.map((s,i)=>(
            <AnomalyCard key={i} type="Traffic Spike" icon="⚡" variant="warning" active>
              <div style={{ fontSize:12,color:'var(--text-primary)',marginBottom:8 }}><span style={{ color:'var(--cyan)' }}>{s.service}</span> — <b>{s.multiplier}x</b> above baseline</div>
              <div style={{ display:'flex',gap:12,fontSize:10,color:'var(--text-muted)',flexWrap:'wrap' }}>
                <span>Baseline: {s.baseline}/s</span>
                <span>Current: <b style={{ color:'var(--amber)' }}>{s.current}/s</b></span>
              </div>
              <RatioBar value={s.current/(s.baseline*5)} color="linear-gradient(90deg,var(--amber),var(--red))" />
            </AnomalyCard>
          )) : <AnomalyCard type="Traffic Spike" icon="⚡" variant="ok" active={false}><div style={{ fontSize:12,color:'var(--green)' }}>No traffic spikes detected</div></AnomalyCard>}

          {d.critical?.length>0 ? d.critical.map((c,i)=>(
            <AnomalyCard key={i} type="Critical Error" icon="💀" variant="danger" active>
              <div style={{ fontSize:12,color:'var(--text-primary)',marginBottom:8,lineHeight:1.5 }}>{c.message}</div>
              <div style={{ fontSize:10,color:'var(--text-muted)',display:'flex',gap:12,flexWrap:'wrap' }}>
                <span>Service: <span style={{ color:'var(--cyan)' }}>{c.service}</span></span>
                <span>Count: <span style={{ color:'var(--red)',fontWeight:700 }}>{c.count}</span></span>
              </div>
            </AnomalyCard>
          )) : <AnomalyCard type="Critical Errors" icon="💀" variant="ok" active={false}><div style={{ fontSize:12,color:'var(--green)' }}>No critical errors active</div></AnomalyCard>}

          {d.rare?.length>0 ? d.rare.map((r,i)=>(
            <AnomalyCard key={i} type="Rare Pattern" icon="🔬" variant="info" active>
              <div style={{ fontSize:12,color:'var(--text-primary)',marginBottom:8,lineHeight:1.5 }}>{r.pattern}</div>
              <div style={{ fontSize:10,color:'var(--text-muted)' }}>Occurrences: <span style={{ color:'var(--cyan)',fontWeight:600 }}>{r.occurrences}</span></div>
            </AnomalyCard>
          )) : <AnomalyCard type="Rare Pattern" icon="🔬" variant="ok" active={false}><div style={{ fontSize:12,color:'var(--green)' }}>No rare patterns detected</div></AnomalyCard>}
        </div>
      )}
    </div>
  )
}
