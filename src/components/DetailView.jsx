// Detail View Panel — Macro Output + Recipe
// Reads: selectedIngredients, ingredientLookup
// Writes: nothing — purely reactive

// ─── Recipe Generation Utilities ────────────────────────────────

const CATEGORY_EMOJI = {
  Protein: '🥩',
  Carbs: '🌾',
  Vegetables: '🥦',
  Fats: '🫒',
  Dairy: '🥛',
}

// Per-ingredient cooking instructions keyed by ingredient id
const STEP_TEMPLATES = {
  'chicken-breast': () =>
    'Season the chicken breast with salt, pepper, and your choice of herbs. Cook in a pan over medium heat for 6–8 minutes per side until fully cooked through.',
  'salmon': () =>
    'Pat the salmon dry and season with salt and pepper. Cook skin-side down in a hot pan for 4–5 minutes, then flip and cook 2–3 minutes more until opaque.',
  'ground-beef': () =>
    'Cook the ground beef in a skillet over medium-high heat, breaking it apart with a spatula, until fully browned. Drain excess fat if needed.',
  'eggs': () =>
    'Whisk the eggs with a pinch of salt. Scramble in a non-stick pan over medium heat until just set, or cook to your preference.',
  'tuna': () =>
    'Drain the canned tuna and flake with a fork. Season lightly with salt, pepper, and a squeeze of lemon if available.',
  'greek-yogurt': () =>
    'Serve the Greek yogurt chilled as a base layer or on the side.',
  'brown-rice': () =>
    'Cook the brown rice in 2× its volume of water. Bring to a boil, reduce heat, cover, and simmer 35–40 minutes until tender. Fluff with a fork.',
  'oats': () =>
    'Cook the oats in hot water or milk, stirring frequently, until creamy — about 5 minutes. Add a pinch of salt.',
  'sweet-potato': () =>
    'Cube the sweet potato and roast at 400°F (200°C) for 20–25 minutes until caramelized and fork-tender, or steam until soft.',
  'quinoa': () =>
    'Rinse the quinoa. Cook in 2× its volume of water — bring to a boil, reduce heat, cover, and simmer 15 minutes until fluffy.',
  'banana': () =>
    'Peel and slice the banana. Serve fresh as a side or stir in at the end.',
  'whole-wheat-bread': () =>
    'Toast the whole wheat bread until golden. Cut as desired and serve alongside.',
  'broccoli': () =>
    'Steam or sauté the broccoli florets for 4–5 minutes until bright green and just tender. Season with a pinch of salt.',
  'spinach': () =>
    'Sauté the spinach in a hot pan for 1–2 minutes until just wilted. Season lightly with salt and a crack of pepper.',
  'bell-pepper': () =>
    'Slice the bell pepper and sauté over medium-high heat for 3–4 minutes until softened with slight char.',
  'olive-oil': () =>
    'Heat the olive oil in your pan before cooking proteins and vegetables — it serves as your base cooking fat throughout.',
  'almonds': () =>
    'Roughly chop the almonds and toast in a dry pan for 2–3 minutes over medium heat. Use as a topping for added crunch.',
  'peanut-butter': () =>
    'Stir the peanut butter until smooth. Drizzle over the finished dish as a sauce or serve as a dipping element.',
  'milk-whole': () =>
    'Use the whole milk as a liquid base for oats, or serve chilled alongside the meal.',
  'cheddar-cheese': () =>
    'Grate the cheddar cheese and sprinkle over the hot dish just before serving so it melts naturally.',
  'cottage-cheese': () =>
    'Serve the cottage cheese chilled as a high-protein topping or on the side.',
}

