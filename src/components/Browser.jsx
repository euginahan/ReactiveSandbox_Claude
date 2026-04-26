// Browser Panel — Ingredient Library
// Reads: ingredients source data, searchQuery, activeFilter, selectedIngredients
// Writes: onIngredientToggle, onSearchChange, onFilterChange

const CATEGORIES = ['all', 'Protein', 'Carbs', 'Vegetables', 'Fats', 'Dairy']

function Browser({
  ingredients,
  selectedIngredients,
  searchQuery,
  activeFilter,
  onIngredientToggle,
  onSearchChange,
  onFilterChange,
}) {
  const selectedIds = selectedIngredients.map((item) => item.ingredientId)

  const visible = ingredients.filter((ing) => {
    const matchesSearch = ing.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter =
      activeFilter === 'all' || ing.category === activeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div style={{ flex: 1 }}>
      <h2>Ingredient Library</h2>

      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            style={{ fontWeight: activeFilter === cat ? 'bold' : 'normal' }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p>No ingredients found.</p>}

      <div>
        {visible.map((ing) => {
          const isSelected = selectedIds.includes(ing.id)
          return (
            <div
              key={ing.id}
              onClick={() => onIngredientToggle(ing.id)}
              style={{
                border: isSelected ? '2px solid teal' : '1px solid #ccc',
                padding: '0.5rem',
                margin: '0.25rem 0',
                cursor: 'pointer',
              }}
            >
              <strong>{ing.name}</strong>
              <span> — {ing.category}</span>
              <div>{ing.per100g.calories} kcal / 100g</div>
              <div>P: {ing.per100g.protein}g | C: {ing.per100g.carbs}g | F: {ing.per100g.fat}g</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Browser
