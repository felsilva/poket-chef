import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Recipe } from '../types';

const { width } = Dimensions.get('window');

// Componente de respaldo para LinearGradient
const GradientFallback = ({ colors, style, children }) => {
  const gradientStyle = {
    ...style,
    backgroundColor: colors[0],
  };
  return (
    <View style={gradientStyle}>
      {children}
    </View>
  );
};

// Importar LinearGradient de manera segura
const getGradientComponent = () => {
  try {
    const { LinearGradient } = require('expo-linear-gradient');
    return LinearGradient;
  } catch (error) {
    console.warn('expo-linear-gradient no está disponible, usando componente de respaldo');
    return GradientFallback;
  }
};

const GradientComponent = getGradientComponent();

const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
};

export default function RecipeStepsScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  
  const route = useRoute();
  const navigation = useNavigation();
  const recipe = (route.params as any)?.recipe as Recipe;

  useEffect(() => {
    if (recipe) {
      setCompletedSteps(new Array(recipe.instructions.length).fill(false));
    }
  }, [recipe]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev === null || prev <= 0) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      Alert.alert('¡Tiempo!', 'El temporizador ha terminado');
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60);
    setIsTimerRunning(true);
  };

  const toggleStepCompletion = (index: number) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró la receta</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <GradientComponent
        colors={['#FF6B6B', '#FF8E53']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paso a Paso</Text>
          <Text style={styles.stepIndicator}>
            Paso {currentStep + 1} de {recipe.instructions.length}
          </Text>
        </View>
      </GradientComponent>

      {/* Timer */}
      {timer !== null && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <TouchableOpacity 
            onPress={() => setIsTimerRunning(!isTimerRunning)}
            style={styles.timerButton}
          >
            <Ionicons 
              name={isTimerRunning ? 'pause' : 'play'} 
              size={24} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Steps */}
      <ScrollView style={styles.stepsContainer}>
        {recipe.instructions.map((instruction, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepCard,
              currentStep === index && styles.currentStep,
              completedSteps[index] && styles.completedStep
            ]}
            onPress={() => setCurrentStep(index)}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => toggleStepCompletion(index)}
              >
                <Ionicons
                  name={completedSteps[index] ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={24}
                  color={completedSteps[index] ? COLORS.secondary : COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.stepText}>{instruction}</Text>
            <View style={styles.stepActions}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => startTimer(5)}
              >
                <Ionicons name="timer-outline" size={20} color={COLORS.primary} />
                <Text style={styles.timerButtonText}>5 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => startTimer(10)}
              >
                <Ionicons name="timer-outline" size={20} color={COLORS.primary} />
                <Text style={styles.timerButtonText}>10 min</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentStep === 0 ? COLORS.textLight : COLORS.primary} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, currentStep === recipe.instructions.length - 1 && styles.navButtonDisabled]}
          onPress={() => setCurrentStep(prev => Math.min(recipe.instructions.length - 1, prev + 1))}
          disabled={currentStep === recipe.instructions.length - 1}
        >
          <Text style={[styles.navButtonText, currentStep === recipe.instructions.length - 1 && styles.navButtonTextDisabled]}>
            Siguiente
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={currentStep === recipe.instructions.length - 1 ? COLORS.textLight : COLORS.primary} 
          />
        </TouchableOpacity>
      </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.light,
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 16,
    color: COLORS.light,
    opacity: 0.9,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.light,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 16,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  timerButtonText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepsContainer: {
    flex: 1,
    padding: 16,
  },
  stepCard: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentStep: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  completedStep: {
    opacity: 0.7,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: COLORS.light,
    fontWeight: '700',
    fontSize: 16,
  },
  checkButton: {
    padding: 4,
  },
  stepText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  stepActions: {
    flexDirection: 'row',
    gap: 8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.light,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  navButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: COLORS.textLight,
  },
}); 