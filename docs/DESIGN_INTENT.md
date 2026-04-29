# Design Intent
## AI 201 — Project 2: The Reactive Sandbox
**Product:** Meal Planning + Macro Tracking Platform
**Author:** euginahan
**Last Updated:** 2026-04-29 (post-build revision)

---

## 1. Concept & Vision

### What it is
A three-panel reactive web application with two distinct modes: **Meal Builder** for composing a single meal ingredient-by-ingredient, and **Week Plan** for building and viewing a full 7-day meal calendar. In both modes, nutritional data updates in real time — there is no submit button, no separate results page. The numbers respond to every action as it happens.

### Who it is for
People who care about what they eat and want to understand their food before they cook or eat it — athletes tracking protein, people learning to meal prep, or anyone who wants to make intentional food choices without a clunky mobile app.

### What makes it different
Most macro trackers are log-after-the-fact tools. This system is compositional — you assemble meals the way a chef would, seeing the nutritional consequences of each decision as you make it. The Week Plan mode extends that idea across an entire week, letting you see daily totals and macro patterns at a glance.

---

## 2. Application Modes

The app has a single **ModeToggle** at the top that switches between two layouts. All three panels are present in both modes — only the center panel changes.

### Meal Builder Mode
The original single-meal composition experience. The center panel is the **Controller** (Meal Builder), which shows the current meal's ingredient list, a Smart Meal Generator, and quantity controls.

### Week Plan Mode
A 7-day planning view. The center panel becomes the **WeekGrid**, a calendar showing Monday–Sunday with four meal slots per day (Breakfast, Lunch, Dinner, Snack). The Ingredient Library and Macro Output panels stay on either side and operate on whichever meal slot is currently selected.

---

## 3. Three Panel Definitions

### Panel 1 — Browser (Ingredient Library)

**Purpose:** Explore and select from a collection of ingredients. The entry point for both modes — every meal begins here.

**Key UI Elements:**
- Panel header with "Ingredient Library" title and ingredient count
- Context label (week plan mode only): "Editing: Monday Lunch" — shows which meal slot is active
- Two-tab control:
  - **Add Ingredients** — searchable, filterable grid of all ingredients
  - **My Ingredients** — list of ingredients currently in the active meal, with quantity controls and remove buttons
- Search bar: filters ingredient grid by name in real time
- Filter pills: All / Protein / Carbs / Vegetables / Fats / Dairy
- Ingredient cards showing: name, category badge, calories per 100g, protein per 100g, and a "+" / "✓" button
- In week plan mode with no meal selected: notice banner prompting user to select a meal slot first

**Interaction Behavior:**
- Clicking an ingredient card opens the **Ingredient Detail Modal** (not a direct add)
- The "+" button on a card adds the ingredient directly to the active meal (100g default)
- Once added, "+" becomes "✓" and the card shows a selected visual state
- In week plan mode, "+" buttons are disabled until a meal slot is selected
- "My Ingredients" tab shows the active meal's current ingredients with inline quantity editing and remove (×) controls
- Tab badge on "My Ingredients" shows the count when ingredients are present

**Mode-Aware Behavior:**
- In Meal Builder: "active meal" = `selectedIngredients`
- In Week Plan: "active meal" = ingredients for the currently selected day/meal slot (`selectedWeekMeal`)
- If no meal slot is selected in Week Plan, "My Ingredients" shows an empty state

---

### Panel 2A — Controller (Meal Builder mode only)

**Purpose:** Show the current meal's ingredient list and let the user take direct action — adjust quantities, remove ingredients, clear the meal, or auto-generate a meal. Only present in Meal Builder mode.

**Key UI Elements:**
- Ingredient list: each row shows name, quantity input, per-quantity macros (calories, protein, carbs, fat), and a remove (×) button
- **Smart Meal Generator** card at the top:
  - Optional target calorie input
  - Macro goal selector: High Protein / Balanced / Low Carb
  - "Generate Meal" button with 700ms simulated loading state
  - If meal already has ingredients: confirmation step before overwriting
- "Clear Meal" button: destructive style, clears all ingredients

**Interaction Behavior:**
- Quantity input: integers only, min 1g, max 2000g, snaps to bounds on blur
- Changing quantity fires macro recalculation instantly in the Detail View
- Smart Meal Generator picks ingredients by category based on macro goal, then scales quantities to hit the calorie target if one is provided
- Confirmation prompt shows when generating would overwrite an existing meal

---

### Panel 2B — WeekGrid (Week Plan mode only)

**Purpose:** Show the full 7-day plan as a scrollable calendar. The user selects a meal slot here to activate it for editing in the Ingredient Library and Detail View panels.

**Key UI Elements:**
- Panel header with "Week Plan" title and contextual subtitle
- "Generate Week Plan" / "Regenerate" button (✨)
- Seven day columns (Monday–Sunday), each containing:
  - Day name header
  - Daily calorie total
  - Four meal cards: Breakfast (🌅), Lunch (☀️), Dinner (🌙), Snack (🍎)
  - Day macro footer: total P / C / F
