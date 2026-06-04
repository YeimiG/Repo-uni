import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import API from '../services/api';
// 1. Importamos el hook de nuestro contexto global
import { useTheme } from '../context/ThemeContext';

const MateriasScreen = ({ navigation }) => {
  // Consumimos el estado y los colores dinámicos del Contexto
  const { isDarkMode, colors } = useTheme();

  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerMaterias();
  }, []);

  const obtenerMaterias = async () => {
    try {
      const raw = await AsyncStorage.getItem('usuario');
      if (!raw) return;

      const usuario = JSON.parse(raw);
      const idUsuario = usuario.idUsuario || usuario.idusuario;

      const response = await API.get(`/actuales/${idUsuario}`);

      if (response.data.success) {
        setMaterias(response.data.data.notas);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Cargando con fondo dinámico e indicador adaptable
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#81b0ff' : '#1565C0'}
        />
      </View>
    );
  }

  // 3. Renderizado de cada Tarjeta de Materia
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate('NotasDetalle', { materia: item })
      }
    >
      <View style={styles.leftSide}>
        <Text style={styles.icon}>📘</Text>
        <View style={{ flex: 1, paddingRight: 8 }}>
          {/* Título de la materia */}
          <Text style={[styles.nombre, { color: colors.text }]}>
            {item.materia_nombre}
          </Text>
          {/* Código de la materia */}
          <Text style={[styles.codigo, { color: colors.textSecondary }]}>
            {item.materia_codigo}
          </Text>
        </View>
      </View>

      {/* Nota / Promedio Dinámico */}
      <Text style={[styles.nota, { color: isDarkMode ? '#81b0ff' : '#1565C0' }]}>
        {item.promedio_actual || '0.0'}
      </Text>
    </TouchableOpacity>
  );

  return (
    // 4. Contenedor principal con fondo dinámico
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Título de la pantalla */}
      <Text style={[styles.titulo, { color: colors.text }]}>
        Mis Materias
      </Text>

      <FlatList
        data={materias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Sombras ligeras adaptadas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  icon: {
    fontSize: 28,
    marginRight: 12
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600'
  },
  codigo: {
    fontSize: 12,
    marginTop: 3
  },
  nota: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default MateriasScreen;