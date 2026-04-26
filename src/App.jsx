import { useState } from 'react'
import ingredients from './data/ingredients'
import Browser from './components/Browser'
import Controller from './components/Controller'
import DetailView from './components/DetailView'

// App is the single source of truth.
// State lives here. Props go down. Callbacks come back up.

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // Build a lookup map so components can find ingredient data by id
  const ingredientLookup = Object.fromEntries(
    ingredients.map((ing) => [ing.id, ing])
  )

  // Browser: toggle an ingredient in/out of the meal
  function handleIngredientToggle(ingredientId) {
    const alreadySelected = selectedIngredients.some(
      (item) => item.ingredientId === ingredientId
    )
    if (alreadySelected) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item.ingredientId !== ingredientId)
      )
    } else {
      setSelectedIngredients([
        ...selectedIngredients,
        { ingredientId, quantity: 100 },
      ])
    }
  }

  // Controller: update the quantity of a selected ingredient
  function handleQuantityChange(ingredientId, newQuantity) {
    setSelectedIngredients(
      selectedIngredients.map((item) =>
        item.ingredientId === ingredientId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // Controller: remove one ingredient from the meal
  function handleIngredientRemove(ingredientId) {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item.ingredientId !== ingredientId)
    )
  }

  // Controller: clear the entire meal
  function handleClearMeal() {
    setSelectedIngredients([])
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <Browser
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onIngredientToggle={handleIngredientToggle}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />
      <Controller
        selectedIngredients={selectedIngredients}
        ingredientLookup={ingredientLookup}
        onQuantityChange={handleQuantityChange}
        onIngredientRemove={handleIngredientRemove}
        onClearMeal={handleClearMeal}
      />
      <DetailView
        selectedIngredients={selectedIngredients}
        ingredientLookup={ingredientLookup}
      />
    </div>
  )
}

export default App
