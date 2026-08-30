// Smart ingredient normalization and recipe matching engine for Pantrio.

const SYNONYM_MAP = {
  // Vegetables
  tomato: 'tomato',
  tomatoes: 'tomato',
  'fresh tomato': 'tomato',
  potato: 'potato',
  potatoes: 'potato',
  aloo: 'potato',
  onion: 'onion',
  onions: 'onion',
  pyaz: 'onion',
  cucumber: 'cucumber',
  cucumbers: 'cucumber',
  garlic: 'garlic',
  ginger: 'ginger',
  coriander: 'coriander',
  cilantro: 'coriander',
  'green chilli': 'green chilli',
  chilli: 'green chilli',

  // Dairy & Bakery
  yogurt: 'yogurt',
  dahi: 'yogurt',
  curd: 'yogurt',
  milk: 'milk',
  doodh: 'milk',
  bread: 'bread',
  'bread slice': 'bread',
  butter: 'butter',
  ghee: 'ghee',
  paneer: 'paneer',
  'cottage cheese': 'paneer',

  // Grains & Staples
  atta: 'atta',
  flour: 'atta',
  'wheat flour': 'atta',
  gehu: 'atta',
  rice: 'rice',
  chawal: 'rice',
  'basmati rice': 'rice',
  dal: 'dal',
  lentil: 'dal',
  pulses: 'dal',
  egg: 'egg',
  eggs: 'egg',
  anda: 'egg',
  pasta: 'pasta',
  tea: 'tea',
  chai: 'tea',
}

/**
 * Normalizes an ingredient or product name for robust matching.
 */
export function normalizeIngredient(name) {
  if (!name || typeof name !== 'string') return ''
  const clean = name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical content e.g. (1kg)
    .replace(/[0-9]+(\.[0-9]+)?\s*(kg|g|l|ml|pcs|pkt|pack|box)/gi, '') // remove quantities
    .trim()

  if (SYNONYM_MAP[clean]) {
    return SYNONYM_MAP[clean]
  }

  // Substring matching check for synonyms
  for (const [key, normalized] of Object.entries(SYNONYM_MAP)) {
    if (clean.includes(key)) {
      return normalized
    }
  }

  return clean
}

/**
 * Checks if a scanned item name matches a required/optional recipe ingredient.
 */
export function isIngredientMatch(scannedName, recipeIngredient) {
  const normScanned = normalizeIngredient(scannedName)
  const normRecipe = normalizeIngredient(recipeIngredient)

  if (!normScanned || !normRecipe) return false
  if (normScanned === normRecipe) return true
  if (normScanned.includes(normRecipe) || normRecipe.includes(normScanned)) return true

  return false
}

/**
 * Matches a single recipe against the user's available inventory items.
 */
export function matchRecipe(recipe, inventoryItems = []) {
  // Normalize available inventory item names
  const availableItems = Array.isArray(inventoryItems)
    ? inventoryItems
    : Object.keys(inventoryItems).map((key) => ({ name: key, ...inventoryItems[key] }))

  const requiredList = recipe.requiredIngredients || Object.keys(recipe.ingredients || {})
  const optionalList = recipe.optionalIngredients || []

  const matchedRequired = []
  const missingRequired = []

  for (const reqIng of requiredList) {
    const found = availableItems.find((item) => {
      const itemName = typeof item === 'string' ? item : item.name
      return isIngredientMatch(itemName, reqIng)
    })

    if (found) {
      const scannedName = typeof found === 'string' ? found : found.name
      matchedRequired.push({ ingredient: reqIng, scannedName })
    } else {
      missingRequired.push({ ingredient: reqIng })
    }
  }

  const matchedOptional = []
  const missingOptional = []

  for (const optIng of optionalList) {
    const found = availableItems.find((item) => {
      const itemName = typeof item === 'string' ? item : item.name
      return isIngredientMatch(itemName, optIng)
    })

    if (found) {
      const scannedName = typeof found === 'string' ? found : found.name
      matchedOptional.push({ ingredient: optIng, scannedName })
    } else {
      missingOptional.push({ ingredient: optIng })
    }
  }

  const totalRequired = requiredList.length
  const matchCount = matchedRequired.length
  const matchPercentage = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 0
  const canMake = missingRequired.length === 0

  let tier = 'unmatched'
  if (canMake) {
    tier = 'ready'
  } else if (matchPercentage >= 50 || matchCount >= 2 || (matchCount >= 1 && missingRequired.length <= 2)) {
    tier = 'almost'
  } else if (matchCount > 0) {
    tier = 'ideas'
  }

  return {
    ...recipe,
    tier,
    canMake,
    matchPercentage,
    matchCount,
    totalRequired,
    matchedRequired,
    missingRequired,
    matchedOptional,
    missingOptional,
    have: matchedRequired,
    missing: missingRequired,
  }
}

/**
 * Scores and ranks all recipes given the current inventory.
 */
export function rankRecipes(recipes, inventoryItems = []) {
  const scored = recipes.map((r) => matchRecipe(r, inventoryItems))

  // Sort: 1) Ready to cook, 2) Match %, 3) Matched item count, 4) Name
  scored.sort((a, b) => {
    if (a.canMake !== b.canMake) return b.canMake ? 1 : -1
    if (b.matchPercentage !== a.matchPercentage) return b.matchPercentage - a.matchPercentage
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount
    return a.name.localeCompare(b.name)
  })

  const canMakeNow = scored.filter((r) => r.tier === 'ready')
  const almostThere = scored.filter((r) => r.tier === 'almost')
  const moreIdeas = scored.filter((r) => r.tier === 'ideas')

  // Collect missing ingredient suggestions for non-100% recipes
  const suggestionSet = new Set()
  for (const r of [...almostThere, ...moreIdeas]) {
    for (const m of r.missingRequired) {
      suggestionSet.add(m.ingredient)
    }
    for (const m of r.missingOptional.slice(0, 1)) {
      suggestionSet.add(m.ingredient)
    }
  }

  return {
    allRanked: scored,
    canMakeNow,
    almostThere,
    moreIdeas,
    topSuggestions: Array.from(suggestionSet).slice(0, 4),
  }
}
