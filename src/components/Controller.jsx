// Controller Panel — Meal Builder
// Reads: selectedIngredients, ingredientLookup
// Writes: onQuantityChange, onIngredientRemove, onClearMeal, onGenerateMeal

import { useState } from 'react'

const GOAL_LABELS = {
  'high-protein': 'High Protein',
  'balanced':     'Balanced',
  'low-carb':     'Low Carb',
}

function Controller({
  selectedIngredients,
  ingredientLookup,
  onQuantityChange,
  onIngredientRemove,
  onClearMeal,
  onGenerateMeal,
}) {
  const [targetCalories, setTargetCalories] = useState('')
  const [macroGoal, setMacroGoal] = useState('balanced')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleGenerateClick() {
    if (selectedIngredients.length > 0) {
      setShowConfirm(true)
    } else {
      runGenerate()
    }
  }

  function runGenerate() {
    setShowConfirm(false)
    setIsGenerating(true)
    setTimeout(() => {
      onGenerateMeal(targetCalories ? parseInt(targetCalories, 10) : 0, macroGoal)
      setIsGenerating(false)
    }, 700)
  }

  function handleQuantityBlur(ingredientId, value) {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed) || parsed < 1) return onQuantityChange(ingredientId, 1)
    if (parsed > 2000) return onQuantityChange(ingredientId, 2000)
    onQuantityChange(ingredientId, parsed)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Meal Builder</div>
        <div className="panel-subtitle">
          {selectedIngredients.length === 0
            ? 'No ingredients added'
            : `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''} added`}
        </div>
      </div>

      <div className="panel-body">

        {/* ── Smart Meal Generator ── */}
        <div className="generator-card">
          <div className="generator-header">
            <span className="generator-icon">✨</span>
            <div>
              <div className="generator-title">Smart Meal Generator</div>
              <div className="generator-sub">Auto-build a meal from your goals</div>
            </div>
          </div>

          <div className="generator-inputs">
            <div className="gen-input-group">
              <label>Target Calories <span className="gen-optional">(optional)</span></label>
              <input
                className="gen-cal-input"
                type="number"
                placeholder="e.g. 600"
                min={100}
                max={5000}
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
              />
            </div>
            <div className="gen-input-group">
              <label>Goal</label>
              <div className="goal-pills">
                {Object.entries(GOAL_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`goal-pill ${macroGoal === key ? 'active' : ''}`}
                    onClick={() => setMacroGoal(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showConfirm ? (
            <div className="gen-confirm">
              <span>Replace current meal?</span>
              <button className="gen-confirm-yes" onClick={runGenerate}>Replace</button>
              <button className="gen-confirm-no" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="gen-btn"
              onClick={handleGenerateClick}
              disabled={isGenerating}
            >
              {isGenerating
                ? <><div className="spinner" /> Generating…</>
                : <><span>✨</span> Generate Meal</>
              }
            </button>
          )}
        </div>

        <div className="panel-divider" />

        {/* ── Meal Rows ── */}
        {selectedIngredients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍱</div>
            <p>Your meal is empty.<br />Select ingredients or generate a meal above.</p>
          </div>
        ) : (
          <>
            <div className="meal-rows">
              {selectedIngredients.map((item) => {
                const ing = ingredientLookup[item.ingredientId]
                if (!ing) return null

                const f    = item.quantity / 100
                const cal  = (ing.per100g.calories * f).toFixed(0)
                const pro  = (ing.per100g.protein  * f).toFixed(1)
                const carb = (ing.per100g.carbs    * f).toFixed(1)
                const fat  = (ing.per100g.fat      * f).toFixed(1)

                return (
                  <div key={item.ingredientId} className="meal-row">
                    <div className="meal-row-header">
                      <div className="meal-row-name">{ing.name}</div>
                      <button
                        className="remove-btn"
                        onClick={() => onIngredientRemove(item.ingredientId)}
                        aria-label={`Remove ${ing.name}`}
                      >
                        ×
                      </button>
                    </div>
                    <div className="meal-row-bottom">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="qty-label">Qty (g)</span>
                        <input
                          className="qty-input"
                          type="number"
                          min={1}
                          max={2000}
                          value={item.quantity}
                          onChange={(e) =>
                            onQuantityChange(item.ingredientId, Number(e.target.value))
                          }
                          onBlur={(e) =>
                            handleQuantityBlur(item.ingredientId, e.target.value)
                          }
                        />
                      </div>
                      <div className="row-macros">
                        <span>{cal}</span> kcal<br />
                        P <span>{pro}g</span> · C <span>{carb}g</span> · F <span>{fat}g</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="clear-btn" onClick={onClearMeal}>
              Clear Meal
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Controller
