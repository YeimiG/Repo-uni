import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { login } from '../services/login';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  try {
    const data = await login(email, password);
    
    // Extraemos el idestudiante (que ahora vale 1 para tu prueba)
    const idEstudiante = data.usuario.idestudiante;

    if (idEstudiante) {
      navigation.navigate('MainTabs', { 
        screen: 'Principal', 
        params: { idEstudiante: idEstudiante } 
      });
    } else {
      Alert.alert("Error", "Este usuario no tiene un perfil de estudiante asignado");
    }
  } catch (error) {
    Alert.alert("Error", error);
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
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (tus estilos se mantienen iguales)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 80, marginBottom: 40 },
  circle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', marginRight: 15 },
  brandText: { fontSize: 35, fontWeight: 'bold', color: 'black' },
  loginCard: { backgroundColor: 'white', width: '85%', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 5 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: Colors.lightBlue, borderRadius: 12, height: 45, paddingHorizontal: 15 },
  button: { backgroundColor: Colors.primaryBlue, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15, marginTop: 20 },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: 'white' }
});

export default LoginScreen;