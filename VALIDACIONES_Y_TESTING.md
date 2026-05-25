# 🧪 VALIDACIONES TÉCNICAS Y TESTING

## Pre-Deployment Checklist

### Backend - Validaciones

#### ✅ Controladores Creados

```bash
# Verificar que existan estos archivos:
backend/src/controllers/controllersWeb/personaController.js
backend/src/controllers/controllersWeb/usuarioController.js
backend/src/controllers/controllersWeb/docenteController.js

# Verificar que cada uno exporte un router o funciones
# Los archivos deben estar en inglés o español pero ser consistentes
```

#### ✅ Rutas Registradas

```bash
# Verificar que app.js tenga:
const personasRoutes = require("./routes/routesWeb/personasRoutes");
const usuariosRoutes = require("./routes/routesWeb/usuariosRoutes");
const docentesRoutes = require("./routes/routesWeb/docentesRoutes");

app.use("/api/personas", personasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/docentes", docentesRoutes);
```

#### ✅ Dependencias Instaladas

```bash
# En backend/ ejecutar:
npm list bcryptjs  # Debe estar instalado

# Si no está:
npm install bcryptjs
```

#### ✅ Variables de Entorno

```bash
# Verificar que backend/.env tenga:
DB_HOST=...
DB_PORT=5432
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=...
NODE_ENV=development
PORT=5000
```

---

### Frontend - Validaciones

#### ✅ Tipos TypeScript

```bash
# Verificar que exista y tenga tipos para:
frontend-web/frontend-web/src/types/index.ts

# Tipos necesarios:
export type Persona = { ... }
export type Usuario = { ... }
export type Estudiante = { ... }
export type Docente = { ... }
export type Carrera = { ... }
export type ApiResponse<T> = { ... }
export type ApiListResponse<T> = { ... }

# Verificar tipos con:
cd frontend-web/frontend-web
tsc --noEmit
```

#### ✅ Servicios Creados

```bash
# Verificar que existan:
frontend-web/frontend-web/src/services/personas.service.ts
frontend-web/frontend-web/src/services/usuarios.service.ts
frontend-web/frontend-web/src/services/estudiantes.service.ts

# Cada uno debe exportar funciones:
export const getPersonas = async (filters?) => { ... }
export const crearPersona = async (persona) => { ... }
# etc.
```

#### ✅ Hooks Creados

```bash
# Verificar que exista:
frontend-web/frontend-web/src/hooks/useStudentCreation.ts

# Debe exportar:
export const useStudentCreation = () => { ... }
export type UseStudentCreationReturn = { ... }
```

---

## 🧪 Testing Manual

### 1. Test: Crear Persona

**Endpoint**: `POST /api/personas`

**Request (curl)**:

```bash
curl -X POST http://localhost:5000/api/personas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "primernombre": "Juan",
    "primerapellido": "Pérez",
    "dui": "12345678-9",
    "telefono": "7123456789",
    "direccion": "Calle Principal 123"
  }'
```

**Response Esperado**:

```json
{
  "success": true,
  "message": "Persona creada exitosamente",
  "persona": {
    "idpersona": 1,
    "primernombre": "Juan",
    "primerapellido": "Pérez",
    "dui": "12345678-9",
    "telefono": "7123456789",
    "direccion": "Calle Principal 123",
    "activo": true,
    "fechacreacion": "2024-01-15T10:30:00Z"
  }
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ `success` es `true`
- ✅ `persona.idpersona` es un número > 0
- ✅ `persona.activo` es `true`
- ✅ DUI no duplicado (si repites, debe fallar)

---

### 2. Test: Obtener Personas Disponibles

**Endpoint**: `GET /api/personas/disponibles/estudiante`

**Request (curl)**:

```bash
curl -X GET "http://localhost:5000/api/personas/disponibles/estudiante" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response Esperado**:

```json
{
  "success": true,
  "personas": [
    {
      "idpersona": 1,
      "nombre_completo": "Juan Pérez",
      "dui": "12345678-9",
      "telefono": "7123456789"
    }
  ]
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ Array de personas
- ✅ NO incluye personas ya son estudiantes

---

### 3. Test: Crear Usuario

**Endpoint**: `POST /api/usuarios`

**Request (curl)**:

```bash
curl -X POST http://localhost:5000/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "idpersona": 1,
    "correo": "juan.perez@universidad.edu",
    "clave": "password123456",
    "idrol": 4
  }'
