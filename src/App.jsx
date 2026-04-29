import { useState } from 'react'
import ingredients       from './data/ingredients'
import ingredientDetails from './data/ingredientDetails'
import productsData      from './data/products'
import { generateWeekPlan, DAYS, MEAL_TYPES } from './utils/weekPlanGenerator'
import Browser           from './components/Browser'
import Controller        from './components/Controller'
import DetailView        from './components/DetailView'
import IngredientDetail  from './components/IngredientDetail'
import ModeToggle        from './components/ModeToggle'
import WeekGrid          from './components/WeekGrid'

// App is the single source of truth.
// State lives here. Props go down. Callbacks come back up.

function App() {
  // ── View mode ────────────────────────────────────────────────
  const [currentMode, setCurrentMode] = useState('mealBuilder') // 'mealBuilder' | 'weekPlan'

  // ── Meal Builder state ────────────────────────────────────────
  const [selectedIngredients, setSelectedIngredients] = useState([])

  // ── Week Plan state ───────────────────────────────────────────
  const [weekPlan,         setWeekPlan]         = useState(() => {
    const plan = {}
    DAYS.forEach(({ key }) => {
      plan[key] = {}
      MEAL_TYPES.forEach(({ key: mk }) => { plan[key][mk] = { ingredients: [] } })
    })
    return plan
  })
  const [selectedWeekMeal, setSelectedWeekMeal] = useState(null)  // { day, mealType } | null
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false)

  // ── Shared UI state ───────────────────────────────────────────
  const [searchQuery,        setSearchQuery]        = useState('')
  const [activeFilter,       setActiveFilter]       = useState('all')
  const [detailIngredientId, setDetailIngredientId] = useState(null)
  const [productSelections,  setProductSelections]  = useState({})

  // ── Lookup maps ───────────────────────────────────────────────

  const ingredientLookup = Object.fromEntries(
    ingredients.map((ing) => [ing.id, ing])
  )

  // effectiveLookup overrides per100g with selected product data transparently
  const effectiveLookup = Object.fromEntries(
    ingredients.map((ing) => {
      const productId = productSelections[ing.id]
      if (!productId) return [ing.id, ing]
      const product = (productsData[ing.id] || []).find((p) => p.id === productId)
      if (!product) return [ing.id, ing]
      return [ing.id, { ...ing, per100g: product.per100g }]
    })
  )

  // ── Meal Builder handlers ─────────────────────────────────────

  // Pure add — does not remove if already present (toggle is for Controller only)
  function handleIngredientAdd(ingredientId) {
    if (selectedIngredients.some((i) => i.ingredientId === ingredientId)) return
    setSelectedIngredients((prev) => [...prev, { ingredientId, quantity: 100 }])
  }

  function handleIngredientToggle(ingredientId) {
    const alreadySelected = selectedIngredients.some(
      (item) => item.ingredientId === ingredientId
    )
    if (alreadySelected) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item.ingredientId !== ingredientId)
      )
    } else {
      setSelectedIngredients([...selectedIngredients, { ingredientId, quantity: 100 }])
    }
  }

  function handleQuantityChange(ingredientId, newQuantity) {
    setSelectedIngredients(
      selectedIngredients.map((item) =>
        item.ingredientId === ingredientId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  function handleIngredientRemove(ingredientId) {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item.ingredientId !== ingredientId)
    )
  }

  function handleClearMeal() {
    setSelectedIngredients([])
  }

  function handleGenerateMeal(targetCalories, macroGoal) {
    function pick(arr) {
      if (!arr.length) return null
      return arr[Math.floor(Math.random() * arr.length)]
    }
    const byCategory = (cat) => ingredients.filter((i) => i.category === cat)
    let picks = []

    if (macroGoal === 'high-protein') {
      const proteins = byCategory('Protein')
      const p1 = pick(proteins)
      const p2 = pick(proteins.filter((i) => i.id !== p1?.id))
      picks = [p1, p2, pick(byCategory('Vegetables')), pick(byCategory('Carbs'))]
    } else if (macroGoal === 'balanced') {
      picks = [
        pick(byCategory('Protein')),
        pick(byCategory('Carbs')),
        pick(byCategory('Vegetables')),
        pick(byCategory('Fats')),
      ]
    } else if (macroGoal === 'low-carb') {
      const proteins = byCategory('Protein')
      const p1 = pick(proteins)
      const p2 = pick(proteins.filter((i) => i.id !== p1?.id))
      picks = [p1, p2, pick(byCategory('Fats')), pick(byCategory('Vegetables'))]
    }

    const unique = [...new Map(picks.filter(Boolean).map((i) => [i.id, i])).values()]
    const BASE_QTY = { Protein: 150, Carbs: 120, Vegetables: 80, Fats: 20, Dairy: 100 }
    let result = unique.map((ing) => ({
      ingredientId: ing.id,
      quantity: BASE_QTY[ing.category] || 100,
    }))

    if (targetCalories > 0) {
      const baseCals = result.reduce((sum, item) => {
        const ing = ingredientLookup[item.ingredientId]
        return sum + (ing.per100g.calories / 100) * item.quantity
      }, 0)
      if (baseCals > 0) {
        const scale = targetCalories / baseCals
        result = result.map((item) => ({
          ...item,
          quantity: Math.round(Math.min(2000, Math.max(10, item.quantity * scale))),
        }))
      }
    }

    setSelectedIngredients(result)
  }

  // ── Week Plan handlers ────────────────────────────────────────

  function handleGenerateWeekPlan() {
    setIsGeneratingWeek(true)
    setSelectedWeekMeal(null)
    setTimeout(() => {
      setWeekPlan(generateWeekPlan())
      setIsGeneratingWeek(false)
    }, 700)
  }

  function handleSelectWeekMeal(day, mealType) {
    setSelectedWeekMeal((prev) =>
      prev?.day === day && prev?.mealType === mealType ? null : { day, mealType }
    )
  }

  function handleAddToWeekMeal(ingredientId) {
    if (!selectedWeekMeal || !weekPlan) return
    const { day, mealType } = selectedWeekMeal
    if (weekPlan[day][mealType].ingredients.some((i) => i.ingredientId === ingredientId)) return
    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          ingredients: [...prev[day][mealType].ingredients, { ingredientId, quantity: 100 }],
        },
      },
    }))
  }

  function handleRemoveFromWeekMeal(ingredientId) {
    if (!selectedWeekMeal || !weekPlan) return
    const { day, mealType } = selectedWeekMeal
    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          ingredients: prev[day][mealType].ingredients.filter(
            (i) => i.ingredientId !== ingredientId
          ),
        },
      },
    }))
  }

  function handleWeekMealQuantityChange(ingredientId, newQuantity) {
    if (!selectedWeekMeal || !weekPlan) return
    const { day, mealType } = selectedWeekMeal
    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          ingredients: prev[day][mealType].ingredients.map((i) =>
            i.ingredientId === ingredientId ? { ...i, quantity: newQuantity } : i
          ),
        },
      },
    }))
  }

  // ── Ingredient detail modal ───────────────────────────────────

  function handleOpenDetail(ingredientId) {
    setDetailIngredientId(ingredientId)
  }

  function handleCloseDetail() {
    setDetailIngredientId(null)
  }

  function handleSelectProduct(ingredientId, productId) {
    setProductSelections((prev) => ({ ...prev, [ingredientId]: productId }))
  }

  // ── Derived: active context for the Browser ───────────────────

  // The "active" ingredients shown in My Ingredients tab and reflected on card checkmarks
  const activeIngredients = (() => {
    if (currentMode === 'mealBuilder') return selectedIngredients
    if (selectedWeekMeal && weekPlan) {
      const { day, mealType } = selectedWeekMeal
      return weekPlan[day]?.[mealType]?.ingredients || []
    }
    return []
  })()

  // Human-readable label for what the user is currently editing
  const contextLabel = (() => {
    if (currentMode === 'mealBuilder') return 'Current Meal'
    if (!selectedWeekMeal) return null
    const dayFull  = DAYS.find((d) => d.key === selectedWeekMeal.day)?.full  || selectedWeekMeal.day
    const mealLabel = MEAL_TYPES.find((m) => m.key === selectedWeekMeal.mealType)?.label || selectedWeekMeal.mealType
    return `${dayFull} ${mealLabel}`
  })()

  // Mode-aware Browser callbacks
  const browserIngredientAdd    = currentMode === 'mealBuilder' ? handleIngredientAdd    : handleAddToWeekMeal
  const browserIngredientRemove = currentMode === 'mealBuilder' ? handleIngredientRemove : handleRemoveFromWeekMeal
  const browserQuantityChange   = currentMode === 'mealBuilder' ? handleQuantityChange   : handleWeekMealQuantityChange

  // ── Derived: ingredient detail modal values ───────────────────

  const detailIngredient = detailIngredientId ? ingredientLookup[detailIngredientId] : null
  const detailProducts   = detailIngredientId ? (productsData[detailIngredientId] || []) : []
  const detailDetail     = detailIngredientId ? (ingredientDetails[detailIngredientId] || null) : null

  const detailIsInMeal = (() => {
    if (!detailIngredientId) return false
    return activeIngredients.some((i) => i.ingredientId === detailIngredientId)
  })()

  // Pure add (not toggle) in both modes for the modal
  const detailAddHandler    = () => browserIngredientAdd(detailIngredientId)
  const detailRemoveHandler = () => browserIngredientRemove(detailIngredientId)

  // Ingredients shown in the right-side DetailView in week plan mode
  const weekDetailIngredients = (() => {
    if (!selectedWeekMeal || !weekPlan) return []
    const { day, mealType } = selectedWeekMeal
    return weekPlan[day]?.[mealType]?.ingredients || []
  })()

  // ── Shared Browser props (same in both modes, values differ) ──
  const browserProps = {
    ingredients,
    activeIngredients,
    ingredientLookup: effectiveLookup,
    searchQuery,
    activeFilter,
    onSearchChange:      setSearchQuery,
    onFilterChange:      setActiveFilter,
    onOpenDetail:        handleOpenDetail,
    onIngredientAdd:     browserIngredientAdd,
    onIngredientRemove:  browserIngredientRemove,
    onQuantityChange:    browserQuantityChange,
    currentMode,
    selectedWeekMeal,
    contextLabel,
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="app-root">
      <ModeToggle currentMode={currentMode} onModeChange={setCurrentMode} />

      {currentMode === 'mealBuilder' ? (
        <div className="app-layout">
          <Browser {...browserProps} />
          <Controller
            selectedIngredients={selectedIngredients}
            ingredientLookup={effectiveLookup}
            onQuantityChange={handleQuantityChange}
            onIngredientRemove={handleIngredientRemove}
            onClearMeal={handleClearMeal}
            onGenerateMeal={handleGenerateMeal}
          />
          <DetailView
            selectedIngredients={selectedIngredients}
            ingredientLookup={effectiveLookup}
          />
        </div>
      ) : (
        <div className="app-layout week-plan-layout">
          <Browser {...browserProps} />
          <WeekGrid
            weekPlan={weekPlan}
            selectedWeekMeal={selectedWeekMeal}
            ingredientLookup={effectiveLookup}
            onSelectMeal={handleSelectWeekMeal}
            onGenerateWeekPlan={handleGenerateWeekPlan}
            isGenerating={isGeneratingWeek}
          />
          <DetailView
            selectedIngredients={weekDetailIngredients}
            ingredientLookup={effectiveLookup}
          />
        </div>
      )}

      {detailIngredient && (
        <IngredientDetail
          ingredient={detailIngredient}
          detail={detailDetail}
          products={detailProducts}
          isInMeal={detailIsInMeal}
          selectedProductId={productSelections[detailIngredientId] || null}
          onAddToMeal={detailAddHandler}
          onRemoveFromMeal={detailRemoveHandler}
          onSelectProduct={(productId) => handleSelectProduct(detailIngredientId, productId)}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}

export default App
