import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (recipeId: string) => Promise<void>;
  isLoading: boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function FavoritesProvider({ children }: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites().finally(() => setIsLoading(false));
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los favoritos. Por favor, intenta de nuevo más tarde.'
      );
    }
  };

  const toggleFavorite = async (recipeId: string) => {
    try {
      const newFavorites = favorites.includes(recipeId)
        ? favorites.filter(id => id !== recipeId)
        : [...favorites, recipeId];

      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar los favoritos. Por favor, intenta de nuevo.'
      );
      throw error; // Re-lanzar el error para que pueda ser manejado por el componente
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
} 