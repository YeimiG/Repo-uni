# 🎓 Sistema de Gestión Académica

Sistema completo de gestión académica que incluye aplicación móvil, panel web administrativo y API backend.

## 📋 Descripción del Proyecto

Este proyecto consta de tres componentes principales:
- **📱 App Móvil** (React Native + Expo) - Para estudiantes y catedráticos
- **🌐 Panel Web** (Next.js) - Para administradores y catedráticos
- **⚙️ API Backend** (Node.js + Express + PostgreSQL) - Servidor y base de datos

## 🏗️ Arquitectura del Sistema

```
Repo-uni/
├── 📱 src/                    # App móvil (React Native + Expo)
├── 🌐 frontend-web/           # Panel web (Next.js)
├── ⚙️ backend/                # API servidor (Node.js + Express)
├── 🖼️ assets/                 # Recursos compartidos
└── 📄 Documentación
```

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- PostgreSQL 12+
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

## 🎯 Funcionalidades Principales

### 👨‍🎓 Para Estudiantes
- ✅ Consulta de notas y calificaciones
- 📚 Visualización de materias inscritas
- 👤 Gestión de perfil personal
- 📊 Historial académico

### 👨‍🏫 Para Catedráticos
- 📝 Ingreso y edición de notas
- 📋 Gestión de materias asignadas
- 👥 Lista de estudiantes por materia
- 📈 Reportes académicos

### 👨‍💼 Para Administradores
- 🏫 Gestión completa de usuarios
- 📊 Dashboard con estadísticas
- 🎓 Administración de materias y cursos
- 📋 Reportes institucionales

## 🛠️ Tecnologías Utilizadas

### 📱 App Móvil
- **React Native** 0.81.5
- **Expo** 54.0.0
- **React Navigation** 7.x
- **Axios** para API calls
- **Expo Router** para navegación

### 🌐 Frontend Web
- **Next.js** 16.1.2
- **React** 19.2.3
- **Axios** para API calls

### ⚙️ Backend
- **Node.js** con **Express** 5.2.1
- **PostgreSQL** con **pg** 8.16.3
- **CORS** habilitado
- **dotenv** para variables de entorno

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

## 👥 Roles del Sistema

| Rol | Acceso | Funcionalidades |
|-----|--------|----------------|
| **Estudiante** | App Móvil | Consultar notas, perfil, materias |
| **Catedrático** | App + Web | Ingresar notas, gestionar materias |
| **Administrador** | Web | Gestión completa del sistema |

## 🔒 Autenticación

El sistema utiliza autenticación basada en tokens JWT:
- Login centralizado en el backend
- Tokens compartidos entre app móvil y web
- Middleware de autenticación en rutas protegidas

## 📊 Base de Datos

Estructura principal:
- **usuarios** (estudiantes, catedráticos, admins)
- **materias** (cursos y asignaturas)
- **notas** (calificaciones)
- **inscripciones** (relación estudiante-materia)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privad.

## 📞 Soporte


---

**🎯 Sistema de Gestión Académica**
