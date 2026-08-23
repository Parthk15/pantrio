import { useMemo } from 'react'
import { useInventory } from '@/context/InventoryContext'
import { RECIPES } from '@/data/recipes'

// Mirrors src/recipe_suggester.py: for each recipe, checks every required
// ingredient against the live inventory and reports what's missing/short.
export function useRecipes() {
  const { items } = useInventory()

  return useMemo(() => {
    return RECIPES.map((recipe) => {
      const missing = []
      const have = []

      for (const [ingredient, requiredQty] of Object.entries(recipe.ingredients)) {
        const stock = items[ingredient]
        const availableQty = stock?.quantity ?? 0

        if (!stock || availableQty < requiredQty) {
          missing.push({ ingredient, requiredQty, availableQty })
        } else {
          have.push({ ingredient, requiredQty, availableQty })
        }
      }

      return {
        ...recipe,
        canMake: missing.length === 0,
        missing,
        have,
        matchRatio: have.length / (have.length + missing.length),
      }
    }).sort((a, b) => Number(b.canMake) - Number(a.canMake) || b.matchRatio - a.matchRatio)
  }, [items])
}
