# 🌐 Frontend Web - Sistema Universitario de Inscripción

Panel web administrativo desarrollado con React y Next.js para la gestión del sistema universitario de inscripciones y progreso académico.

## 📋 Descripción

Interfaz web moderna y responsive que permite a administradores, profesores y estudiantes gestionar inscripciones, consultar progreso académico y administrar el sistema educativo con capacidades futuras de pagos en línea.

## 🛠️ Tecnologías

- **React** 18+ - Biblioteca de interfaz de usuario
- **Next.js** 13+ - Framework React con SSR/SSG
- **TypeScript** 4.9+ - JavaScript tipado
- **Tailwind CSS** 3.0+ - Framework de estilos utility-first
- **React Query** 4.0+ - Gestión de estado del servidor
- **React Hook Form** 7.0+ - Manejo eficiente de formularios
- **Chart.js** 4.0+ - Visualización de datos y gráficos
- **Headless UI** - Componentes accesibles sin estilos
- **Heroicons** - Iconografía moderna

## ⚡ Instalación y Configuración

### 1️⃣ Instalar dependencias
```bash
cd frontend-web
npm install
```

### 2️⃣ Configurar variables de entorno
```bash
cp .env.example .env.local
```

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Sistema Universitario

# Configuración
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_VERSION=1.0.0

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3️⃣ Ejecutar en desarrollo
```bash
npm run dev
```

### 4️⃣ Construir para producción
```bash
npm run build
npm start
```

**Aplicación disponible en:** http://localhost:3001

## 🎯 Funcionalidades por Rol

### 👨💼 Administradores
- **📊 Dashboard Ejecutivo** - Métricas y KPIs institucionales
- **👥 Gestión de Usuarios** - CRUD completo de estudiantes, profesores y admins
- **📚 Catálogo de Materias** - Gestión completa del plan de estudios
- **🎓 Gestión de Carreras** - Configuración de programas académicos
- **📈 Reportes Avanzados** - Analytics y reportes personalizables
- **⚙️ Configuración del Sistema** - Parámetros y ajustes globales

### 👨🏫 Profesores
- **📋 Mis Materias** - Materias asignadas y gestión de cupos
- **👥 Lista de Estudiantes** - Estudiantes inscritos por materia
- **📊 Estadísticas de Curso** - Métricas de rendimiento y participación
- **📝 Gestión de Inscripciones** - Aprobación manual de inscripciones especiales

### 👨🎓 Estudiantes
- **🎯 Portal de Inscripciones** - Inscripción intuitiva de materias
- **📈 Progreso Académico** - Visualización del avance en la carrera
- **📚 Historial Académico** - Transcripción completa de notas
- **📅 Horarios** - Visualización de horarios de clase
- **🔔 Notificaciones** - Alertas importantes del sistema

## 🗂️ Estructura del Proyecto

