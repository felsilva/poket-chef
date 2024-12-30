import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SectionList,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListItem } from '../types';

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
  success: '#2ECC71',
  border: 'rgba(0,0,0,0.1)',
  categoryHeader: '#F0F2F5',
};

const categories = [
  'Frutas y Verduras',
  'Lácteos',
  'Carnes',
  'Despensa',
  'Condimentos',
  'Bebidas',
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<ShoppingListItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('shoppingList');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading shopping list:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de compras');
    }
  };

  const saveShoppingList = async (newItems: ShoppingListItem[]) => {
    try {
      await AsyncStorage.setItem('shoppingList', JSON.stringify(newItems));
    } catch (error) {
      console.error('Error saving shopping list:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit || !newItem.category) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const item: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      category: newItem.category,
      checked: false,
      addedAt: new Date(),
      source: 'manual',
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    await saveShoppingList(updatedItems);
    setNewItem({});
    setIsAdding(false);
  };

  const toggleItem = async (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    await saveShoppingList(updatedItems);
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
            await saveShoppingList(updatedItems);
          },
        },
      ]
    );
  };

  const clearCheckedItems = async () => {
    Alert.alert(
      'Limpiar completados',
      '¿Estás seguro de que quieres eliminar todos los items completados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = items.filter(item => !item.checked);
            setItems(updatedItems);
            await saveShoppingList(updatedItems);
          },
        },
      ]
    );
  };

  const filteredAndGroupedItems = () => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = categories.map(category => ({
      title: category,
      data: filtered.filter(item => item.category === category)
    })).filter(section => section.data.length > 0);

    return grouped;
  };

  const renderAddItemForm = () => (
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
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={newItem.name}
        onChangeText={text => setNewItem({ ...newItem, name: text })}
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              newItem.category === category && styles.categoryChipSelected,
            ]}
            onPress={() => setNewItem({ ...newItem, category })}
          >
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
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={addItem}
      >
        <Text style={styles.addButtonText}>Agregar a la Lista</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <TouchableOpacity
      style={[styles.itemCard, item.checked && styles.itemCardChecked]}
      onPress={() => toggleItem(item.id)}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleItem(item.id)}
      >
        <View style={[styles.checkboxInner, item.checked && styles.checkboxChecked]}>
          {item.checked && (
            <Ionicons name="checkmark" size={16} color={COLORS.light} />
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>
          {item.quantity} {item.unit}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Compras</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { marginRight: 8 }]}
            onPress={clearCheckedItems}
          >
            <Ionicons name="checkmark-done-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsAdding(true)}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isAdding ? (
        renderAddItemForm()
      ) : (
        <SectionList
          sections={filteredAndGroupedItems()}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          stickySectionHeadersEnabled={true}
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
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}15`,
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
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: COLORS.categoryHeader,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemCardChecked: {
    backgroundColor: `${COLORS.success}10`,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: COLORS.light,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
}); 