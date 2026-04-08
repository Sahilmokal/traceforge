import React, { useState, useCallback } from 'react'
import { fetchRCARealtme, fetchRCAHistorical } from '../services/api'
import { MOCK_RCA } from '../services/mockData'
import { useAsync } from '../hooks/useAsync'
import { confidenceColor, confidenceLabel, formatNumber } from '../utils/helpers'
import { ModeBadge } from '../components/Badges'
import { Card, CardHeader } from '../components/Card'
import { LoadingState, EmptyState, MockNotice } from '../components/States'
import { TabButton, IconButton } from '../components/Controls'

function ConfidenceMeter({ value }) {
  const pct=Math.round((value||0)*100), color=confidenceColor(value), label=confidenceLabel(value)
  const r=48,cx=62,cy=62,startAngle=-210,totalArc=240
  const filled=(pct/100)*totalArc
  const toRad=d=>(d*Math.PI)/180
  const arc=(start,sweep)=>{
    const s=toRad(start),e=toRad(start+sweep)
    const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e)
    return `M ${x1} ${y1} A ${r} ${r} 0 ${sweep>180?1:0} 1 ${x2} ${y2}`
  }
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}>
      <svg width={124} height={88} viewBox="0 0 124 88">
        <path d={arc(startAngle,totalArc)} fill="none" stroke="var(--border)" strokeWidth={7} strokeLinecap="round"/>
        {pct>0&&<path d={arc(startAngle,filled)} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" style={{ filter:`drop-shadow(0 0 4px ${color}60)` }}/>}
        <text x={cx} y={cy+7}  textAnchor="middle" fill={color} style={{ fontSize:20,fontFamily:'var(--font-display)',fontWeight:800 }}>{pct}%</text>
        <text x={cx} y={cy+20} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize:8,fontFamily:'var(--font-mono)',letterSpacing:'1px' }}>{label.toUpperCase()}</text>
      </svg>
      <div style={{ fontSize:9,color:'var(--text-muted)',letterSpacing:'1px',textTransform:'uppercase' }}>Confidence</div>
    </div>
  )
}

