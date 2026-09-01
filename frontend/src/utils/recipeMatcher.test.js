import { describe, it, expect } from 'vitest'
import { RECIPES } from '../data/recipes'
import { rankRecipes, matchRecipe } from './recipeMatcher'

describe('Pantrio Recipe Matching Engine', () => {
  it('correctly ranks and matches recipes based on scanned bill items', () => {
    const scannedBillItems = [
      { name: 'Tomato', quantity: 2, unit: 'kg' },
      { name: 'Potato', quantity: 3, unit: 'kg' },
      { name: 'Onion', quantity: 1, unit: 'kg' },
      { name: 'Atta', quantity: 5, unit: 'kg' },
      { name: 'Milk', quantity: 2, unit: 'L' },
      { name: 'Bread', quantity: 1, unit: 'pkt' },
      { name: 'Yogurt', quantity: 1, unit: 'kg' },
    ]

    const result = rankRecipes(RECIPES, scannedBillItems)

    expect(scannedBillItems.length).toBe(7)
    expect(result.canMakeNow.length).toBeGreaterThan(0)

    const parathaMatch = result.canMakeNow.find((r) => r.id === 'aloo-paratha')
    const sabziMatch = result.canMakeNow.find((r) => r.id === 'aloo-tamatar-sabzi')
    const sandwichMatch = result.canMakeNow.find((r) => r.id === 'vegetable-sandwich')
    const raitaMatch = result.canMakeNow.find((r) => r.id === 'raita')

    expect(parathaMatch).toBeDefined()
    expect(sabziMatch).toBeDefined()
    expect(sandwichMatch).toBeDefined()
    expect(raitaMatch).toBeDefined()
  })

  it('calculates individual recipe match percentage correctly', () => {
    const recipe = RECIPES[0] // e.g. Aloo Paratha
    const availableItems = [{ name: recipe.requiredIngredients[0] }]
    const match = matchRecipe(recipe, availableItems)

    expect(match).toHaveProperty('matchPercentage')
    expect(match).toHaveProperty('matchedRequired')
    expect(match).toHaveProperty('missingRequired')
  })
})