- Meal cards show: meal type emoji + label, auto-generated recipe name, calorie total, and P/C/F breakdown
- Empty meal cards show "—" as the name and no macro data

**Interaction Behavior:**
- Clicking a meal card selects it as the active editing target — the Ingredient Library and Detail View update to show that meal's contents
- Clicking the same meal card again **deselects** it (toggle behavior) — clears the active editing context
- Generating a week plan auto-fills all 28 slots with balanced templates using a shuffle-and-cycle algorithm
- The grid is always visible (not hidden behind an empty state) — users can start adding ingredients to any slot without generating first

---

### Panel 3 — Detail View (Macro Output)

**Purpose:** Display the complete nutritional picture and recipe instructions for the current meal. Read-only — never initiates changes.

**Key UI Elements:**
- Auto-generated recipe name based on the top two ingredients by quantity and their categories (e.g. "Chicken & Brown Rice Bowl", "High Protein Plate")
- Total macro summary: Calories (large), Protein (g), Carbs (g), Fat (g)
- Visual macro ratio bar: horizontal bar divided proportionally into protein / carbs / fat (color-coded)
- Per-ingredient breakdown: each ingredient's name, quantity, and macro contribution
- Step-by-step cooking instructions for each ingredient (per-ingredient templates covering prep, cook method, time, and technique)
- Empty / no-selection state: "Select a meal to view details" placeholder in Week Plan mode; "Add ingredients to see your macro breakdown" in Meal Builder mode

**Interaction Behavior:**
- No direct user interaction — this panel is purely reactive
- All values update instantly when state changes
- Macro ratio bar width transitions proportionally (~150ms ease)

---

## 4. Ingredient Detail Modal

Clicking any ingredient card (in the Browser grid or the "My Ingredients" list) opens a full-screen modal overlay with extended information.

**Contents:**
- Ingredient name, category badge
- Full macro table per 100g: calories, protein, carbs, fat
- Descriptive text / nutritional context (from `ingredientDetails` data)
- **Brand / Product Switcher**: each ingredient has 3 product options — 1 generic + 2 branded variants (e.g. Perdue, Tyson for chicken breast) with slightly different per100g values. Selecting a brand updates that ingredient's macros globally across all panels via `effectiveLookup`.
- "Add to Meal" / "Remove from Meal" button based on whether the ingredient is currently in the active meal
- Close button

**State:** `detailIngredientId` in App drives which ingredient is shown. `productSelections` stores the selected brand per ingredient (persists across the session).

---

## 5. Data Model

### Ingredient Object (static source data)
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

### Product Variant Object (per ingredient, 3 options each)
```json
{
  "id": "cb-tyson",
  "brand": "Tyson",
  "name": "All Natural Chicken Breast",
  "servingSize": "148g",
  "per100g": { "calories": 170, "protein": 32.0, "carbs": 0.0, "fat": 4.0 },
  "barcode": "023700004025"
}
```

### Selected Ingredient Entry (in shared state)
```json
{ "ingredientId": "chicken-breast", "quantity": 150 }
```
Macros are **always derived** at render time — never stored. Formula: `(per100g value / 100) * quantity`.

### Week Plan Structure
```json
{
  "monday": {
    "breakfast": { "ingredients": [{ "ingredientId": "oats", "quantity": 80 }] },
    "lunch":     { "ingredients": [...] },
    "dinner":    { "ingredients": [...] },
    "snack":     { "ingredients": [...] }
  },
  "tuesday": { ... }
}
```

### Full Shared State Shape (App.jsx)
```
currentMode          'mealBuilder' | 'weekPlan'
selectedIngredients  [{ ingredientId, quantity }]       — Meal Builder active meal
weekPlan             { [day]: { [mealType]: { ingredients } } }  — always initialized (empty arrays)
selectedWeekMeal     { day, mealType } | null
detailIngredientId   string | null
productSelections    { [ingredientId]: productId }
searchQuery          string
activeFilter         string
```

### Derived / Calculated Data (never stored)

| Value | How it is calculated |
|---|---|
| `activeIngredients` | `selectedIngredients` in Meal Builder; `weekPlan[day][mealType].ingredients` in Week Plan |
| `effectiveLookup` | Ingredient lookup overridden by selected brand's `per100g` where applicable |
| `contextLabel` | "Current Meal" in Meal Builder; "Monday Lunch" etc. in Week Plan |
| `weekDetailIngredients` | Ingredients for the currently selected week plan meal slot |
| Macro totals | `(per100g / 100) * quantity` summed across all active ingredients |
| Macro ratio bar | Protein%, Carbs%, Fat% as share of total calories |
| Recipe name | Derived from top 2 ingredients by quantity + category composition |

---

## 6. State Architecture

State lives exclusively in `App.jsx`. No child component owns state that another panel needs to read.

