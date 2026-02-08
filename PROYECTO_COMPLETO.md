# ✅ Sistema de Gestión Académica IEPROES - Completado

## 🎯 Funcionalidades Implementadas

### 1. 🔐 Autenticación y Autorización
- ✅ Login con JWT
- ✅ Control de acceso por roles (Administrador, Catedrático)
- ✅ Protección de rutas
- ✅ Sesión persistente

### 2. 📊 Dashboard
- ✅ Estadísticas en tiempo real desde DB
- ✅ Actividad reciente (inscripciones, notas)
- ✅ Acciones rápidas según rol
- ✅ Carga paralela de datos

### 3. 📚 Gestión de Materias
- ✅ Listar materias/grupos según rol
- ✅ Modal de detalles completo
- ✅ Búsqueda en tiempo real
- ✅ Asignar docente a grupo (Admin)
- ✅ Mover estudiantes entre grupos (Admin)
- ✅ Validación de cupo disponible

### 4. 📝 Gestión de Notas
- ✅ Selección de materia/grupo
- ✅ Lista de estudiantes inscritos
- ✅ Ingreso de notas (Parcial 1, Parcial 2, Examen Final)
- ✅ Cálculo automático: (P1+P2)/2 × 0.6 + Final × 0.4
- ✅ Validaciones: rango 0-10, máximo 2 decimales
- ✅ Confirmación antes de guardar
- ✅ Guardado individual por estudiante
- ✅ Actualización automática

### 5. 👥 Gestión de Usuarios
- ✅ Listar usuarios desde DB
- ✅ Búsqueda en tiempo real
- ✅ Vista por rol

### 6. 🔔 Sistema de Notificaciones
- ✅ Toast messages (success, error, info, warning)
- ✅ Auto-cierre configurable
- ✅ Animaciones

### 7. 📊 Reportes
- ✅ Estructura de página
- ⏳ Pendiente: conectar con DB

### 8. ⚙️ Configuración
- ✅ Estructura de página (Solo Admin)
- ⏳ Pendiente: persistencia en DB

## 🔄 Endpoints Backend

```
✅ POST /api/auth/login
✅ GET  /api/dashboard/stats
✅ GET  /api/dashboard/actividad
✅ GET  /api/grupos?idUsuario=X&rol=Y
✅ GET  /api/grupos/:idgrupo/estudiantes
✅ POST /api/grupos/notas
✅ GET  /api/admin/usuarios
✅ GET  /api/admin/docentes
✅ PUT  /api/admin/grupos/:id/asignar-docente
✅ PUT  /api/admin/inscripciones/:id/mover
✅ GET  /api/admin/materias/:id/grupos-disponibles
```

## 📋 Estructura de Base de Datos

### Esquemas:
- `seguridad` - Usuarios y roles
- `academico` - Estudiantes, docentes, materias, grupos, carreras, ciclos
- `registro` - Inscripciones y notas

### Tablas Principales:
```sql
seguridad.usuario (idusuario, correo, clave, idrol)
seguridad.rol (idrol, nombrerol)

academico.estudiante (idestudiante, expediente, nombre, apellidos, idusuario)
academico.docente (iddocente, nombres, apellidos, especialidad, idusuario)
academico.materia (idmateria, codigomateria, nombre, unidadesvalorativas)
academico.grupo (idgrupo, cupomaximo, idmateria, iddocente, idciclo)
academico.cicloacademico (idciclo, año, periodo)

registro.inscripcion (idinscripcion, idestudiante, idgrupo, fechainscripcion)
registro.notas (idnota, primero, segundo, tercero, notafinal, idinscripcion)
```

## 🎨 Componentes Frontend

### Páginas:
- `/login` - Autenticación
- `/dashboard` - Panel principal
- `/subjects` - Gestión de materias
- `/grades` - Gestión de notas
- `/users` - Gestión de usuarios
- `/reports` - Reportes
- `/config` - Configuración

### Componentes:
- `Toast` - Notificaciones
- `ClientOnly` - Wrapper para SSR
- `Navbar`, `Sidebar` - Navegación
- `Loading`, `Error` - Estados

### Hooks:
- `useAuth` - Autenticación
- `useToast` - Notificaciones

### Servicios:
- `auth.service` - Login/logout
- `dashboard.service` - Estadísticas
- `materias.service` - Materias y notas
- `admin.service` - Administración

## 🔑 Credenciales de Prueba

### Administrador:
```
Correo: MP26I01@uni.edu
Clave: 160404
```

### Catedrático:
```
Correo: AA26I00@uni.edu
Clave: 310870
```

## 🚀 Cómo Ejecutar

### Backend:
```bash
cd backend
npm install
npm run dev
# Puerto: 3000
```

### Frontend:
```bash
cd frontend-web/frontend-web
npm install
npm run dev
# Puerto: 3001
```

### Variables de Entorno:

**Backend (.env):**
```
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=DB_UNI
PG_PASSWORD=root
PG_PORT=5433
PORT=3000
JWT_SECRET=ieproes_secret_key_2024_sistema_academico
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📊 Estado del Proyecto

### ✅ Completado (85%)
- Autenticación y autorización
- Dashboard completo con datos reales
- Gestión de materias (CRUD + asignaciones)
- Gestión de notas (CRUD completo con validaciones)
- Gestión de usuarios (lectura)
- Sistema de notificaciones
- Búsqueda y filtros
- Control de acceso por roles

### ⏳ Pendiente (15%)
- Reportes funcionales con generación de PDF
- CRUD completo de usuarios
- Gestión de ciclos académicos
- Configuración persistente
- Historial de cambios (auditoría)
- Gráficas y estadísticas avanzadas

## 🎯 Características Destacadas

1. **Validaciones Robustas**: Notas entre 0-10, máximo 2 decimales
2. **Confirmaciones**: Antes de acciones críticas
3. **Notificaciones**: Toast messages elegantes
4. **Búsqueda en Tiempo Real**: En materias y usuarios
5. **Carga Optimizada**: Paralela de datos
6. **Responsive**: Diseño adaptable
7. **Seguridad**: JWT, roles, validaciones
8. **UX Mejorada**: Estados de carga, mensajes claros

## 🏆 Logros Técnicos

- ✅ Arquitectura limpia (MVC en backend)
- ✅ Componentes reutilizables
- ✅ Hooks personalizados
- ✅ TypeScript en frontend
- ✅ Queries optimizadas con JOINs
- ✅ Manejo de errores robusto
- ✅ Validaciones en frontend y backend
- ✅ Sistema de permisos granular

## 📝 Notas Importantes

1. Las notas se calculan automáticamente: (P1+P2)/2 × 0.6 + Final × 0.4
2. Solo Admin puede asignar docentes y mover estudiantes
3. Se valida cupo disponible antes de mover estudiantes
4. Las búsquedas son case-insensitive
5. Los toast se auto-cierran en 3 segundos

## 🎓 Próximas Mejoras Sugeridas

1. Generación de reportes en PDF
2. Exportar datos a Excel
3. Gráficas de rendimiento
4. Sistema de notificaciones por email
5. Historial de cambios en notas
6. Backup automático
7. Modo oscuro
8. Paginación en listados grandes
