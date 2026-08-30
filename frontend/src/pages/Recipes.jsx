import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, ScanLine, ShoppingBag } from 'lucide-react'
import { useRecipes } from '@/hooks/useRecipes'
import { useInventory } from '@/context/InventoryContext'
import RecipeCard from '@/components/recipes/RecipeCard'
import NoMatchBanner from '@/components/recipes/NoMatchBanner'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

export default function Recipes() {
  const {
    recipes,
    canMakeNow,
    almostThere,
    moreIdeas,
    topSuggestions,
    scannedItems,
    hasScannedItems,
  } = useRecipes()
  const { cookRecipe } = useInventory()
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)

  const FILTERS = [
    { id: 'all', label: `All recipes (${recipes.filter((r) => r.matchCount > 0).length || recipes.length})` },
    { id: 'ready', label: `Can make now (${canMakeNow.length})` },
    { id: 'almost', label: `Almost there (${almostThere.length})` },
    { id: 'ideas', label: `More ideas (${moreIdeas.length})` },
  ]

  const filtered = useMemo(() => {
    if (filter === 'ready') return canMakeNow
    if (filter === 'almost') return almostThere
    if (filter === 'ideas') return moreIdeas
    const matched = recipes.filter((r) => r.matchCount > 0)
    return matched.length > 0 ? matched : recipes
  }, [filter, recipes, canMakeNow, almostThere, moreIdeas])

  const handleCook = (recipe) => {
    const result = cookRecipe(recipe.id)
    if (result.success) {
      setToast(`${recipe.name} marked as cooked — ingredients updated in pantry!`)
      setTimeout(() => setToast(null), 2800)
    }
  }

  const hasStrongMatches = canMakeNow.length > 0 || almostThere.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tomato-100 text-tomato-600 px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4">
            <ChefHat size={12} strokeWidth={2.5} />
            Dynamic Recipe Engine
          </span>
          <h1 className="font-display text-4xl text-ink text-balance">What can you make?</h1>
          <p className="mt-2 text-ink-faint max-w-lg">
            {hasScannedItems
              ? `Recipes dynamically matched against your current scanned bill items.`
              : 'Scan a grocery bill to generate instant, personalized recipe recommendations.'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button as={Link} to="/scan" variant="rust" size="md" icon={ScanLine}>
            {hasScannedItems ? 'Scan new bill' : 'Scan a bill'}
          </Button>
        </div>
      </div>

      {/* Scanned Bill Items Context Chip Bar */}
      {hasScannedItems && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-paper border border-ink/8 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-olive-100 text-olive-800 font-bold text-xs">
              <ShoppingBag size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Current Scanned Bill Products ({scannedItems.length})
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {scannedItems.map((item) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1 rounded-md bg-cream-dark px-2 py-0.5 text-xs font-medium text-ink"
                  >
                    • {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Low / No Strong Match Banner */}
      {hasScannedItems && !hasStrongMatches && (
        <NoMatchBanner scannedItems={scannedItems} topSuggestions={topSuggestions} />
      )}

      {/* Filters Nav */}
      {hasScannedItems && (
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.id ? 'text-cream-soft' : 'text-ink-soft bg-paper border border-ink/8 hover:bg-cream-dark'
              }`}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="recipe-filter-pill"
                  className="absolute inset-0 rounded-full bg-olive-700"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Recipe Grid */}
      {!hasScannedItems ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-paper border border-dashed border-ink/15">
          <ChefHat className="mx-auto h-12 w-12 text-ink-faint mb-3 opacity-50" />
          <h3 className="font-display text-2xl text-ink">No grocery bill scanned yet</h3>
          <p className="mt-2 text-sm text-ink-faint max-w-md mx-auto mb-6">
            Upload or snap a grocery bill so Pantrio can dynamically calculate and rank recipes tailored specifically to your ingredients.
          </p>
          <Button as={Link} to="/scan" variant="rust" size="lg" icon={ScanLine}>
            Scan your first bill
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-faint">
          <p className="text-lg font-medium text-ink mb-1">No recipes in this view</p>
          <p className="text-sm">Try selecting a different filter tab above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} onCook={handleCook} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Toast message={toast} show={!!toast} />
    </div>
  )
}