```

**Response Esperado**:

```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "usuario": {
    "idusuario": 1,
    "correo": "juan.perez@universidad.edu",
    "idpersona": 1,
    "idrol": 4,
    "activo": true,
    "fechacreacion": "2024-01-15T10:35:00Z"
  }
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ Contraseña está encriptada (en BD, no en response)
- ✅ `idusuario` es un número > 0
- ✅ Correo no duplicado

**Importante**:

- Nunca devolver contraseña en response
- Verificar que bcrypt encriptó la contraseña en BD

---

### 4. Test: Crear Estudiante (3 pasos)

**Paso 1**: Obtener persona disponible

```bash
# (Ver test anterior)
```

**Paso 2**: Crear usuario con rol ESTUDIANTE

```bash
# idrol 4 = ESTUDIANTE
# (Ver test anterior)
```

**Paso 3**: Crear estudiante
**Endpoint**: `POST /api/estudiantes`

**Request (curl)**:

```bash
curl -X POST http://localhost:5000/api/estudiantes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "idpersona": 1,
    "idusuario": 1,
    "expediente": "EST-2024-001",
    "idcarrera": 1,
    "fechaingreso": "2024-01-15"
  }'
```

**Response Esperado**:

```json
{
  "success": true,
  "message": "Estudiante creado exitosamente",
  "estudiante": {
    "idestudiante": 1,
    "idpersona": 1,
    "idusuario": 1,
    "expediente": "EST-2024-001",
    "idcarrera": 1,
    "fechaingreso": "2024-01-15",
    "activo": true,
    "estado": "ACTIVO"
  }
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ `idestudiante` es un número > 0
- ✅ Expediente no duplicado
- ✅ Persona existe (validación)
- ✅ Usuario existe (validación)
- ✅ Carrera existe (validación)

---

### 5. Test: Crear Docente

**Endpoint**: `POST /api/docentes`

**Request (curl)**:

```bash
curl -X POST http://localhost:5000/api/docentes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "idpersona": 2,
    "idusuario": 2,
    "especialidad": "Matemáticas"
  }'
