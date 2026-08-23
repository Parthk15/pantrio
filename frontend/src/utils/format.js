export function formatPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return `\u20B9${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatQuantity(quantity, unit) {
  const n = Number(quantity)
  const rounded = Number.isInteger(n) ? n : Math.round(n * 100) / 100
  return `${rounded} ${unit || ''}`.trim()
}

const UNIT_LABELS = {
  kg: 'kilograms',
  g: 'grams',
  L: 'litres',
  ml: 'millilitres',
  piece: 'pieces',
  packet: 'packets',
  dozen: 'dozen',
}

export function unitLabel(unit) {
  return UNIT_LABELS[unit] || unit
}

export function timeAgo(dateIso) {
  if (!dateIso) return ''
  const diff = Date.now() - new Date(dateIso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Deterministic small set of "ingredient personality" tags so cards
// feel curated rather than uniform, based only on the real item name.
const PRODUCE_HINTS = ['tomato', 'onion', 'apple', 'spinach', 'potato', 'banana', 'carrot', 'garlic', 'ginger', 'lemon', 'mango', 'cucumber', 'pepper', 'chili', 'lettuce']
const DAIRY_HINTS = ['milk', 'yogurt', 'curd', 'cheese', 'butter', 'paneer', 'cream']
const PANTRY_HINTS = ['rice', 'bread', 'flour', 'atta', 'sugar', 'salt', 'oil', 'dal', 'lentil', 'pasta', 'oats']

export function categoryFor(name = '') {
  const lower = name.toLowerCase()
  if (PRODUCE_HINTS.some((k) => lower.includes(k))) return 'produce'
  if (DAIRY_HINTS.some((k) => lower.includes(k))) return 'dairy'
  if (PANTRY_HINTS.some((k) => lower.includes(k))) return 'pantry'
  return 'other'
}

export const CATEGORY_META = {
  produce: { label: 'Produce', color: 'olive' },
  dairy: { label: 'Dairy', color: 'gold' },
  pantry: { label: 'Pantry', color: 'rust' },
  other: { label: 'Grocery', color: 'ink' },
}
