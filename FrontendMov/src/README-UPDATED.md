# 📱 App Móvil - Sistema Universitario de Inscripción

Aplicación móvil multiplataforma desarrollada con React Native y Expo para estudiantes y profesores del sistema universitario de inscripciones y progreso académico.

## 📋 Descripción

App nativa que permite a estudiantes realizar inscripciones, consultar progreso académico y gestionar su vida universitaria desde dispositivos móviles, con funcionalidades específicas para profesores y capacidades futuras de pagos en línea.

## 🛠️ Tecnologías

- **React Native** 0.72+ - Framework multiplataforma
- **Expo** 49+ - Plataforma de desarrollo y deployment
- **TypeScript** 4.9+ - JavaScript tipado
- **React Navigation** 6+ - Navegación nativa
- **Expo Router** - Enrutamiento basado en archivos
- **React Native Paper** 5+ - Componentes Material Design
- **React Query** 4+ - Gestión de estado del servidor
- **Expo Notifications** - Notificaciones push
- **Expo SecureStore** - Almacenamiento seguro
- **React Hook Form** - Manejo de formularios

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
```bash
cp .env.example .env
```

```env
# API Backend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=Sistema Universitario

# Configuración
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_VERSION=1.0.0

# Notificaciones (Expo)
EXPO_PUBLIC_PROJECT_ID=tu-project-id-expo
```

### 4️⃣ Ejecutar la aplicación
```bash
# Iniciar Expo DevTools
npm start
# o
npx expo start

# Plataformas específicas
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

## 📱 Dispositivos Soportados

### 📱 Android
- **Versión mínima**: Android 6.0 (API 23)
- **Versión recomendada**: Android 8.0+ (API 26+)
- **Arquitecturas**: ARM64, ARMv7, x86_64

### 🍎 iOS
- **Versión mínima**: iOS 13.0
- **Versión recomendada**: iOS 15.0+
- **Dispositivos**: iPhone 7 en adelante, iPad (6ta gen) en adelante

### 🌐 Web (PWA)
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Funcionalidades**: Responsive design, offline básico

## 🎯 Funcionalidades por Rol

### 👨🎓 Estudiantes
- **🔐 Autenticación Biométrica** - Login con huella/Face ID
- **📝 Inscripción de Materias** - Proceso intuitivo paso a paso
- **📊 Progreso Académico** - Visualización gráfica del avance
- **📚 Horarios Personalizados** - Vista de calendario integrada
- **🔔 Notificaciones Push** - Alertas de fechas importantes
- **📄 Historial Académico** - Transcripción completa
- **💳 Pagos Móviles** - Integración con pasarelas de pago (futuro)
- **📍 Mapa del Campus** - Localización de aulas y edificios

### 👨🏫 Profesores
- **📋 Gestión de Materias** - Materias asignadas y cupos
- **👥 Lista de Estudiantes** - Información detallada por curso
- **📊 Estadísticas de Curso** - Métricas de participación
- **🔔 Notificaciones** - Alertas de inscripciones y eventos
- **📅 Horarios de Clase** - Calendario personalizado

## 🗂️ Estructura del Proyecto

```
src/
├── app/                      # Expo Router (App Directory)
│   ├── (auth)/              # Grupo de rutas de autenticación
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/              # Navegación por pestañas
│   │   ├── index.tsx        # Dashboard/Home
│   │   ├── enrollment.tsx   # Inscripciones
│   │   ├── progress.tsx     # Progreso académico
│   │   ├── schedule.tsx     # Horarios
│   │   └── profile.tsx      # Perfil
│   ├── modal/               # Pantallas modales
│   │   ├── subject-detail.tsx
│   │   └── enrollment-confirm.tsx
│   ├── _layout.tsx          # Layout raíz
│   └── +not-found.tsx       # Página 404
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── forms/               # Formularios especializados
│   │   ├── LoginForm.tsx
│   │   ├── EnrollmentForm.tsx
│   │   └── ProfileForm.tsx
│   ├── charts/              # Componentes de gráficos
│   │   ├── ProgressChart.tsx
│   │   └── GradeChart.tsx
│   └── common/              # Componentes comunes
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── ErrorBoundary.tsx
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── useNotifications.ts
│   ├── useOfflineSync.ts
│   └── useBiometrics.ts
├── services/                # Servicios de API
│   ├── api.ts               # Configuración base
│   ├── auth.ts              # Autenticación
│   ├── students.ts          # Servicios de estudiantes
│   ├── subjects.ts          # Servicios de materias
│   └── notifications.ts     # Servicio de notificaciones
├── utils/                   # Utilidades
│   ├── constants.ts         # Constantes
│   ├── helpers.ts           # Funciones auxiliares
│   ├── storage.ts           # Gestión de almacenamiento
│   └── validators.ts        # Validadores
├── types/                   # Definiciones TypeScript
│   ├── api.ts
│   ├── navigation.ts
│   └── user.ts
└── assets/                  # Recursos estáticos
    ├── images/
    ├── icons/
    └── fonts/
```

## 🧭 Navegación de la App

### Stack Principal con Expo Router
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
```

### Navegación por Pestañas
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="enrollment"
        options={{
          title: 'Inscripciones',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="school" size={24} color={color} />
          ),
        }}
      />
      {/* Más pestañas... */}
    </Tabs>
  );
}
```

## 🔌 Integración con API

### Configuración de API con Axios
```typescript
// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para tokens
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
      // Redirigir a login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Servicios Específicos
