import { motion } from 'framer-motion'
import { WifiOff, FileWarning, ScanLine, ServerCrash } from 'lucide-react'
import Button from '@/components/ui/Button'

const KIND_META = {
  network: {
    icon: WifiOff,
    title: 'Pantrio backend is unreachable.',
    hint: 'Make sure the FastAPI backend is running at http://127.0.0.1:8000.',
  },
  timeout: {
    icon: ScanLine,
    title: 'Scan timed out',
    hint: 'Scanning is taking longer than expected. Please try again.',
  },
  server: {
    icon: ServerCrash,
    title: 'Pantrio couldn\u2019t process this bill.',
    hint: 'An unexpected server error occurred during bill processing.',
  },
  invalid_file: {
    icon: FileWarning,
    title: 'Please upload a clear grocery bill image.',
    hint: 'Supported formats: JPG, PNG, WEBP, HEIC.',
  },
  empty: {
    icon: ScanLine,
    title: 'No groceries found on that bill',
    hint: 'Try a sharper, well-lit photo with the full receipt visible.',
  },
  unknown: {
    icon: ServerCrash,
    title: 'Something went wrong',
    hint: 'Please try scanning again.',
  },
}

export default function ScanError({ error, onRetry }) {
  const meta = KIND_META[error?.kind] || KIND_META.unknown
  const Icon = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-[2rem] border border-tomato-100 bg-paper px-8 py-12 text-center shadow-soft"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tomato-100 text-tomato-600">
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <div>
        <p className="font-display text-xl text-ink">{meta.title}</p>
        <p className="mt-1.5 text-sm text-ink-faint">{error?.message || meta.hint}</p>
      </div>
      <Button variant="primary" onClick={onRetry}>
        Try again
      </Button>
    </motion.div>
  )
}