export default function RCAPage({ usingMock }) {
  const [mode, setMode] = useState('realtime')

  const fetcher = useCallback(async () => {
    if (usingMock) return { ...MOCK_RCA, mode }
    try { return mode==='realtime' ? await fetchRCARealtme() : await fetchRCAHistorical({size:1000}) }
    catch { return { ...MOCK_RCA, mode } }
  }, [mode, usingMock])

  const { data, loading, refetch } = useAsync(fetcher, [mode, usingMock])
  const rca = data?.rca

  return (
    <div className="animate-fade-in" style={{ display:'flex',flexDirection:'column',gap:14,width:'100%' }}>
      {usingMock && <MockNotice />}

      <div style={{ display:'flex',alignItems:'center',gap:8,flexWrap:'wrap' }}>
        <TabButton active={mode==='realtime'}   onClick={()=>setMode('realtime')}>⏱ Realtime</TabButton>
        <TabButton active={mode==='historical'} onClick={()=>setMode('historical')}>📅 Historical</TabButton>
        {data && <ModeBadge mode={data.mode} />}
        <div style={{ marginLeft:'auto' }}><IconButton onClick={refetch}>↻ Re-analyze</IconButton></div>
      </div>

      {loading ? <LoadingState message="Running root cause analysis..." /> : !rca ? (
        <EmptyState icon="⬡" message="No RCA data available" sub="Try a different time window" />
      ) : (
        <div className="rca-grid">
          {/* Hero */}
          <div className="rca-full">
            <Card style={{ position:'relative' }}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--red),var(--amber),transparent)' }}/>
              <div style={{ padding:20 }}>
                <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap' }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:6 }}>Root Cause Identified</div>
                    <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(22px,3.5vw,32px)',fontWeight:800,color:'var(--red)',letterSpacing:'-0.5px',lineHeight:1,marginBottom:14 }}>
                      {rca.rootService}
                    </div>
                    {rca.impactedServices?.length>0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:8 }}>Failure Propagation</div>
                        <div style={{ display:'flex',alignItems:'center',gap:0,flexWrap:'wrap',rowGap:6 }}>
                          {[rca.rootService,...rca.impactedServices].map((s,i,arr)=>(
                            <React.Fragment key={s}>
                              <div style={{ padding:'5px 10px',borderRadius:4,fontSize:11,fontFamily:'var(--font-mono)',background:i===0?'rgba(255,61,90,0.12)':'rgba(255,184,0,0.08)',border:`1px solid ${i===0?'rgba(255,61,90,0.3)':'rgba(255,184,0,0.22)'}`,color:i===0?'var(--red)':'var(--amber)',display:'flex',alignItems:'center',gap:4 }}>
                                {i===0&&<span style={{ fontSize:8 }}>★</span>}{s}
                              </div>
                              {i<arr.length-1&&<div style={{ padding:'0 5px',color:'var(--text-dim)',fontSize:12 }}>→</div>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize:12,color:'var(--text-primary)',lineHeight:1.65,padding:'10px 12px',background:'rgba(255,61,90,0.04)',border:'1px solid rgba(255,61,90,0.15)',borderLeft:'3px solid var(--red)',borderRadius:'0 3px 3px 0' }}>
                      {rca.reason}
                    </div>
                  </div>
                  <ConfidenceMeter value={rca.confidence} />
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          {[
            { label:'Logs Analyzed',     value:formatNumber(data?.totalLogsAnalyzed), color:'var(--cyan)',  accent:'var(--cyan)' },
            { label:'Impacted Services', value:rca.impactedServices?.length||0,        color:'var(--amber)', accent:'var(--amber)' },
          ].map(s=>(
            <div key={s.label} style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',padding:'14px 18px',position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${s.accent},transparent)` }}/>
              <div className="stat-val-display" style={{ fontFamily:'var(--font-display)',fontSize:24,fontWeight:800,color:s.color }}>{s.value}</div>
              <div style={{ fontSize:9,color:'var(--text-muted)',letterSpacing:'1px',textTransform:'uppercase',marginTop:3 }}>{s.label}</div>
            </div>
          ))}

          {/* Summary */}
          <div className="rca-full">
            <Card>
              <CardHeader title="AI-Generated Analysis Summary" icon="⬡"/>
              <div style={{ padding:18 }}>
                <div style={{ fontSize:12,color:'var(--text-secondary)',lineHeight:1.85,fontFamily:'var(--font-mono)' }}>
                  {rca.summary?.split(/(\b(?:inventory-service|order-service|payment-service|auth-service|gateway-service|notification-service)\b)/g).map((part,i)=>/service$/.test(part)?<span key={i} style={{ color:'var(--cyan)' }}>{part}</span>:part)}
                </div>
              </div>
            </Card>
          </div>

          {/* Impact map */}
          {rca.impactedServices?.length>0&&(
            <div className="rca-full">
              <Card>
                <CardHeader title="Service Impact Map" icon="◈"/>
                <div style={{ padding:14,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8 }}>
                  {[rca.rootService,...rca.impactedServices].map((svc,i)=>(
                    <div key={svc} style={{ padding:'9px 12px',background:i===0?'rgba(255,61,90,0.06)':'var(--bg-elevated)',border:`1px solid ${i===0?'rgba(255,61,90,0.2)':'var(--border)'}`,borderRadius:'var(--radius-sm)',display:'flex',alignItems:'center',gap:8 }}>
                      <span style={{ fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:2,background:i===0?'rgba(255,61,90,0.15)':'rgba(255,184,0,0.1)',color:i===0?'var(--red)':'var(--amber)',border:`1px solid ${i===0?'rgba(255,61,90,0.25)':'rgba(255,184,0,0.2)'}`,letterSpacing:'0.5px',flexShrink:0 }}>{i===0?'ROOT':`+${i}`}</span>
                      <span style={{ fontSize:11,color:i===0?'var(--red)':'var(--text-primary)',fontFamily:'var(--font-mono)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{svc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
