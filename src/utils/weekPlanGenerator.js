// Week plan generation — rule-based, no AI API needed.
// Shuffles each meal type's template pool then cycles through across 7 days,
// so the same template never appears back-to-back.

import {
  BREAKFAST_TEMPLATES,
  LUNCH_TEMPLATES,
  DINNER_TEMPLATES,
  SNACK_TEMPLATES,
} from '../data/mealTemplates'

export const DAYS = [
  { key: 'monday',    label: 'Mon', full: 'Monday'    },
  { key: 'tuesday',   label: 'Tue', full: 'Tuesday'   },
  { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
  { key: 'thursday',  label: 'Thu', full: 'Thursday'  },
  { key: 'friday',    label: 'Fri', full: 'Friday'    },
  { key: 'saturday',  label: 'Sat', full: 'Saturday'  },
  { key: 'sunday',    label: 'Sun', full: 'Sunday'    },
]

export const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️'  },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙'  },
  { key: 'snack',     label: 'Snack',     emoji: '🍎'  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Returns a deep copy of a template's ingredients array so mutations are safe
function cloneIngredients(template) {
  return template.ingredients.map((item) => ({ ...item }))
}

export function generateWeekPlan() {
  // Shuffle each pool independently for variety
  const breakfasts = shuffle(BREAKFAST_TEMPLATES)
  const lunches    = shuffle(LUNCH_TEMPLATES)
  const dinners    = shuffle(DINNER_TEMPLATES)
  const snacks     = shuffle(SNACK_TEMPLATES)

  const plan = {}

  DAYS.forEach(({ key }, i) => {
    plan[key] = {
      breakfast: { ingredients: cloneIngredients(breakfasts[i % breakfasts.length]) },
      lunch:     { ingredients: cloneIngredients(lunches[i    % lunches.length])    },
      dinner:    { ingredients: cloneIngredients(dinners[i    % dinners.length])    },
      snack:     { ingredients: cloneIngredients(snacks[i     % snacks.length])     },
    }
  })

  return plan
}

// Shared macro calculator — used in WeekGrid cards and daily totals.
// Mirrors the reduce in DetailView so there's a single calculation model.
export function calcMacros(ingredients, ingredientLookup) {
  return ingredients.reduce(
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
}

// Sum macros across all four meal slots for a single day
export function calcDayMacros(dayPlan, ingredientLookup) {
  return MEAL_TYPES.reduce(
    (totals, { key }) => {
      const meal = dayPlan?.[key]
      if (!meal) return totals
      const m = calcMacros(meal.ingredients, ingredientLookup)
      return {
        calories: totals.calories + m.calories,
        protein:  totals.protein  + m.protein,
        carbs:    totals.carbs    + m.carbs,
        fat:      totals.fat      + m.fat,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}
