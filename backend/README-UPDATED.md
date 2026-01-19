# 🚀 Backend API - Sistema Universitario de Inscripción

API REST desarrollada con Node.js y Express para el sistema universitario de inscripciones y progreso académico.

## 📋 Descripción

Backend robusto que maneja toda la lógica de negocio del sistema universitario, incluyendo autenticación, gestión de usuarios, materias, inscripciones y seguimiento académico con capacidades futuras de pagos en línea.

## 🛠️ Tecnologías

- **Node.js** 18+ - Runtime de JavaScript
- **Express.js** 4.18+ - Framework web minimalista
- **PostgreSQL** 14+ - Base de datos relacional
- **Prisma** 4.0+ - ORM moderno para Node.js
- **JWT** - Autenticación segura
- **Bcrypt** - Encriptación de contraseñas
- **Joi** - Validación de esquemas
- **Winston** - Sistema de logging
- **Jest** - Testing framework

## ⚡ Instalación y Configuración

### 1️⃣ Instalar dependencias
```bash
cd backend
npm install
```

### 2️⃣ Configurar variables de entorno
Crear archivo `.env` en la carpeta backend:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_universitario"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_de_al_menos_32_caracteres
JWT_EXPIRES_IN=7d

# Encriptación
BCRYPT_ROUNDS=12

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
```

### 3️⃣ Configurar base de datos
```bash
# Crear base de datos
createdb sistema_universitario

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Poblar datos iniciales (opcional)
npm run seed
```

### 4️⃣ Ejecutar servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

**Servidor disponible en:** http://localhost:3000

## 📡 Rutas de la API

### 🔐 Autenticación
```
POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/register        # Registrar usuario
POST   /api/auth/refresh         # Renovar token
POST   /api/auth/logout          # Cerrar sesión
POST   /api/auth/forgot-password # Recuperar contraseña
POST   /api/auth/reset-password  # Restablecer contraseña
```

### 👥 Usuarios
```
GET    /api/users               # Listar usuarios (admin)
GET    /api/users/:id           # Obtener usuario
PUT    /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Eliminar usuario
GET    /api/users/profile       # Perfil del usuario actual
PUT    /api/users/profile       # Actualizar perfil
```

### 🎓 Estudiantes
```
GET    /api/students                    # Listar estudiantes
GET    /api/students/:id               # Obtener estudiante
GET    /api/students/:id/enrollments   # Inscripciones del estudiante
GET    /api/students/:id/progress      # Progreso académico
GET    /api/students/:id/transcript    # Historial académico
```

### 📚 Materias
```
GET    /api/subjects                   # Listar materias
GET    /api/subjects/:id              # Obtener materia
POST   /api/subjects                  # Crear materia (admin)
PUT    /api/subjects/:id              # Actualizar materia (admin)
DELETE /api/subjects/:id              # Eliminar materia (admin)
GET    /api/subjects/:id/prerequisites # Prerequisitos de materia
GET    /api/subjects/available        # Materias disponibles para inscripción
```

### 📝 Inscripciones
```
GET    /api/enrollments               # Listar inscripciones
POST   /api/enrollments               # Crear inscripción
GET    /api/enrollments/:id          # Obtener inscripción
PUT    /api/enrollments/:id          # Actualizar inscripción
DELETE /api/enrollments/:id          # Cancelar inscripción
POST   /api/enrollments/validate     # Validar prerequisitos
```

### 📊 Reportes y Analytics
```
GET    /api/reports/dashboard         # Métricas del dashboard
GET    /api/reports/enrollments      # Reporte de inscripciones
GET    /api/reports/subjects         # Estadísticas por materia
GET    /api/reports/students         # Reporte de estudiantes
```

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/           # Controladores de rutas
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── studentController.js
│   │   ├── subjectController.js
│   │   └── enrollmentController.js
│   ├── middleware/            # Middleware personalizado
│   │   ├── auth.js           # Autenticación JWT
│   │   ├── validation.js     # Validación de datos
│   │   ├── errorHandler.js   # Manejo de errores
│   │   └── logger.js         # Logging de requests
│   ├── routes/               # Definición de rutas
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── students.js
│   │   ├── subjects.js
│   │   └── enrollments.js
│   ├── services/             # Lógica de negocio
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── enrollmentService.js
│   │   └── emailService.js
│   ├── utils/                # Utilidades
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── config/               # Configuraciones
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── email.js
│   └── app.js               # Configuración de Express
├── prisma/                  # Esquemas y migraciones
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── tests/                   # Pruebas unitarias
├── docs/                    # Documentación de API
├── .env.example
├── package.json
└── server.js               # Punto de entrada
```

## 🗄️ Esquema de Base de Datos

### Modelos Principales
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(STUDENT)
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Student {
  id           String       @id @default(cuid())
  studentId    String       @unique
  userId       String       @unique
  user         User         @relation(fields: [userId], references: [id])
  enrollments  Enrollment[]
  career       Career       @relation(fields: [careerId], references: [id])
  careerId     String
}

model Subject {
  id            String       @id @default(cuid())
  code          String       @unique
  name          String
  credits       Int
  prerequisites Subject[]    @relation("Prerequisites")
  enrollments   Enrollment[]
  semester      Int
  isActive      Boolean      @default(true)
}

model Enrollment {
  id        String   @id @default(cuid())
  studentId String
  subjectId String
  student   Student  @relation(fields: [studentId], references: [id])
  subject   Subject  @relation(fields: [subjectId], references: [id])
  status    EnrollmentStatus @default(ACTIVE)
  grade     Float?
  createdAt DateTime @default(now())
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo con nodemon
npm start            # Ejecutar en producción
npm run build        # Compilar TypeScript (si aplica)
npm test             # Ejecutar pruebas
npm run test:watch   # Ejecutar pruebas en modo watch
npm run seed         # Poblar base de datos con datos de prueba
npm run migrate      # Ejecutar migraciones de Prisma
npm run studio       # Abrir Prisma Studio
npm run lint         # Ejecutar ESLint
npm run format       # Formatear código con Prettier
```

## 🔒 Seguridad

### Autenticación JWT
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### Validación de Datos
```javascript
// utils/validators.js
const Joi = require('joi');

const enrollmentSchema = Joi.object({
  subjectId: Joi.string().required(),
  semester: Joi.string().required(),
  year: Joi.number().integer().min(2024).required()
});

const validateEnrollment = (data) => {
  return enrollmentSchema.validate(data);
};
```

## 🧪 Testing

### Configuración de Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/migrations/**'
  ]
};
```

### Ejemplo de Test
```javascript
// tests/auth.test.js
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@university.edu',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 📊 Monitoreo y Logging

### Configuración de Winston
```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Entorno de Producción
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/sistema_universitario
JWT_SECRET=clave_super_segura_produccion
PORT=3000
```

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
- [ ] Sistema de pagos integrado

## 📞 Soporte

Para problemas específicos del backend:
- 📧 Email: dev@ieproes.edu
- 📱 Slack: #backend-support

---

**🚀 Backend API - Sistema Universitario v1.0.0**