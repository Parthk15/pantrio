import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { formatPrice, formatQuantity, categoryFor, CATEGORY_META } from '@/utils/format'

export default function ScanResults({ items, onScanAnother }) {
  const total = items.reduce((sum, i) => sum + (i.price || 0), 0)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col items-center text-center gap-3 mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-700 text-cream-soft"
        >
          <CheckCircle2 size={28} strokeWidth={2} />
        </motion.div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink text-balance">
          {items.length} {items.length === 1 ? 'item' : 'items'} found on your bill
        </h2>
        <p className="text-ink-faint text-sm">Straight from Pantrio's OCR — nothing made up.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const category = categoryFor(item.name)
          return (
            <motion.div
              key={`${item.name}-${idx}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-paper px-4 py-3.5 shadow-soft"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink truncate">{item.name}</p>
                <p className="text-xs text-ink-faint mt-0.5">
                  {formatQuantity(item.quantity, item.unit)} · {CATEGORY_META[category].label}
                </p>
              </div>
              <span className="shrink-0 font-display text-lg text-olive-700">
                {item.price != null ? formatPrice(item.price) : '—'}
              </span>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 + items.length * 0.07 + 0.1 }}
        className="mt-6 flex items-center justify-between rounded-2xl bg-olive-700 px-5 py-4 text-cream-soft"
      >
        <span className="text-sm font-medium opacity-90">Bill total (parsed)</span>
        <span className="font-display text-xl">{formatPrice(total)}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + items.length * 0.07 + 0.2 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button as={Link} to="/inventory" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          View your pantry
        </Button>
        <Button variant="ghost" size="lg" icon={RotateCcw} onClick={onScanAnother}>
          Scan another bill
        </Button>
      </motion.div>
    </div>
  )
}
