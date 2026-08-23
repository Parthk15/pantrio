import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanLine, PackageSearch, Coins, AlertTriangle } from 'lucide-react'
import { useInventory } from '@/context/InventoryContext'
import IngredientCard from '@/components/inventory/IngredientCard'
import LowStockStrip from '@/components/inventory/LowStockStrip'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/utils/format'

export default function Inventory() {
  const { itemList, lowStockItems, totals, hasInventory } = useInventory()

  if (!hasInventory) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-700">
          <PackageSearch size={28} strokeWidth={1.7} />
        </div>
        <h1 className="font-display text-3xl text-ink">Your pantry is empty</h1>
        <p className="mt-3 text-ink-faint">Scan your first grocery bill and Pantrio will build your inventory automatically.</p>
        <div className="mt-8">
          <Button as={Link} to="/scan" variant="rust" size="lg" icon={ScanLine}>
            Scan a grocery bill
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink">Your pantry</h1>
          <p className="mt-2 text-ink-faint">Everything Pantrio has read from your bills, kept current automatically.</p>
        </div>
        <Button as={Link} to="/scan" variant="ghost" size="md" icon={ScanLine}>
          Scan another
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <SummaryTile icon={PackageSearch} label="Ingredients" value={totals.itemCount} />
        <SummaryTile icon={Coins} label="Pantry value" value={formatPrice(totals.totalValue)} />
        <SummaryTile icon={AlertTriangle} label="Running low" value={totals.lowStockCount} tone={totals.lowStockCount > 0 ? 'tomato' : 'olive'} />
      </div>

      <LowStockStrip items={lowStockItems} />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {itemList.map((item, i) => (
          <IngredientCard key={item.name} item={item} index={i} />
        ))}
      </motion.div>
    </div>
  )
}

function SummaryTile({ icon: Icon, label, value, tone = 'olive' }) {
  const tones = {
    olive: 'text-olive-700 bg-olive-100',
    tomato: 'text-tomato-600 bg-tomato-100',
  }
  return (
    <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-4 sm:px-5 sm:py-5 shadow-soft">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full mb-3 ${tones[tone]}`}>
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <p className="font-display text-xl sm:text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink-faint mt-0.5">{label}</p>
    </div>
  )
}
