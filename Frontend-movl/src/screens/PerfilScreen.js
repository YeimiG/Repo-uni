import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Colors } from '../constants/Colors';
import API from '../services/api';
// 1. Importamos el hook de nuestro contexto global
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const PerfilScreen = ({ route }) => {
  // Consumimos el estado y los colores dinámicos del Contexto
  const { isDarkMode, colors } = useTheme();

  const [idUsuario, setIdUsuario] = useState(route?.params?.idUsuario || null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolver = async () => {
      let id = idUsuario;
      if (!id) {
        try {
          const raw = await AsyncStorage.getItem('usuario');
          if (raw) {
            const u = JSON.parse(raw);
            id = u.idUsuario || u.idusuario;
            setIdUsuario(id);
          }
        } catch {}
      }
      if (id) obtenerDatos(id);
    };
    resolver();
  }, []);

  const obtenerDatos = async (id) => {
    try {
      setLoading(true);
      const response = await API.get(`/perfil/${id}`);
      if (response.data.success) setPerfil(response.data.perfil);
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de carga con fondo dinámico e indicador adaptable
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#81b0ff' : Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* El StatusBar cambia de estilo para contrastar con el fondo curvo */}
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? colors.background : Colors.primaryBlue} 
      />

      {/* Fondo curvo superior: Se oculta o cambia a un tono oscuro uniforme de noche */}
      <View style={[styles.upperDecoration, { backgroundColor: isDarkMode ? colors.card : Colors.primaryBlue }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? colors.text : Colors.black }]}>MI PERFIL</Text>
        </View>

        {/* TARJETA PRINCIPAL */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#000' : '#000' }]}>
          
          {/* Avatar con Iniciales (Borde dinámico para que no corte la tarjeta) */}
          <View style={[styles.avatarCircle, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue, borderColor: colors.card }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {perfil?.nombre?.charAt(0)}{perfil?.apellidos?.charAt(0)}
            </Text>
          </View>

          <View style={styles.infoWrapper}>

            {/* NOMBRE COMPLETO */}
            <View style={styles.dataGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>NOMBRE COMPLETO:</Text>
              <View style={[styles.valueContainer, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue }]}>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  {`${perfil?.nombre} ${perfil?.apellidos}`.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* N° EXPEDIENTE */}
            <View style={styles.dataGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>N° EXPEDIENTE:</Text>
              <View style={[styles.valueContainer, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue }]}>
                <Text style={[styles.valueText, { color: colors.text }]}>{perfil?.expediente || 'S/N'}</Text>
              </View>
            </View>

            {/* CARRERA */}
            <View style={styles.dataGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>CARRERA:</Text>
              <View style={[styles.valueContainer, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue }]}>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  {perfil?.nombreCarrera || perfil?.nombrecarrera || 'No especificada'}
                </Text>
              </View>
            </View>

            {/* CUM Y PROGRESO (Dos columnas) */}
            <View style={styles.row}>
              <View style={[styles.dataGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>CUM:</Text>
                <View style={[styles.valueContainer, { backgroundColor: isDarkMode ? '#3e3214' : '#FFF9C4' }]}>
                  <Text style={[styles.valueText, { color: isDarkMode ? '#ffd54f' : '#FBC02D' }]}>
                    {perfil?.cum || '0.00'}
                  </Text>
                </View>
              </View>

              <View style={[styles.dataGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>AVANCE:</Text>
                <View style={[styles.valueContainer, { backgroundColor: isDarkMode ? '#2d3748' : Colors.lightBlue }]}>
                  <Text style={[styles.valueText, { color: colors.text }]}>{perfil?.porcentajeAvance || 0}%</Text>
                </View>
              </View>
            </View>

            {/* BARRA DE PROGRESO VISUAL */}
            <View style={[styles.progressContainer, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' }]}>
              <View style={[styles.progressBar, { width: `${perfil?.porcentajeAvance || 0}%`, backgroundColor: isDarkMode ? '#81b0ff' : Colors.primaryBlue }]} />
            </View>

            {/* ESTADO ACADÉMICO */}
            <View style={styles.dataGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ESTADO:</Text>
              <View style={[styles.statusBadge, { borderColor: isDarkMode ? '#81b0ff' : Colors.primaryBlue }]}>
                <View style={[styles.dot, { backgroundColor: isDarkMode ? '#81b0ff' : Colors.primaryBlue }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>{perfil?.estadoAcademico || 'ACTIVO'}</Text>
              </View>
            </View>

          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>UNIVERSIDAD DE SONSONATE</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperDecoration: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 180,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 40
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  card: {
    borderRadius: 35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 12,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -45,
    borderWidth: 5,
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  infoWrapper: {
    width: '100%',
  },
  dataGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  valueContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressContainer: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 25,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});

export default PerfilScreen;