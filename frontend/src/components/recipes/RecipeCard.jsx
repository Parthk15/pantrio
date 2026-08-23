import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, ChefHat, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const ACCENT_MAP = {
  rust: { bg: 'bg-rust-600', soft: 'bg-rust-100 text-rust-700' },
  gold: { bg: 'bg-gold-500', soft: 'bg-gold-200 text-gold-600' },
  tomato: { bg: 'bg-tomato-500', soft: 'bg-tomato-100 text-tomato-600' },
  olive: { bg: 'bg-olive-700', soft: 'bg-olive-100 text-olive-800' },
}

export default function RecipeCard({ recipe, index = 0, onCook }) {
  const accent = ACCENT_MAP[recipe.accent] || ACCENT_MAP.olive

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-[1.75rem] border shadow-soft hover:shadow-lift transition-shadow duration-300 bg-paper ${
        recipe.canMake ? 'border-olive-300/50' : 'border-ink/8'
      }`}
    >
      <div className={`h-24 relative flex items-end p-5 ${accent.bg}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <h3 className="relative font-display text-2xl text-cream-soft leading-none text-balance">{recipe.name}</h3>
      </div>

      <div className="p-5">
        <p className="text-sm text-ink-faint mb-4">{recipe.tagline}</p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge tone="cream" icon={Clock3}>{recipe.time}</Badge>
          <Badge tone="cream" icon={ChefHat}>{recipe.difficulty}</Badge>
          {recipe.canMake ? (
            <Badge tone="olive" icon={CheckCircle2}>Ready to cook</Badge>
          ) : (
            <Badge tone="tomato" icon={XCircle}>{recipe.missing.length} missing</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {recipe.have.map(({ ingredient }) => (
            <span key={ingredient} className="rounded-full bg-olive-100 text-olive-800 text-xs font-medium px-2.5 py-1">
              {ingredient}
            </span>
          ))}
          {recipe.missing.map(({ ingredient }) => (
            <span key={ingredient} className="rounded-full bg-ink/6 text-ink-faint text-xs font-medium px-2.5 py-1 line-through decoration-1">
              {ingredient}
            </span>
          ))}
        </div>

        <Button
          variant={recipe.canMake ? 'primary' : 'ghost'}
          size="sm"
          className="w-full"
          disabled={!recipe.canMake}
          onClick={() => onCook?.(recipe)}
        >
          {recipe.canMake ? 'Mark as cooked' : `Need ${recipe.missing.map((m) => m.ingredient).join(', ')}`}
        </Button>
      </div>
    </motion.div>
  )
}
