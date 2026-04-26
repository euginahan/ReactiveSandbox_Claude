// Controller Panel — Meal Builder
// Reads: selectedIngredients, ingredientLookup
// Writes: onQuantityChange, onIngredientRemove, onClearMeal

function Controller({
  selectedIngredients,
  ingredientLookup,
  onQuantityChange,
  onIngredientRemove,
  onClearMeal,
}) {
  function handleQuantityBlur(ingredientId, value) {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed) || parsed < 1) return onQuantityChange(ingredientId, 1)
    if (parsed > 2000) return onQuantityChange(ingredientId, 2000)
    onQuantityChange(ingredientId, parsed)
  }

  if (selectedIngredients.length === 0) {
    return (
      <div style={{ flex: 1 }}>
        <h2>Meal Builder</h2>
        <p>Your meal is empty. Select ingredients from the library.</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <h2>Meal Builder</h2>

      {selectedIngredients.map((item) => {
        const ing = ingredientLookup[item.ingredientId]
        if (!ing) return null

        const factor = item.quantity / 100
        const cal = (ing.per100g.calories * factor).toFixed(1)
        const pro = (ing.per100g.protein * factor).toFixed(1)
        const carb = (ing.per100g.carbs * factor).toFixed(1)
        const fat = (ing.per100g.fat * factor).toFixed(1)

        return (
          <div
            key={item.ingredientId}
            style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.25rem 0' }}
          >
            <strong>{ing.name}</strong>
            <button onClick={() => onIngredientRemove(item.ingredientId)}>×</button>
            <div>
              <label>
                Quantity (g):
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(item.ingredientId, Number(e.target.value))}
                  onBlur={(e) => handleQuantityBlur(item.ingredientId, e.target.value)}
                  style={{ width: '70px', marginLeft: '0.5rem' }}
                />
              </label>
            </div>
            <div>{cal} kcal | P: {pro}g | C: {carb}g | F: {fat}g</div>
          </div>
        )
      })}

      <button
        onClick={onClearMeal}
        style={{ marginTop: '1rem', color: 'red' }}
      >
        Clear Meal
      </button>
    </div>
  )
}

export default Controller
