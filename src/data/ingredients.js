// Static ingredient source data — never modified at runtime.
// All macro values are per 100g.
// Derived macros (based on quantity) are always calculated at render time.

const ingredients = [
  // --- Protein ---
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "Protein",
    per100g: { calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6 },
  },
  {
    id: "eggs",
    name: "Eggs",
    category: "Protein",
    per100g: { calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0 },
  },
  {
    id: "salmon",
    name: "Salmon",
    category: "Protein",
    per100g: { calories: 208, protein: 20.0, carbs: 0.0, fat: 13.0 },
  },
  {
    id: "ground-beef",
    name: "Ground Beef (90% lean)",
    category: "Protein",
    per100g: { calories: 215, protein: 26.0, carbs: 0.0, fat: 12.0 },
  },
  {
    id: "tuna",
    name: "Tuna (canned)",
    category: "Protein",
    per100g: { calories: 116, protein: 26.0, carbs: 0.0, fat: 0.8 },
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    category: "Protein",
    per100g: { calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
  },

  // --- Carbs ---
  {
    id: "brown-rice",
    name: "Brown Rice (cooked)",
    category: "Carbs",
    per100g: { calories: 112, protein: 2.3, carbs: 24.0, fat: 0.8 },
  },
  {
    id: "oats",
    name: "Oats (dry)",
    category: "Carbs",
    per100g: { calories: 389, protein: 17.0, carbs: 66.0, fat: 7.0 },
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato (cooked)",
    category: "Carbs",
    per100g: { calories: 86, protein: 1.6, carbs: 20.0, fat: 0.1 },
  },
  {
    id: "quinoa",
    name: "Quinoa (cooked)",
    category: "Carbs",
    per100g: { calories: 120, protein: 4.4, carbs: 22.0, fat: 1.9 },
  },
  {
    id: "banana",
    name: "Banana",
    category: "Carbs",
    per100g: { calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3 },
  },
  {
    id: "whole-wheat-bread",
    name: "Whole Wheat Bread",
    category: "Carbs",
    per100g: { calories: 247, protein: 13.0, carbs: 41.0, fat: 3.4 },
  },

  // --- Vegetables ---
  {
    id: "broccoli",
    name: "Broccoli",
    category: "Vegetables",
    per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  },
  {
    id: "spinach",
    name: "Spinach",
    category: "Vegetables",
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  },
  {
    id: "bell-pepper",
    name: "Bell Pepper",
    category: "Vegetables",
    per100g: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3 },
  },

  // --- Fats ---
  {
    id: "olive-oil",
    name: "Olive Oil",
    category: "Fats",
    per100g: { calories: 884, protein: 0.0, carbs: 0.0, fat: 100.0 },
  },
  {
    id: "almonds",
    name: "Almonds",
    category: "Fats",
    per100g: { calories: 579, protein: 21.0, carbs: 22.0, fat: 50.0 },
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter",
    category: "Fats",
    per100g: { calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0 },
  },

  // --- Dairy ---
  {
    id: "milk-whole",
    name: "Whole Milk",
    category: "Dairy",
    per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  },
  {
    id: "cheddar-cheese",
    name: "Cheddar Cheese",
    category: "Dairy",
    per100g: { calories: 402, protein: 25.0, carbs: 1.3, fat: 33.0 },
  },
  {
    id: "cottage-cheese",
    name: "Cottage Cheese",
    category: "Dairy",
    per100g: { calories: 98, protein: 11.0, carbs: 3.4, fat: 4.3 },
  },
]

export default ingredients
