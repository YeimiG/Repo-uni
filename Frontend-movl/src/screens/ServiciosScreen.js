import { useEffect } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/Colors';
// 1. Importamos el hook de nuestro contexto global
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ServiciosScreen = ({ navigation, route }) => {
  // Consumimos el estado y los colores dinámicos del Contexto
  const { isDarkMode, colors } = useTheme();

  const idUsuario = route?.params?.idUsuario || route?.params?.params?.idUsuario;

  useEffect(() => {
    console.log("📌 ID de Usuario detectado en Servicios:", idUsuario);
  }, [idUsuario]);

  const irAPerfil = () => {
    if (idUsuario) {
      navigation.navigate('Perfil', { idUsuario });
    } else {
      Alert.alert(
        "Sesión no detectada", 
        "No pudimos encontrar tu identificador de usuario. Intenta reiniciar la aplicación."
      );
    }
  };

  const servicioProximamente = (nombre) => {
    Alert.alert("Módulo en Desarrollo", `El servicio de ${nombre} estará disponible en la próxima actualización.`);
  };

  return (
    // 2. Fondo general dinámico
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* El StatusBar cambia el color de los iconos de la barra según el modo */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? colors.background : Colors.primaryBlue} 
      />
      
      {/* Encabezado: Se mantiene azul o pasa a un color oscuro armónico en modo noche */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? colors.card : Colors.primaryBlue }]}>
        <Text style={styles.headerTitle}>SERVICIOS</Text>
        <View style={styles.underline} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Etiqueta de la sección dinámica */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Gestión de Usuario</Text>
        
        {/* BOTÓN VER PERFIL CON FONDO DINÁMICO */}
        <TouchableOpacity 
          style={[styles.mainCard, { backgroundColor: colors.card }]} 
          onPress={irAPerfil}
          activeOpacity={0.8}
        >
          {/* El contenedor del emoji se adapta ligeramente en modo oscuro */}
          <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue }]}>
            <Text style={styles.iconEmoji}>👤</Text>
          </View>
          
          <View style={styles.cardTextContent}>
            {/* Títulos y subtítulos con textos dinámicos */}
            <Text style={[styles.cardTitle, { color: colors.text }]}>Mi Perfil</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Datos personales y académicos
            </Text>
          </View>
          
          <Text style={[styles.chevron, { color: colors.textSecondary }]}>˃</Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: { 
    height: 150, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: '#323236',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: 'white',
    letterSpacing: 3,
    marginTop: 20
  },
  underline: {
    width: 50,
    height: 4,
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 2
  },
  scrollContent: { 
    padding: 20,
    paddingTop: 30 
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5,
    textTransform: 'uppercase'
  },
  mainCard: { 
    borderRadius: 20, 
    padding: 18, 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  iconEmoji: { fontSize: 26 },
  cardTextContent: { flex: 1 },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  cardSubtitle: { 
    fontSize: 13, 
    marginTop: 2
  },
  chevron: {
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default ServiciosScreen;