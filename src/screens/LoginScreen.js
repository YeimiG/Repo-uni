import { useState } from 'react'; // 1. Agregamos useState
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { login } from '../services/login'; // 2. Importamos tu servicio de login

const LoginScreen = ({ navigation }) => {
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar un cargando

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      // Asegúrate de enviar 'correo' y 'clave' como pide tu DB
      const data = await login(email, password);

      // REVISIÓN AQUÍ: Mira cómo se llama el objeto en la respuesta de Postman
      // Si en Postman sale "usuario", usa data.usuario.nombre
      // Si sale "estudiante", usa data.estudiante.nombre
      const nombreUsuario = data.usuario ? data.usuario.nombre : data.estudiante.nombre;

      Alert.alert("Bienvenido", `Hola, ${nombreUsuario}`);
      navigation.navigate('MainTabs');

    } catch (error) {
      Alert.alert("Error de inicio de sesión", error.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <View style={styles.circle} />
        </View>
        <Text style={styles.brandText}>IEPROES</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.cardTitle}>Inicia sesión</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@ieproes.edu.sv"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)} // Captura el texto
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)} // Captura el texto
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin} // Ejecuta la función funcional
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.black} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
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