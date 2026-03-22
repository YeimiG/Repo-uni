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

const { width } = Dimensions.get('window');

const ServiciosScreen = ({ navigation, route }) => {
  // 1. Lógica de recuperación de ID (Doble vía para evitar el undefined)
  // Revisa en los parámetros directos o en los parámetros anidados del Navigator
  const idUsuario = route?.params?.idUsuario || route?.params?.params?.idUsuario;

  useEffect(() => {
    // Esto te ayudará a ver en la consola si el ID llegó correctamente
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBlue} />
      
      {/* Encabezado Estilizado */}
      <View style={[styles.header, { backgroundColor: Colors.primaryBlue }]}>
        <Text style={styles.headerTitle}>SERVICIOS</Text>
        <View style={styles.underline} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionLabel}>Gestión de Usuario</Text>
        
        {/* BOTÓN VER PERFIL */}
        <TouchableOpacity 
          style={styles.mainCard} 
          onPress={irAPerfil}
          activeOpacity={0.8}
        >
          <View style={[styles.iconBox, { backgroundColor: Colors.lightBlue }]}>
            <Text style={styles.iconEmoji}>👤</Text>
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Mi Perfil</Text>
            <Text style={styles.cardSubtitle}>Datos personales y académicos</Text>
          </View>
          <Text style={styles.chevron}>˃</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Académico</Text>

        {/* OTROS SERVICIOS (Ejemplos) */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.smallCard} 
            onPress={() => servicioProximamente("Notas")}
          >
            <Text style={styles.iconEmojiSmall}>📝</Text>
            <Text style={styles.smallCardTitle}>Notas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.smallCard} 
            onPress={() => servicioProximamente("Horarios")}
          >
            <Text style={styles.iconEmojiSmall}>📅</Text>
            <Text style={styles.smallCardTitle}>Horarios</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.mainCard} 
          onPress={() => servicioProximamente("Pagos")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.iconEmoji}>💳</Text>
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Estado de Cuenta</Text>
            <Text style={styles.cardSubtitle}>Consulta tus pagos y solvencias</Text>
          </View>
          <Text style={styles.chevron}>˃</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Identificador visual de sesión (Debug) */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>Usuario ID: {idUsuario || 'No identificado'}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  header: { 
    height: 150, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: '#000',
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
    color: '#A0A0A0',
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5,
    textTransform: 'uppercase'
  },
  mainCard: { 
    backgroundColor: 'white', 
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
    color: '#2D3436'
  },
  cardSubtitle: { 
    fontSize: 13, 
    color: '#636E72',
    marginTop: 2
  },
  chevron: {
    fontSize: 22,
    color: '#DFE6E9',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  smallCard: {
    backgroundColor: 'white',
    width: (width / 2) - 30,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconEmojiSmall: { fontSize: 30, marginBottom: 10 },
  smallCardTitle: { 
    fontWeight: 'bold', 
    color: '#2D3436' 
  },
  footerInfo: {
    padding: 10,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 10,
    color: '#B2BEC3'
  }
});

export default ServiciosScreen;