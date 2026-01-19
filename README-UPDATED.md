# 🎓 Sistema Universitario de Inscripción y Progreso Académico - IEPROES

Sistema integral de gestión académica que automatiza el proceso de inscripción de materias y permite el seguimiento del progreso académico estudiantil, con capacidades futuras de pagos en línea.

## 📋 Descripción del Proyecto

El **Sistema Universitario de Inscripción y Progreso Académico** es una solución tecnológica diseñada para modernizar y optimizar los procesos académicos universitarios. Proporciona una plataforma digital completa que conecta estudiantes, profesores y administradores en un ecosistema académico eficiente.

### Componentes del Sistema:
- **📱 App Móvil** (React Native + Expo) - Para estudiantes y profesores
- **🌐 Panel Web** (Next.js + TypeScript) - Para administradores y gestión académica
- **⚙️ API Backend** (Node.js + Express + PostgreSQL) - Servidor y lógica de negocio

## 🎯 Problema que Resuelve

### Desafíos Actuales:
- ⏰ **Largas colas y tiempos de espera** durante períodos de inscripción
- 📄 **Procesos manuales** propensos a errores humanos
- 🔍 **Falta de visibilidad** del progreso académico en tiempo real
- 💰 **Gestión manual de pagos** y procesos contables complejos
- 📊 **Dificultad para generar reportes** académicos y administrativos

### Nuestra Solución:
- 🚀 **Inscripción digital instantánea** con validación automática
- 📱 **Acceso multiplataforma** (web y móvil)
- 📈 **Seguimiento en tiempo real** del progreso académico
- 💳 **Pagos en línea integrados** (fase futura)
- 📊 **Reportes automáticos** y analytics

## 💡 Beneficios para la Institución

### 👨🎓 Para Estudiantes:
- ✅ Inscripción de materias 24/7 desde cualquier dispositivo
- 📊 Visualización clara del progreso académico y requisitos
- 🔔 Notificaciones automáticas de fechas importantes
- 💳 Pagos seguros y convenientes en línea (futuro)
- 📱 Acceso móvil con autenticación biométrica

### 👨🏫 Para Profesores:
- 📋 Gestión eficiente de listas de estudiantes
- 📈 Seguimiento del rendimiento por materia
- 🔄 Actualización automática de cupos disponibles
- 📊 Reportes de inscripciones y estadísticas

### 👨💼 Para Administradores:
- 🎛️ Control centralizado de todo el sistema
- 📊 Dashboard con métricas en tiempo real
- 💰 Gestión financiera integrada (futuro)
- 📈 Reportes institucionales completos
- ⚙️ Configuración flexible de períodos académicos

### 🏛️ Para la Institución:
- 💰 **Reducción de costos operativos** hasta 60%
- ⚡ **Mejora en eficiencia** de procesos administrativos
- 📊 **Mejor toma de decisiones** basada en datos
- 🎯 **Mayor satisfacción estudiantil** y retención

## 🛠️ Tecnologías Utilizadas

### 🔧 Backend (API)
- **Node.js** 18+ - Runtime de JavaScript
- **Express.js** 4.18+ - Framework web minimalista
- **PostgreSQL** 14+ - Base de datos relacional
- **Prisma** 4.0+ - ORM moderno para Node.js
- **JWT** - Autenticación segura
- **Bcrypt** - Encriptación de contraseñas
- **Winston** - Sistema de logging

### 🌐 Frontend Web
- **React** 18+ - Biblioteca de interfaz de usuario
- **Next.js** 13+ - Framework React con SSR
- **TypeScript** 4.9+ - JavaScript tipado
- **Tailwind CSS** 3.0+ - Framework de estilos
- **React Query** - Gestión de estado del servidor
- **Chart.js** - Visualización de datos

### 📱 Aplicación Móvil
- **React Native** 0.72+ - Framework multiplataforma
- **Expo** 49+ - Plataforma de desarrollo
- **TypeScript** 4.9+ - JavaScript tipado
- **React Navigation** 6+ - Navegación nativa
- **Expo Router** - Enrutamiento basado en archivos
- **React Native Paper** - Componentes Material Design

## 🏗️ Arquitectura del Sistema

```
sistema-universitario/
├── 📁 backend/                 # API y lógica de negocio
│   ├── src/
│   │   ├── controllers/        # Controladores de rutas
│   │   ├── models/            # Modelos de datos (Prisma)
│   │   ├── routes/            # Definición de rutas
│   │   ├── middleware/        # Middleware personalizado
│   │   ├── services/          # Lógica de negocio
│   │   └── config/            # Configuraciones
│   └── prisma/                # Esquemas de base de datos
│
├── 📁 frontend-web/           # Interfaz web administrativa
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── hooks/            # Custom hooks
│   │   └── services/         # Servicios de API
│   └── public/               # Archivos estáticos
│
├── 📁 src/                    # Aplicación móvil (React Native)
│   ├── app/                  # Expo Router (App Directory)
│   ├── components/           # Componentes reutilizables
│   ├── hooks/                # Custom hooks
│   ├── services/             # Servicios de API
│   └── assets/               # Recursos (imágenes, fonts)
│
└── 📁 docs/                   # Documentación del proyecto
```

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- PostgreSQL 14+
- Expo CLI (para app móvil)
- Git

