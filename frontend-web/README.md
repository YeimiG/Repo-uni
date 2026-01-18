# 🌐 Frontend Web - Panel Administrativo IEPROES

Panel web administrativo desarrollado con Next.js para la gestión del sistema académico IEPROES.

## 📋 Descripción

Interfaz web que permite a administradores y catedráticos gestionar usuarios, materias, notas y generar reportes del sistema educativo.

## 🛠️ Tecnologías

- **Next.js** 16.1.2 - Framework React con SSR
- **React** 19.2.3 - Biblioteca de interfaz de usuario
- **React DOM** 19.2.3 - Renderizado DOM
- **Axios** 1.13.2 - Cliente HTTP para API calls

## ⚡ Instalación y Configuración

### 1️⃣ Instalar dependencias
```bash
cd frontend-web
npm install
```

### 2️⃣ Configurar variables de entorno
Crear archivo `.env.local` en la carpeta frontend-web:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=IEPROES Admin Panel

# Configuración de desarrollo
NEXT_PUBLIC_ENV=development
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

La aplicación estará disponible en: **http://localhost:3000** (o puerto disponible)

## 🎯 Funcionalidades

### 👨💼 Panel de Administrador
- **📊 Dashboard** - Estadísticas generales del sistema
- **👥 Gestión de Usuarios** - CRUD completo de estudiantes, catedráticos y admins
- **📚 Gestión de Materias** - Crear, editar y asignar materias
- **📈 Reportes** - Generación de reportes académicos
- **⚙️ Configuración** - Ajustes del sistema

### 👨🏫 Panel de Catedrático
- **📝 Mis Materias** - Materias asignadas
- **📊 Ingreso de Notas** - Calificación de estudiantes
- **👥 Lista de Estudiantes** - Por materia
- **📋 Reportes de Notas** - Estadísticas por materia

## 🗂️ Estructura del Proyecto

```
frontend-web/
├── .next/                    # Archivos generados por Next.js
├── components/               # Componentes reutilizables (futuro)
├── pages/
│   ├── admin/
│   │   └── dashboard.js      # Panel administrativo
│   ├── catedratico/
│   │   ├── mis-materias.js   # Materias del catedrático
│   │   └── ingresar-notas.js # Ingreso de calificaciones
│   ├── _app.js              # Configuración global de la app
│   └── index.js             # Página de inicio/login
├── services/
│   └── api.js               # Configuración de Axios
├── .env.local               # Variables de entorno
└── package.json
```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm start          # Ejecutar versión de producción
npm run lint       # Ejecutar linter (por configurar)
```

## 🎨 Páginas Principales

### 🏠 Página de Inicio (`/`)
- Login centralizado
- Redirección según rol de usuario
- Formulario de autenticación

### 👨💼 Dashboard Admin (`/admin/dashboard`)
- Estadísticas generales
- Gráficos de rendimiento
- Accesos rápidos a funciones principales

### 👨🏫 Materias Catedrático (`/catedratico/mis-materias`)
- Lista de materias asignadas
- Acceso a estudiantes por materia
- Enlaces a ingreso de notas

### 📝 Ingreso de Notas (`/catedratico/ingresar-notas`)
- Formularios de calificación
- Validación de notas
- Guardado automático

## 🔌 Integración con Backend

### Configuración de API (services/api.js)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Interceptores para manejo de tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Endpoints Utilizados
- `GET /api/admin/dashboard` - Datos del dashboard
- `GET /api/catedraticos/:id/materias` - Materias del catedrático
- `POST /api/notas` - Ingreso de calificaciones
- `GET /api/estudiantes` - Lista de estudiantes

## 🎨 Estilos y UI

### CSS Modules (Recomendado)
```css
/* styles/Dashboard.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}
```

### Componentes Sugeridos
- `Layout` - Estructura común de páginas
- `Navbar` - Navegación principal
- `Card` - Tarjetas de información
- `Table` - Tablas de datos
- `Form` - Formularios reutilizables

## 🔐 Autenticación y Rutas Protegidas

### Middleware de Autenticación
```javascript
// middleware/auth.js
export function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    }, []);
    
    if (!isAuthenticated) return <div>Cargando...</div>;
    
    return <WrappedComponent {...props} />;
  };
}
```

## 📱 Responsive Design

- **Desktop First** - Optimizado para pantallas grandes
- **Tablet Compatible** - Adaptable a tablets
- **Mobile Friendly** - Funcional en móviles

### Breakpoints Recomendados
```css
/* Mobile */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 🐛 Solución de Problemas

### Error de conexión con API:
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3000/api/health

# Verificar variables de entorno
cat .env.local
```

### Problemas de CORS:
```javascript
// Verificar configuración en backend
// backend/src/app.js
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

### Errores de build:
```bash
# Limpiar caché de Next.js
rm -rf .next
npm run build
```

## 🚀 Optimizaciones

### Performance
- **Image Optimization** - Usar `next/image`
- **Code Splitting** - Automático con Next.js
- **Static Generation** - Para páginas estáticas

### SEO
```javascript
// pages/_app.js
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>IEPROES - Panel Administrativo</title>
        <meta name="description" content="Sistema de gestión académica" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

## 🔄 Actualizaciones Futuras

- [ ] Implementar TypeScript
- [ ] Agregar Tailwind CSS o Styled Components
- [ ] Sistema de notificaciones
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Tests con Jest y React Testing Library
- [ ] Storybook para componentes

## 📞 Soporte

Para problemas específicos del frontend web:
- 📧 Email: frontend@ieproes.edu
- 📱 Slack: #frontend-support

---

**🌐 Desarrollado para IEPROES - Frontend Web v1.0.0**