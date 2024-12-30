export interface Ingredient {
  id: string;
  name: string;
  barcode?: string;
  quantity?: number;
  unit?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

export interface User {
  id: string;
  pantry: Ingredient[];
  favoriteRecipes: string[];
  shoppingList: Ingredient[];
}

export interface RootStackParamList {
  Home: undefined;
  Recipe: { id: string };
  Scanner: undefined;
  Pantry: undefined;
  Profile: undefined;
} 