```
frontend-web/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes base (Button, Input, etc.)
│   │   ├── forms/           # Formularios especializados
│   │   ├── charts/          # Componentes de gráficos
│   │   ├── layout/          # Componentes de layout
│   │   └── common/          # Componentes comunes
│   ├── pages/               # Páginas de Next.js
│   │   ├── admin/           # Páginas de administrador
│   │   ├── professor/       # Páginas de profesor
│   │   ├── student/         # Páginas de estudiante
│   │   ├── auth/            # Páginas de autenticación
│   │   ├── _app.tsx         # Configuración global
│   │   └── index.tsx        # Página de inicio
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts       # Hook de autenticación
│   │   ├── useApi.ts        # Hook para API calls
│   │   └── useLocalStorage.ts
│   ├── services/            # Servicios de API
│   │   ├── api.ts           # Configuración de Axios
│   │   ├── auth.ts          # Servicios de autenticación
│   │   ├── students.ts      # Servicios de estudiantes
│   │   └── subjects.ts      # Servicios de materias
│   ├── utils/               # Utilidades
│   │   ├── constants.ts     # Constantes de la aplicación
│   │   ├── helpers.ts       # Funciones auxiliares
│   │   └── validators.ts    # Validadores de formularios
│   ├── types/               # Definiciones de TypeScript
│   │   ├── api.ts           # Tipos de API
│   │   ├── user.ts          # Tipos de usuario
│   │   └── common.ts        # Tipos comunes
│   └── styles/              # Estilos globales
│       ├── globals.css      # Estilos globales
│       └── components.css   # Estilos de componentes
├── public/                  # Archivos estáticos
│   ├── images/             # Imágenes
│   ├── icons/              # Iconos
│   └── favicon.ico
├── tests/                   # Pruebas de componentes
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Páginas Principales

### 🏠 Dashboard (`/dashboard`)
```typescript
// Métricas en tiempo real
const DashboardPage = () => {
  const { data: metrics } = useQuery('dashboard-metrics', fetchDashboardMetrics);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Estudiantes Activos" value={metrics?.activeStudents} />
      <MetricCard title="Inscripciones Hoy" value={metrics?.todayEnrollments} />
      <MetricCard title="Materias Disponibles" value={metrics?.availableSubjects} />
      <MetricCard title="Cupos Restantes" value={metrics?.remainingSlots} />
    </div>
  );
};
```

### 📝 Portal de Inscripciones (`/student/enrollment`)
```typescript
// Proceso de inscripción paso a paso
const EnrollmentPage = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const { mutate: enrollSubjects } = useMutation(enrollInSubjects);

  const handleEnrollment = () => {
    enrollSubjects(selectedSubjects.map(s => s.id));
  };

  return (
    <EnrollmentWizard
      subjects={availableSubjects}
      selectedSubjects={selectedSubjects}
      onSubjectSelect={setSelectedSubjects}
      onEnroll={handleEnrollment}
    />
  );
};
```

### 📊 Progreso Académico (`/student/progress`)
```typescript
// Visualización del progreso
const ProgressPage = () => {
  const { data: progress } = useQuery('academic-progress', fetchAcademicProgress);

  return (
    <div className="space-y-6">
      <ProgressChart data={progress?.chartData} />
      <SubjectGrid subjects={progress?.subjects} />
      <TranscriptTable grades={progress?.grades} />
    </div>
  );
};
```

## 🔌 Integración con API

### Configuración de Axios
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Interceptor para tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Servicios de API
```typescript
// services/students.ts
export const studentService = {
  getProfile: () => api.get('/api/students/profile'),
  getEnrollments: () => api.get('/api/students/enrollments'),
  getProgress: () => api.get('/api/students/progress'),
  enrollInSubjects: (subjectIds: string[]) => 
    api.post('/api/enrollments', { subjectIds }),
};
```

## 🎨 Componentes UI Principales

### Componente de Tarjeta Métrica
```typescript
// components/ui/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      {trend && <TrendIndicator trend={trend} />}
    </div>
  );
};
```

### Formulario de Inscripción
```typescript
// components/forms/EnrollmentForm.tsx
const EnrollmentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: EnrollmentFormData) => {
    // Lógica de inscripción
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SubjectSelector
        {...register('subjects', { required: 'Selecciona al menos una materia' })}
        error={errors.subjects?.message}
      />
      <Button type="submit" className="w-full">
        Inscribirse
      </Button>
    </form>
  );
};
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm start            # Ejecutar versión de producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos de TypeScript
npm test             # Ejecutar pruebas
npm run test:watch   # Ejecutar pruebas en modo watch
npm run analyze      # Analizar bundle size
```

## 🎨 Configuración de Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## 📱 Responsive Design

### Breakpoints Utilizados
```css
/* Mobile First Approach */
.container {
  @apply px-4 mx-auto;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8 max-w-7xl;
  }
}
```

## 🔒 Autenticación y Rutas Protegidas

### Hook de Autenticación
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token y obtener usuario
      verifyToken(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user, token } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

### Componente de Ruta Protegida
```typescript
// components/common/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [user, loading, requiredRole]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return <>{children}</>;
};
```

## 🧪 Testing

### Configuración de Jest y Testing Library
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### Ejemplo de Test de Componente
```typescript
// tests/components/MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import MetricCard from '@/components/ui/MetricCard';

describe('MetricCard', () => {
  test('renders metric card with title and value', () => {
    render(<MetricCard title="Test Metric" value={100} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
```

## 🚀 Optimizaciones de Performance

### Configuración de Next.js
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
    };
    return config;
  },
};
```

### Lazy Loading de Componentes
```typescript
// Lazy loading para componentes pesados
const ChartComponent = dynamic(() => import('@/components/charts/AdvancedChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

## 🔄 Actualizaciones Futuras

- [ ] Implementar PWA (Progressive Web App)
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)
- [ ] Notificaciones push web
- [ ] Optimización de imágenes con Next.js Image
- [ ] Implementar Storybook para componentes
- [ ] Migración a App Router de Next.js 13+
- [ ] Sistema de pagos integrado

## 📞 Soporte

Para problemas específicos del frontend web:
- 📧 Email: frontend@ieproes.edu
- 📱 Slack: #frontend-support

---

**🌐 Frontend Web - Sistema Universitario v1.0.0**