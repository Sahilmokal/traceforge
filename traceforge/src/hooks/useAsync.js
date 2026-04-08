import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Generic async hook ───────────────────────────────────────────────────────
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  const execute = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const data = await asyncFn()
      setState({ data, loading: false, error: null })
    } catch (err) {
      setState({ data: null, loading: false, error: err })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return { ...state, refetch: execute }
}

// ─── Polling hook ─────────────────────────────────────────────────────────────
export function usePolling(asyncFn, intervalMs = 10000, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  const execute = useCallback(async () => {
    try {
      const data = await asyncFn()
      setState({ data, loading: false, error: null })
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
    const timer = setInterval(execute, intervalMs)
    return () => clearInterval(timer)
  }, [execute, intervalMs])

  return { ...state, refetch: execute }
}

// ─── Clock hook ───────────────────────────────────────────────────────────────
export function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}