// Fallback step for any ingredient not in the template map
function fallbackStep(ing) {
  const cat = ing.category
  if (cat === 'Protein') return `Cook the ${ing.name} until fully done and safe to eat.`
  if (cat === 'Vegetables') return `Sauté or steam the ${ing.name} until tender.`
  if (cat === 'Carbs') return `Prepare the ${ing.name} according to package instructions.`
  if (cat === 'Fats') return `Add the ${ing.name} as a finishing element or cooking fat.`
  if (cat === 'Dairy') return `Serve the ${ing.name} chilled or as a topping.`
  return `Prepare the ${ing.name} as desired.`
}

function shortenName(name) {
  return name
    .replace(' (cooked)', '')
    .replace(' (canned)', '')
    .replace(' (dry)', '')
    .replace(' (90% lean)', '')
}

function getRecipeName(selectedIngredients, ingredientLookup) {
  if (!selectedIngredients.length) return ''

  // Sort by quantity descending, take top 2 for the name
  const sorted = [...selectedIngredients].sort((a, b) => b.quantity - a.quantity)
  const topNames = sorted
    .slice(0, 2)
    .map((item) => shortenName(ingredientLookup[item.ingredientId]?.name || ''))
    .filter(Boolean)

  // Determine meal character from category counts
  const categories = selectedIngredients.map(
    (i) => ingredientLookup[i.ingredientId]?.category
  )
  const proteinCount = categories.filter((c) => c === 'Protein').length
  const carbCount    = categories.filter((c) => c === 'Carbs').length
  const vegCount     = categories.filter((c) => c === 'Vegetables').length

  let character = 'Custom'
  if (proteinCount >= 2 && carbCount === 0) character = 'High Protein'
  else if (proteinCount >= 1 && carbCount === 0) character = 'Low Carb'
  else if (proteinCount >= 1 && carbCount >= 1 && vegCount >= 1) character = 'Balanced'
  else if (carbCount >= 2) character = 'Carb-Rich'
  else if (proteinCount >= 1 && carbCount >= 1) character = 'Classic'

  const format = carbCount >= 1 ? 'Bowl' : vegCount >= 1 ? 'Plate' : 'Meal'

  if (topNames.length >= 2) return `${character} ${topNames[0]} & ${topNames[1]} ${format}`
  if (topNames.length === 1) return `${character} ${topNames[0]} ${format}`
  return `${character} ${format}`
}

function getRecipeDescription(selectedIngredients, ingredientLookup) {
  if (!selectedIngredients.length) return ''

  const categories = selectedIngredients.map(
    (i) => ingredientLookup[i.ingredientId]?.category
  )
  const proteinCount = categories.filter((c) => c === 'Protein').length
  const carbCount    = categories.filter((c) => c === 'Carbs').length
  const vegCount     = categories.filter((c) => c === 'Vegetables').length
  const fatCount     = categories.filter((c) => c === 'Fats').length
  const dairyCount   = categories.filter((c) => c === 'Dairy').length
  const total        = selectedIngredients.length

  if (proteinCount >= 2 && carbCount === 0) {
    return `A high-protein build combining ${proteinCount} protein sources. Designed to maximize amino acid intake with minimal carbohydrates — ideal for muscle recovery or body recomposition.`
  }
  if (proteinCount >= 1 && carbCount >= 1 && vegCount >= 1) {
    return `A balanced meal hitting all three macronutrient groups across ${total} ingredients. Protein for recovery, complex carbs for sustained energy, and vegetables for micronutrient density.`
  }
  if (proteinCount >= 1 && carbCount === 0 && vegCount >= 1) {
    return `A low-carb plate built around quality protein and nutrient-dense vegetables. Keeps blood sugar stable while delivering strong satiety and essential micronutrients.`
  }
  if (carbCount >= 2) {
    return `A carbohydrate-forward meal delivering sustained energy through complex whole grains and starchy vegetables. Well-suited for pre-training fueling or active recovery days.`
  }
  if (fatCount >= 2 && proteinCount >= 1) {
    return `A fat-focused, high-satiety meal combining quality fats with protein. Supports hormone health and long-lasting energy without the blood sugar spike of high-carb options.`
  }
  if (dairyCount >= 1 && proteinCount >= 1) {
    return `A protein-rich combination featuring dairy alongside lean proteins — a strong pairing for calcium intake and complete amino acid coverage in a single meal.`
  }
  return `A custom ${total}-ingredient combination. Adjust quantities in the Meal Builder to hit your macro targets.`
}

