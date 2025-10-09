export type View = 'inventory' | 'recipes' | 'favorites' | 'profile';

export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  isFavorite: boolean;
}

export interface UserProfile {
  goal: 'standard' | 'diet' | 'pregnancy';
}
