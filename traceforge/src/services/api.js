import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000, // Short timeout so mock fallback kicks in fast
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    console.warn('[TraceForge API] unreachable, using mock data')
    return Promise.reject(error)
  }
)

export const fetchLogs        = (params = {}) => api.get('/logs',         { params })
export const fetchAlerts      = (params = {}) => api.get('/alerts',       { params })
export const fetchAnomalies   = ()             => api.get('/anomalies')
export const fetchRCARealtme  = ()             => api.get('/rca/realtime')
export const fetchRCAHistorical = (params={}) => api.get('/rca/historical', { params })

export default api