function generateSteps(selectedIngredients, ingredientLookup) {
  const steps = []
  const categories = selectedIngredients.map(
    (i) => ingredientLookup[i.ingredientId]?.category
  )

  // Olive oil goes first if present — it frames the cooking approach
  const hasOil = selectedIngredients.some((i) => i.ingredientId === 'olive-oil')
  if (hasOil) steps.push(STEP_TEMPLATES['olive-oil']())

  // One step per ingredient (skip olive oil — already handled)
  for (const item of selectedIngredients) {
    if (item.ingredientId === 'olive-oil') continue
    const ing = ingredientLookup[item.ingredientId]
    if (!ing) continue
    const template = STEP_TEMPLATES[item.ingredientId]
    steps.push(template ? template() : fallbackStep(ing))
  }

  // Assembly step based on what's in the meal
  const hasCarbs   = categories.includes('Carbs')
  const hasProtein = categories.includes('Protein')
  const hasVeg     = categories.includes('Vegetables')

  if (hasCarbs && hasProtein && hasVeg) {
    steps.push('Layer the carb base in your bowl. Arrange the proteins on top and add the vegetables alongside.')
  } else if (hasCarbs && hasProtein) {
    steps.push('Serve the proteins over the carb base and plate together.')
  } else if (hasProtein && hasVeg) {
    steps.push('Plate the proteins and arrange the vegetables alongside.')
  } else {
    steps.push('Combine all components and plate together.')
  }

  steps.push('Season to taste with salt and pepper. Serve immediately and enjoy.')

  return steps
}

// ─── Component ──────────────────────────────────────────────────

