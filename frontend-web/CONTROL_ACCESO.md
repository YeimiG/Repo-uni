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
- ✅ Mensaje cuando no hay sesión activa

### 3. Nuevas Páginas Creadas

#### 📝 Gestión de Notas (`/grades`)
- Acceso: Administrador y Catedrático
- Funcionalidades:
  - Seleccionar materia y periodo
  - Ingresar notas por estudiante
  - Guardar calificaciones

#### 📊 Reportes (`/reports`)
- Acceso: Administrador y Catedrático
- Tipos de reportes:
  - Rendimiento académico
  - Asistencia
  - Materias
  - Graduados
  - Inscripciones
  - Pagos

#### ⚙️ Configuración (`/config`)
- Acceso: Solo Administrador
- Opciones:
  - Información institucional
  - Configuración académica
  - Seguridad
  - Notificaciones

### 4. Páginas Protegidas
- ✅ `/users` - Solo Administrador
- ✅ `/subjects` - Administrador y Catedrático
- ✅ `/grades` - Administrador y Catedrático
- ✅ `/reports` - Administrador y Catedrático
- ✅ `/config` - Solo Administrador

## 🎯 Diferencias por Rol

### 👨‍💼 Administrador
Tiene acceso a TODO:
- ✅ Gestionar usuarios
- ✅ Administrar materias
- ✅ Gestionar notas
- ✅ Ver reportes
- ✅ Configuración del sistema

### 👨‍🏫 Catedrático
Acceso limitado:
- ❌ Gestionar usuarios (NO)
- ✅ Administrar materias
- ✅ Gestionar notas
- ✅ Ver reportes
- ❌ Configuración del sistema (NO)

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

## 🚀 Próximos Pasos

1. Conectar páginas con el backend (API calls)
2. Implementar funcionalidad de guardar notas
3. Generar reportes reales desde la base de datos
4. Agregar validaciones en formularios
5. Implementar búsqueda y filtros funcionales
