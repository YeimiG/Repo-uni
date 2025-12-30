import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
            {/* Reemplaza con <Image source={require('../../assets/logo.png')} /> */}
            <View style={styles.circle} /> 
        </View>
        <Text style={styles.brandText}>IEPROES</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.cardTitle}>Inicia sesión</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput style={styles.input} placeholder="ejemplo@ieproes.edu.sv" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput style={styles.input} secureTextEntry={true} />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 80, marginBottom: 40 },
  circle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', marginRight: 15 },
  brandText: { fontSize: 35, fontWeight: 'bold', color: Colors.black },
  loginCard: { 
    backgroundColor: Colors.white, 
    width: '85%', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: Colors.lightBlue, borderRadius: 12, height: 45, paddingHorizontal: 15 },
  button: { backgroundColor: Colors.primaryBlue, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15, marginTop: 20 },
  buttonText: { fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;