import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PantryItem } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
  warning: '#FFB900',
  danger: '#FF4444',
  border: 'rgba(0,0,0,0.1)',
  cardBackground: '#FFFFFF',
};

// Definir el tipo de categoría
type Category = 'Frutas y Verduras' | 'Lácteos' | 'Carnes' | 'Despensa' | 'Condimentos' | 'Bebidas';

const categories: Category[] = [
  'Frutas y Verduras',
  'Lácteos',
  'Carnes',
  'Despensa',
  'Condimentos',
  'Bebidas',
];

// Actualizar la definición de categorías con mejores íconos y descripciones
const CATEGORIES_CONFIG = {
  'Frutas y Verduras': {
    icon: 'nutrition',
    description: 'Frutas y vegetales frescos',
    image: { uri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500' },
    color: '#4CD97B',
  },
  'Lácteos': {
    icon: 'cafe',
    description: 'Leche, queso, yogur',
    image: { uri: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500' },
    color: '#4ECDC4',
  },
  'Carnes': {
    icon: 'restaurant',
    description: 'Carnes, pescados, pollo',
    image: { uri: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500' },
    color: '#FF6B6B',
  },
  'Despensa': {
    icon: 'cube',
    description: 'Pasta, arroz, conservas',
    image: { uri: 'https://images.unsplash.com/photo-1584385002340-d886f3a0f097?w=500' },
    color: '#FFB900',
  },
  'Condimentos': {
    icon: 'flame',
    description: 'Especias y salsas',
    image: { uri: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500' },
    color: '#FF8F66',
  },
  'Bebidas': {
    icon: 'wine',
    description: 'Agua, jugos, refrescos',
    image: { uri: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500' },
    color: '#6C5CE7',
  },
} as const;

const DEFAULT_IMAGE = { uri: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500' }; // Imagen por defecto de cocina

// Definir interfaces para el modal
interface ScannedItem {
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  selected?: boolean;
}

interface SelectItemsModalProps {
  items: ScannedItem[];
  onClose: () => void;
  onConfirm: (selectedItems: ScannedItem[]) => void;
}

export default function PantryScreen() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<PantryItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadPantryItems();
  }, []);

  const loadPantryItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('pantryItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading pantry items:', error);
      Alert.alert('Error', 'No se pudieron cargar los items de la despensa');
    }
  };

  const savePantryItems = async (newItems: PantryItem[]) => {
    try {
      await AsyncStorage.setItem('pantryItems', JSON.stringify(newItems));
    } catch (error) {
      console.error('Error saving pantry items:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit || !newItem.category) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const item: PantryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      category: newItem.category,
      lastUpdated: new Date(),
      expirationDate: newItem.expirationDate,
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    await savePantryItems(updatedItems);
    setNewItem({});
    setIsAdding(false);
  };

  const updateQuantity = async (id: string, change: number) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, Number(item.quantity) + change),
            lastUpdated: new Date(),
          }
        : item
    );
    setItems(updatedItems);
    await savePantryItems(updatedItems);
  };

  const deleteItem = async (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            await savePantryItems(updatedItems);
          },
        },
      ]
    );
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getExpirationStatus = (expirationDate: string | undefined) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const expDate = new Date(expirationDate);
    
    if (isNaN(expDate.getTime())) return null;
    
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { 
      status: 'expired', 
      color: COLORS.danger, 
      background: `${COLORS.danger}15`,
      text: `¡Vencido! (${Math.abs(diffDays)} días)`
    };
    if (diffDays <= 7) return { 
      status: 'warning', 
      color: COLORS.warning, 
      background: `${COLORS.warning}15`,
      text: diffDays === 0 ? '¡Vence hoy!' : `¡Próximo a vencer! (${diffDays} días)`
    };
    return { 
      status: 'good', 
      color: COLORS.secondary, 
      background: `${COLORS.secondary}15`,
      text: 'En buen estado'
    };
  };

  const getExpirationText = (expirationDate: string | undefined) => {
    if (!expirationDate) return '';
    
    const expDate = new Date(expirationDate);
    if (isNaN(expDate.getTime())) return 'Fecha inválida';
    
    return expDate.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (!isNaN(new Date(formattedDate).getTime())) {
        setNewItem({ 
          ...newItem, 
          expirationDate: formattedDate
        });
      } else {
        Alert.alert('Error', 'La fecha seleccionada no es válida');
      }
    }
  };

  const handleScan = async () => {
    Alert.alert('Función no disponible', 'La funcionalidad de escaneo está temporalmente deshabilitada.');
  };

  const SelectItemsModal: React.FC<SelectItemsModalProps> = ({ items, onClose, onConfirm }) => {
    const [selectedItems, setSelectedItems] = useState<(ScannedItem & { selected: boolean })[]>(
      items.map(item => ({ ...item, selected: true }))
    );

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecciona los productos a agregar</Text>
          
          <FlatList
            data={selectedItems}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.itemSelectRow}
                onPress={() => {
                  const newItems = [...selectedItems];
                  newItems[index] = { ...item, selected: !item.selected };
                  setSelectedItems(newItems);
                }}
              >
                <View style={styles.itemSelectCheckbox}>
                  {item.selected && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </View>
                <View style={styles.itemSelectInfo}>
                  <Text style={styles.itemSelectName}>{item.name}</Text>
                  <Text style={styles.itemSelectQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.itemSelectCategory}
                  onPress={() => {
                    Alert.alert(
                      'Seleccionar Categoría',
                      'Elige una categoría para este producto',
                      categories.map(category => ({
                        text: category,
                        onPress: () => {
                          const newItems = [...selectedItems];
                          newItems[index] = { ...item, category };
                          setSelectedItems(newItems);
                        }
                      }))
                    );
                  }}
                >
                  <Text style={styles.itemSelectCategoryText}>{item.category}</Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.textLight} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={() => onConfirm(selectedItems.filter(item => item.selected))}
            >
              <Text style={[styles.modalButtonText, { color: COLORS.light }]}>
                Agregar ({selectedItems.filter(item => item.selected).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const AddItemForm = () => {
    return (
      <View style={styles.addItemForm}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Agregar Nuevo Item</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsAdding(false)}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formScrollView}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={newItem.name}
            onChangeText={text => setNewItem({ ...newItem, name: text })}
            autoFocus
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={newItem.quantity?.toString()}
              onChangeText={text => setNewItem({ ...newItem, quantity: Number(text) })}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Unidad"
              value={newItem.unit}
              onChangeText={text => setNewItem({ ...newItem, unit: text })}
            />
          </View>

          <Text style={styles.categoryLabel}>Categoría</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChipLarge,
                  newItem.category === category && styles.categoryChipSelected,
                ]}
                onPress={() => setNewItem({ ...newItem, category })}
              >
                <Image
                  source={CATEGORIES_CONFIG[category].image}
                  style={styles.categoryImage}
                  defaultSource={DEFAULT_IMAGE}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    newItem.category === category && styles.categoryChipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.inputLabel}>Fecha de vencimiento:</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.dateInputText}>
                {newItem.expirationDate 
                  ? getExpirationText(newItem.expirationDate)
                  : 'Seleccionar fecha (opcional)'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={newItem.expirationDate ? new Date(newItem.expirationDate) : new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={addItem}
          >
            <Text style={styles.submitButtonText}>Agregar al Inventario</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderItem = ({ item }: { item: PantryItem }) => {
    const expirationStatus = getExpirationStatus(item.expirationDate);
    
    return (
      <TouchableOpacity 
        style={styles.itemCard}
        onPress={() => Alert.alert(
          item.name,
          `Cantidad: ${item.quantity} ${item.unit}\nCategoría: ${item.category}\n${item.expirationDate ? `Vence: ${getExpirationText(item.expirationDate)}` : ''}`
        )}
      >
        <View style={styles.itemHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: `${COLORS.primary}20` }]}>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>{item.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <Image
          source={CATEGORIES_CONFIG[item.category as Category].image}
          style={styles.itemImage}
          defaultSource={DEFAULT_IMAGE}
        />

        <View style={styles.itemNameContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.quantityContainer}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>
                  {item.quantity} {item.unit}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {item.expirationDate && expirationStatus && (
            <View style={[
              styles.expirationContainer,
              { backgroundColor: expirationStatus.background }
            ]}>
              <View style={styles.expirationInfo}>
                <Ionicons 
                  name="calendar-outline" 
                  size={14} 
                  color={expirationStatus.color}
                  style={styles.expirationIcon}
                />
                <Text style={[
                  styles.expirationDate,
                  { color: COLORS.text }
                ]}>
                  {getExpirationText(item.expirationDate)}
                </Text>
              </View>
              <Text style={[
                styles.expirationStatus,
                { color: expirationStatus.color }
              ]}>
                {expirationStatus.text}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Mi Despensa</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[styles.headerButton, styles.scanButton]}
          onPress={handleScan}
        >
          <Ionicons name="scan" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        {!isAdding && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsAdding(true)}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {!isAdding && (
        <>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Categorías</Text>
                <Text style={styles.sectionSubtitle}>¿Qué estás buscando?</Text>
              </View>
              {selectedCategory && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={styles.clearFilterText}>Limpiar filtro</Text>
                  <Ionicons name="close-circle" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.categoriesGrid}>
              {Object.entries(CATEGORIES_CONFIG).map(([category, config]) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category && styles.categoryCardSelected,
                    { borderColor: config.color },
                  ]}
                  onPress={() => setSelectedCategory(category as Category)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
                    <Ionicons 
                      name={config.icon as any} 
                      size={28} 
                      color={selectedCategory === category ? COLORS.light : config.color} 
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryCardText,
                      selectedCategory === category && styles.categoryCardTextSelected,
                      { color: selectedCategory === category ? COLORS.light : config.color },
                    ]}
                    numberOfLines={2}
                    textBreakStrategy="balanced"
                  >
                    {category}
                  </Text>
                  <Text 
                    style={[
                      styles.categoryDescription,
                      selectedCategory === category && styles.categoryDescriptionSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {config.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {isAdding ? (
        <AddItemForm />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: COLORS.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  categoriesSection: {
    paddingVertical: 16,
    backgroundColor: COLORS.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 8,
  },
  clearFilterText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 96) / 3,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 6,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  categoryCardSelected: {
    backgroundColor: COLORS.primary,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  categoryCardText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 2,
    color: COLORS.text,
    lineHeight: 16,
  },
  categoryCardTextSelected: {
    color: COLORS.light,
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 4,
    lineHeight: 14,
  },
  categoryDescriptionSelected: {
    color: `${COLORS.light}CC`,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 4,
  },
  itemCard: {
    width: ITEM_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    height: 260,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}20`,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 4,
  },
  itemNameContainer: {
    minHeight: 36,
    marginVertical: 6,
    justifyContent: 'flex-start',
    backgroundColor: `${COLORS.background}20`,
    borderRadius: 6,
    padding: 8,
    paddingLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
    textAlign: 'left',
  },
  itemFooter: {
    marginTop: 'auto',
    gap: 8,
  },
  quantityContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  expirationContainer: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  expirationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expirationIcon: {
    marginRight: 6,
  },
  expirationDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  expirationStatus: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  addItemForm: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}15`,
  },
  formScrollView: {
    maxHeight: '85%',
  },
  categoryChipLarge: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
  categoryChipTextSelected: {
    color: COLORS.light,
  },
  categoryImage: {
    width: '80%',
    height: '70%',
    borderRadius: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  itemImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateInputText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanButton: {
    marginRight: 4,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  itemSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemSelectCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemSelectInfo: {
    flex: 1,
  },
  itemSelectName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  itemSelectQuantity: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemSelectCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemSelectCategoryText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.background,
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
}); 