```

**Response Esperado**:

```json
{
  "success": true,
  "message": "Docente creado exitosamente",
  "docente": {
    "iddocente": 1,
    "idpersona": 2,
    "idusuario": 2,
    "especialidad": "Matemáticas",
    "activo": true
  }
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ Usuario tiene rol DOCENTE
- ✅ Persona existe
- ✅ `iddocente` es un número > 0

---

### 6. Test: Obtener Docentes con Grupos

**Endpoint**: `GET /api/docentes/:id/grupos`

**Request (curl)**:

```bash
curl -X GET "http://localhost:5000/api/docentes/1/grupos" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response Esperado**:

```json
{
  "success": true,
  "grupos": [
    {
      "idgrupo": 1,
      "codigo": "MAT-101-01",
      "materia": "Matemáticas I",
      "horario": "Lunes-Miércoles 8am",
      "cupos": 30
    }
  ]
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ Array de grupos
- ✅ Relaciones correctas con materias y horarios

---

## 🔍 Testing Frontend

### 1. Test: Navegar a Página de Estudiantes

1. Iniciar frontend: `npm run dev` (desde `frontend-web/frontend-web/`)
2. Navegar a http://localhost:3000/estudiantes
3. Verificar que la tabla se carga

**Validaciones**:

- ✅ No hay errores en consola
- ✅ Tabla muestra estudiantes existentes
- ✅ Botón "+ Nuevo Estudiante" visible

---

### 2. Test: Crear Estudiante vía Frontend

1. Click en "+ Nuevo Estudiante"
2. Modal abre con **Paso 1: Persona**

**Paso 1 - Crear Nueva Persona**:

- [ ] Llenar nombre, apellido, DUI, teléfono
- [ ] Click "Siguiente"
- [ ] Verificar que persona se creó (sin errores en consola)

**Paso 2 - Crear Usuario**:

- [ ] Llenar correo, contraseña
- [ ] Click "Siguiente"
- [ ] Verificar que usuario se creó (sin errores en consola)

**Paso 3 - Datos Académicos**:

- [ ] Seleccionar carrera, expediente
- [ ] Click "Crear"
- [ ] Toast de éxito debe aparecer
- [ ] Modal debe cerrarse
- [ ] Tabla debe recargarse con nuevo estudiante

**Validaciones**:

- ✅ No hay errores en consola
- ✅ No hay errores en red (F12 → Network)
- ✅ Estudiante aparece en tabla
- ✅ Datos están correctos

---

### 3. Test: Cambiar Contraseña

**Endpoint**: `PATCH /api/usuarios/:id/cambiar-contrasena`

```bash
curl -X PATCH http://localhost:5000/api/usuarios/1/cambiar-contrasena \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{
    "claveActual": "password123456",
    "claveNueva": "newpassword789012"
  }'
```

**Response Esperado**:

```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

**Validaciones**:

- ✅ Status: 200
- ✅ Clave actual verificada
- ✅ Nueva clave encriptada
- ✅ No permite cambiar sin clave actual

---

## 📊 Checklist de Errores Comunes

### ❌ Errores que pueden ocurrir

| Error                     | Causa                        | Solución                                         |
| ------------------------- | ---------------------------- | ------------------------------------------------ |
| `CORS error`              | CORS no configurado          | Verificar que `cors()` esté en `app.js`          |
| `JWT token invalid`       | Token expirado o inválido    | Re-generar token de login                        |
| `Cannot find module`      | Ruta de require incorrecta   | Verificar paths en requires                      |
| `Contraseña en plaintext` | bcrypt no encriptando        | Verificar `bcryptjs` instalado                   |
| `DUI duplicado`           | Validación no funcionando    | Verificar unique constraint en BD                |
| `Persona no existe`       | Crear estudiante sin persona | Validar que persona se creó primero              |
| `Usuario no existe`       | FK constraint fallo          | Verificar que usuario existe antes de estudiante |
| `404 en endpoints`        | Rutas no registradas         | Verificar `app.use()` en `app.js`                |
| `500 en create`           | Database error               | Ver logs del servidor, verificar BD              |

---

## 🗄️ Checklist de BD

### Verificar que la BD tenga:

```sql
-- Ejecutar en psql o editor SQL de Neon:

-- 1. Verificar personas
SELECT COUNT(*) FROM personas.persona;
SELECT * FROM personas.persona LIMIT 1;

-- 2. Verificar usuarios
SELECT COUNT(*) FROM seguridad.usuario;
SELECT * FROM seguridad.usuario LIMIT 1;
-- Verificar que clave esté hasheada (debe ser $2a$ o $2b$)

-- 3. Verificar estudiantes
SELECT COUNT(*) FROM estudiantes.estudiante;
SELECT * FROM estudiantes.estudiante LIMIT 1;
-- Verificar que tiene idpersona e idusuario

-- 4. Verificar docentes
SELECT COUNT(*) FROM docentes.docente;
SELECT * FROM docentes.docente LIMIT 1;
-- Verificar que tiene idpersona e idusuario

-- 5. Verificar índices
SELECT indexname FROM pg_indexes WHERE tablename = 'persona';
SELECT indexname FROM pg_indexes WHERE tablename = 'usuario';

-- 6. Verificar constraints
SELECT constraint_name, table_name
FROM information_schema.key_column_usage
WHERE table_name IN ('persona', 'usuario', 'estudiante', 'docente')
ORDER BY table_name;
```

---

## 📋 Test Summary

Después de completar todos los tests, crear un reporte:

```markdown
## Resultado de Testing

### Backend ✅ / ❌

- [ ] Crear Persona: ✅
- [ ] Obtener Personas: ✅
- [ ] Crear Usuario: ✅
- [ ] Cambiar Contraseña: ✅
- [ ] Crear Estudiante: ✅
- [ ] Crear Docente: ✅
- [ ] Obtener Docentes: ✅

### Frontend ✅ / ❌

- [ ] Cargar página Estudiantes: ✅
- [ ] Crear Estudiante 3 pasos: ✅
- [ ] Sin errores en consola: ✅
- [ ] Tabla se actualiza: ✅

### BD ✅ / ❌

- [ ] Personas creadas: ✅
- [ ] Usuarios con contraseña encriptada: ✅
- [ ] Estudiantes con relaciones: ✅
- [ ] Docentes con relaciones: ✅
- [ ] Índices creados: ✅

### Errores Encontrados

- Ninguno (o listar si existen)

### Recomendaciones

- ...
```

---

## 🚀 Go/No-Go Checklist

**Antes de ir a Producción**:

- [ ] Todos los tests pasan
- [ ] No hay errores en consola
- [ ] BD está respaldada
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] JWT_SECRET es seguro
- [ ] Contraseñas encriptadas con bcrypt
- [ ] Soft deletes funcionan
- [ ] Relaciones FK validan
- [ ] Índices están creados
- [ ] Diseño visual NO cambió
- [ ] Backend móvil NO se tocó
- [ ] Documentación actualizada
