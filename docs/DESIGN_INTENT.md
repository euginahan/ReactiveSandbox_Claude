# Design Intent
## AI 201 — Project 2: The Reactive Sandbox
**Product:** Meal Planning + Macro Tracking Platform
**Author:** euginahan
**Written:** Before AI coding session, per SCAD ESF Protocol

---

## 1. Concept & Vision

### What it is
A three-panel reactive web application that lets users build meals ingredient by ingredient and see their full macro breakdown update in real time. It is not a calorie counter after the fact — it is a live assembly tool. You pick an ingredient, it lands in your meal, and the numbers adjust immediately.

### Who it is for
People who care about what they eat and want to understand their food before they cook or eat it — athletes tracking protein intake, people learning to meal prep, or anyone who wants to make intentional food choices without using a clunky mobile app.

### What makes it different
Most macro trackers are log-after-the-fact tools. This system is compositional — you assemble a meal the way a chef would, seeing the nutritional consequences of each decision as you make it. The interaction should feel like dragging tiles into place, not filling out a form.

---

## 2. Core Interaction Idea

### The Reactive System
All three panels share a single state object that lives in the root parent component. No panel owns its own copy of the data. Every panel receives what it needs as props and communicates changes back up through callback functions.

The flow is:

```
User action in Browser or Controller → callback fires → state updates in App → all three panels re-render with new data
```

### How the panels influence each other
- Selecting an ingredient in the **Browser** adds it to the meal in the **Controller** and immediately recalculates totals in the **Detail View**.
- Adjusting a quantity or removing an ingredient in the **Controller** immediately recalculates totals in the **Detail View** and reflects the updated selection state back in the **Browser** (selected ingredients are visually marked).
- The **Detail View** is purely reactive — it never initiates changes. It only reads and displays.

---

## 3. Three Panel Definitions

### Panel 1 — Browser (Ingredient Library)

**Purpose:** Let the user explore and select from a collection of ingredients. This is the entry point of the system. Every meal begins here.

**Key UI Elements:**
- Search bar at the top (filters ingredient list by name in real time)
- Filter tabs or pills: All / Protein / Carbs / Vegetables / Fats / Dairy
- Grid of ingredient cards, each showing:
  - Ingredient name
  - Category label
  - Calories per 100g
  - A single macro highlight (protein, carbs, or fat — whichever is dominant)
- Visual selected state on cards already in the meal (distinct border or fill)

**Interaction Behavior:**
- Typing in the search bar filters the visible card grid immediately (no submit button)
- Clicking a filter tab narrows the grid to that category
- Clicking an ingredient card that is NOT in the current meal → adds it to the meal with a default quantity of 100g
- Clicking an ingredient card that IS already in the meal → removes it from the meal
- The card reflects its selected/unselected state at all times based on shared state

**What Triggers Updates:**
- Every click on an ingredient card fires `onIngredientToggle(ingredientId)` up to App
- Every keystroke in search fires `onSearchChange(query)` up to App
- Every filter tab click fires `onFilterChange(category)` up to App

---

### Panel 2 — Controller (Meal Builder)

**Purpose:** Show the user what is currently in their meal and let them take direct action on it — adjust quantities, remove ingredients, or clear the whole meal. This panel actively modifies shared state.

**Key UI Elements:**
- List of currently selected ingredients, each row showing:
  - Ingredient name
  - Quantity input (number field, unit: grams)
  - Calculated macros for that quantity (calories, protein, carbs, fat)
  - Remove button (×)
- "Clear Meal" button at the bottom
- Empty state message when no ingredients are selected: "Your meal is empty. Select ingredients from the library."

**Interaction Behavior:**
- Changing a quantity input field recalculates that ingredient's macros inline and updates the meal totals in the Detail View
- Clicking remove (×) on an ingredient removes it from the meal and deselects it in the Browser
- Clicking "Clear Meal" empties the selectedIngredients array and resets all totals to zero
- Quantity input is constrained: minimum 1g, maximum 2000g, integers only

**What Triggers Updates:**
- Quantity change fires `onQuantityChange(ingredientId, newQuantity)` up to App
- Remove fires `onIngredientRemove(ingredientId)` up to App
- Clear Meal fires `onClearMeal()` up to App

---

### Panel 3 — Detail View (Meal + Macro Output)

**Purpose:** Display the complete nutritional picture of the current meal. This panel only reads from shared state — it never initiates changes. It reacts.

**Key UI Elements:**
- Meal name header: "Current Meal" (static label)
- Total macro summary bar:
  - Calories (large, prominent)
  - Protein (g)
  - Carbohydrates (g)
  - Fat (g)
- Visual macro ratio bar: a horizontal bar divided proportionally into protein / carbs / fat (color-coded)
- Per-ingredient breakdown list:
  - Each ingredient name with its contribution to each macro
- Empty state: "Add ingredients to see your macro breakdown." when meal is empty

**Interaction Behavior:**
- No direct user interaction — this panel is read-only
- All values update instantly when state changes (no delay, no animation lag)
- Macro ratio bar updates proportionally as ingredients are added or quantities change

**What Triggers Updates:**
- Any change to `selectedIngredients` in shared state causes this panel to re-render with fresh calculated totals

---

## 4. Data Model

### Ingredient Object (source data, static)
```json
{
  "id": "chicken-breast",
  "name": "Chicken Breast",
  "category": "Protein",
  "unit": "g",
  "per100g": {
    "calories": 165,
    "protein": 31.0,
    "carbs": 0.0,
    "fat": 3.6
  },
  "tags": ["lean", "high-protein", "meat"]
}
```

