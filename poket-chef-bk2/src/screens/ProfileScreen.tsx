import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const renderSettingItem = (
    icon: string,
    title: string,
    value?: boolean,
    onValueChange?: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#007AFF" style={styles.icon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {onValueChange ? (
        <Switch value={value} onValueChange={onValueChange} />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.name}>Juan Silva</Text>
        <Text style={styles.email}>juan.silva@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        {renderSettingItem(
          'mic',
          'Comandos de voz',
          voiceEnabled,
          setVoiceEnabled
        )}
        {renderSettingItem(
          'moon',
          'Modo oscuro',
          darkMode,
          setDarkMode
        )}
        {renderSettingItem(
          'notifications',
          'Notificaciones',
          notifications,
          setNotifications
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        {renderSettingItem('person', 'Editar perfil')}
        {renderSettingItem('lock-closed', 'Cambiar contraseña')}
        {renderSettingItem('language', 'Idioma')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Otros</Text>
        {renderSettingItem('help-circle', 'Ayuda y soporte')}
        {renderSettingItem('information-circle', 'Acerca de')}
        {renderSettingItem('log-out', 'Cerrar sesión')}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
}); 