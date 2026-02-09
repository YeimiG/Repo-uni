import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
// CAMBIO: Ahora importamos TU servicio específico para la App
import { loginEstudiante } from '../services/authApp';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validación básica antes de llamar al servidor
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      // Llamamos a tu nuevo servicio independiente
      const data = await loginEstudiante(email, password);
      
      if (data.success) {
        // Obtenemos el idUsuario del objeto usuario que devuelve tu controlador
        const idUsuario = data.usuario.idUsuario;

        // Navegamos pasando el idUsuario para que la pantalla de Perfil 
        // pueda buscar los datos en academico.Estudiante
        navigation.navigate('MainTabs', { 
          screen: 'Principal', 
          params: { idUsuario: idUsuario } 
        });
      }
    } catch (error) {
      // Si el backend devuelve un error (como "Credenciales incorrectas")
      Alert.alert("Error de Inicio de Sesión", error.message || "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle} />
        <Text style={styles.brandText}>IEPROES</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.cardTitle}>Inicia sesión</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ejemplo@ieproes.edu.sv" 
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            placeholder="********"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue || '#0047AB', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 80, marginBottom: 40 },
  circle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', marginRight: 15 },
  brandText: { fontSize: 35, fontWeight: 'bold', color: 'black' },
  loginCard: { backgroundColor: 'white', width: '85%', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 5 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: Colors.lightBlue || '#E3F2FD', borderRadius: 12, height: 45, paddingHorizontal: 15 },
  button: { backgroundColor: Colors.primaryBlue || '#0047AB', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15, marginTop: 20 },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: 'white' }
});

export default LoginScreen;