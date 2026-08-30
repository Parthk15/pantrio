import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, ChefHat, Sparkles, CircleDashed } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const ACCENT_MAP = {
  rust: { bg: 'bg-rust-600', text: 'text-rust-700', badge: 'bg-rust-100 text-rust-700' },
  gold: { bg: 'bg-gold-500', text: 'text-gold-700', badge: 'bg-gold-200 text-gold-700' },
  tomato: { bg: 'bg-tomato-500', text: 'text-tomato-700', badge: 'bg-tomato-100 text-tomato-600' },
  olive: { bg: 'bg-olive-700', text: 'text-olive-800', badge: 'bg-olive-100 text-olive-800' },
}

export default function RecipeCard({ recipe, index = 0, onCook }) {
  const accent = ACCENT_MAP[recipe.accent] || ACCENT_MAP.olive
  const matchPct = recipe.matchPercentage ?? 0
  const matchCount = recipe.matchCount ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.35), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border shadow-soft hover:shadow-lift transition-all duration-300 bg-paper ${
        recipe.canMake ? 'border-olive-400/60 ring-1 ring-olive-400/20' : 'border-ink/8'
      }`}
    >
      <div>
        {/* Card Header Banner */}
        <div className={`h-24 relative flex items-end p-5 ${accent.bg}`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative z-10 w-full flex items-center justify-between">
            <h3 className="font-display text-2xl text-cream-soft leading-tight text-balance">{recipe.name}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <p className="text-xs sm:text-sm text-ink-faint mb-3 line-clamp-2">{recipe.tagline}</p>

          {/* Badges Row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {recipe.canMake ? (
              <Badge tone="olive" icon={CheckCircle2}>
                100% Match · Ready
              </Badge>
            ) : matchPct > 0 ? (
              <Badge tone="gold" icon={Sparkles}>
                {matchPct}% match
              </Badge>
            ) : (
              <Badge tone="cream" icon={CircleDashed}>
                0% match
              </Badge>
            )}
            <Badge tone="cream" icon={Clock3}>{recipe.time}</Badge>
            <Badge tone="cream" icon={ChefHat}>{recipe.difficulty}</Badge>
          </div>

          {/* Why Recommended Callout */}
          <div className="mb-4 rounded-xl bg-cream-dark/60 border border-ink/5 p-2.5 text-xs text-ink-soft">
            <span className="font-semibold text-ink">
              {matchCount > 0
                ? `Uses ${matchCount} ingredient${matchCount === 1 ? '' : 's'} from your scanned bill`
                : 'No ingredients available from recent bill'}
            </span>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-1.5 mb-5 text-xs font-medium">
            {/* Matched Required Ingredients */}
            {recipe.matchedRequired?.map(({ ingredient, scannedName }) => (
              <div key={ingredient} className="flex items-center gap-2 text-olive-800 bg-olive-50/70 border border-olive-200/50 rounded-lg px-2.5 py-1.5">
                <span className="font-bold text-olive-700">✓</span>
                <span>{ingredient}</span>
                {scannedName && scannedName.toLowerCase() !== ingredient.toLowerCase() && (
                  <span className="text-[10px] text-olive-600/70 font-normal italic">({scannedName})</span>
                )}
              </div>
            ))}

            {/* Missing Required Ingredients */}
            {recipe.missingRequired?.map(({ ingredient }) => (
              <div key={ingredient} className="flex items-center gap-2 text-ink-faint bg-ink/4 rounded-lg px-2.5 py-1.5">
                <span className="text-tomato-500 font-bold">○</span>
                <span className="line-through decoration-1 opacity-75">{ingredient}</span>
                <span className="ml-auto text-[10px] text-tomato-600 font-semibold uppercase tracking-wider">Missing</span>
              </div>
            ))}

            {/* Optional Ingredients */}
            {recipe.matchedOptional?.map(({ ingredient }) => (
              <div key={`opt-${ingredient}`} className="flex items-center gap-2 text-gold-700 bg-gold-50/60 rounded-lg px-2.5 py-1.5">
                <span className="font-bold">✓</span>
                <span>{ingredient} <span className="text-[10px] opacity-75 font-normal">(optional)</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        <Button
          variant={recipe.canMake ? 'primary' : 'ghost'}
          size="sm"
          className="w-full"
          disabled={!recipe.canMake}
          onClick={() => onCook?.(recipe)}
        >
          {recipe.canMake
            ? 'Mark as cooked'
            : recipe.missingRequired?.length > 0
            ? `Need ${recipe.missingRequired.map((m) => m.ingredient).join(', ')}`
            : 'Missing ingredients'}
        </Button>
      </div>
    </motion.div>
  )
}
