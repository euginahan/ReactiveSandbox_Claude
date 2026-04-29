// Static ingredient detail data — descriptions, common uses, serving suggestions.
// Keyed by ingredient id to match ingredients.js.

const ingredientDetails = {
  'chicken-breast': {
    description: 'A lean, high-protein white meat with minimal fat. One of the most popular proteins for meal prepping and hitting fitness goals consistently.',
    commonUses: ['Grilled bowls', 'Salads', 'Stir-fry', 'Meal prep', 'Wraps'],
    servingSuggestions: ['100g — salad topper or snack', '150g — standard main dish', '200g+ — high-protein performance meal'],
  },
  'eggs': {
    description: 'A nutritionally complete food packed with high-quality protein, healthy fats, and essential vitamins. Extremely versatile and fast to prepare.',
    commonUses: ['Breakfast scrambles', 'Hard-boiled snacks', 'Omelets', 'Post-workout meal', 'Baked goods'],
    servingSuggestions: ['1 egg (~50g)', '2 eggs (~100g) — standard serving', '3–4 eggs — high-protein option'],
  },
  'salmon': {
    description: 'A fatty fish rich in omega-3 fatty acids and high-quality protein. Known for anti-inflammatory benefits and cardiovascular health support.',
    commonUses: ['Baked or pan-seared fillets', 'Grain bowls', 'Poke bowls', 'Salads'],
    servingSuggestions: ['100g — standard portion', '140g — restaurant-style serving', '200g — performance meal'],
  },
  'ground-beef': {
    description: 'A versatile, calorie-dense protein source. Fat percentage significantly impacts the nutritional profile — leaner options suit most fitness goals.',
    commonUses: ['Taco bowls', 'Burgers', 'Stir-fry', 'Pasta sauces', 'Meal prep'],
    servingSuggestions: ['100g — mixed into dishes', '150g — main protein base', '200g — high-protein, high-calorie meal'],
  },
  'tuna': {
    description: 'A lean, convenient protein source available canned or fresh. Very low fat and high in protein — ideal for calorie-conscious meal prep.',
    commonUses: ['Tuna salad', 'Grain bowls', 'Wraps', 'Mixed into rice dishes', 'Quick snacks'],
    servingSuggestions: ['85g — one standard can', '100g — salad addition', '170g — double serving for high protein'],
  },
  'greek-yogurt': {
    description: 'Strained yogurt with significantly more protein than regular yogurt. Creamy, tangy, and excellent as a base, sauce, or standalone snack.',
    commonUses: ['Parfaits', 'Smoothie base', 'Tzatziki sauce', 'Protein breakfast', 'Dip or spread'],
    servingSuggestions: ['100g — topping or sauce', '150g — breakfast serving', '200g — high-protein snack'],
  },
  'brown-rice': {
    description: 'A whole grain carbohydrate providing sustained energy and dietary fiber. Less processed than white rice with a nuttier, more complex flavor.',
    commonUses: ['Grain bowls', 'Side dish', 'Stir-fry base', 'Meal prep staple', 'Buddha bowls'],
    servingSuggestions: ['100g cooked — light side', '150g cooked — standard portion', '200g cooked — energy-dense base'],
  },
  'oats': {
    description: 'A whole grain packed with complex carbohydrates and beta-glucan fiber. Excellent for sustained energy and cardiovascular health.',
    commonUses: ['Overnight oats', 'Cooked porridge', 'Smoothie thickener', 'Granola', 'Baked goods'],
    servingSuggestions: ['40g dry — standard bowl', '60g dry — larger serving', '80g dry — high-carb performance breakfast'],
  },
  'sweet-potato': {
    description: 'A nutrient-dense complex carbohydrate loaded with beta-carotene, fiber, and natural sweetness. A fitness nutrition staple.',
    commonUses: ['Roasted cubes', 'Mashed side', 'Bowl base', 'Pre-workout carb source', 'Soup'],
    servingSuggestions: ['100g — light side portion', '150g — standard serving', '200g — carb-loading option'],
  },
  'quinoa': {
    description: 'A complete plant protein and complex carbohydrate containing all nine essential amino acids. Gluten-free and remarkably nutrient-dense.',
    commonUses: ['Grain bowls', 'Salad base', 'Stuffed peppers', 'Breakfast porridge', 'Meal prep starch'],
    servingSuggestions: ['100g cooked — light side', '150g cooked — standard serving', '200g cooked — high-carb base'],
  },
  'banana': {
    description: 'A natural source of fast-digesting carbohydrates, potassium, and vitamin B6. Ideal before or after workouts for quick energy.',
    commonUses: ['Pre-workout snack', 'Smoothies', 'Oatmeal topper', 'Quick energy boost', 'Dessert'],
    servingSuggestions: ['80g — small banana', '120g — medium banana', '150g — large banana'],
  },
  'whole-wheat-bread': {
    description: 'A whole grain bread providing complex carbohydrates and dietary fiber. More nutritious than white bread with a lower glycemic index.',
    commonUses: ['Sandwiches', 'Toast with toppings', 'Pre-workout snack', 'Side with soup'],
    servingSuggestions: ['30g — 1 slice', '60g — 2 slices', '90g — 3 slices for higher carb needs'],
  },
  'broccoli': {
    description: 'A cruciferous vegetable rich in fiber, vitamin C, and antioxidants. Very low calorie with surprisingly decent protein content for a vegetable.',
    commonUses: ['Steamed side', 'Stir-fry', 'Roasted florets', 'Bowl filler', 'Salads'],
    servingSuggestions: ['80g — small side serving', '150g — standard serving', '200g — generous low-calorie volume add'],
  },
  'spinach': {
    description: 'A leafy green powerhouse with iron, folate, and vitamin K. Extremely low calorie — excellent for adding volume and nutrients to any meal.',
    commonUses: ['Sautéed side', 'Salad base', 'Smoothie add-in', 'Egg dishes', 'Bowl filler'],
    servingSuggestions: ['50g — cooked down', '80g — standard serving', '150g — high-volume, low-calorie add'],
  },
  'bell-pepper': {
    description: 'A colorful vegetable rich in vitamin C and antioxidants. Adds crunch, color, and natural sweetness to any dish with minimal calories.',
    commonUses: ['Stir-fry', 'Fajitas', 'Raw in salads', 'Stuffed peppers', 'Roasted as side'],
    servingSuggestions: ['80g — half a medium pepper', '120g — one medium pepper', '200g — generous portion'],
  },
  'olive-oil': {
    description: 'A heart-healthy monounsaturated fat rich in antioxidants. A cornerstone of the Mediterranean diet and an essential cooking fat.',
    commonUses: ['Sautéing proteins', 'Roasting vegetables', 'Salad dressings', 'Finishing drizzle'],
    servingSuggestions: ['5g — light drizzle (1 tsp)', '14g — 1 tablespoon standard', '28g — 2 tbsp for heavier cooking'],
  },
  'almonds': {
    description: 'A nutrient-dense nut providing healthy fats, plant protein, vitamin E, and magnesium. Great as a snack or a crunchy topping.',
    commonUses: ['Topping for bowls', 'Trail mix', 'Standalone snack', 'Chopped into salads', 'Almond butter base'],
    servingSuggestions: ['15g — small handful (~12 almonds)', '28g — standard serving (~23 almonds)', '42g — larger portion'],
  },
  'peanut-butter': {
    description: 'A calorie-dense spread rich in healthy fats and plant protein. Adds flavor, richness, and satiety to meals and snacks alike.',
    commonUses: ['Toast topping', 'Smoothie add-in', 'Dipping sauce', 'Oatmeal mix-in', 'Protein sauce for bowls'],
    servingSuggestions: ['16g — 1 tablespoon', '32g — 2 tablespoons (standard)', '48g — heavier use or sauce base'],
  },
  'milk-whole': {
    description: 'A complete source of protein, calcium, and fat-soluble vitamins. Full-fat milk is more satiating and nutrient-rich than reduced-fat alternatives.',
    commonUses: ['Oat cooking liquid', 'Smoothie base', 'Beverage', 'Cooking and baking'],
    servingSuggestions: ['100ml — splash in oats', '200ml — small glass', '240ml — standard 8oz serving'],
  },
  'cheddar-cheese': {
    description: 'A rich, aged cheese with bold flavor and high fat content. Small amounts add significant flavor, calcium, and protein to any dish.',
    commonUses: ['Melted topping', 'Egg dishes', 'Sandwiches', 'Bowl topping', 'Snacking with fruit'],
    servingSuggestions: ['15g — light topping', '28g — standard serving', '42g — generous portion'],
  },
  'cottage-cheese': {
    description: 'A fresh cheese with surprisingly high protein and a mild flavor. An underrated fitness food that works well as a topping, base, or standalone snack.',
    commonUses: ['Protein-rich breakfast', 'Dip base', 'Bowl topping', 'Pancake ingredient', 'Standalone snack'],
    servingSuggestions: ['100g — topping or mix-in', '150g — standard snack serving', '225g — full protein-rich meal'],
  },
}

export default ingredientDetails
