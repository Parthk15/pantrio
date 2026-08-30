import { motion } from 'framer-motion'
import { AlertCircle, PlusCircle, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NoMatchBanner({ scannedItems = [], topSuggestions = [] }) {
  const hasItems = scannedItems.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 rounded-3xl border border-tomato-500/20 bg-tomato-500/5 p-6 sm:p-8 shadow-soft"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tomato-500 text-cream-soft shadow-soft">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink">No strong recipe matches yet</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Based on your scanned bill, here is what you have and what you can add to unlock recipes.
            </p>

            {hasItems && (
              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">You have:</p>
                  <p className="text-sm font-semibold text-olive-800 mt-0.5">
                    {scannedItems.map((i) => i.name).join(' • ')}
                  </p>
                </div>

                {topSuggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Try adding:</p>
                    <p className="text-sm font-semibold text-tomato-600 mt-0.5">
                      {topSuggestions.join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button as={Link} to="/scan" variant="rust" size="md" icon={ScanLine} className="shrink-0">
          Scan another bill
        </Button>
      </div>
    </motion.div>
  )
}
