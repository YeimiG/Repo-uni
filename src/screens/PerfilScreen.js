import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import API from '../services/api';

const PerfilScreen = ({ route }) => {
  const { idEstudiante } = route.params;
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatosPerfil = async () => {
      try {
        // Asegúrate de que esta ruta existe en tu backend (estudianteRoutes.js)
        const response = await API.get(`/estudiantes/perfil/${idEstudiante}`);
        setPerfil(response.data);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del perfil");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatosPerfil();
  }, [idEstudiante]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Información del Estudiante</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Expediente (Carnet)</Text>
          <Text style={styles.value}>{perfil?.expediente}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre Completo</Text>
          <Text style={styles.value}>{`${perfil?.nombre} ${perfil?.apellidos}`}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Correo Institucional</Text>
          <Text style={styles.value}>{perfil?.correo}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Carrera</Text>
          <Text style={styles.value}>{perfil?.nombrecarrera}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estado Académico</Text>
          <Text style={styles.value}>{perfil?.estadoacademico || 'Activo'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 3 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#003366', textAlign: 'center' },
  field: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', pb: 5 },
  label: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  value: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 }
});

export default PerfilScreen;