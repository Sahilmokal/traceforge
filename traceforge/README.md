# TraceForge AI — Frontend Dashboard

A production-grade monitoring dashboard for the TraceForge AI log intelligence platform. Built with React + Vite + Tailwind CSS.

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component + page routing
    ├── styles/
    │   └── globals.css       # Design tokens, base styles, animations
    ├── services/
    │   ├── api.js            # Axios API client + all endpoint calls
    │   └── mockData.js       # Demo data (shown when backend is offline)
    ├── hooks/
    │   └── useAsync.js       # useAsync, usePolling, useClock hooks
    ├── utils/
    │   └── helpers.js        # Formatters, color helpers, utilities
    ├── components/
    │   ├── Badges.jsx        # LevelBadge, SeverityBadge, StatusBadge, ModeBadge
    │   ├── Card.jsx          # Card, CardHeader, StatCard
    │   ├── Controls.jsx      # FilterSelect, Pagination, ActionButton, ConfidenceBar
    │   ├── Sidebar.jsx       # Navigation sidebar
    │   ├── States.jsx        # LoadingState, EmptyState, MockNotice
    │   └── Topbar.jsx        # Top navigation bar
    └── pages/
        ├── LogsPage.jsx      # Logs Explorer
        ├── AlertsPage.jsx    # Alerts Dashboard
        ├── AnomaliesPage.jsx # Anomaly Monitor (auto-refresh 10s)
        └── RCAPage.jsx       # Root Cause Analysis Viewer
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure backend URL

```bash
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8080
```

If `VITE_API_URL` is not set, the dashboard runs in **demo mode** with realistic mock data.

### 3. Start development server

```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Backend API Compatibility

The frontend uses these endpoints exactly as documented:

| Page       | Endpoint              | Method |
|------------|-----------------------|--------|
| Logs       | `/logs`               | GET    |
| Alerts     | `/alerts`             | GET    |
| Anomalies  | `/anomalies`          | GET    |
| RCA        | `/rca/realtime`       | GET    |
| RCA        | `/rca/historical`     | GET    |

### Supported query parameters

**Logs:** `service`, `level`, `minutes`, `start_time`, `end_time`, `page`, `size`, `sort_field`, `sort_order`

**Alerts:** `status`, `severity`, `start_time`, `end_time`, `page`, `size`, `sort_field`, `sort_order`

**RCA Historical:** `start_time`, `end_time`, `size`

---

## Features

### Logs Explorer
- Paginated log table (20 per page)
- Filter by service and log level
- Sort by timestamp (asc/desc)
- Color-coded level badges (ERROR/WARN/INFO/DEBUG)
- Row tinting for ERROR/WARN logs

### Alerts Dashboard
- Filter by status (NEW / ACKNOWLEDGED / RESOLVED)
- Filter by severity (CRITICAL / HIGH / MEDIUM / LOW)
- One-click Acknowledge and Resolve actions (optimistic UI)
- Inline confidence bars per alert
- Time-ago display with full timestamp on hover

### Anomaly Monitor
- Auto-refreshes every 10 seconds
- Cards for: Error Rate, Traffic Drop, Spikes, Critical Errors, Rare Patterns
- Inactive cards dim when no anomaly is present
- Visual ratio bars for error rate and traffic spikes

### RCA Viewer
- Toggle between Realtime and Historical analysis
- SVG confidence arc meter
- Failure propagation chain visualization
- AI-generated summary with service name highlighting
- Impacted services breakdown

---

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool with HMR
- **Tailwind CSS** — Utility styles (minimal usage; design tokens via CSS variables)
- **Axios** — HTTP client with interceptors
- **Recharts** — Available for chart extensions

---

## Design

- **Dark industrial terminal aesthetic**
- **Fonts:** JetBrains Mono (data/mono) + Syne (display/headings)
- **Color palette:** Deep navy base with cyan, amber, red, green accents
- **Animations:** Fade-in transitions, staggered list reveals, pulse indicators, scan line overlay
- **CSS variables** for all design tokens — easily themeable
