# 📱 App Móvil IEPROES - React Native + Expo

Aplicación móvil desarrollada con React Native y Expo para estudiantes y catedráticos del sistema académico IEPROES.

## 📋 Descripción

App nativa multiplataforma que permite a estudiantes consultar sus notas y a catedráticos gestionar calificaciones desde dispositivos móviles.

## 🛠️ Tecnologías

- **React Native** 0.81.5 - Framework para apps nativas
- **Expo** 54.0.0 - Plataforma de desarrollo
- **React Navigation** 7.x - Navegación entre pantallas
- **Axios** 1.13.2 - Cliente HTTP para API
- **Expo Router** 6.0.21 - Enrutamiento basado en archivos
- **React Native Vector Icons** 10.3.0 - Iconografía

## ⚡ Instalación y Configuración

### 1️⃣ Prerrequisitos
```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Verificar instalación
expo --version
```

### 2️⃣ Instalar dependencias
```bash
# Desde la raíz del proyecto
npm install
```

### 3️⃣ Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
# API Backend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=IEPROES Mobile

# Configuración de desarrollo
EXPO_PUBLIC_ENV=development
```

### 4️⃣ Ejecutar la aplicación

#### Modo desarrollo:
```bash
npm start
# o
npx expo start
```

#### Plataformas específicas:
```bash
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar en navegador web
```

## 📱 Dispositivos Soportados

### 📱 Android
- **Versión mínima**: Android 6.0 (API 23)
- **Versión recomendada**: Android 8.0+ (API 26+)
- **Arquitecturas**: ARM64, ARMv7

### 🍎 iOS
- **Versión mínima**: iOS 13.0
- **Versión recomendada**: iOS 15.0+
- **Dispositivos**: iPhone 6s en adelante, iPad Air 2 en adelante

### 🌐 Web (PWA)
- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Responsive**: Adaptable a tablets y móviles

## 🎯 Funcionalidades por Rol

### 👨🎓 Estudiantes
- **🔐 Login** - Autenticación segura
- **📊 Consulta de Notas** - Visualización de calificaciones por materia
- **📚 Materias Inscritas** - Lista de cursos actuales
- **👤 Perfil Personal** - Información y configuración
- **📈 Historial Académico** - Rendimiento histórico
- **🔔 Notificaciones** - Alertas de nuevas notas

### 👨🏫 Catedráticos
- **🔐 Login** - Acceso con credenciales
- **📝 Ingreso de Notas** - Calificación de estudiantes
- **📚 Mis Materias** - Materias asignadas
- **👥 Lista de Estudiantes** - Por materia
- **📊 Estadísticas** - Rendimiento por curso
- **🔔 Notificaciones** - Recordatorios y alertas

## 🗂️ Estructura del Proyecto

```
src/
├── constants/
│   └── Colors.js             # Paleta de colores
├── navigation/
│   └── AppNavigator.js       # Configuración de navegación
├── screens/
│   ├── LoginScreen.js        # Pantalla de login
│   ├── NotasScreen.js        # Consulta de notas
│   ├── PerfilScreen.js       # Perfil de usuario
│   └── ServiciosScreen.js    # Servicios disponibles
└── services/
    ├── api.js                # Configuración de Axios
    ├── estudiantes.js        # Servicios de estudiantes
    └── login.js              # Servicios de autenticación
```

## 🧭 Navegación de la App

### Stack Principal
```
App Navigator
├── Login Screen              # Pantalla inicial
├── Tab Navigator            # Navegación por pestañas
│   ├── Notas Tab           # Consulta de calificaciones
│   ├── Servicios Tab       # Servicios académicos
│   └── Perfil Tab          # Información personal
└── Modal Screens           # Pantallas modales
```

### Flujo de Navegación
1. **Login** → Autenticación
2. **Home/Notas** → Pantalla principal
3. **Servicios** → Funcionalidades adicionales
4. **Perfil** → Configuración y datos personales

## 🎨 Diseño y UI

### Paleta de Colores (Colors.js)
```javascript
export const Colors = {
  primary: '#2E86AB',      // Azul principal
  secondary: '#A23B72',    // Rosa secundario
  accent: '#F18F01',       // Naranja de acento
  background: '#F5F5F5',   // Fondo gris claro
  surface: '#FFFFFF',      // Superficie blanca
  text: '#333333',         // Texto principal
  textSecondary: '#666666', // Texto secundario
  success: '#4CAF50',      // Verde éxito
  warning: '#FF9800',      // Naranja advertencia
  error: '#F44336',        // Rojo error
};
```

### Componentes de UI
- **Cards** - Tarjetas de información
- **Buttons** - Botones personalizados
- **Forms** - Formularios estilizados
- **Lists** - Listas de datos
- **Headers** - Encabezados de pantalla

## 🔌 Integración con API

### Configuración Base (services/api.js)
```javascript
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tokens
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Servicios Principales

