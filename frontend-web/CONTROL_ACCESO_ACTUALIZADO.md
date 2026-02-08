# 🔐 Control de Acceso por Roles - Frontend Web

## ✅ Cambios Implementados

### 1. Sistema de Permisos (`src/utils/permissions.ts`)
- **ROLES**: Administrador y Catedrático
- **PERMISOS**:
  - `MANAGE_USERS`: Solo Administrador
  - `MANAGE_SUBJECTS`: Administrador y Catedrático
  - `MANAGE_GRADES`: Administrador y Catedrático
  - `VIEW_REPORTS`: Administrador y Catedrático
  - `SYSTEM_CONFIG`: Solo Administrador
  - `VIEW_STATS`: Administrador y Catedrático

### 2. Dashboard Actualizado (`/dashboard`)
- ✅ Botones dinámicos según rol del usuario
- ✅ Iconos agregados a cada acción
- ✅ Estadísticas en tiempo real desde base de datos
- ✅ Carga automática de datos al iniciar
- ✅ Mensaje cuando no hay sesión activa

### 3. Páginas Implementadas

#### 📝 Gestión de Notas (`/grades`)
- ✅ Acceso: Administrador y Catedrático
- ✅ Carga de materias asignadas desde DB
- ✅ Selección de grupo/materia
- ✅ Lista de estudiantes inscritos
- ✅ Ingreso de notas (Parcial 1, Parcial 2, Examen Final)
- ✅ Cálculo automático de nota global
- ✅ Guardado individual por estudiante
- ✅ Actualización automática después de guardar
- ✅ Fórmula: (P1+P2)/2 × 0.6 + Final × 0.4

#### 📚 Gestión de Materias (`/subjects`)
- ✅ Acceso: Administrador y Catedrático
- ✅ Carga de materias/grupos desde DB
- ✅ Vista diferenciada por rol:
  - Admin: todas las materias
  - Catedrático: solo sus materias asignadas
- ✅ Modal de detalles funcional
- ✅ Información completa: código, créditos, ciclo, docente, inscritos
- ✅ Navegación directa a gestión de notas
- ✅ Estadísticas en tiempo real

#### 📊 Reportes (`/reports`)
- ✅ Acceso: Administrador y Catedrático
- ⏳ Tipos de reportes (pendiente conectar con DB):
  - Rendimiento académico
  - Asistencia
  - Materias
  - Graduados
  - Inscripciones
  - Pagos

#### 👥 Gestión de Usuarios (`/users`)
- ✅ Acceso: Solo Administrador
- ⏳ Pendiente: conectar con DB
- ⏳ Pendiente: CRUD de usuarios

#### ⚙️ Configuración (`/config`)
- ✅ Acceso: Solo Administrador
- ⏳ Pendiente: guardar en DB
- Opciones:
  - Información institucional
  - Configuración académica
  - Seguridad
  - Notificaciones

### 4. Páginas Protegidas
- ✅ `/users` - Solo Administrador
- ✅ `/subjects` - Administrador y Catedrático (con datos reales)
- ✅ `/grades` - Administrador y Catedrático (con datos reales)
- ✅ `/reports` - Administrador y Catedrático
- ✅ `/config` - Solo Administrador

## 🎯 Diferencias por Rol

### 👨💼 Administrador
Tiene acceso a TODO:
- ✅ Gestionar usuarios
- ✅ Ver todas las materias/grupos
- ✅ Gestionar notas de cualquier grupo
- ✅ Ver reportes
- ✅ Configuración del sistema
- ✅ Asignar catedráticos (pendiente)
- ✅ Mover estudiantes entre grupos (pendiente)

### 👨🏫 Catedrático
Acceso limitado:
- ❌ Gestionar usuarios (NO)
- ✅ Ver solo sus materias asignadas
- ✅ Gestionar notas de sus grupos
- ✅ Ver reportes
- ❌ Configuración del sistema (NO)
- ❌ Asignar catedráticos (NO)
- ❌ Mover estudiantes (NO)

## 🔑 Credenciales de Prueba

### Administrador
```
Correo: MP26I01@uni.edu
Clave: 160404
```

### Catedrático
```
Correo: AA26I00@uni.edu
Clave: 310870
```

## 🔄 Endpoints Backend Implementados

```
✅ POST /api/auth/login
✅ GET  /api/dashboard/stats
✅ GET  /api/grupos?idUsuario=X&rol=Y
✅ GET  /api/grupos/:idgrupo/estudiantes
✅ POST /api/grupos/notas
```

## 🚀 Próximos Pasos

### 🔴 Alta Prioridad (Funcionalidad Core)

