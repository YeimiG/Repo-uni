import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

const NotasScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>Notas</Text>
      </View>
      <View style={styles.whiteContent}>
        <View style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>Ciclo 01/2026</Text>
            <Text style={styles.serviceSubtitle}>Ingles</Text>
            <Text style={styles.serviceSubtitle}>Matemática l</Text>
            <Text style={styles.serviceSubtitle}>Desarrollo</Text>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue },
  blueHeader: { height: 100, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  whiteContent: { 
    flex: 1, 
    backgroundColor: Colors.white, 
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
  serviceTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  serviceSubtitle: { fontSize: 15, color: '#0b0909ff', textAlign: 'left' }
});

export default NotasScreen;