### 1️⃣ Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Repo-uni
```

### 2️⃣ Instalar dependencias principales
```bash
npm install
```

### 3️⃣ Configurar y ejecutar cada componente

#### 🔧 Backend (API)
```bash
cd backend
npm install
# Configurar .env (ver backend/README.md)
npm run dev
```

#### 🌐 Frontend Web
```bash
cd frontend-web
npm install
npm run dev
```

#### 📱 App Móvil
```bash
# Desde la raíz del proyecto
npm start
# o
npx expo start
```

## 📊 Estado Actual del Proyecto

### ✅ Completado (Fase 1)
- [x] **Arquitectura base** del sistema
- [x] **Autenticación y autorización** con JWT
- [x] **Gestión de usuarios** (estudiantes, profesores, admins)
- [x] **Catálogo de materias** y prerequisitos
- [x] **Sistema de inscripciones** básico
- [x] **Dashboard administrativo** básico
- [x] **API REST** documentada

### 🚧 En Desarrollo (Fase 2)
- [ ] **Interfaz web completa** con React/Next.js
- [ ] **Aplicación móvil** con Expo/React Native
- [ ] **Sistema de notificaciones** push y email
- [ ] **Reportes avanzados** y analytics
- [ ] **Validación de prerequisitos** automática
- [ ] **Sistema de cupos** y listas de espera

### 🔮 Planeado (Fase 3)
- [ ] **Pagos en línea** integrados
- [ ] **Facturación electrónica**
- [ ] **Integración contable**
- [ ] **Sistema de becas** y descuentos
- [ ] **Módulo de evaluaciones**
- [ ] **App móvil nativa** (iOS/Android)

## 🗺️ Roadmap 2024-2025

### Q1 2024 - Fundación Sólida
- ✅ Completar API backend
- ✅ Implementar autenticación segura
- ✅ Diseñar base de datos optimizada
- 🚧 Desarrollar interfaz web básica

### Q2 2024 - Experiencia de Usuario
- 🔄 Finalizar interfaz web responsive
- 🔄 Lanzar aplicación móvil beta
- 📋 Implementar sistema de notificaciones
- 📊 Desarrollar dashboard de analytics

### Q3 2024 - Funcionalidades Avanzadas
- 📅 Integración con calendario académico
- 🔔 Sistema de alertas inteligentes
- 📈 Reportes avanzados para administradores
- 🧪 Testing exhaustivo y optimización

### Q4 2024 - Preparación para Pagos
- 💳 Investigación de pasarelas de pago
- 🔒 Implementación de seguridad PCI DSS
- 📄 Desarrollo de módulo de facturación
- 🏦 Integración con sistemas contables

### Q1 2025 - Lanzamiento de Pagos
- 💰 Sistema de pagos en línea completo
- 📊 Dashboard financiero integrado
- 🎯 Optimizaciones basadas en feedback
- 🚀 Lanzamiento de versión 2.0

## 📸 Capturas de Pantalla

### 🖥️ Interfaz Web
```
[Espacio reservado para captura del dashboard administrativo]
- Vista general del sistema de inscripciones
- Métricas de inscripciones en tiempo real
- Gestión de usuarios y permisos
```

### 📱 Aplicación Móvil
```
[Espacio reservado para capturas de la app móvil]
- Pantalla de login con autenticación biométrica
- Lista de materias disponibles para inscripción
- Progreso académico visual con gráficos
- Proceso de inscripción paso a paso
```

### 📊 Reportes y Analytics
```
[Espacio reservado para capturas de reportes]
- Gráficos de inscripciones por período
- Análisis de demanda por materia
- Reportes de progreso académico estudiantil
```

## 📚 Documentación Detallada

Cada componente tiene su propia documentación específica:

- 📖 [**Backend API**](./backend/README.md) - Instalación, rutas, base de datos
- 📖 [**Frontend Web**](./frontend-web/README.md) - Panel administrativo
- 📖 [**App Móvil**](./src/README.md) - Aplicación React Native

## 🔧 Scripts Disponibles

### 🌍 Proyecto Principal
```bash
npm start          # Inicia la app móvil con Expo
npm run android    # Ejecuta en emulador Android
npm run ios        # Ejecuta en simulador iOS
npm run web        # Ejecuta versión web de la app
npm run lint       # Ejecuta linter
```

## 🌐 URLs de Desarrollo

- **🔗 API Backend**: http://localhost:3000
- **🔗 Panel Web**: http://localhost:3001
- **🔗 App Móvil**: Expo DevTools (puerto dinámico)

## 🔒 Autenticación

El sistema utiliza autenticación basada en tokens JWT:
- Login centralizado en el backend
- Tokens compartidos entre app móvil y web
- Middleware de autenticación en rutas protegidas

## 📊 Base de Datos

Estructura principal:
- **usuarios** (estudiantes, profesores, admins)
- **materias** (cursos y asignaturas)
- **inscripciones** (relación estudiante-materia)
- **prerequisitos** (dependencias entre materias)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a la institución IEPROES.

## 👨💻 Desarrollador

**[Tu Nombre]**
- 📧 Email: tu.email@ejemplo.com
- 💼 LinkedIn: [tu-perfil-linkedin](https://linkedin.com/in/tu-perfil)
- 🐙 GitHub: [@tu-usuario](https://github.com/tu-usuario)
- 🌐 Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

### 📞 Contacto para Colaboraciones
- 💬 WhatsApp: +XX-XXXX-XXXX
- 📅 Calendly: [Agendar reunión](https://calendly.com/tu-usuario)
- 🏢 Disponible para proyectos freelance y colaboraciones institucionales

## 📞 Soporte Técnico

Para soporte técnico o consultas:
- 📧 Email: soporte@ieproes.edu
- 📱 WhatsApp: +XXX-XXXX-XXXX
- 💬 Slack: #soporte-tecnico

---

**🎓 Desarrollado con ❤️ para modernizar la educación superior - IEPROES**