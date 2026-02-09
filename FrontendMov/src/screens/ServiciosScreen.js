import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ServiciosScreen = ({ navigation, route }) => {
  // CAMBIO: Ahora recibimos idUsuario, que es el enlace universal en tu BD
  const idUsuario = route.params?.idUsuario;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>Servicios</Text>
      </View>
      
      <View style={styles.whiteContent}>
        {/* Botón de Perfil */}
        <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => navigation.navigate('Perfil', { idUsuario })}
        >
          <Text style={styles.serviceTitle}>Perfil</Text>
          <Text style={styles.serviceSubtitle}>Ver mi información académica</Text>
        </TouchableOpacity>

        {/* Botón de Inscripción (Para el futuro) */}
        <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => navigation.navigate('Inscripcion', { idUsuario })}
        >
          <Text style={styles.serviceTitle}>Inscripción</Text>
          <Text style={styles.serviceSubtitle}>Inscribir materias del ciclo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue || '#0047AB' },
  blueHeader: { height: 100, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  whiteContent: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    padding: 20 
  },
  serviceItem: { 
    backgroundColor: Colors.lightBlue || '#E3F2FD', 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 20 
  },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: Colors.primaryBlue || '#0047AB' },
  serviceSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 }
});

export default ServiciosScreen;