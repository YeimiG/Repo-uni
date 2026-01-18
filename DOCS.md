# 📚 Documentación Completa - Sistema IEPROES

## 🚀 Guía de Instalación Completa

### 📋 Prerrequisitos del Sistema

#### Software Requerido
- **Node.js** 18.0.0 o superior
- **npm** 8.0.0 o superior (o yarn 1.22.0+)
- **PostgreSQL** 12.0 o superior
- **Git** 2.30.0 o superior

#### Para Desarrollo Móvil
- **Expo CLI** (instalación global)
- **Android Studio** (para emulador Android)
- **Xcode** (para simulador iOS - solo macOS)

#### Verificación de Prerrequisitos
```bash
node --version          # v18.0.0+
npm --version           # 8.0.0+
psql --version          # 12.0+
git --version           # 2.30.0+
expo --version          # Última versión
```

### 🔧 Instalación Paso a Paso

#### 1. Clonar y Configurar Repositorio
```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd Repo-uni

# Instalar dependencias principales
npm install
```

#### 2. Configurar Base de Datos PostgreSQL

##### Crear Usuario y Base de Datos
```sql
-- Conectar como superusuario
sudo -u postgres psql

-- Crear usuario
CREATE USER ieproes_user WITH PASSWORD 'tu_password_seguro';

-- Crear base de datos
CREATE DATABASE ieproes_db OWNER ieproes_user;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE ieproes_db TO ieproes_user;

-- Salir
\q
```

##### Crear Estructura de Tablas
```sql
-- Conectar a la base de datos
psql -U ieproes_user -d ieproes_db -h localhost

-- Crear tablas (ejecutar en orden)
\i backend/sql/create_tables.sql
```

#### 3. Configurar Variables de Entorno

##### Backend (.env)
```bash
cd backend
cp .env.example .env
```

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ieproes_db
DB_USER=ieproes_user
DB_PASSWORD=tu_password_seguro

# Servidor
PORT=3000
NODE_ENV=development

# Seguridad
JWT_SECRET=tu_clave_jwt_muy_segura_de_al_menos_32_caracteres
BCRYPT_ROUNDS=12

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:19006
```

##### Frontend Web (.env.local)
```bash
cd frontend-web
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=IEPROES Admin Panel
NEXT_PUBLIC_ENV=development
```

##### App Móvil (.env)
```bash
# En la raíz del proyecto
cp .env.example .env
```

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=IEPROES Mobile
EXPO_PUBLIC_ENV=development
```

#### 4. Instalar Dependencias por Componente

```bash
# Backend
cd backend
npm install

# Frontend Web
cd ../frontend-web
npm install

# App Móvil (desde raíz)
cd ..
npm install
```

#### 5. Ejecutar Componentes

##### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

##### Terminal 2 - Frontend Web
```bash
cd frontend-web
npm run dev
```

##### Terminal 3 - App Móvil
```bash
npm start
```

## 🌐 URLs de Desarrollo

| Componente | URL | Puerto |
|------------|-----|--------|
| **Backend API** | http://localhost:3000 | 3000 |
| **Frontend Web** | http://localhost:3001 | 3001 |
| **App Móvil** | Expo DevTools | Dinámico |

## 🗄️ Estructura de Base de Datos

### Diagrama ER Simplificado
```
usuarios (id, nombre, email, password, rol, created_at)
    ↓ (1:N)
materias (id, nombre, codigo, creditos, catedratico_id, created_at)
    ↓ (1:N)
inscripciones (id, estudiante_id, materia_id, periodo, created_at)
    ↓ (1:N)
notas (id, inscripcion_id, tipo_nota, valor, fecha_registro)
```

### Scripts SQL de Inicialización

#### Crear Tablas
```sql
-- backend/sql/create_tables.sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('estudiante', 'catedratico', 'admin')) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    creditos INTEGER DEFAULT 3,
    descripcion TEXT,
    catedratico_id INTEGER REFERENCES usuarios(id),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER REFERENCES usuarios(id) NOT NULL,
    materia_id INTEGER REFERENCES materias(id) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, materia_id, periodo)
);

CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER REFERENCES inscripciones(id) NOT NULL,
    tipo_nota VARCHAR(50) NOT NULL, -- 'parcial1', 'parcial2', 'final', etc.
    valor DECIMAL(4,2) CHECK (valor >= 0 AND valor <= 100),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por INTEGER REFERENCES usuarios(id)
);
```

#### Datos de Prueba
```sql
-- backend/sql/seed_data.sql
-- Insertar usuario administrador
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Admin', 'Sistema', 'admin@ieproes.edu', '$2b$12$hashedpassword', 'admin');

-- Insertar catedrático de prueba
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Juan', 'Pérez', 'juan.perez@ieproes.edu', '$2b$12$hashedpassword', 'catedratico');

-- Insertar estudiante de prueba
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('María', 'García', 'maria.garcia@ieproes.edu', '$2b$12$hashedpassword', 'estudiante');

-- Insertar materias de prueba
INSERT INTO materias (nombre, codigo, creditos, catedratico_id) VALUES
('Matemáticas I', 'MAT101', 4, 2),
('Física I', 'FIS101', 4, 2),
('Química General', 'QUI101', 3, 2);
```

## 🔐 Configuración de Seguridad

### Autenticación JWT

#### Generar Clave Secreta
```bash
# Generar clave segura de 32 caracteres
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Middleware de Autenticación
```javascript
// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

### Configuración CORS
```javascript
// backend/src/app.js
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

## 🧪 Testing y Calidad

### Configuración de ESLint
```json
// .eslintrc.js
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  }
};
```

### Scripts de Testing
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
  }
}
```

## 🚀 Deployment

### Preparación para Producción

#### Backend
```bash
# Instalar dependencias de producción
npm ci --only=production

# Variables de entorno de producción
NODE_ENV=production
DB_HOST=tu_servidor_db
JWT_SECRET=clave_super_segura_produccion
```

#### Frontend Web
```bash
# Build para producción
npm run build

# Servir archivos estáticos
npm start
```

#### App Móvil
```bash
# Build para Android
expo build:android --release-channel production

# Build para iOS
expo build:ios --release-channel production
```

### Docker (Opcional)

#### Dockerfile Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: ieproes_db
      POSTGRES_USER: ieproes_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Mantenimiento

### Backup de Base de Datos
```bash
# Crear backup
pg_dump -U ieproes_user -h localhost ieproes_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U ieproes_user -h localhost ieproes_db < backup_20240101.sql
```

### Logs del Sistema
```bash
# Ver logs del backend
tail -f backend/logs/app.log

# Ver logs de Next.js
tail -f frontend-web/.next/logs/development.log
```

### Monitoreo
```javascript
// backend/src/middleware/monitoring.js
const monitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
```

## 📞 Soporte y Contacto

### Canales de Soporte
- **📧 Email General**: soporte@ieproes.edu
- **🔧 Soporte Técnico**: dev@ieproes.edu
- **📱 WhatsApp**: +XXX-XXXX-XXXX
- **💬 Slack**: workspace.slack.com

### Reportar Bugs
1. Crear issue en el repositorio
2. Incluir pasos para reproducir
3. Adjuntar logs relevantes
4. Especificar entorno (dev/prod)

---

**📚 Documentación Completa - Sistema IEPROES v1.0.0**