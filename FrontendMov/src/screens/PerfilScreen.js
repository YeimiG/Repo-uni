import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { obtenerDatosPerfil } from '../services/perfilApp';

const PerfilScreen = ({ route }) => {
  const { idUsuario } = route.params; // Viene desde ServiciosScreen
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarInformacion = async () => {
      try {
        const data = await obtenerDatosPerfil(idUsuario);
        if (data.success) {
          setPerfil(data.perfil);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    cargarInformacion();
  }, [idUsuario]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Mi Perfil Académico</Text>
        
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Nombre Completo:</Text>
          <Text style={styles.value}>{perfil?.nombre} {perfil?.apellidos}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Expediente / Carnet:</Text>
          <Text style={styles.value}>{perfil?.expediente}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Carrera:</Text>
          <Text style={styles.value}>{perfil?.nombrecarrera}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primaryBlue, marginBottom: 20, textAlign: 'center' },
  infoGroup: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', pb: 10 },
  label: { fontSize: 14, color: '#666', fontWeight: '600' },
  value: { fontSize: 18, color: '#333', marginTop: 5 }
});

export default PerfilScreen;