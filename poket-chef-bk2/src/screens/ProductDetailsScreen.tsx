import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
  border: 'rgba(0,0,0,0.1)',
};

export default function ProductDetailsScreen({ route, navigation }) {
  const { barcode } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [barcode]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Aquí deberías hacer la llamada a tu API para obtener los detalles del producto
      // Por ahora, simularemos una respuesta
      const mockProduct = {
        name: 'Producto de ejemplo',
        brand: 'Marca ejemplo',
        quantity: '500g',
        ingredients: 'Ingredientes de ejemplo',
        nutritionalInfo: {
          calories: '200kcal',
          protein: '5g',
          carbs: '25g',
          fat: '10g',
        },
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProduct(mockProduct);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar la información del producto');
      console.error('Error al cargar el producto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchProductDetails}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Producto</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Código de barras:</Text>
            <Text style={styles.value}>{barcode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{product.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Marca:</Text>
            <Text style={styles.value}>{product.brand}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cantidad:</Text>
            <Text style={styles.value}>{product.quantity}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Nutricional</Text>
          <View style={styles.nutritionalInfo}>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Calorías:</Text>
              <Text style={styles.nutrientValue}>{product.nutritionalInfo.calories}</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Proteínas:</Text>
              <Text style={styles.nutrientValue}>{product.nutritionalInfo.protein}</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Carbohidratos:</Text>
              <Text style={styles.nutrientValue}>{product.nutritionalInfo.carbs}</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Grasas:</Text>
              <Text style={styles.nutrientValue}>{product.nutritionalInfo.fat}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <Text style={styles.ingredients}>{product.ingredients}</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: COLORS.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  nutritionalInfo: {
    backgroundColor: `${COLORS.secondary}10`,
    borderRadius: 8,
    padding: 12,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  nutrientLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  nutrientValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  ingredients: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
}); 