1. ⏳ **Gestión de Catedráticos** (Admin)
   - Endpoint: `GET /api/docentes`
   - Endpoint: `POST /api/grupos/:idgrupo/asignar-docente`
   - Frontend: Página `/teachers` o modal en `/subjects`
   - Listar todos los catedráticos
   - Ver materias asignadas por catedrático
   - Asignar/reasignar catedrático a grupo

2. ⏳ **Mover Estudiantes entre Grupos** (Admin)
   - Endpoint: `PUT /api/inscripciones/:idinscripcion/cambiar-grupo`
   - Endpoint: `GET /api/grupos/:idgrupo/cupo-disponible`
   - Frontend: Modal en `/subjects` o `/grades`
   - Listar estudiantes del grupo actual
   - Seleccionar grupo destino
   - Validar cupo disponible
   - Transferir inscripción

3. ⏳ **Validaciones de Notas**
   - Frontend: Validación en tiempo real
   - Rango 0-10
   - Máximo 2 decimales
   - Confirmación antes de guardar
   - Mensaje de éxito/error

4. ⏳ **Gestión de Usuarios desde DB** (`/users`)
   - Endpoint: `GET /api/usuarios`
   - Endpoint: `POST /api/usuarios`
   - Endpoint: `PUT /api/usuarios/:id`
   - Endpoint: `DELETE /api/usuarios/:id`
   - Listar usuarios reales
   - Crear nuevo usuario
   - Editar usuario existente
   - Eliminar usuario
   - Asignar rol

### 🟡 Media Prioridad (Mejoras UX)

5. ⏳ **Búsqueda y Filtros**
   - Buscar materias por código/nombre
   - Filtrar por ciclo académico
   - Buscar estudiantes por carnet/nombre
   - Filtrar por estado académico

6. ⏳ **Sistema de Notificaciones**
   - Toast messages para acciones exitosas
   - Alertas de error descriptivas
   - Confirmaciones antes de acciones críticas
   - Notificaciones de guardado

7. ⏳ **Reportes Funcionales** (`/reports`)
   - Endpoint: `GET /api/reportes/rendimiento`
   - Endpoint: `GET /api/reportes/asistencia`
   - Endpoint: `GET /api/reportes/materias`
   - Generar PDF de notas
   - Reporte de rendimiento académico
   - Estadísticas por materia
   - Exportar a Excel

8. ⏳ **Gestión de Ciclos Académicos**
   - Endpoint: `GET /api/ciclos`
   - Endpoint: `POST /api/ciclos`
   - Crear nuevo ciclo
   - Activar/desactivar ciclo
   - Filtrar datos por ciclo

### 🟢 Baja Prioridad (Optimizaciones)

9. ⏳ **Configuración Persistente** (`/config`)
   - Endpoint: `GET /api/configuracion`
   - Endpoint: `PUT /api/configuracion`
   - Guardar configuraciones en DB
   - Parámetros del sistema
   - Nota mínima de aprobación
   - Máximo de materias por ciclo

10. ⏳ **Historial de Cambios**
    - Endpoint: `GET /api/auditoria`
    - Log de cambios en notas
    - Quién modificó qué y cuándo
    - Historial de inscripciones

11. ⏳ **Dashboard Mejorado**
    - Gráficas de rendimiento
    - Tendencias por ciclo
    - Comparativas entre materias
    - Actividad reciente real desde DB

12. ⏳ **Optimizaciones de Performance**
    - Paginación en listados
    - Caché de datos frecuentes
    - Lazy loading de componentes
    - Optimización de queries

## 📊 Estado Actual del Proyecto

### ✅ Completado (70%)
- Autenticación y autorización
- Dashboard con estadísticas reales
- Gestión de materias (lectura)
- Gestión de notas (CRUD completo)
- Control de acceso por roles
- Estructura de base de datos
- API endpoints básicos

### ⏳ En Progreso (20%)
- Validaciones de formularios
- Mensajes de error/éxito
- Gestión de usuarios

### 📋 Pendiente (10%)
- Gestión de catedráticos
- Mover estudiantes
- Reportes funcionales
- Búsqueda y filtros avanzados
- Sistema de notificaciones

## 🎯 Recomendación de Implementación

**Orden sugerido para máximo impacto:**

1. **Validaciones de notas** (rápido, mejora UX)
2. **Gestión de usuarios** (funcionalidad core)
3. **Gestión de catedráticos** (funcionalidad core)
4. **Sistema de notificaciones** (mejora UX)
5. **Mover estudiantes** (funcionalidad avanzada)
6. **Búsqueda y filtros** (mejora UX)
7. **Reportes** (valor agregado)
8. Resto según necesidad
