import React, { useContext, useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { FavoritesContext } from '../contexts/FavoritesContext';

// Tipos
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  image?: string;
}

// Constantes
const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
} as const;

const API_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: {
    params: {
      id: string;
    };
  };
}

interface IngredientItemProps {
  ingredient: Ingredient;
}

interface InstructionItemProps {
  instruction: string;
  index: number;
}

// Componentes Memorizados
const IngredientItem = memo(({ ingredient }: IngredientItemProps): JSX.Element => (
  <View style={styles.ingredientItem}>
    <Text style={styles.ingredientText}>
      • {ingredient.quantity} {ingredient.unit} {ingredient.name}
    </Text>
  </View>
));

IngredientItem.displayName = 'IngredientItem';

const InstructionItem = memo(({ instruction, index }: InstructionItemProps): JSX.Element => (
  <View style={styles.instructionItem}>
    <Text style={styles.instructionNumber}>{index + 1}</Text>
    <Text style={styles.instructionText}>{instruction}</Text>
  </View>
));

InstructionItem.displayName = 'InstructionItem';

const RecipeScreen = ({ route }: Props): JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const favoritesContext = useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/recipes/${route.params.id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('No se recibieron datos de la API');
      }

      setRecipe(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cargar la receta:', errorMessage);
      setError('No se pudo cargar la receta. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [route.params.id]);

  useEffect(() => {
    void fetchRecipe();
  }, [fetchRecipe]);

  const handleToggleFavorite = useCallback(async () => {
    if (!favoritesContext) return;
    
    try {
      setIsLoading(true);
      await favoritesContext.toggleFavorite(route.params.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cambiar favorito:', errorMessage);
      Alert.alert(
        'Error',
        'No se pudo actualizar el estado de favorito. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [favoritesContext, route.params.id]);

  const handleStartCooking = useCallback(() => {
    if (!recipe) return;
    
    try {
      navigation.navigate('RecipeSteps', { recipe });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al navegar:', errorMessage);
      Alert.alert(
        'Error',
        'No se pudo iniciar la receta. Por favor, intenta de nuevo.'
      );
    }
  }, [navigation, recipe]);

  const handleAddToShoppingList = useCallback(() => {
    try {
      Alert.alert(
        'Éxito',
        'Los ingredientes han sido añadidos a tu lista de compras',
        [
          {
            text: 'Ver lista',
            onPress: () => navigation.navigate('ShoppingList'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al agregar a la lista de compras:', errorMessage);
      Alert.alert(
        'Error',
        'No se pudieron agregar los ingredientes a la lista de compras'
      );
    }
  }, [navigation]);

  if (!favoritesContext) {
    return (
      <View style={styles.centered}>
        <Text>Error: No se pudo cargar el contexto de favoritos</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecipe}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró la receta</Text>
      </View>
    );
  }

  const { favorites } = favoritesContext;
  const isFavorite = favorites.includes(route.params.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.name}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleToggleFavorite}
            disabled={isLoading}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddToShoppingList}
            disabled={isLoading}
          >
            <Ionicons
              name="cart-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color={COLORS.textLight} />
          <Text style={styles.infoText}>{recipe.preparationTime} min</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="speedometer-outline" size={20} color={COLORS.textLight} />
          <Text style={styles.infoText}>
            {recipe.difficulty === 'easy' ? 'Fácil' :
             recipe.difficulty === 'medium' ? 'Media' : 'Difícil'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ingredientes</Text>
      {recipe.ingredients.map((ingredient) => (
        <IngredientItem key={ingredient.id} ingredient={ingredient} />
      ))}

      <Text style={styles.sectionTitle}>Instrucciones</Text>
      {recipe.instructions.map((instruction, index) => (
        <InstructionItem key={index} instruction={instruction} index={index} />
      ))}

      <TouchableOpacity
        style={[styles.startButton, isLoading && styles.disabledButton]}
        onPress={handleStartCooking}
        disabled={isLoading}
      >
        <Text style={styles.startButtonText}>Comenzar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

RecipeScreen.displayName = 'RecipeScreen';

export default RecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    marginLeft: 8,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  ingredientItem: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: COLORS.text,
  },
  instructionItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.light,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: COLORS.light,
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 