function DetailView({ selectedIngredients, ingredientLookup }) {
  // Derive totals — always calculated, never stored
  const totals = selectedIngredients.reduce(
    (acc, item) => {
      const ing = ingredientLookup[item.ingredientId]
      if (!ing) return acc
      const f = item.quantity / 100
      return {
        calories: acc.calories + ing.per100g.calories * f,
        protein:  acc.protein  + ing.per100g.protein  * f,
        carbs:    acc.carbs    + ing.per100g.carbs    * f,
        fat:      acc.fat      + ing.per100g.fat      * f,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Macro ratio bar (caloric contribution)
  const proteinCals    = totals.protein * 4
  const carbCals       = totals.carbs   * 4
  const fatCals        = totals.fat     * 9
  const totalMacroCals = proteinCals + carbCals + fatCals

  const ratios = totalMacroCals > 0
    ? {
        protein: (proteinCals / totalMacroCals) * 100,
        carbs:   (carbCals    / totalMacroCals) * 100,
        fat:     (fatCals     / totalMacroCals) * 100,
      }
    : { protein: 0, carbs: 0, fat: 0 }

  // Recipe — derived from current state, updates automatically
  const recipeName        = getRecipeName(selectedIngredients, ingredientLookup)
  const recipeDescription = getRecipeDescription(selectedIngredients, ingredientLookup)
  const recipeSteps       = generateSteps(selectedIngredients, ingredientLookup)

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Macro Output</div>
        <div className="panel-subtitle">Live nutritional breakdown</div>
      </div>

      <div className="panel-body">
        {selectedIngredients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Add ingredients to see your macro breakdown and recipe.</p>
          </div>
        ) : (
          <>
            {/* ── Recipe identity card — TOP of panel ── */}
            <div className="recipe-header-card">
              <div className="recipe-header-eyebrow">Your Meal</div>
              <div className="recipe-header-name">{recipeName}</div>
              <p className="recipe-header-desc">{recipeDescription}</p>
            </div>

            {/* ── Calorie hero + macro stats ── */}
            <div className="totals-block">
              <div className="total-calories">{totals.calories.toFixed(0)}</div>
              <div className="total-calories-label">Calories</div>
              <div className="macro-stats">
                <div className="macro-stat stat-protein">
                  <div className="macro-stat-value">{totals.protein.toFixed(1)}g</div>
                  <div className="macro-stat-label">Protein</div>
                </div>
                <div className="macro-stat stat-carbs">
                  <div className="macro-stat-value">{totals.carbs.toFixed(1)}g</div>
                  <div className="macro-stat-label">Carbs</div>
                </div>
                <div className="macro-stat stat-fat">
                  <div className="macro-stat-value">{totals.fat.toFixed(1)}g</div>
                  <div className="macro-stat-label">Fat</div>
                </div>
              </div>
            </div>

            {/* ── Macro ratio bar ── */}
            <div className="ratio-bar-wrap">
              <div className="ratio-bar-label">Macro Ratio</div>
              <div className="ratio-bar">
                <div className="ratio-segment protein" style={{ width: `${ratios.protein}%` }} />
                <div className="ratio-segment carbs"   style={{ width: `${ratios.carbs}%` }} />
                <div className="ratio-segment fat"     style={{ width: `${ratios.fat}%` }} />
              </div>
              <div className="ratio-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#4A90D9' }} />
                  Protein {ratios.protein.toFixed(0)}%
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#F0A030' }} />
                  Carbs {ratios.carbs.toFixed(0)}%
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#D95C4A' }} />
                  Fat {ratios.fat.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* ── Ingredient Breakdown ── */}
            <div className="breakdown-label">Ingredient Breakdown</div>
            <div className="breakdown-rows">
              {selectedIngredients.map((item) => {
                const ing = ingredientLookup[item.ingredientId]
                if (!ing) return null
                const f = item.quantity / 100
                return (
                  <div key={item.ingredientId} className="breakdown-row">
                    <div>
                      <div className="breakdown-name">{ing.name}</div>
                      <div className="breakdown-qty">{item.quantity}g</div>
                    </div>
                    <div>
                      <div className="breakdown-cals">
                        {(ing.per100g.calories * f).toFixed(0)} kcal
                      </div>
                      <div className="breakdown-macros">
                        P {(ing.per100g.protein * f).toFixed(1)}g ·{' '}
                        C {(ing.per100g.carbs   * f).toFixed(1)}g ·{' '}
                        F {(ing.per100g.fat     * f).toFixed(1)}g
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Recipe Card ── */}
            <div className="recipe-divider" />
            <div className="recipe-card">
              <div className="recipe-card-header">
                <span className="recipe-icon">🍳</span>
                <div>
                  <div className="recipe-eyebrow">How to Prepare</div>
                  <div className="recipe-name">{recipeName}</div>
                </div>
              </div>

              {/* Ingredients list */}
              <div className="recipe-section-label">Ingredients</div>
              <ul className="recipe-ingredients">
                {selectedIngredients.map((item) => {
                  const ing = ingredientLookup[item.ingredientId]
                  if (!ing) return null
                  const emoji = CATEGORY_EMOJI[ing.category] || '🍽️'
                  return (
                    <li key={item.ingredientId} className="recipe-ingredient-line">
                      <span className="recipe-ingredient-emoji">{emoji}</span>
                      <span>
                        <strong>{item.quantity}g</strong> {shortenName(ing.name)}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* Step-by-step instructions */}
              <div className="recipe-section-label">Instructions</div>
              <ol className="recipe-steps">
                {recipeSteps.map((step, i) => (
                  <li key={i} className="recipe-step">
                    <span className="recipe-step-num">{i + 1}</span>
                    <span className="recipe-step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DetailView
