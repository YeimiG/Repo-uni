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
import API from '../services/api';
// Importación desde tu carpeta de constantes
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const PerfilScreen = ({ route }) => {
  const { idUsuario } = route.params;
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idUsuario) return;

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primaryBlue} />

      {/* Fondo curvo superior */}
      <View style={[styles.upperDecoration, { backgroundColor: Colors.primaryBlue }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MI PERFIL</Text>
        </View>

        <View style={styles.card}>
          {/* Avatar con Iniciales */}
          <View style={[styles.avatarCircle, { backgroundColor: Colors.lightBlue }]}>
            <Text style={[styles.avatarText, { color: Colors.black }]}>
              {perfil?.nombre?.charAt(0)}{perfil?.apellidos?.charAt(0)}
            </Text>
          </View>

          <View style={styles.infoWrapper}>

            {/* NOMBRE COMPLETO */}
            <View style={styles.dataGroup}>
              <Text style={styles.label}>NOMBRE COMPLETO:</Text>
              <View style={[styles.valueContainer, { backgroundColor: Colors.lightBlue }]}>
                <Text style={styles.valueText}>
                  {`${perfil?.nombre} ${perfil?.apellidos}`.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* N° EXPEDIENTE */}
            <View style={styles.dataGroup}>
              <Text style={styles.label}>N° EXPEDIENTE:</Text>
              <View style={[styles.valueContainer, { backgroundColor: Colors.lightBlue }]}>
                <Text style={styles.valueText}>{perfil?.expediente || 'S/N'}</Text>
              </View>
            </View>

            {/* CARRERA */}
            <View style={styles.dataGroup}>
              <Text style={styles.label}>CARRERA:</Text>
              <View style={[styles.valueContainer, { backgroundColor: Colors.lightBlue }]}>
                <Text style={styles.valueText}>
                  {perfil?.nombreCarrera || perfil?.nombrecarrera || 'No especificada'}
                </Text>
              </View>
            </View>

         

            {/* CUM Y PROGRESO (Dos columnas) */}
            <View style={styles.row}>
              <View style={[styles.dataGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>CUM:</Text>
                <View style={[styles.valueContainer, { backgroundColor: '#FFF9C4' }]}>
                  <Text style={[styles.valueText, { color: '#FBC02D' }]}>
                    {perfil?.cum || '0.00'}
                  </Text>
                </View>
              </View>

              <View style={[styles.dataGroup, { flex: 1 }]}>
                <Text style={styles.label}>AVANCE:</Text>
                <View style={[styles.valueContainer, { backgroundColor: Colors.lightBlue }]}>
                  <Text style={styles.valueText}>{perfil?.porcentajeAvance || 0}%</Text>
                </View>
              </View>
            </View>

            {/* BARRA DE PROGRESO VISUAL */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${perfil?.porcentajeAvance || 0}%`, backgroundColor: Colors.primaryBlue }]} />
            </View>

            {/* ESTADO ACADÉMICO */}
            <View style={styles.dataGroup}>
              <Text style={styles.label}>ESTADO:</Text>
              <View style={[styles.statusBadge, { borderColor: Colors.primaryBlue }]}>
                <View style={[styles.dot, { backgroundColor: Colors.primaryBlue }]} />
                <Text style={styles.statusText}>{perfil?.estadoAcademico || 'ACTIVO'}</Text>
              </View>
            </View>

          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>UNIVERSIDAD DE SONSONATE</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2'
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
    color: Colors.black,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
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
    marginTop: -45, // Mitad del círculo sobresale
    borderWidth: 5,
    borderColor: Colors.white,
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
    color: '#666',
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
    color: Colors.black,
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
    color: Colors.black,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
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
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 25, // Un poco de espacio antes del estado
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});


export default PerfilScreen;