```
App (single source of truth)
├── ModeToggle          (reads: currentMode — writes: setCurrentMode)
├── Browser             (reads: ingredients, activeIngredients, effectiveLookup, searchQuery,
│                               activeFilter, currentMode, selectedWeekMeal, contextLabel
│                        writes: onSearchChange, onFilterChange, onIngredientAdd,
│                                onIngredientRemove, onQuantityChange, onOpenDetail)
├── [Meal Builder mode]
│   ├── Controller      (reads: selectedIngredients, effectiveLookup
│   │                    writes: onQuantityChange, onIngredientRemove, onClearMeal, onGenerateMeal)
│   └── DetailView      (reads: selectedIngredients, effectiveLookup — writes: nothing)
├── [Week Plan mode]
│   ├── WeekGrid        (reads: weekPlan, selectedWeekMeal, effectiveLookup
│   │                    writes: onSelectMeal, onGenerateWeekPlan)
│   └── DetailView      (reads: weekDetailIngredients, effectiveLookup — writes: nothing)
└── IngredientDetail    (modal overlay — reads: ingredient, products, detail, isInMeal,
                         selectedProductId — writes: onAddToMeal, onRemoveFromMeal,
                         onSelectProduct, onClose)
```

### Mode-aware callback routing
`App` passes different callbacks to `Browser` depending on `currentMode`:
- `onIngredientAdd` → `handleIngredientAdd` (Meal Builder) or `handleAddToWeekMeal` (Week Plan)
- `onIngredientRemove` → `handleIngredientRemove` or `handleRemoveFromWeekMeal`
- `onQuantityChange` → `handleQuantityChange` or `handleWeekMealQuantityChange`

---

## 7. Interaction Rules

### Add behavior
- "+" button in Browser adds the ingredient to the active meal at 100g default
- Duplicates are blocked — the button shows "✓" and does nothing on click if already added
- In week plan mode, adding is disabled until a meal slot is selected

### Selection / toggle behavior (Week Plan)
- Clicking a meal card selects it → sets `selectedWeekMeal`
- Clicking the same meal card again deselects it → sets `selectedWeekMeal` to null
- Deselecting clears the active editing context across all panels

### Remove behavior
- Remove (×) in the "My Ingredients" tab or Controller removes the ingredient from the active meal
- The corresponding card in Browser reverts to unselected state immediately (derived from shared state)

### Quantity rules
- Min: 1g, Max: 2000g, integers only
- Invalid or empty input snaps to nearest valid value on blur

### Product / brand selection
- Selecting a brand in the Ingredient Detail Modal updates `productSelections[ingredientId]`
- `effectiveLookup` substitutes the brand's `per100g` for that ingredient everywhere — Browser card macros, Controller row macros, Detail View totals, WeekGrid card macros all update
- Selection persists for the session (not reset when closing the modal)

### Empty state handling
| Context | Empty State |
|---|---|
| Meal Builder — no ingredients | Controller shows empty message; Detail View shows "Add ingredients" prompt |
| Week Plan — no meal selected | Browser shows "No meal selected"; Detail View shows placeholder |
| Week Plan — empty meal slot selected | Browser "My Ingredients" tab shows "No ingredients in this meal slot yet" |
| Browser search — no results | "No ingredients found" message with search/filter hint |

### Macro recalculation
- Macros are never pre-stored — always computed from `(per100g / 100) * quantity` at render time
- This makes stale data structurally impossible

---

## 8. Visual & UX Direction

### Tone
Clean, precise, and satisfying. Not clinical or cold — a well-designed kitchen tool, not a medical form. Functional first, with small moments of delight on interaction.

### Color Palette
- Background: off-white / very light warm gray
- Panel borders: subtle, 1px, low contrast
- Accent: single saturated color for selections and active states
- Category badge colors: distinct per category (Protein, Carbs, Vegetables, Fats, Dairy)
- Macro color coding:
  - Protein: blue
  - Carbohydrates: amber/yellow
  - Fat: coral/red

### Layout
- Three-panel grid, full viewport width
- Desktop: three columns side by side (Browser | Center Panel | Detail View)
- Center panel swaps between Controller and WeekGrid based on mode
- WeekGrid uses horizontal scroll within its panel to fit 7 day columns
- ModeToggle sits above the three-panel layout

### Micro-interactions
- Ingredient card click: brief scale feedback
- Card entering selected state: border/fill color transition, not a jump
- Quantity change: macro numbers update immediately, no delay
- Macro ratio bar: width transition on change (~150ms ease)
- Generate Week Plan / Generate Meal: 700ms simulated loading state with spinner
- Meal card selection: highlighted border to indicate the active editing target
- Deselecting a meal card: clean transition back to unselected state

### What it should feel like
Assembling a meal should feel like building something real. Each ingredient click has weight. The numbers respond immediately. The macro bar shifts as you add food. In Week Plan mode, the calendar gives you a bird's-eye view of your week — you can see at a glance if Tuesday is light on protein or if your snacks are pushing calories too high. The interaction is live composition, not form-filling.
