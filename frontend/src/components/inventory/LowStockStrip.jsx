import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { formatQuantity } from '@/utils/format'

export default function LowStockStrip({ items }) {
  if (items.length === 0) return null

  return (
    <div className="rounded-[2rem] bg-tomato-600 px-6 py-6 sm:px-8 sm:py-7 text-cream-soft mb-8">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={17} strokeWidth={2.2} />
        <h3 className="font-display text-xl">Running low</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3 min-w-[140px]"
          >
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-cream-soft/75 mt-0.5">{formatQuantity(item.quantity, item.unit)} left</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
