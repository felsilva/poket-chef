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

type Category = 'Frutas y Verduras' | 'Lácteos' | 'Carnes' | 'Despensa' | 'Condimentos' | 'Bebidas';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  lastUpdated: Date;
  expirationDate?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Recipe: { id: string };
  RecipeSteps: { recipe: Recipe };
  Scanner: undefined;
  Pantry: undefined;
  Profile: undefined;
  ProductDetails: { barcode: string };
}; 