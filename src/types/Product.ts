export interface NutritionFacts {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // milligrams
  vitaminC: number; // milligrams
  potassium: number; // milligrams
}

export interface Product {
  id: number;
  name: string;
  description: string;
  nutritionFacts: NutritionFacts;
}