#### Login (services/login.js)
```javascript
import api from './api';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### Estudiantes (services/estudiantes.js)
```javascript
import api from './api';

export const getNotasEstudiante = async (estudianteId) => {
  try {
    const response = await api.get(`/api/estudiantes/${estudianteId}/notas`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMateriasEstudiante = async (estudianteId) => {
  try {
    const response = await api.get(`/api/estudiantes/${estudianteId}/materias`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## 📱 Pantallas Principales

### 🔐 LoginScreen.js
- Formulario de autenticación
- Validación de credenciales
- Redirección según rol
- Manejo de errores

### 📊 NotasScreen.js
- Lista de materias con notas
- Filtros por período
- Detalles de calificaciones
- Gráficos de rendimiento

### 👤 PerfilScreen.js
- Información personal
- Configuración de cuenta
- Cambio de contraseña
- Cerrar sesión

### 🛠️ ServiciosScreen.js
- Servicios académicos disponibles
- Enlaces a funcionalidades
- Información institucional

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo DevTools
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en navegador

# Construcción
expo build:android    # Build para Android
expo build:ios       # Build para iOS

# Utilidades
npm run lint         # Ejecutar linter
expo doctor         # Diagnosticar problemas
```

## 📦 Dependencias Principales

### Navegación
```json
{
  "@react-navigation/native": "^7.1.26",
  "@react-navigation/bottom-tabs": "^7.9.0",
  "@react-navigation/stack": "^7.6.13"
}
```

### UI y Estilos
```json
{
  "@expo/vector-icons": "^15.0.3",
  "react-native-vector-icons": "^10.3.0",
  "expo-haptics": "~15.0.8"
}
```

### Funcionalidades
```json
{
  "axios": "^1.13.2",
  "expo-constants": "~18.0.12",
  "expo-linking": "~8.0.11"
}
```

## 🔄 Estados de la App

### Gestión de Estado
```javascript
// Context para autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    // Lógica de login
  };

  const logout = () => {
    // Lógica de logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🐛 Solución de Problemas

### Error de conexión con API:
```bash
# Verificar URL de API en .env
echo $EXPO_PUBLIC_API_URL

# Probar conexión
curl http://localhost:3000/api/health
```

### Problemas con Expo:
```bash
# Limpiar caché
expo r -c

# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Errores de build:
```bash
# Verificar configuración
expo doctor

# Limpiar build
expo build:android --clear-cache
```

## 📱 Testing en Dispositivos

### Expo Go (Desarrollo)
1. Instalar Expo Go desde App Store/Play Store
2. Escanear QR code desde `expo start`
3. La app se carga automáticamente

### Build de Desarrollo
```bash
# Android APK
expo build:android -t apk

# iOS (requiere cuenta de desarrollador)
expo build:ios -t simulator
```

## 🚀 Deployment

### Android (Google Play)
```bash
# Build para producción
expo build:android -t app-bundle

# Subir a Google Play Console
```

### iOS (App Store)
```bash
# Build para producción
expo build:ios -t archive

# Subir a App Store Connect
```

## 🔄 Actualizaciones Futuras

- [ ] Implementar notificaciones push
- [ ] Modo offline con AsyncStorage
- [ ] Biometría para login
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests con Jest y Detox
- [ ] CodePush para actualizaciones OTA

## 📞 Soporte

Para problemas específicos de la app móvil:
- 📧 Email: mobile@ieproes.edu
- 📱 Slack: #mobile-support

---

**📱 Desarrollado para IEPROES - App Móvil v1.0.0**