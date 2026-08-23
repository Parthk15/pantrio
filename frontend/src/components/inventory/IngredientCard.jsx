import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { formatPrice, formatQuantity, categoryFor, CATEGORY_META } from '@/utils/format'
import Badge from '@/components/ui/Badge'

const CATEGORY_GRADIENTS = {
  produce: 'from-olive-100 to-olive-200/60',
  dairy: 'from-gold-200/70 to-gold-200/20',
  pantry: 'from-rust-100 to-rust-100/30',
  other: 'from-cream-dark to-cream-soft',
}

export default function IngredientCard({ item, index = 0 }) {
  const category = categoryFor(item.name)
  const initial = item.name?.[0]?.toUpperCase() || '?'
  const fillPct = item.threshold ? Math.min(100, Math.round((item.quantity / (item.threshold * 2.4)) * 100)) : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-soft transition-shadow hover:shadow-lift ${
        item.isLow ? 'border-tomato-500/30 bg-tomato-100/40' : 'border-ink/8 bg-paper'
      }`}
    >
      {item.isLow && (
        <div className="absolute top-3 right-3">
          <Badge tone="tomato" icon={AlertTriangle}>Low</Badge>
        </div>
      )}

      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-lg text-ink-soft ${CATEGORY_GRADIENTS[category]}`}>
        {initial}
      </div>

      <h3 className="font-display text-lg text-ink truncate pr-10">{item.name}</h3>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-faint">{CATEGORY_META[category].label}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-sm text-ink-soft font-medium">{formatQuantity(item.quantity, item.unit)}</p>
          <p className="text-xs text-ink-faint mt-0.5">in stock</p>
        </div>
        <p className="font-display text-lg text-olive-700">{item.price != null ? formatPrice(item.price) : '—'}</p>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-ink/6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPct}%` }}
          transition={{ delay: 0.2 + index * 0.02, duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${item.isLow ? 'bg-tomato-500' : 'bg-olive-600'}`}
        />
      </div>
    </motion.div>
  )
}
