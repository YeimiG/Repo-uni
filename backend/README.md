# 🚀 Backend API - Sistema IEPROES

API REST desarrollada con Node.js y Express para el sistema de gestión académica IEPROES.

## 📋 Descripción

Backend que proporciona servicios de autenticación, gestión de usuarios, materias y notas para la aplicación móvil y panel web administrativo.

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** 5.2.1 - Framework web
- **PostgreSQL** - Base de datos relacional
- **pg** 8.16.3 - Cliente PostgreSQL para Node.js
- **CORS** 2.8.5 - Manejo de políticas CORS
- **dotenv** 17.2.3 - Variables de entorno

## ⚡ Instalación y Configuración

### 1️⃣ Instalar dependencias
```bash
cd backend
npm install
```

### 2️⃣ Configurar variables de entorno
Crear archivo `.env` en la carpeta backend:

```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ieproes_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# Servidor
PORT=3000
NODE_ENV=development

# JWT (opcional para futuras implementaciones)
JWT_SECRET=tu_clave_secreta_muy_segura
```

### 3️⃣ Configurar base de datos PostgreSQL

#### Crear base de datos:
```sql
CREATE DATABASE ieproes_db;
```

#### Crear tablas principales:
```sql
-- Tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('estudiante', 'catedratico', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla materias
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    creditos INTEGER DEFAULT 3,
    catedratico_id INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla inscripciones
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER REFERENCES usuarios(id),
    materia_id INTEGER REFERENCES materias(id),
    periodo VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla notas
CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER REFERENCES inscripciones(id),
    tipo_nota VARCHAR(50), -- 'parcial1', 'parcial2', 'final', etc.
    valor DECIMAL(4,2),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ Ejecutar el servidor

#### Modo desarrollo:
```bash
npm run dev
```

#### Modo producción:
```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 📡 Rutas de la API

### 🔐 Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario (admin)
POST /api/auth/logout         # Cerrar sesión
```

### 👥 Usuarios
```
GET    /api/usuarios          # Listar todos los usuarios
GET    /api/usuarios/:id      # Obtener usuario por ID
POST   /api/usuarios          # Crear nuevo usuario
PUT    /api/usuarios/:id      # Actualizar usuario
DELETE /api/usuarios/:id      # Eliminar usuario
```

### 🎓 Estudiantes
```
GET    /api/estudiantes                    # Listar estudiantes
GET    /api/estudiantes/:id               # Obtener estudiante
GET    /api/estudiantes/:id/materias      # Materias del estudiante
GET    /api/estudiantes/:id/notas         # Notas del estudiante
```

### 👨‍🏫 Catedráticos
```
GET    /api/catedraticos                  # Listar catedráticos
GET    /api/catedraticos/:id             # Obtener catedrático
GET    /api/catedraticos/:id/materias    # Materias del catedrático
```

### 📚 Materias
```
GET    /api/materias                      # Listar materias
GET    /api/materias/:id                 # Obtener materia
POST   /api/materias                     # Crear materia
PUT    /api/materias/:id                 # Actualizar materia
DELETE /api/materias/:id                 # Eliminar materia
GET    /api/materias/:id/estudiantes     # Estudiantes de la materia
```

### 📊 Administración
```
GET    /api/admin/dashboard              # Estadísticas generales
GET    /api/admin/reportes              # Reportes del sistema
```

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Configuración de base de datos
│   ├── controllers/
│   │   ├── adminController.js    # Lógica de administración
│   │   ├── catedraticoController.js
│   │   ├── estudianteController.js
│   │   ├── loginController.js    # Autenticación
│   │   └── materiaController.js
│   ├── middlewares/
│   │   └── authMiddleware.js     # Middleware de autenticación
│   ├── models/                   # Modelos de datos (futuro)
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── catedraticoRoutes.js
│   │   ├── estudianteRoutes.js
│   │   └── materiaRoutes.js
│   └── app.js                    # Configuración de Express
├── .env                          # Variables de entorno
├── index.js                      # Punto de entrada
└── package.json
```

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo
npm test           # Ejecutar pruebas (por implementar)
```

## 🛡️ Seguridad

- **CORS** configurado para permitir requests desde frontend
- **Variables de entorno** para datos sensibles
- **Validación** de datos en controladores
- **Middleware de autenticación** para rutas protegidas

## 📊 Códigos de Respuesta HTTP

| Código | Descripción |
|--------|-------------|
| 200 | ✅ Operación exitosa |
| 201 | ✅ Recurso creado |
| 400 | ❌ Solicitud incorrecta |
| 401 | ❌ No autorizado |
| 403 | ❌ Prohibido |
| 404 | ❌ Recurso no encontrado |
| 500 | ❌ Error interno del servidor |

## 🐛 Solución de Problemas

### Error de conexión a base de datos:
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Verificar credenciales en .env
cat .env
```

### Puerto ocupado:
```bash
# Cambiar puerto en .env o matar proceso
lsof -ti:3000 | xargs kill -9
```

### Dependencias faltantes:
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Actualizaciones Futuras

- [ ] Implementación completa de JWT
- [ ] Middleware de validación con Joi
- [ ] Documentación con Swagger
- [ ] Pruebas unitarias con Jest
- [ ] Logging con Winston
- [ ] Rate limiting
- [ ] Compresión de respuestas

## 📞 Soporte

Para problemas específicos del backend:
- 📧 Email: dev@ieproes.edu
- 📱 Slack: #backend-support

---

**🔧 Desarrollado para IEPROES - Backend API v1.0.0**