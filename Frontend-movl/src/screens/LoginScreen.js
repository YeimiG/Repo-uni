import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { loginEstudiante } from '../services/loginApp';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    const data = await loginEstudiante(correo, clave);
    
    if (data.success && data.usuario) {
      // Capturamos el ID y el nombre (usando variaciones por si acaso)
      const idUsuario = data.usuario.idUsuario || data.usuario.idusuario || 21;
      const nombreUsuario = data.usuario.nombre || data.usuario.Nombre || "Estudiante";

      console.log(`✅ Bienvenido ${nombreUsuario}, ID: ${idUsuario}`);

navigation.replace('MainTabs', { idUsuario: idUsuario });

    }
  } catch (error) {
    Alert.alert("Error", "Credenciales incorrectas");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado con Logo */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          {/* Aquí puedes descomentar la imagen si tienes el archivo */}
          {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
          <Text style={{ fontSize: 20 }}>🎓</Text>
        </View>
        <Text style={styles.brandText}>IEPROES</Text>
      </View>

      {/* Tarjeta de Login */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inicia sesión</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo institucional</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ejemplo@uni.edu.sv"
            value={correo} 
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            placeholder="********"
            secureTextEntry 
            value={clave} 
            onChangeText={setClave}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.black} />
          ) : (
            <Text style={styles.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.primaryBlue || '#0047AB', // Color de tu paleta
    alignItems: 'center' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 80, 
    marginBottom: 40 
  },
  logoCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  brandText: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: Colors.black || '#000' 
  },
  card: { 
    backgroundColor: 'white', 
    width: '85%', 
    borderRadius: 25, 
    padding: 30, 
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  inputGroup: { 
    width: '100%', 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 5,
    color: '#333'
  },
  input: { 
    backgroundColor: '#F0F5FF', // Azul muy claro
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16 
  },
  loginBtn: { 
    backgroundColor: Colors.primaryBlue || '#0047AB', 
    borderRadius: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  btnText: { 
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: 18 
  }
});

export default LoginScreen;