```typescript
// services/students.ts
import api from './api';
import { Student, Enrollment, AcademicProgress } from '@/types/api';

export const studentService = {
  getProfile: (): Promise<Student> =>
    api.get('/api/students/profile').then(res => res.data),
    
  getEnrollments: (): Promise<Enrollment[]> =>
    api.get('/api/students/enrollments').then(res => res.data),
    
  getAcademicProgress: (): Promise<AcademicProgress> =>
    api.get('/api/students/progress').then(res => res.data),
    
  enrollInSubjects: (subjectIds: string[]): Promise<void> =>
    api.post('/api/enrollments', { subjectIds }),
};
```

## 📱 Pantallas Principales

### 🏠 Dashboard (app/(tabs)/index.tsx)
```typescript
import { useQuery } from '@tanstack/react-query';
import { View, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function DashboardScreen() {
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => studentService.getDashboardData(),
  });

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        <Card>
          <Card.Content>
            <Title>Bienvenido, {dashboardData?.student.name}</Title>
            <Paragraph>Materias inscritas: {dashboardData?.enrolledSubjects}</Paragraph>
          </Card.Content>
        </Card>
        
        <QuickActions />
        <RecentActivity activities={dashboardData?.recentActivity} />
      </View>
    </ScrollView>
  );
}
```

### 📝 Inscripciones (app/(tabs)/enrollment.tsx)
```typescript
import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function EnrollmentScreen() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const { data: availableSubjects } = useQuery({
    queryKey: ['available-subjects'],
    queryFn: () => subjectService.getAvailableSubjects(),
  });

  const enrollMutation = useMutation({
    mutationFn: studentService.enrollInSubjects,
    onSuccess: () => {
      // Mostrar éxito y actualizar datos
    },
  });

  return (
    <View className="flex-1">
      <FlatList
        data={availableSubjects}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            selected={selectedSubjects.includes(item.id)}
            onToggle={(id) => toggleSubjectSelection(id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      
      <EnrollmentSummary
        selectedSubjects={selectedSubjects}
        onConfirm={() => enrollMutation.mutate(selectedSubjects)}
        loading={enrollMutation.isLoading}
      />
    </View>
  );
}
```

### 📊 Progreso Académico (app/(tabs)/progress.tsx)
```typescript
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function ProgressScreen() {
  const { data: progressData } = useQuery({
    queryKey: ['academic-progress'],
    queryFn: () => studentService.getAcademicProgress(),
  });

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Title>Progreso Académico</Title>
        
        <Card className="mb-4">
          <Card.Content>
            <ProgressChart
              data={progressData?.chartData}
              width={screenWidth - 32}
              height={220}
            />
          </Card.Content>
        </Card>

        <SubjectProgressList subjects={progressData?.subjects} />
      </View>
    </ScrollView>
  );
}
```

## 🔔 Notificaciones Push

### Configuración de Expo Notifications
```typescript
// hooks/useNotifications.ts
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Manejar notificación recibida
      }
    );

    return () => subscription.remove();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    // Enviar token al backend
  };
};
```

## 🔒 Autenticación Biométrica

### Implementación con Expo LocalAuthentication
```typescript
// hooks/useBiometrics.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
    
    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setBiometricType(types.map(type => 
        LocalAuthentication.AuthenticationType[type]
      ));
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticarse con biometría',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar contraseña',
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  return {
    isBiometricSupported,
    biometricType,
    authenticateWithBiometrics,
  };
};
```

## 🎨 Componentes UI Personalizados

### Componente de Tarjeta de Materia
```typescript
// components/ui/SubjectCard.tsx
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { View } from 'react-native';

interface SubjectCardProps {
  subject: Subject;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  selected = false,
  onToggle,
}) => {
  return (
    <Card className={`m-2 ${selected ? 'border-2 border-blue-500' : ''}`}>
      <Card.Content>
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Title>{subject.name}</Title>
            <Paragraph>Código: {subject.code}</Paragraph>
            <Paragraph>Créditos: {subject.credits}</Paragraph>
            <Paragraph>Cupos: {subject.availableSlots}/{subject.totalSlots}</Paragraph>
          </View>
          
          <View className="items-end">
            <Chip mode={selected ? 'flat' : 'outlined'}>
              {subject.schedule}
            </Chip>
          </View>
        </View>
        
        {subject.prerequisites.length > 0 && (
          <View className="mt-2">
            <Paragraph className="text-sm text-gray-600">
              Prerequisitos: {subject.prerequisites.join(', ')}
            </Paragraph>
          </View>
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button
          mode={selected ? 'contained' : 'outlined'}
          onPress={() => onToggle?.(subject.id)}
        >
          {selected ? 'Seleccionada' : 'Seleccionar'}
        </Button>
      </Card.Actions>
    </Card>
  );
};
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo DevTools
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS
npm run web           # Ejecutar en navegador

# Build y Deploy
npx expo build:android # Build APK/AAB para Android
npx expo build:ios    # Build para iOS
npx expo publish      # Publicar actualización OTA

# Utilidades
npm run lint          # Ejecutar ESLint
npm run type-check    # Verificar tipos TypeScript
npm test              # Ejecutar pruebas
npx expo doctor       # Diagnosticar problemas
```

## 📦 Configuración de app.json

```json
{
  "expo": {
    "name": "Sistema Universitario",
    "slug": "sistema-universitario",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ieproes.sistemauniversitario"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.ieproes.sistemauniversitario"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-notifications",
      "expo-local-authentication"
    ]
  }
}
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
- [ ] Sistema de pagos móviles integrado

## 📞 Soporte

Para problemas específicos de la app móvil:
- 📧 Email: mobile@ieproes.edu
- 📱 Slack: #mobile-support

---

**📱 App Móvil - Sistema Universitario v1.0.0**