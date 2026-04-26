// Detail View Panel — Macro Output
// Reads: selectedIngredients, ingredientLookup
// Writes: nothing — this panel is purely reactive

function DetailView({ selectedIngredients, ingredientLookup }) {
  // Derive totals — never stored, always calculated from current state
  const totals = selectedIngredients.reduce(
    (acc, item) => {
      const ing = ingredientLookup[item.ingredientId]
      if (!ing) return acc
      const factor = item.quantity / 100
      return {
        calories: acc.calories + ing.per100g.calories * factor,
        protein: acc.protein + ing.per100g.protein * factor,
        carbs: acc.carbs + ing.per100g.carbs * factor,
        fat: acc.fat + ing.per100g.fat * factor,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Macro ratio bar percentages (based on caloric contribution)
  const proteinCals = totals.protein * 4
  const carbCals = totals.carbs * 4
  const fatCals = totals.fat * 9
  const totalMacroCals = proteinCals + carbCals + fatCals

  const ratios =
    totalMacroCals > 0
      ? {
          protein: ((proteinCals / totalMacroCals) * 100).toFixed(1),
          carbs: ((carbCals / totalMacroCals) * 100).toFixed(1),
          fat: ((fatCals / totalMacroCals) * 100).toFixed(1),
        }
      : { protein: 0, carbs: 0, fat: 0 }

  if (selectedIngredients.length === 0) {
    return (
      <div style={{ flex: 1 }}>
        <h2>Macro Output</h2>
        <p>Add ingredients to see your macro breakdown.</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <h2>Macro Output</h2>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {totals.calories.toFixed(0)} kcal
        </div>
        <div>Protein: {totals.protein.toFixed(1)}g</div>
        <div>Carbs: {totals.carbs.toFixed(1)}g</div>
        <div>Fat: {totals.fat.toFixed(1)}g</div>
      </div>

      {/* Macro ratio bar */}
      <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', margin: '1rem 0' }}>
        <div style={{ width: `${ratios.protein}%`, background: '#4a90d9' }} title={`Protein ${ratios.protein}%`} />
        <div style={{ width: `${ratios.carbs}%`, background: '#f5a623' }} title={`Carbs ${ratios.carbs}%`} />
        <div style={{ width: `${ratios.fat}%`, background: '#e85d4a' }} title={`Fat ${ratios.fat}%`} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
        <span style={{ color: '#4a90d9' }}>■ Protein {ratios.protein}%</span>
        <span style={{ color: '#f5a623' }}>■ Carbs {ratios.carbs}%</span>
        <span style={{ color: '#e85d4a' }}>■ Fat {ratios.fat}%</span>
      </div>

      {/* Per-ingredient breakdown */}
      <h3>Breakdown</h3>
      {selectedIngredients.map((item) => {
        const ing = ingredientLookup[item.ingredientId]
        if (!ing) return null
        const factor = item.quantity / 100
        return (
          <div key={item.ingredientId} style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
            <strong>{ing.name}</strong> ({item.quantity}g) —{' '}
            {(ing.per100g.calories * factor).toFixed(0)} kcal |{' '}
            P: {(ing.per100g.protein * factor).toFixed(1)}g |{' '}
            C: {(ing.per100g.carbs * factor).toFixed(1)}g |{' '}
            F: {(ing.per100g.fat * factor).toFixed(1)}g
          </div>
        )
      })}
    </div>
  )
}

export default DetailView
