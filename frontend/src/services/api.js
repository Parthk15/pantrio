import axios from 'axios'

// Base URL for the real Pantrio FastAPI backend.
// Configured via .env -> VITE_API_URL (defaults to local dev server).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // OCR can take a few seconds on first run (model warm-up)
})

/**
 * Custom error shape so the UI can distinguish between:
 * - the backend being unreachable
 * - the backend returning a real error response
 * - the backend running but finding nothing on the bill
 */
export class PantrioApiError extends Error {
  constructor(message, { kind = 'unknown', status = null, cause = null } = {}) {
    super(message)
    this.name = 'PantrioApiError'
    this.kind = kind // 'network' | 'server' | 'invalid_file' | 'empty' | 'unknown'
    this.status = status
    this.cause = cause
  }
}

/**
 * Sends a grocery bill image to the real POST /api/scan-bill endpoint.
 *
 * @param {File} file - image file selected/dropped by the user
 * @param {(percent: number) => void} [onProgress] - optional upload progress callback
 * @returns {Promise<{ success: boolean, items: Array<{name: string, quantity: number, unit: string, price: number}> }>}
 */
export async function scanBill(file, onProgress) {
  if (!file) {
    throw new PantrioApiError('Please upload a clear grocery bill image.', { kind: 'invalid_file' })
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (file.type && !allowedTypes.includes(file.type)) {
    throw new PantrioApiError(
      'Please upload a clear grocery bill image.',
      { kind: 'invalid_file' }
    )
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await client.post('/api/scan-bill', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      },
    })

    const data = response.data

    if (!data || data.success === false) {
      throw new PantrioApiError(
        data?.message || 'Pantrio couldn\u2019t process this bill.',
        { kind: 'empty' }
      )
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new PantrioApiError(
        'Pantrio couldn\u2019t find any items on that bill. Try a clearer, well-lit photo.',
        { kind: 'empty' }
      )
    }

    return data
  } catch (err) {
    if (err instanceof PantrioApiError) throw err

    if (err.code === 'ECONNABORTED') {
      throw new PantrioApiError(
        'Scanning is taking longer than expected. Please try again.',
        { kind: 'timeout', cause: err }
      )
    }

    if (err.response) {
      throw new PantrioApiError(
        err.response.data?.detail || err.response.data?.message || 'Pantrio couldn\u2019t process this bill.',
        { kind: 'server', status: err.response.status, cause: err }
      )
    }

    if (err.request) {
      throw new PantrioApiError(
        'Pantrio backend is unreachable.',
        { kind: 'network', cause: err }
      )
    }

    throw new PantrioApiError(err.message || 'Something unexpected happened.', { kind: 'unknown', cause: err })
  }
}

/**
 * Lightweight reachability check against the backend root endpoint.
 * Used to show a "backend offline" state proactively rather than only on scan.
 */
export async function pingBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      cache: 'no-store',
    })

    console.log('Pantrio backend health:', response.status)

    return response.ok
  } catch (error) {
    console.error('Pantrio backend health check failed:', error)
    return false
  }
}