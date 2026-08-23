import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { pingBackend, API_BASE_URL } from '@/services/api'

export default function BackendStatusBanner() {
  const [offline, setOffline] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    let interval

    const check = async () => {
      const ok = await pingBackend()
      if (!cancelled) {
        setOffline(!ok)
        setChecked(true)
      }
    }

    check()
    interval = setInterval(check, 15000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (!checked) return null

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 bg-tomato-600 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-cream-soft">
            <WifiOff size={14} />
            Backend unreachable at {API_BASE_URL} — start the FastAPI server to scan bills.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
