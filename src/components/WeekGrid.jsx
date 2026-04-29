// WeekGrid — 7-day meal planning calendar
// Reads: weekPlan, selectedWeekMeal, ingredientLookup, isGenerating
// Writes: onSelectMeal, onGenerateWeekPlan

import { DAYS, MEAL_TYPES, calcMacros, calcDayMacros } from '../utils/weekPlanGenerator'

// Reuse the same recipe name logic as DetailView for consistent naming
function shortenName(name) {
  return name
    .replace(' (cooked)', '')
    .replace(' (canned)', '')
    .replace(' (dry)', '')
    .replace(' (90% lean)', '')
}

function getRecipeName(ingredients, ingredientLookup) {
  if (!ingredients.length) return 'No meal set'

  const sorted = [...ingredients].sort((a, b) => b.quantity - a.quantity)
  const topNames = sorted
    .slice(0, 2)
    .map((item) => shortenName(ingredientLookup[item.ingredientId]?.name || ''))
    .filter(Boolean)

  const categories = ingredients.map((i) => ingredientLookup[i.ingredientId]?.category)
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

  if (topNames.length >= 2) return `${topNames[0]} & ${topNames[1]} ${format}`
  if (topNames.length === 1) return `${topNames[0]} ${format}`
  return `${character} ${format}`
}

function MealCard({ meal, mealType, isSelected, ingredientLookup, onClick }) {
  const { label, emoji } = MEAL_TYPES.find((m) => m.key === mealType)
  const isEmpty = !meal || meal.ingredients.length === 0

  const macros = isEmpty ? null : calcMacros(meal.ingredients, ingredientLookup)
  const name   = isEmpty ? '—' : getRecipeName(meal.ingredients, ingredientLookup)

  return (
    <button
      className={`meal-card ${isSelected ? 'selected' : ''} ${isEmpty ? 'empty' : ''}`}
      onClick={onClick}
      disabled={isEmpty}
    >
      <div className="meal-card-type">
        <span className="meal-card-emoji">{emoji}</span>
        <span className="meal-card-type-label">{label}</span>
      </div>
      <div className="meal-card-name">{name}</div>
      {macros && (
        <div className="meal-card-macros">
          <span className="meal-card-kcal">{macros.calories.toFixed(0)} kcal</span>
          <span className="meal-card-macro-detail">
            P {macros.protein.toFixed(0)}g · C {macros.carbs.toFixed(0)}g · F {macros.fat.toFixed(0)}g
          </span>
        </div>
      )}
    </button>
  )
}

function DayColumn({ dayMeta, dayPlan, selectedWeekMeal, ingredientLookup, onSelectMeal }) {
  const isToday = false // could add real date check later
  const dayMacros = dayPlan ? calcDayMacros(dayPlan, ingredientLookup) : null

  return (
    <div className={`day-column ${isToday ? 'today' : ''}`}>
      <div className="day-column-header">
        <div className="day-label">{dayMeta.full}</div>
        {dayMacros && (
          <div className="day-total">
            {dayMacros.calories.toFixed(0)} kcal
          </div>
        )}
      </div>

      <div className="meal-cards-stack">
        {MEAL_TYPES.map(({ key: mealType }) => (
          <MealCard
            key={mealType}
            meal={dayPlan?.[mealType]}
            mealType={mealType}
            isSelected={
              selectedWeekMeal?.day === dayMeta.key &&
              selectedWeekMeal?.mealType === mealType
            }
            ingredientLookup={ingredientLookup}
            onClick={() => onSelectMeal(dayMeta.key, mealType)}
          />
        ))}
      </div>

      {dayMacros && (
        <div className="day-macro-footer">
          <span className="day-footer-macro">P {dayMacros.protein.toFixed(0)}g</span>
          <span className="day-footer-sep">·</span>
          <span className="day-footer-macro">C {dayMacros.carbs.toFixed(0)}g</span>
          <span className="day-footer-sep">·</span>
          <span className="day-footer-macro">F {dayMacros.fat.toFixed(0)}g</span>
        </div>
      )}
    </div>
  )
}

function WeekGrid({ weekPlan, selectedWeekMeal, ingredientLookup, onSelectMeal, onGenerateWeekPlan, isGenerating }) {
  const hasWeekPlan = weekPlan !== null

  return (
    <div className="panel week-grid-panel">
      <div className="panel-header week-grid-header">
        <div>
          <div className="panel-title">Week Plan</div>
          <div className="panel-subtitle">
            {hasWeekPlan ? 'Click a meal card to see the full recipe' : 'Generate a week to get started'}
          </div>
        </div>
        <button
          className="generate-week-btn"
          onClick={onGenerateWeekPlan}
          disabled={isGenerating}
        >
          {isGenerating
            ? <><div className="spinner" /> Generating…</>
            : <><span>✨</span> {hasWeekPlan ? 'Regenerate' : 'Generate Week Plan'}</>
          }
        </button>
      </div>

      <div className="week-grid-body">
        {hasWeekPlan ? (
          <div className="day-columns-scroll">
            <div className="day-columns">
              {DAYS.map((dayMeta) => (
                <DayColumn
                  key={dayMeta.key}
                  dayMeta={dayMeta}
                  dayPlan={weekPlan[dayMeta.key]}
                  selectedWeekMeal={selectedWeekMeal}
                  ingredientLookup={ingredientLookup}
                  onSelectMeal={onSelectMeal}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="week-empty-state">
            <div className="week-empty-icon">📅</div>
            <p>Your week is empty.</p>
            <p className="week-empty-sub">Click <strong>Generate Week Plan</strong> to auto-fill 7 days of balanced meals.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeekGrid
