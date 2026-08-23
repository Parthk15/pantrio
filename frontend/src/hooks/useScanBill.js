import { useCallback, useRef, useState } from 'react'
import { scanBill, PantrioApiError } from '@/services/api'

// idle -> uploading -> reading -> success | error
export function useScanBill() {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const minReadTimer = useRef(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setResult(null)
    if (minReadTimer.current) clearTimeout(minReadTimer.current)
  }, [])

  const run = useCallback(async (file) => {
    setStatus('uploading')
    setError(null)
    setResult(null)
    setProgress(0)

    const startedAt = Date.now()

    try {
      const data = await scanBill(file, (pct) => {
        setProgress(pct)
        if (pct >= 100) setStatus('reading')
      })

      // Keep the "Reading your groceries..." state visible for a minimum
      // beat so the interaction reads as deliberate, not flickery, even
      // on very fast local responses.
      const elapsed = Date.now() - startedAt
      const minDuration = 1100
      const remaining = Math.max(0, minDuration - elapsed)

      await new Promise((resolve) => {
        minReadTimer.current = setTimeout(resolve, remaining)
      })

      setResult(data)
      setStatus('success')
      return data
    } catch (err) {
      const apiErr =
        err instanceof PantrioApiError ? err : new PantrioApiError(err.message || 'Something went wrong.')
      setError(apiErr)
      setStatus('error')
      throw apiErr
    }
  }, [])

  return { status, progress, error, result, run, reset }
}
