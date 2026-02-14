import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const ServiciosScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servicios</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.serviceCard}>
          <Text style={styles.cardHeader}>Perfil</Text>
          <Text style={styles.cardSub}>Ver el perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.primaryBlue, height: 120, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.black, marginTop: 30 },
  content: { flex: 1, padding: 20 },
  serviceCard: { backgroundColor: Colors.lightBlue, borderRadius: 20, padding: 25, width: '100%' },
  cardHeader: { fontSize: 20, fontWeight: 'bold' },
  cardSub: { fontSize: 14, color: '#555' }
});

export default ServiciosScreen;