import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Recipe, RootStackParamList } from '../types';
import { FavoritesContext, FavoritesContextType } from '../contexts/FavoritesContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CATEGORY_WIDTH = width * 0.4;

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  dark: '#2C363F',
  light: '#FFFFFF',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  success: '#2ECC71',
  gradient: {
    primary: ['#FF6B6B', '#FF8E53'],
    dark: ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'],
    light: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
    overlay: ['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']
  }
};

// Imágenes de stock para las categorías
const STOCK_IMAGES = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
  lunch: 'https://images.unsplash.com/photo-1547592180-85f173990554',
  dinner: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  dessert: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
};

const categories = [
  {
    id: '1',
    name: 'Desayunos',
    image: STOCK_IMAGES.breakfast,
    icon: 'sunny-outline'
  },
  {
    id: '2',
    name: 'Almuerzos',
    image: STOCK_IMAGES.lunch,
    icon: 'restaurant-outline'
  },
  {
    id: '3',
    name: 'Cenas',
    image: STOCK_IMAGES.dinner,
    icon: 'moon-outline'
  },
  {
    id: '4',
    name: 'Postres',
    image: STOCK_IMAGES.dessert,
    icon: 'ice-cream-outline'
  },
  {
    id: '5',
    name: 'Bebidas',
    image: STOCK_IMAGES.drinks,
    icon: 'wine-outline'
  },
];

const filters = [
  { id: 'all', name: 'Todos' },
  { id: 'quick', name: '< 30 min' },
  { id: 'easy', name: 'Fácil' },
  { id: 'vegetarian', name: 'Vegetariano' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites } = useContext(FavoritesContext) as FavoritesContextType;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, activeFilter, recipes]);

  const fetchRecipes = async () => {
    try {
      // Aquí deberías hacer una llamada a la API
      // Por ahora usaremos datos de ejemplo
      const sampleRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Pasta Carbonara',
          description: 'Una deliciosa pasta carbonara tradicional italiana',
          ingredients: [
            { ingredientId: '1', quantity: 400, unit: 'g' },
            { ingredientId: '2', quantity: 4, unit: 'unidades' },
          ],
          instructions: [
            'Cocer la pasta en agua con sal',
            'Mientras tanto, cortar la panceta en dados',
          ],
          preparationTime: 30,
          difficulty: 'medium',
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
        },
        {
          id: '2',
          name: 'Ensalada César',
          description: 'Clásica ensalada César con pollo a la parrilla',
          ingredients: [
            { ingredientId: '3', quantity: 200, unit: 'g' },
            { ingredientId: '4', quantity: 1, unit: 'unidad' },
          ],
          instructions: [
            'Lavar y cortar la lechuga',
            'Cocinar el pollo a la parrilla',
          ],
          preparationTime: 20,
          difficulty: 'easy',
          image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        },
      ];
      setRecipes(sampleRecipes);
      setFilteredRecipes(sampleRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];
    
    // Aplicar filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtros rápidos
    switch (activeFilter) {
      case 'quick':
        filtered = filtered.filter(recipe => recipe.preparationTime <= 30);
        break;
      case 'easy':
        filtered = filtered.filter(recipe => recipe.difficulty === 'easy');
        break;
      case 'vegetarian':
        // Aquí podrías agregar la lógica para filtrar recetas vegetarianas
        break;
    }

    setFilteredRecipes(filtered);
  };

  const renderRecipeCard = (recipe: Recipe, large = false) => (
    <TouchableOpacity
      key={recipe.id}
      style={[styles.card, large ? styles.largeCard : styles.smallCard]}
      onPress={() => navigation.navigate('Recipe', { id: recipe.id })}
    >
      <ImageBackground
        source={{ uri: recipe.image }}
        style={[styles.cardImage, large ? styles.largeImage : styles.smallImage]}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={COLORS.gradient.overlay}
          locations={[0, 0.3, 0.6, 1]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {recipe.name}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {recipe.description}
            </Text>
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.light} />
                <Text style={styles.metaText}>{recipe.preparationTime} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star-outline" size={14} color={COLORS.light} />
                <Text style={styles.metaText}>
                  {recipe.difficulty === 'easy' ? 'Fácil' :
                   recipe.difficulty === 'medium' ? 'Media' : 'Difícil'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCategoryCard = (category: { id: string; name: string; image: string; icon: string }) => (
    <TouchableOpacity key={category.id} style={styles.categoryCard}>
      <ImageBackground
        source={{ uri: category.image }}
        style={styles.categoryImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={COLORS.gradient.dark}
          locations={[0, 0.5, 1]}
          style={styles.categoryGradient}
        >
          <View style={styles.categoryContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={category.icon as any} size={24} color={COLORS.light} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderFilterChip = (filter: { id: string; name: string }) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterChip,
        activeFilter === filter.id && styles.filterChipActive
      ]}
      onPress={() => setActiveFilter(filter.id)}
    >
      <Text style={[
        styles.filterChipText,
        activeFilter === filter.id && styles.filterChipTextActive
      ]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado con saludo */}
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.welcomeText}>¡Hola, Chef! 👋‍🍳</Text>
          <Text style={styles.welcomeSubtext}>¿Qué cocinarás hoy? 🍳</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map(renderFilterChip)}
        </ScrollView>
      </View>

      {/* Categorías */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <Text style={styles.sectionSubtitle}>Explora por tipo de comida</Text>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryCard)}
        </ScrollView>
      </View>

      {/* Sección de Favoritos */}
      {favorites.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tus Favoritos</Text>
              <Text style={styles.sectionSubtitle}>Recetas que te encantan</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesContainer}
          >
            {recipes.filter(recipe => favorites.includes(recipe.id)).map(recipe => renderRecipeCard(recipe, true))}
          </ScrollView>
        </View>
      )}

      {/* Recetas Destacadas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recetas Destacadas</Text>
            <Text style={styles.sectionSubtitle}>Las más populares de la semana</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesContainer}
        >
          {filteredRecipes.map(recipe => renderRecipeCard(recipe, true))}
        </ScrollView>
      </View>
    </ScrollView>
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
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.light,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.light,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.light,
  },
  section: {
    marginTop: 24,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}15`,
  },
  seeAllButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  categoryCard: {
    width: CATEGORY_WIDTH,
    height: CATEGORY_WIDTH * 0.8,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  categoryContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}33`,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.light,
    textAlign: 'center',
  },
  recipesContainer: {
    paddingHorizontal: 12,
  },
  card: {
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.light,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  largeCard: {
    width: CARD_WIDTH,
  },
  smallCard: {
    width: CARD_WIDTH * 0.75,
  },
  cardImage: {
    width: '100%',
    backgroundColor: COLORS.background,
  },
  largeImage: {
    height: 220,
  },
  smallImage: {
    height: 180,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.light,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 