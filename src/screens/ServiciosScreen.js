import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ServiciosScreen = ({ navigation, route }) => {
  // Extraemos el ID que el Login inyectó en los parámetros de la ruta
  const idEstudiante = route.params?.idEstudiante;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>Servicios</Text>
      </View>
      <View style={styles.whiteContent}>
        <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => navigation.navigate('Perfil', { idEstudiante })}
        >
          <Text style={styles.serviceTitle}>Perfil</Text>
          <Text style={styles.serviceSubtitle}>Ver mi información académica</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// ... (tus estilos)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue },
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
    backgroundColor: Colors.lightBlue, 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 20 
  },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: Colors.primaryBlue },
  serviceSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 }
});

export default ServiciosScreen;