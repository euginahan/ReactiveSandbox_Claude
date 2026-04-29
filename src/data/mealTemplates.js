// Rule-based meal templates for the Weekly Planner.
// Each template is an array of { ingredientId, quantity } using the same
// ingredient ids from ingredients.js so macro calculations work unchanged.
//
// Design principle: templates should feel like real meals a person would eat,
// not random ingredient dumps. Breakfast = morning foods, snacks = light bites, etc.

export const BREAKFAST_TEMPLATES = [
  // Oatmeal + fruit + PB
  {
    ingredients: [
      { ingredientId: 'oats',          quantity: 60  },
      { ingredientId: 'banana',        quantity: 120 },
      { ingredientId: 'peanut-butter', quantity: 16  },
      { ingredientId: 'milk-whole',    quantity: 150 },
    ],
  },
  // Scrambled eggs on toast
  {
    ingredients: [
      { ingredientId: 'eggs',              quantity: 150 },
      { ingredientId: 'whole-wheat-bread', quantity: 60  },
      { ingredientId: 'spinach',           quantity: 60  },
      { ingredientId: 'olive-oil',         quantity: 10  },
    ],
  },
  // Greek yogurt bowl
  {
    ingredients: [
      { ingredientId: 'greek-yogurt', quantity: 150 },
      { ingredientId: 'banana',       quantity: 100 },
      { ingredientId: 'almonds',      quantity: 15  },
    ],
  },
  // Cottage cheese + fruit
  {
    ingredients: [
      { ingredientId: 'cottage-cheese', quantity: 150 },
      { ingredientId: 'banana',         quantity: 120 },
      { ingredientId: 'almonds',        quantity: 15  },
    ],
  },
  // Eggs + peppers (veggie scramble)
  {
    ingredients: [
      { ingredientId: 'eggs',        quantity: 150 },
      { ingredientId: 'bell-pepper', quantity: 100 },
      { ingredientId: 'spinach',     quantity: 80  },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
  // Overnight oats with yogurt
  {
    ingredients: [
      { ingredientId: 'oats',         quantity: 60  },
      { ingredientId: 'greek-yogurt', quantity: 100 },
      { ingredientId: 'banana',       quantity: 80  },
      { ingredientId: 'milk-whole',   quantity: 100 },
    ],
  },
  // Toast + PB + banana
  {
    ingredients: [
      { ingredientId: 'whole-wheat-bread', quantity: 60  },
      { ingredientId: 'peanut-butter',     quantity: 32  },
      { ingredientId: 'banana',            quantity: 120 },
    ],
  },
]

export const LUNCH_TEMPLATES = [
  // Classic chicken rice bowl
  {
    ingredients: [
      { ingredientId: 'chicken-breast', quantity: 150 },
      { ingredientId: 'brown-rice',     quantity: 150 },
      { ingredientId: 'broccoli',       quantity: 100 },
      { ingredientId: 'olive-oil',      quantity: 14  },
    ],
  },
  // Tuna salad with bread
  {
    ingredients: [
      { ingredientId: 'tuna',              quantity: 100 },
      { ingredientId: 'whole-wheat-bread', quantity: 60  },
      { ingredientId: 'spinach',           quantity: 80  },
      { ingredientId: 'bell-pepper',       quantity: 100 },
      { ingredientId: 'olive-oil',         quantity: 10  },
    ],
  },
  // Salmon grain bowl
  {
    ingredients: [
      { ingredientId: 'salmon',    quantity: 140 },
      { ingredientId: 'quinoa',    quantity: 150 },
      { ingredientId: 'spinach',   quantity: 80  },
      { ingredientId: 'olive-oil', quantity: 14  },
    ],
  },
  // Ground beef + rice + peppers
  {
    ingredients: [
      { ingredientId: 'ground-beef', quantity: 150 },
      { ingredientId: 'brown-rice',  quantity: 150 },
      { ingredientId: 'bell-pepper', quantity: 100 },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
  // Chicken sweet potato plate
  {
    ingredients: [
      { ingredientId: 'chicken-breast', quantity: 150 },
      { ingredientId: 'sweet-potato',   quantity: 150 },
      { ingredientId: 'broccoli',       quantity: 80  },
      { ingredientId: 'olive-oil',      quantity: 10  },
    ],
  },
  // Egg quinoa bowl
  {
    ingredients: [
      { ingredientId: 'eggs',        quantity: 150 },
      { ingredientId: 'quinoa',      quantity: 150 },
      { ingredientId: 'spinach',     quantity: 80  },
      { ingredientId: 'bell-pepper', quantity: 80  },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
  // Tuna + sweet potato + greens
  {
    ingredients: [
      { ingredientId: 'tuna',         quantity: 100 },
      { ingredientId: 'sweet-potato', quantity: 150 },
      { ingredientId: 'spinach',      quantity: 80  },
      { ingredientId: 'olive-oil',    quantity: 10  },
    ],
  },
]

export const DINNER_TEMPLATES = [
  // Salmon + quinoa + broccoli
  {
    ingredients: [
      { ingredientId: 'salmon',    quantity: 140 },
      { ingredientId: 'quinoa',    quantity: 150 },
      { ingredientId: 'broccoli',  quantity: 100 },
      { ingredientId: 'olive-oil', quantity: 14  },
    ],
  },
  // Ground beef stir fry
  {
    ingredients: [
      { ingredientId: 'ground-beef', quantity: 150 },
      { ingredientId: 'brown-rice',  quantity: 120 },
      { ingredientId: 'bell-pepper', quantity: 100 },
      { ingredientId: 'broccoli',    quantity: 80  },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
  // Chicken + sweet potato + spinach
  {
    ingredients: [
      { ingredientId: 'chicken-breast', quantity: 150 },
      { ingredientId: 'sweet-potato',   quantity: 150 },
      { ingredientId: 'spinach',        quantity: 80  },
      { ingredientId: 'olive-oil',      quantity: 14  },
    ],
  },
  // Salmon + sweet potato
  {
    ingredients: [
      { ingredientId: 'salmon',       quantity: 140 },
      { ingredientId: 'sweet-potato', quantity: 150 },
      { ingredientId: 'broccoli',     quantity: 80  },
      { ingredientId: 'olive-oil',    quantity: 14  },
    ],
  },
  // Chicken + brown rice + peppers
  {
    ingredients: [
      { ingredientId: 'chicken-breast', quantity: 150 },
      { ingredientId: 'brown-rice',     quantity: 150 },
      { ingredientId: 'bell-pepper',    quantity: 100 },
      { ingredientId: 'olive-oil',      quantity: 14  },
    ],
  },
  // Ground beef + quinoa + broccoli
  {
    ingredients: [
      { ingredientId: 'ground-beef', quantity: 150 },
      { ingredientId: 'quinoa',      quantity: 150 },
      { ingredientId: 'broccoli',    quantity: 100 },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
  // Eggs + rice + spinach (recovery dinner)
  {
    ingredients: [
      { ingredientId: 'eggs',        quantity: 150 },
      { ingredientId: 'brown-rice',  quantity: 150 },
      { ingredientId: 'spinach',     quantity: 80  },
      { ingredientId: 'olive-oil',   quantity: 10  },
    ],
  },
]

export const SNACK_TEMPLATES = [
  // Greek yogurt + almonds
  {
    ingredients: [
      { ingredientId: 'greek-yogurt', quantity: 150 },
      { ingredientId: 'almonds',      quantity: 15  },
    ],
  },
  // PB banana
  {
    ingredients: [
      { ingredientId: 'banana',        quantity: 120 },
      { ingredientId: 'peanut-butter', quantity: 32  },
    ],
  },
  // Cottage cheese + almonds
  {
    ingredients: [
      { ingredientId: 'cottage-cheese', quantity: 150 },
      { ingredientId: 'almonds',        quantity: 15  },
    ],
  },
  // Tuna + bread
  {
    ingredients: [
      { ingredientId: 'tuna',              quantity: 85 },
      { ingredientId: 'whole-wheat-bread', quantity: 30 },
    ],
  },
  // Cheddar + almonds
  {
    ingredients: [
      { ingredientId: 'cheddar-cheese', quantity: 28  },
      { ingredientId: 'almonds',        quantity: 28  },
    ],
  },
]
