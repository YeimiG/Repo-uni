import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../services/api';

const PerfilScreen = ({ route }) => {
  const { idUsuario } = route.params; 
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("🔍 Intentando conectar con ID:", idUsuario);

  if (!idUsuario) {
    console.log("⚠️ ID es undefined, la navegación falló.");
    return;
  }

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/perfil/${idUsuario}`);
      if (response.data.success) {
        setPerfil(response.data.perfil);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  obtenerDatos();
}, [idUsuario]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#003366" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Información Académica</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{`${perfil?.nombre} ${perfil?.apellidos}`}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Carnet / Expediente</Text>
            <Text style={styles.value}>{perfil?.expediente}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Carrera</Text>
            {/* Validamos minúsculas y mayúsculas de Postgres */}
            <Text style={styles.value}>{perfil?.nombreCarrera || perfil?.nombrecarrera}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>{perfil?.estadoAcademico || perfil?.estadoacademico}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 25, color: '#003366', textAlign: 'center' },
  field: { marginBottom: 18, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  label: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 17, fontWeight: '600', color: '#222', marginTop: 4 }
});

export default PerfilScreen;