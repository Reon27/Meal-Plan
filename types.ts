
export enum UserType {
  NORMAL = '普通の人',
  DIET = 'ダイエット中',
  PREGNANT = '妊婦',
}

export enum View {
  PROFILE = 'PROFILE',
  INVENTORY = 'INVENTORY',
  SUGGESTIONS = 'SUGGESTIONS',
  RECIPE = 'RECIPE',
}

export interface UserProfile {
  userType: UserType;
  allergens: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  expiryDate?: string;
}

export interface PFC {
  protein: number;
  fat: number;
  carbs: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  cookingTime: number; // in minutes
  calories?: number;
  pfc?: PFC;
  specialNotes?: string; // For pregnancy/diet info
}

export interface MealSet {
  id: string;
  main: Recipe;
  side: Recipe;
  soup: Recipe;
}
