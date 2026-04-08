import React, { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import LogsPage from './pages/LogsPage'
import AlertsPage from './pages/AlertsPage'
import AnomaliesPage from './pages/AnomaliesPage'
import RCAPage from './pages/RCAPage'

const USING_MOCK = !import.meta.env.VITE_API_URL

export default function App() {
  const [page, setPage]           = useState('logs')
  const [refreshKey, setRefresh]  = useState(0)
  const [sidebarOpen, setSidebar] = useState(false)

  const handleNavigate = useCallback((p) => {
    setPage(p)
    setSidebar(false)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebar(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const pageProps = { usingMock: USING_MOCK, key: refreshKey }

  return (
    <>
      {/* Scan line */}
      <div className="scan-overlay" />

      <div className="app-shell">
        {/* Mobile backdrop */}
        <div
          className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
          onClick={() => setSidebar(false)}
        />

        {/* Sidebar */}
        <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <Sidebar activePage={page} onNavigate={handleNavigate} />
        </div>

        {/* Main — fills everything to the right of sidebar */}
        <div className="main-area">
          <Topbar
            page={page}
            onRefresh={() => setRefresh(k => k + 1)}
            onMenuToggle={() => setSidebar(o => !o)}
          />
          <main
            className="page-content"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 0%, rgba(0,212,255,0.035) 0%, transparent 55%),
                radial-gradient(ellipse at 80% 100%, rgba(176,106,255,0.025) 0%, transparent 55%)
              `,
            }}
          >
            {page === 'logs'      && <LogsPage      {...pageProps} />}
            {page === 'alerts'    && <AlertsPage    {...pageProps} />}
            {page === 'anomalies' && <AnomaliesPage {...pageProps} />}
            {page === 'rca'       && <RCAPage       {...pageProps} />}
          </main>
        </div>
      </div>
    </>
  )
}
