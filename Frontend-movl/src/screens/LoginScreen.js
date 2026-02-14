import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { loginEstudiante } from '../services/loginApp'; //

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!correo || !clave) {
    Alert.alert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
    return;
  }

  setLoading(true);
  try {
    const data = await loginEstudiante(correo, clave);
    
    // Si la API responde con éxito, navegamos a la pantalla de Servicios
    // Asegúrate de que 'MainTabs' o 'Servicios' sea el nombre en tu AppNavigator
    navigation.replace('MainTabs'); 

  } catch (error) {
    Alert.alert("Error de Inicio", error.message || "Credenciales inválidas");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
         
        </View>
        <Text style={styles.brandText}>IEPROES</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inicia sesión</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo institucional</Text>
          <TextInput 
            style={styles.input} 
            value={correo} 
            onChangeText={setCorreo}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            value={clave} 
            onChangeText={setClave}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Entrar</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logo: { width: 50, height: 50, resizeMode: 'contain' },
  brandText: { fontSize: 42, fontWeight: 'bold', color: Colors.black },
  card: { backgroundColor: Colors.white, width: '85%', borderRadius: 25, padding: 30, alignItems: 'center' },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: Colors.lightBlue, borderRadius: 10, padding: 12, fontSize: 16 },
  loginBtn: { backgroundColor: Colors.primaryBlue, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 40, marginTop: 10 },
  btnText: { color: Colors.black, fontWeight: 'bold', fontSize: 18 }
});

export default LoginScreen;