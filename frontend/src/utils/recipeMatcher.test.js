import { RECIPES } from '../data/recipes'
import { rankRecipes, matchRecipe } from './recipeMatcher'

// Verification Test for Pantrio Recipe Engine
export function testRecipeMatchingEngine() {
  console.log('--- TESTING PANTRIO DYNAMIC RECIPE ENGINE ---')

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

  console.log(`Scanned items count: ${scannedBillItems.length}`)
  console.log(`Ready recipes count: ${result.canMakeNow.length}`)
  console.log('Ready Recipes:', result.canMakeNow.map((r) => `${r.name} (${r.matchPercentage}%)`))

  const parathaMatch = result.canMakeNow.find((r) => r.id === 'aloo-paratha')
  const sabziMatch = result.canMakeNow.find((r) => r.id === 'aloo-tamatar-sabzi')
  const sandwichMatch = result.canMakeNow.find((r) => r.id === 'vegetable-sandwich')
  const raitaMatch = result.canMakeNow.find((r) => r.id === 'raita')

  if (parathaMatch && sabziMatch && sandwichMatch && raitaMatch) {
    console.log('✅ TEST PASSED: All expected recipes matched 100% with scanned bill!')
    return true
  } else {
    console.error('❌ TEST FAILED: Missing expected recipe matches')
    return false
  }
}
