// These recipe definitions intentionally mirror `src/recipe_engine.py` (RECIPES dict)
// on the backend 1:1, so recipe-availability math stays consistent with the Python
// pipeline. The backend does not yet expose a `/api/recipes` endpoint — once it does,
// swap the array below for a `fetchRecipes()` call in `services/api.js` and nothing
// else in the UI needs to change (see `hooks/useRecipes.js`).

export const RECIPES = [
  {
    id: 'tomato-rice',
    name: 'Tomato Rice',
    tagline: 'Bright, tangy, weeknight-easy comfort rice.',
    time: '25 min',
    difficulty: 'Easy',
    accent: 'rust',
    ingredients: { Tomato: 0.5, Rice: 1.0, Onion: 0.5 },
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    tagline: 'Wok-tossed leftovers, elevated.',
    time: '20 min',
    difficulty: 'Easy',
    accent: 'gold',
    ingredients: { Rice: 1.0, Onion: 0.5, Tomato: 0.5 },
  },
  {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    tagline: 'Slow-simmered, silky, deeply savory.',
    time: '30 min',
    difficulty: 'Easy',
    accent: 'tomato',
    ingredients: { Tomato: 0.5, Onion: 0.25 },
  },
  {
    id: 'milk-rice',
    name: 'Milk Rice',
    tagline: 'Gently sweet, warm, and grounding.',
    time: '35 min',
    difficulty: 'Easy',
    accent: 'olive',
    ingredients: { Rice: 1.0, Milk: 0.5 },
  },
]
