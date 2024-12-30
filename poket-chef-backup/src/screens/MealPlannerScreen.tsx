import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { MealPlan, DailyMeal, Recipe } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
  muted: '#E9ECEF',
};

const MEAL_TYPES = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
};

export default function MealPlannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchMealPlan();
    fetchRecipes();
  }, [currentWeek]);

  const fetchMealPlan = async () => {
    try {
      // Aquí deberías hacer una llamada a la API
      // Por ahora usaremos datos de ejemplo
      const weekDays = Array.from({ length: 7 }, (_, i) => ({
        date: addDays(currentWeek, i),
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
      }));

      setMealPlan({
        id: '1',
        userId: '123',
        weekStartDate: currentWeek,
        meals: weekDays,
      });
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      // Aquí deberías hacer una llamada a la API
      // Por ahora usaremos datos de ejemplo
      setRecipes([
        {
          id: '1',
          name: 'Avena con frutas',
          description: 'Desayuno saludable',
          ingredients: [],
          instructions: [],
          preparationTime: 15,
          difficulty: 'easy',
        },
        {
          id: '2',
          name: 'Pasta Carbonara',
          description: 'Pasta italiana clásica',
          ingredients: [],
          instructions: [],
          preparationTime: 30,
          difficulty: 'medium',
        },
      ]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const handleSelectMeal = (day: Date, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setRecipeModalVisible(true);
  };

  const handleSelectRecipe = async (recipe: Recipe) => {
    if (!selectedDay || !selectedMealType || !mealPlan) return;

    try {
      // Aquí deberías hacer una llamada a la API para actualizar el plan
      const updatedMeals = mealPlan.meals.map(meal => {
        if (format(meal.date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd')) {
          return {
            ...meal,
            [selectedMealType]: {
              recipeId: recipe.id,
              recipeName: recipe.name,
              servings: 1,
            },
          };
        }
        return meal;
      });

      setMealPlan({
        ...mealPlan,
        meals: updatedMeals,
      });

      setRecipeModalVisible(false);
      setSelectedDay(null);
      setSelectedMealType(null);

      Alert.alert('Éxito', 'Receta añadida al plan');
    } catch (error) {
      console.error('Error updating meal plan:', error);
      Alert.alert('Error', 'No se pudo actualizar el plan de comidas');
    }
  };

  const handleGenerateShoppingList = async () => {
    try {
      // Aquí deberías hacer una llamada a la API para generar la lista
      Alert.alert(
        'Lista de compras generada',
        'Se han añadido los ingredientes necesarios a tu lista de compras',
        [
          {
            text: 'Ver lista',
            onPress: () => navigation.navigate('Lista'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error generating shopping list:', error);
      Alert.alert('Error', 'No se pudo generar la lista de compras');
    }
  };

  const renderMealCell = (day: DailyMeal, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const meal = day[mealType];
    return (
      <TouchableOpacity
        style={styles.mealCell}
        onPress={() => handleSelectMeal(day.date, mealType)}
      >
        {meal ? (
          <Text style={styles.mealText}>{meal.recipeName}</Text>
        ) : (
          <Ionicons name="add" size={24} color={COLORS.textLight} />
        )}
      </TouchableOpacity>
    );
  };

  if (!mealPlan) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousWeek}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.weekText}>
          Semana del {format(currentWeek, "d 'de' MMMM", { locale: es })}
        </Text>
        <TouchableOpacity onPress={handleNextWeek}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.headerText}>Hora</Text>
            </View>
            {mealPlan.meals.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayText}>
                  {format(day.date, 'EEE', { locale: es })}
                </Text>
                <Text style={styles.dateText}>
                  {format(day.date, 'd')}
                </Text>
              </View>
            ))}
          </View>

          {/* Meal rows */}
          {Object.entries(MEAL_TYPES).map(([type, label]) => (
            <View key={type} style={styles.mealRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.mealTypeText}>{label}</Text>
              </View>
              {mealPlan.meals.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  {renderMealCell(day, type as 'breakfast' | 'lunch' | 'dinner')}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateShoppingList}
      >
        <Ionicons name="cart-outline" size={24} color={COLORS.light} />
        <Text style={styles.generateButtonText}>Generar lista de compras</Text>
      </TouchableOpacity>

      <Modal
        visible={recipeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRecipeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar receta</Text>
              <TouchableOpacity
                onPress={() => setRecipeModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recipeItem}
                  onPress={() => handleSelectRecipe(item)}
                >
                  <Text style={styles.recipeName}>{item.name}</Text>
                  <Text style={styles.recipeDescription}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.light,
  },
  weekText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  tableContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
  },
  timeColumn: {
    width: 100,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: COLORS.light,
  },
  dayColumn: {
    width: 120,
    padding: 8,
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  mealRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
  },
  mealTypeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  mealCell: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    margin: 4,
    borderRadius: 8,
    padding: 8,
  },
  mealText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  recipeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  recipeDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
}); 