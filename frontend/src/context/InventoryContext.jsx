import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getThresholdFor } from '@/data/thresholds'
import { RECIPES } from '@/data/recipes'

const InventoryContext = createContext(null)

const STORAGE_KEY = 'pantrio.inventory.v1'

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: {}, lastScan: null, scans: [] }
    const parsed = JSON.parse(raw)
    return {
      items: parsed.items || {},
      lastScan: parsed.lastScan || null,
      scans: parsed.scans || [],
    }
  } catch {
    return { items: {}, lastScan: null, scans: [] }
  }
}

export function InventoryProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const [justAdded, setJustAdded] = useState([]) // names added in the most recent scan, for entry animation

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Mirrors Inventory.add_item from src/inventory.py: sums quantity for
  // existing items, otherwise creates a fresh entry from the real scan result.
  const addScannedItems = useCallback((scanItems) => {
    setState((prev) => {
      const items = { ...prev.items }
      for (const raw of scanItems) {
        const name = raw.name
        const quantity = Number(raw.quantity) || 0
        const unit = raw.unit
        const price = raw.price == null ? null : Number(raw.price)

        if (items[name]) {
          items[name] = {
            ...items[name],
            quantity: items[name].quantity + quantity,
            price: price ?? items[name].price,
          }
        } else {
          items[name] = { quantity, unit, price }
        }
      }
      const scanRecord = {
        id: `scan_${Date.now()}`,
        date: new Date().toISOString(),
        items: scanItems,
      }
      return {
        items,
        lastScan: scanRecord,
        scans: [scanRecord, ...prev.scans].slice(0, 20),
      }
    })
    setJustAdded(scanItems.map((i) => i.name))
  }, [])

  const clearJustAdded = useCallback(() => setJustAdded([]), [])

  // Mirrors recipe_engine.consume_recipe
  const cookRecipe = useCallback((recipeId) => {
    const recipe = RECIPES.find((r) => r.id === recipeId)
    if (!recipe) return { success: false, reason: 'not_found' }

    let success = true
    setState((prev) => {
      const items = { ...prev.items }
      for (const [ingredient, needed] of Object.entries(recipe.ingredients)) {
        const have = items[ingredient]?.quantity ?? 0
        if (have < needed) success = false
      }
      if (!success) return prev

      for (const [ingredient, needed] of Object.entries(recipe.ingredients)) {
        items[ingredient] = { ...items[ingredient], quantity: items[ingredient].quantity - needed }
      }
      return { ...prev, items }
    })
    return { success }
  }, [])

  const resetInventory = useCallback(() => {
    setState({ items: {}, lastScan: null, scans: [] })
  }, [])

  const itemList = useMemo(
    () =>
      Object.entries(state.items).map(([name, data]) => ({
        name,
        ...data,
        threshold: getThresholdFor(name, data.unit),
        isLow: data.quantity <= getThresholdFor(name, data.unit),
      })),
    [state.items]
  )

  const lowStockItems = useMemo(() => itemList.filter((i) => i.isLow), [itemList])

  const totals = useMemo(() => {
    const totalValue = itemList.reduce((sum, i) => sum + (i.price || 0), 0)
    return {
      itemCount: itemList.length,
      totalValue,
      lowStockCount: lowStockItems.length,
    }
  }, [itemList, lowStockItems])

  const value = {
    items: state.items,
    itemList,
    lowStockItems,
    totals,
    lastScan: state.lastScan,
    scans: state.scans,
    justAdded,
    clearJustAdded,
    addScannedItems,
    cookRecipe,
    resetInventory,
    hasInventory: itemList.length > 0,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
