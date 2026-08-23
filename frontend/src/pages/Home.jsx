import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanLine, ArrowRight, PackageSearch, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import HeroIllustration from '@/components/home/HeroIllustration'
import FlowSection from '@/components/home/FlowSection'
import { useInventory } from '@/context/InventoryContext'
import { formatPrice } from '@/utils/format'

export default function Home() {
  const { hasInventory, totals, lowStockItems } = useInventory()

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-200 text-gold-600 px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-6">
              real ocr · zero manual entry
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[3.6rem] leading-[1.05] text-ink text-balance">
              Your pantry,
              <br />
              <span className="italic text-olive-700">but smarter.</span>
            </h1>
            <p className="mt-6 text-lg text-ink-soft max-w-md text-balance">
              Snap a photo of any grocery bill. Pantrio reads it, fills your pantry, and tells you what to cook tonight.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button as={Link} to="/scan" variant="rust" size="lg" icon={ScanLine}>
                Scan a grocery bill
              </Button>
              <Button as={Link} to="/recipes" variant="ghost" size="lg" icon={ArrowRight} iconPosition="right">
                Explore recipes
              </Button>
            </div>

            {hasInventory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <StatChip icon={PackageSearch} label={`${totals.itemCount} ingredients tracked`} to="/inventory" />
                <StatChip icon={AlertTriangle} label={`${totals.lowStockCount} running low`} tone="tomato" to="/inventory" />
                <StatChip label={`${formatPrice(totals.totalValue)} pantry value`} to="/inventory" />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      <FlowSection />

      {lowStockItems.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <div className="rounded-[2rem] bg-olive-950 text-cream-soft px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2">Heads up</p>
              <h3 className="font-display text-2xl sm:text-3xl text-balance">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low
              </h3>
              <p className="mt-2 text-cream-soft/70 text-sm max-w-md">
                {lowStockItems.slice(0, 3).map((i) => i.name).join(', ')}
                {lowStockItems.length > 3 ? ', and more' : ''} could use a restock soon.
              </p>
            </div>
            <Button as={Link} to="/inventory" variant="paper" size="md" icon={ArrowRight} iconPosition="right">
              Review pantry
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

function StatChip({ icon: Icon, label, tone = 'olive', to }) {
  const tones = {
    olive: 'bg-olive-100 text-olive-800',
    tomato: 'bg-tomato-100 text-tomato-600',
  }
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-transform hover:scale-[1.03] ${tones[tone]}`}
    >
      {Icon && <Icon size={14} strokeWidth={2.2} />}
      {label}
    </Link>
  )
}
