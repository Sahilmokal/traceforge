// ─── Mock Logs ────────────────────────────────────────────────────────────────
export const MOCK_LOGS = {
  page: 1, size: 20, total: 324,
  data: [
    { id: '1',  timestamp: '2025-03-07T10:42:31Z', serviceName: 'inventory-service',    logLevel: 'ERROR', message: 'NullPointerException in InventoryController.getStock() at line 84', traceId: 'abc-123-xyz-001' },
    { id: '2',  timestamp: '2025-03-07T10:42:29Z', serviceName: 'order-service',        logLevel: 'WARN',  message: 'Slow DB query detected: 4200ms — SELECT * FROM orders WHERE status=PENDING', traceId: 'def-456-uvw-002' },
    { id: '3',  timestamp: '2025-03-07T10:42:27Z', serviceName: 'auth-service',         logLevel: 'INFO',  message: 'User session created for uid:8821 from IP 10.0.1.44', traceId: 'ghi-789-rst-003' },
    { id: '4',  timestamp: '2025-03-07T10:42:25Z', serviceName: 'payment-service',      logLevel: 'ERROR', message: 'Connection timeout to payment gateway after 5000ms', traceId: 'jkl-012-opq-004' },
    { id: '5',  timestamp: '2025-03-07T10:42:23Z', serviceName: 'gateway-service',      logLevel: 'INFO',  message: 'Request routed to inventory-service — latency 12ms', traceId: 'mno-345-lmn-005' },
    { id: '6',  timestamp: '2025-03-07T10:42:20Z', serviceName: 'inventory-service',    logLevel: 'ERROR', message: 'Database connection pool exhausted (50/50 active connections)', traceId: 'pqr-678-ijk-006' },
    { id: '7',  timestamp: '2025-03-07T10:42:18Z', serviceName: 'notification-service', logLevel: 'DEBUG', message: 'Queuing email notification for order #9981 — recipient: user@example.com', traceId: 'stu-901-fgh-007' },
    { id: '8',  timestamp: '2025-03-07T10:42:15Z', serviceName: 'order-service',        logLevel: 'ERROR', message: 'Failed to reserve inventory: inventory-service returned 503 Service Unavailable', traceId: 'vwx-234-cde-008' },
    { id: '9',  timestamp: '2025-03-07T10:42:12Z', serviceName: 'auth-service',         logLevel: 'WARN',  message: 'Rate limit approaching for IP 192.168.1.44 — 950/1000 requests used', traceId: 'yza-567-bcd-009' },
    { id: '10', timestamp: '2025-03-07T10:42:10Z', serviceName: 'payment-service',      logLevel: 'INFO',  message: 'Payment processed successfully: $149.99 for order #9980', traceId: 'bcd-890-abc-010' },
    { id: '11', timestamp: '2025-03-07T10:42:08Z', serviceName: 'inventory-service',    logLevel: 'ERROR', message: 'Stock check failed for SKU:88821 — concurrent modification exception', traceId: 'efg-123-hij-011' },
    { id: '12', timestamp: '2025-03-07T10:42:05Z', serviceName: 'gateway-service',      logLevel: 'WARN',  message: 'Circuit breaker OPEN for inventory-service after 5 consecutive failures', traceId: 'klm-456-nop-012' },
    { id: '13', timestamp: '2025-03-07T10:42:02Z', serviceName: 'order-service',        logLevel: 'INFO',  message: 'Order #9982 created for customer uid:7712', traceId: 'qrs-789-tuv-013' },
    { id: '14', timestamp: '2025-03-07T10:41:59Z', serviceName: 'notification-service', logLevel: 'INFO',  message: 'SMS sent successfully to +1-555-0142', traceId: 'wxy-012-zab-014' },
    { id: '15', timestamp: '2025-03-07T10:41:55Z', serviceName: 'auth-service',         logLevel: 'DEBUG', message: 'JWT token validated for uid:8821 — expires in 3540s', traceId: 'cde-345-fgh-015' },
  ]
}

// ─── Mock Alerts ──────────────────────────────────────────────────────────────
export const MOCK_ALERTS = {
  page: 1, size: 20, total: 5,
  data: [
    { id: 'a1', severity: 'CRITICAL', anomalyType: 'HIGH_ERROR_RATE',  rootService: 'inventory-service', status: 'NEW',          confidence: 0.91, firstDetectedAt: '2025-03-07T10:40:00Z' },
    { id: 'a2', severity: 'HIGH',     anomalyType: 'SPIKE',            rootService: 'order-service',     status: 'NEW',          confidence: 0.78, firstDetectedAt: '2025-03-07T10:35:00Z' },
    { id: 'a3', severity: 'MEDIUM',   anomalyType: 'TRAFFIC_DROP',     rootService: 'payment-service',   status: 'ACKNOWLEDGED', confidence: 0.62, firstDetectedAt: '2025-03-07T10:20:00Z' },
    { id: 'a4', severity: 'LOW',      anomalyType: 'RARE_LOG',         rootService: 'auth-service',      status: 'RESOLVED',     confidence: 0.45, firstDetectedAt: '2025-03-07T09:55:00Z' },
    { id: 'a5', severity: 'HIGH',     anomalyType: 'CRITICAL_ERROR',   rootService: 'gateway-service',   status: 'NEW',          confidence: 0.84, firstDetectedAt: '2025-03-07T10:38:00Z' },
  ]
}

// ─── Mock Anomalies ───────────────────────────────────────────────────────────
export const MOCK_ANOMALIES = {
  mode: 'realtime',
  trafficDrop: null,
  errorRate: {
    type: 'HIGH_ERROR_RATE',
    errorRatio: 0.69,
    message: 'High percentage of ERROR logs detected across services'
  },
  critical: [
    { service: 'inventory-service', message: 'NullPointerException spike — 14 occurrences in 60s', count: 14 }
  ],
  rare: [
    { pattern: 'JDBC connection reset by peer', occurrences: 2 }
  ],
  spike: [
    { service: 'order-service', multiplier: 3.2, baseline: 45, current: 144 }
  ]
}

// ─── Mock RCA ─────────────────────────────────────────────────────────────────
export const MOCK_RCA = {
  mode: 'realtime',
  totalLogsAnalyzed: 1000,
  rca: {
    rootService: 'inventory-service',
    impactedServices: ['order-service', 'payment-service', 'gateway-service'],
    reason: 'Null pointer exception in InventoryController caused database connection pool exhaustion, cascading failures to downstream services.',
    confidence: 0.87,
    summary: 'inventory-service is identified as the probable root cause with 87% confidence. A NullPointerException in InventoryController.getStock() at line 84 triggered repeated retry loops, exhausting the DB connection pool (50/50 connections). This propagated as 503 errors to order-service (3.2x traffic spike observed) and payment-service (gateway timeout after 5000ms), ultimately causing degraded throughput at the API gateway with circuit breaker entering OPEN state. Temporal analysis shows failure propagation began at 10:38:42 UTC. Recommend immediate rollback of inventory-service v2.4.1 deployment and connection pool size increase as a mitigation measure.'
  }
}
