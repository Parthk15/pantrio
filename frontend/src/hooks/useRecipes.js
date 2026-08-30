import { useMemo } from 'react'
import { useInventory } from '@/context/InventoryContext'
import { RECIPES } from '@/data/recipes'
import { rankRecipes } from '@/utils/recipeMatcher'

/**
 * Dynamically ranks recipes based on current scanned inventory items.
 * Recalculates immediately when a new bill is scanned or inventory changes.
 */
export function useRecipes() {
  const { itemList, items } = useInventory()

  return useMemo(() => {
    const ranking = rankRecipes(RECIPES, itemList)

    return {
      recipes: ranking.allRanked,
      canMakeNow: ranking.canMakeNow,
      almostThere: ranking.almostThere,
      moreIdeas: ranking.moreIdeas,
      topSuggestions: ranking.topSuggestions,
      scannedItems: itemList,
      hasScannedItems: itemList.length > 0,
      totalCount: RECIPES.length,
      readyCount: ranking.canMakeNow.length,
    }
  }, [itemList, items])
}
