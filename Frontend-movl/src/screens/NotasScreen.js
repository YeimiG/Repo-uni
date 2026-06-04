import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const NotasScreen = ({ route }) => {

  const { materia } = route.params;

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <Text style={styles.titulo}>
          Detalle de Notas
        </Text>

        <View style={styles.card}>

          <Text style={styles.tituloMateria}>
            📘 {materia.materia_nombre}
          </Text>

          <View style={styles.fila}>
            <Text>Primer Parcial</Text>
            <Text>{materia.nota1 || '0.0'}</Text>
          </View>

          <View style={styles.fila}>
            <Text>Primer Laboratorio</Text>
            <Text>{materia.nota2 || '0.0'}</Text>
          </View>

          <View style={styles.fila}>
            <Text>Segundo Parcial</Text>
            <Text>{materia.nota3 || '0.0'}</Text>
          </View>

          <View style={styles.fila}>
            <Text>Segundo Laboratorio</Text>
            <Text>{materia.nota4 || '0.0'}</Text>
          </View>

          <View style={styles.fila}>
            <Text>Examen Final</Text>
            <Text>{materia.nota5 || '0.0'}</Text>
          </View>

          <View style={styles.linea} />

          <View style={styles.fila}>
            <Text style={styles.finalLabel}>
              Promedio Final
            </Text>

            <Text style={styles.finalValor}>
              {materia.promedio_actual || '0.0'}
            </Text>
          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 15
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4
  },

  tituloMateria: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25
  },

  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },

  linea: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 15
  },

  finalLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  finalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0'
  }

});

export default NotasScreen;