import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  NativeModules,
  Dimensions,
  requireNativeComponent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const { NativeCameraScanner } = NativeModules;
const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#2196F3',
  background: '#F7F9FC',
  text: '#2C363F',
  textLight: '#95A5A6',
  light: '#FFFFFF',
  border: 'rgba(0,0,0,0.1)',
  error: '#FF6B6B',
} as const;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ScannerScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const isFocused = useIsFocused();

  const initializeCamera = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        NativeCameraScanner.initializeScanner((error: string | null, success: boolean) => {
          if (error) {
            console.error('Error al inicializar la cámara:', error);
            Alert.alert('Error', error);
            setHasPermission(false);
          } else {
            setHasPermission(success);
            if (success) {
              handleStartScanning();
            }
          }
        });
      } else {
        Alert.alert('Plataforma no soportada', 'Esta función solo está disponible en iOS');
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error al inicializar la cámara:', error);
      Alert.alert('Error', 'No se pudo inicializar la cámara');
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      void initializeCamera();
    }

    return () => {
      if (Platform.OS === 'ios' && isScanning) {
        handleStopScanning();
      }
    };
  }, [isFocused]);

  const handleStartScanning = useCallback(() => {
    try {
      setIsScanning(true);
      if (Platform.OS === 'ios') {
        NativeCameraScanner.startScanning((error: string | null, barcode: string | null) => {
          if (error) {
            console.error('Error al escanear:', error);
            Alert.alert('Error', error);
            setIsScanning(false);
          } else if (barcode) {
            handleBarcodeDetected(barcode);
          }
        });
      }
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      Alert.alert('Error', 'No se pudo iniciar el escaneo');
      setIsScanning(false);
    }
  }, []);

  const handleStopScanning = useCallback(() => {
    try {
      if (Platform.OS === 'ios') {
        NativeCameraScanner.stopScanning();
      }
      setIsScanning(false);
    } catch (error) {
      console.error('Error al detener el escaneo:', error);
    }
  }, []);

  const handleBarcodeDetected = useCallback((barcode: string) => {
    handleStopScanning();
    navigation.navigate('ProductDetails', { barcode });
  }, [navigation]);

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>No hay acceso a la cámara</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={initializeCamera}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isScanning && styles.buttonScanning]}
        onPress={isScanning ? handleStopScanning : handleStartScanning}
        disabled={!hasPermission}
      >
        <MaterialIcons
          name={isScanning ? "stop" : "qr-code-scanner"}
          size={32}
          color={COLORS.light}
        />
      </TouchableOpacity>

      <Text style={styles.instructions}>
        {isScanning ? 'Escaneando...' : 'Presiona el botón para escanear'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: COLORS.light,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary,
  },
  button: {
    position: 'absolute',
    bottom: height * 0.1,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonScanning: {
    backgroundColor: COLORS.error,
  },
  retryButton: {
    marginTop: 16,
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
  text: {
    color: COLORS.light,
    fontSize: 16,
    textAlign: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: height * 0.05,
    alignSelf: 'center',
    color: COLORS.light,
    fontSize: 14,
    textAlign: 'center',
  },
});