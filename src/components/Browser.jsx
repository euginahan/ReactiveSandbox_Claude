// Browser Panel — Ingredient Library
// Reads: ingredients, activeIngredients, ingredientLookup, searchQuery, activeFilter,
//        currentMode, selectedWeekMeal, contextLabel
// Writes: onSearchChange, onFilterChange, onOpenDetail, onIngredientAdd,
//         onIngredientRemove, onQuantityChange

import { useState } from 'react'

const CATEGORIES = ['all', 'Protein', 'Carbs', 'Vegetables', 'Fats', 'Dairy']

const CATEGORY_ICON = {
  Protein:    { emoji: '🥩', bg: '#EBF3FD' },
  Carbs:      { emoji: '🌾', bg: '#FEF3E2' },
  Vegetables: { emoji: '🥦', bg: '#EAF2EB' },
  Fats:       { emoji: '🫒', bg: '#FDF0E6' },
  Dairy:      { emoji: '🥛', bg: '#F3EEFB' },
}

function Browser({
  ingredients,
  activeIngredients,
  ingredientLookup,
  searchQuery,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onOpenDetail,
  onIngredientAdd,
  onIngredientRemove,
  onQuantityChange,
  currentMode,
  selectedWeekMeal,
  contextLabel,
}) {
  const [activeTab, setActiveTab] = useState('add')

  const activeIds = new Set(activeIngredients.map((i) => i.ingredientId))

  // In week plan mode, adding is only possible when a meal is selected
  const noMealSelected = currentMode === 'weekPlan' && !selectedWeekMeal

  const visible = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === 'all' || ing.category === activeFilter
    return matchesSearch && matchesFilter
  })

  function handleQtyChange(ingredientId, value) {
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed)) onQuantityChange(ingredientId, parsed)
  }

  function handleQtyBlur(ingredientId, value) {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed) || parsed < 1) return onQuantityChange(ingredientId, 1)
    if (parsed > 2000) return onQuantityChange(ingredientId, 2000)
    onQuantityChange(ingredientId, parsed)
  }

  return (
    <div className="panel">

      {/* ── Panel Header ── */}
      <div className="panel-header browser-panel-header">
        <div>
          <div className="panel-title">Ingredient Library</div>
          <div className="panel-subtitle">{ingredients.length} ingredients available</div>
        </div>
        <div className={`context-label ${!contextLabel ? 'no-selection' : ''}`}>
          {contextLabel
            ? <>Editing: <strong>{contextLabel}</strong></>
            : currentMode === 'weekPlan'
              ? 'No meal selected'
              : null
          }
        </div>
      </div>

      {/* ── Segmented Tab Control ── */}
      <div className="browser-tabs">
        <button
          className={`browser-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Ingredients
        </button>
        <button
          className={`browser-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Ingredients
          {activeIngredients.length > 0 && (
            <span className="tab-badge">{activeIngredients.length}</span>
          )}
        </button>
      </div>

      {/* ── Search + Filter (Add tab only) ── */}
      {activeTab === 'add' && (
        <>
          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="filter-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => onFilterChange(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Panel Body ── */}
      <div className="panel-body">

        {/* ════ ADD INGREDIENTS TAB ════ */}
        {activeTab === 'add' && (
          <>
            {/* No-meal-selected notice in week plan mode */}
            {noMealSelected && (
              <div className="browser-notice">
                <span className="browser-notice-icon">💡</span>
                <span>Select a meal slot in the week plan to add ingredients to it.</span>
              </div>
            )}

            {visible.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p>No ingredients found.<br />Try a different search or filter.</p>
              </div>
            ) : (
              <div className="card-grid">
                {visible.map((ing) => {
                  const isAdded = activeIds.has(ing.id)
                  const icon    = CATEGORY_ICON[ing.category] || { emoji: '🍽️', bg: '#F4F4F0' }
                  return (
                    <div
                      key={ing.id}
                      className={`ingredient-card ${isAdded ? 'selected' : ''}`}
                      onClick={() => onOpenDetail(ing.id)}
                    >
                      <div className="card-icon" style={{ background: icon.bg }}>
                        {icon.emoji}
                      </div>
                      <div className="card-content">
                        <div className="card-name">{ing.name}</div>
                        <div className="card-meta">
                          <span className={`category-badge badge-${ing.category}`}>
                            {ing.category}
                          </span>
                          <span className="card-macros">
                            {ing.per100g.calories} kcal · P {ing.per100g.protein}g
                          </span>
                        </div>
                      </div>
                      <button
                        className={`add-ingredient-btn ${isAdded ? 'added' : ''}`}
                        aria-label={isAdded ? `${ing.name} added` : `Add ${ing.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isAdded && !noMealSelected) onIngredientAdd(ing.id)
                        }}
                        disabled={noMealSelected}
                        title={noMealSelected ? 'Select a meal slot first' : isAdded ? 'Already added' : `Add ${ing.name}`}
                      >
                        {isAdded ? '✓' : '+'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ════ MY INGREDIENTS TAB ════ */}
        {activeTab === 'my' && (
          activeIngredients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {currentMode === 'weekPlan' ? '📅' : '🍱'}
              </div>
              <p>
                {currentMode === 'weekPlan'
                  ? noMealSelected
                    ? 'Select a meal from the week plan, then add ingredients here.'
                    : 'No ingredients in this meal slot yet.'
                  : 'No ingredients added yet.'
                }
              </p>
              {currentMode === 'mealBuilder' && (
                <p className="empty-state-hint">Browse <strong>Add Ingredients</strong> to start building your meal.</p>
              )}
            </div>
          ) : (
            <div className="my-ingredients-list">
              {activeIngredients.map((item) => {
                const ing = ingredientLookup[item.ingredientId]
                if (!ing) return null
                const f    = item.quantity / 100
                const cals = (ing.per100g.calories * f).toFixed(0)
                const pro  = (ing.per100g.protein  * f).toFixed(1)
                const carb = (ing.per100g.carbs    * f).toFixed(1)
                const fat  = (ing.per100g.fat      * f).toFixed(1)

                return (
                  <div
                    key={item.ingredientId}
                    className="my-ing-row"
                    onClick={() => onOpenDetail(item.ingredientId)}
                  >
                    <div className="my-ing-info">
                      <div className="my-ing-name">{ing.name}</div>
                      <div className="my-ing-macros">
                        {cals} kcal · P {pro}g · C {carb}g · F {fat}g
                      </div>
                    </div>
                    <div
                      className="my-ing-controls"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        className="qty-input"
                        type="number"
                        min={1}
                        max={2000}
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.ingredientId, e.target.value)}
                        onBlur={(e) => handleQtyBlur(item.ingredientId, e.target.value)}
                      />
                      <span className="my-ing-unit">g</span>
                      <button
                        className="remove-btn"
                        onClick={() => onIngredientRemove(item.ingredientId)}
                        aria-label={`Remove ${ing.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Browser
