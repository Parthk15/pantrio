import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, ScanLine } from 'lucide-react'
import { useRecipes } from '@/hooks/useRecipes'
import { useInventory } from '@/context/InventoryContext'
import RecipeCard from '@/components/recipes/RecipeCard'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

const FILTERS = [
  { id: 'all', label: 'All recipes' },
  { id: 'ready', label: 'Ready to cook' },
  { id: 'missing', label: 'Missing something' },
]

export default function Recipes() {
  const recipes = useRecipes()
  const { cookRecipe, hasInventory } = useInventory()
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'ready') return recipes.filter((r) => r.canMake)
    if (filter === 'missing') return recipes.filter((r) => !r.canMake)
    return recipes
  }, [recipes, filter])

  const readyCount = recipes.filter((r) => r.canMake).length

  const handleCook = (recipe) => {
    const result = cookRecipe(recipe.id)
    if (result.success) {
      setToast(`${recipe.name} marked as cooked — ingredients updated`)
      setTimeout(() => setToast(null), 2800)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tomato-100 text-tomato-600 px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4">
            <ChefHat size={12} strokeWidth={2.5} />
            Cook something
          </span>
          <h1 className="font-display text-4xl text-ink text-balance">What can you make?</h1>
          <p className="mt-2 text-ink-faint max-w-md">
            {hasInventory
              ? `Matched against your live pantry — ${readyCount} of ${recipes.length} recipes are ready right now.`
              : 'Scan a bill first so Pantrio can match recipes to what you actually have.'}
          </p>
        </div>
        {!hasInventory && (
          <Button as={Link} to="/scan" variant="rust" size="md" icon={ScanLine}>
            Scan a bill
          </Button>
        )}
      </div>

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
              <motion.span layoutId="recipe-filter-pill" className="absolute inset-0 rounded-full bg-olive-700" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-faint">
          <p>No recipes in this view yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} onCook={handleCook} />
          ))}
        </div>
      )}

      <Toast message={toast} show={!!toast} />
    </div>
  )
}
