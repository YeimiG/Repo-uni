import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Importamos el hook de nuestro contexto global
import { useTheme } from '../context/ThemeContext';

export default function ConfiguracionScreen({ navigation }) {
  // 1. Consumimos el estado y los colores dinámicos del Contexto
  const { isDarkMode, toggleTheme, colors } = useTheme();
  
  // Estado local para las notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const toggleNotifications = () => setNotificationsEnabled(prevState => !prevState);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => navigation.replace('Login') // Redirige al Login reseteando el historial
        }
      ]
    );
  };

  // Componente interno reutilizable para las filas de opciones
  const SettingRow = ({ icon, title, description, type, value, onPress }) => {
    return (
      <View style={[styles.rowWrapper, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.row} 
          onPress={onPress} 
          disabled={type === 'switch'} 
        >
          {/* Icono de la opción */}
          <Ionicons 
            name={icon} 
            size={22} 
            color={isDarkMode ? colors.textSecondary : '#4a5568'} 
            style={styles.rowIcon} 
          />

          {/* Textos */}
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{title}</Text>
            {description && (
              <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                {description}
              </Text>
            )}
          </View>

          {/* Control derecho según el tipo */}
          {type === 'switch' && (
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={value ? '#2f95dc' : '#f4f3f4'}
              onValueChange={onPress}
              value={value}
            />
          )}

          {type === 'link' && (
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // 2. Aplicamos el color de fondo dinámico a toda la pantalla
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* SECCIÓN: CUENTA */}
        <Text style={styles.sectionHeader}>Cuenta</Text>
        
        <SettingRow 
          icon="person-outline"
          title="Editar Perfil" 
          type="link" 
          onPress={() => navigation.navigate('Perfil')} // Navega a la pantalla Perfil de tu Stack
        />
        <SettingRow 
          icon="lock-closed-outline"
          title="Cambiar Contraseña" 
          type="link" 
          onPress={() => Alert.alert("Seguridad", "Abrir modal de contraseña")} 
        />

        {/* SECCIÓN: PREFERENCIAS */}
        <Text style={styles.sectionHeader}>Preferencias</Text>
        
        <SettingRow 
          icon="notifications-outline"
          title="Notificaciones Push" 
          description="Alertas de notas y servicios"
          type="switch" 
          value={notificationsEnabled}
          onPress={toggleNotifications} 
        />
        
        {/* Aquí es donde ocurre la magia del cambio de tema */}
        <SettingRow 
          icon="moon-outline"
          title="Modo Oscuro" 
          type="switch" 
          value={isDarkMode}
          onPress={toggleTheme} 
        />

        {/* SECCIÓN: SOPORTE */}
        <Text style={styles.sectionHeader}>Soporte</Text>
        
        <SettingRow 
          icon="information-circle-outline"
          title="Centro de Ayuda" 
          type="link" 
          onPress={() => Alert.alert("Soporte", "Contacto de soporte técnico")} 
        />

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: isDarkMode ? '#333' : '#ffebee' }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#d32f2f" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Versión 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 4,
  },
  rowWrapper: {
    borderRadius: 12,
    marginBottom: 8,
    // Sombras ligeras para dar efecto de tarjeta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    marginTop: 32,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoutText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  }
});