### Selected Ingredient Entry (in shared state)
```json
{
  "ingredientId": "chicken-breast",
  "quantity": 150
}
```
Macros for a selected ingredient are **always derived** — never stored. They are calculated at render time from `(per100g value / 100) * quantity`.

### Full Shared State Shape
```json
{
  "selectedIngredients": [
    { "ingredientId": "chicken-breast", "quantity": 150 },
    { "ingredientId": "brown-rice", "quantity": 200 }
  ],
  "searchQuery": "",
  "activeFilter": "all"
}
```

### Derived / Calculated Data (not stored in state)
The following are computed from `selectedIngredients` on every render:

| Value | How it is calculated |
|---|---|
| `totalCalories` | Sum of `(ingredient.per100g.calories / 100) * quantity` for all selected |
| `totalProtein` | Sum of `(ingredient.per100g.protein / 100) * quantity` |
| `totalCarbs` | Sum of `(ingredient.per100g.carbs / 100) * quantity` |
| `totalFat` | Sum of `(ingredient.per100g.fat / 100) * quantity` |
| `macroRatioBar` | Protein%, Carbs%, Fat% of total calories |

---

## 5. State Flow

### Where state lives
State lives in `App.jsx` — the root parent of all three panels. This is the single source of truth. No panel manages its own copy.

```
App (state owner)
├── Browser (reads: ingredients list, searchQuery, activeFilter, selectedIngredients)
├── Controller (reads: selectedIngredients + ingredient lookup)
└── DetailView (reads: selectedIngredients + ingredient lookup for totals)
```

### What happens when a user clicks an ingredient

1. User clicks an ingredient card in Browser
2. Browser fires `onIngredientToggle(id)` callback (passed as prop from App)
3. App checks: is this `id` already in `selectedIngredients`?
   - **No** → append `{ ingredientId: id, quantity: 100 }` to array → `setSelectedIngredients([...prev, newEntry])`
   - **Yes** → filter it out → `setSelectedIngredients(prev.filter(i => i.ingredientId !== id))`
4. State update triggers re-render of all three panels
5. Browser: card shows selected/unselected state
6. Controller: ingredient appears/disappears in the list
7. Detail View: totals recalculate and display

### What happens when a user changes a quantity

1. User edits quantity input in Controller row
2. Controller fires `onQuantityChange(id, newQuantity)`
3. App maps over `selectedIngredients`, finds matching `id`, updates `quantity`
4. State update triggers re-render
5. Controller row shows updated per-ingredient macros
6. Detail View totals recalculate instantly

---

## 6. Interaction Rules

### Add behavior
- Clicking an unselected ingredient always adds it with a default quantity of **100g**
- Duplicate adds are blocked — if the ingredient is already in `selectedIngredients`, clicking it removes it instead (toggle behavior)

### Remove behavior
- Remove (×) in Controller removes the ingredient from `selectedIngredients`
- This also deselects the card in Browser (because Browser derives selected state from shared state)

### Quantity rules
- Minimum: 1g
- Maximum: 2000g
- Input type: number, integers only
- Invalid input (empty, below min, above max) snaps to the nearest valid value on blur

### Empty meal state
- When `selectedIngredients` is an empty array:
  - Controller shows its empty state message
  - Detail View shows its empty state message
  - All totals display as 0
  - Browser shows no selected cards

### Macro recalculation
- Macros are never pre-stored per selected ingredient — they are always computed from `(per100g / 100) * quantity` at render time
- This means no stale data is possible

### Edge cases
| Scenario | Behavior |
|---|---|
| Quantity field cleared/blank | Treat as 0 during edit; snap to 1 on blur |
| All ingredients removed | Totals reset to 0, empty states show |
| Search returns no results | Browser shows "No ingredients found" message |
| Filter + search combined | Both are applied simultaneously (AND logic) |

---

## 7. Visual & UX Direction

### Tone
Clean, precise, and satisfying. Not clinical or cold — this should feel like a well-designed kitchen tool, not a medical form. Functional first, with small moments of delight on interaction.

### Color Palette (intent, not final hex values)
- Background: off-white or very light warm gray — not pure white
- Panel borders: subtle, 1px, low contrast
- Accent / interactive: a single saturated color used for selections, active states, and the macro ratio bar (candidates: teal, sage green, or muted orange)
- Macro color coding:
  - Protein: blue
  - Carbohydrates: amber/yellow
  - Fat: coral/red

### Typography
- UI labels and data: sans-serif, medium weight, tight tracking
- Macro numbers (totals): large, bold — these are the hero numbers
- Ingredient names: readable, not decorative

### Layout
- Three-panel grid, full viewport width
- Desktop: three equal-width columns side by side
- Panels do not scroll independently — page scroll if content overflows
- Panel headers are fixed labels: "Ingredient Library" / "Meal Builder" / "Macro Output"

### Micro-interactions
- Ingredient card click: brief scale-down on press (0.97), snap back — tactile click feel
- Card entering selected state: border color transition, not a jump
- Quantity change: macro numbers in Controller row update immediately, no delay
- Detail View macro bar: width transition on change (smooth proportional shift, ~150ms ease)
- Remove (×): row slides out or fades — not an abrupt disappearance
- "Clear Meal" button: requires no confirmation but should have a visually distinct (destructive) style — red-tinted, not the same as other buttons

### What it should feel like
Assembling a meal should feel like building something real. Each ingredient click has weight. The numbers respond immediately. The macro bar shifts as you add food. It is not a search → result → submit flow — it is a continuous, live composition.
