# Sistema Web IEPROES — Documentación de Funcionalidades

## Arquitectura General

El sistema está dividido en tres módulos:
- **Backend** — Node.js + Express + PostgreSQL (puerto 3001)
- **Frontend Web** — Next.js 16 + TypeScript + Tailwind (puerto 3000)
- **Frontend Móvil** — Expo + React Native (para estudiantes)

---

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `SUPER_ADMIN` | Acceso total. Puede hacer todo lo que hace ADMIN_ACADEMICO más configuración del sistema |
| `ADMIN_ACADEMICO` | Gestión académica completa: usuarios, estudiantes, materias, notas, períodos, permisos |
| `COORDINADOR` | Igual que ADMIN_ACADEMICO en permisos de gestión académica |
| `DOCENTE` | Solo ve sus materias asignadas. Ingresa notas únicamente cuando el admin le habilita el permiso |
| `SECRETARIA` | Puede gestionar usuarios y estudiantes, ver reportes |
| `ADMIN_FINANCIERO` | Solo puede ver reportes y estadísticas |

---

## Módulos del Frontend Web

### 1. Login (`/login`)
- Autenticación con correo y contraseña
- El token JWT se guarda en `localStorage`
- Redirige automáticamente al dashboard si ya hay sesión activa

---

### 2. Dashboard (`/dashboard`)
- Muestra estadísticas generales: total de estudiantes, docentes, materias y calificaciones
- Las tarjetas de estadísticas solo aparecen para roles con permiso `VIEW_STATS`
- Muestra acciones rápidas filtradas según el rol del usuario
- Muestra actividad reciente del sistema (últimas inscripciones y notas)
- Cada usuario ve solo las acciones que le corresponden

---

### 3. Gestión de Usuarios (`/users`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA
- Listar todos los usuarios del sistema con su rol y estado
- Crear nuevo usuario: nombre, apellido, correo, contraseña, rol
- Editar usuario: puede cambiar nombre, correo y contraseña
- Activar / Desactivar usuario (toggle)
- Exportar lista a CSV
- Buscador en tiempo real por nombre, correo o rol

---

### 4. Gestión de Estudiantes (`/estudiantes`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA
- Listar todos los estudiantes con expediente, carrera y estado
- Crear estudiante: nombre, apellido, expediente, correo, contraseña, carrera, fecha de ingreso
- Editar estudiante: nombre, correo, carrera, estado académico
- Activar / Desactivar estudiante
- Exportar a CSV
- Estadísticas rápidas: total, activos, inactivos, carreras

---

### 5. Inscripciones (`/inscripciones`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR
- Ver todas las inscripciones con filtro por período
- Inscribir un estudiante a un grupo (solo grupos del período activo)
- Retirar una inscripción activa
- Ver estado de la inscripción (INSCRITO / RETIRADO) y nota final
- Estadísticas: total, inscritos, retirados, aprobados

---

### 6. Materias y Grupos (`/subjects`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR (gestión completa) / DOCENTE (solo lectura de sus grupos)
- Vista en tarjetas de todos los grupos activos
- Para **admin**: crear nueva materia (código, nombre, UV, horas, tipo)
- Para **admin**: crear nuevo grupo (materia, período, docente, cupo)
- Para **admin**: asignar docente a un grupo
- Para **admin**: mover estudiante de un grupo a otro (verifica cupo)
- Para **docente**: solo ve sus grupos asignados con un aviso informativo
- Desde cada tarjeta se puede ir directamente a gestionar notas

---

### 7. Gestión Académica — Notas con Permisos (`/academica`) ⭐ NUEVO
- **Quién accede:** DOCENTE (vista principal), ADMIN_ACADEMICO, SUPER_ADMIN, COORDINADOR
- Panel izquierdo: lista de materias/grupos asignados al usuario
- Panel derecho: tabla de estudiantes con campos de notas (Parcial 1, 2, 3)
- **Para DOCENTE:**
  - Solo puede editar los parciales que el administrador le haya habilitado
  - Cada parcial muestra su estado: 🔒 Bloqueado / ✓ Habilitado / Editado
  - Una vez que edita un parcial, queda marcado como "Editado" y se bloquea
  - Si no tiene permisos, aparece un aviso para contactar al administrador
- **Para ADMIN:**
  - Acceso total a todos los parciales sin restricciones
  - Indicador visual "Admin — acceso total"
- Botón "Guardar Todo" para guardar notas de todos los estudiantes a la vez
- Botón individual por estudiante para guardar uno a la vez
- Promedio calculado automáticamente en tiempo real

---

### 8. Calificaciones (`/grades`)
- **Quién accede:** Todos los roles con permiso `MANAGE_GRADES`
- Vista alternativa de notas con 5 parciales (P1 a P5)
- Selector de grupo/materia
- Escala 0–10, aprobado con 6 o más
- Guardar nota individual o todas a la vez
- Promedio calculado automáticamente, en verde si ≥ 6, en rojo si < 6

---

### 9. Reportes (`/reports`)
- **Quién accede:** Todos los roles (incluyendo ADMIN_FINANCIERO y SECRETARIA)
- **Tab Rendimiento:** tabla por materia con total de notas, promedio, aprobados, reprobados y barra de % aprobación
- **Tab Estadísticas:** tarjetas con totales globales del sistema
- **Tab Historial Estudiante:** seleccionar un estudiante y ver todo su historial académico por ciclo
- Exportar cualquier reporte a CSV o TXT

---

### 10. Períodos Académicos (`/periodos`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO
- Listar todos los períodos con fechas y estado
- Crear período: nombre, año, número de período, fechas de inicio/fin, fechas de inscripciones
- Editar período existente
- Activar un período (desactiva automáticamente el anterior)
- El período activo se resalta en verde

---

### 11. Permisos de Notas (`/permisos`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO
- **Sección 1 — Períodos de Ingreso:** activar/desactivar ventanas de tiempo para ingreso de notas
- **Sección 2 — Habilitar Permiso:** seleccionar catedrático + materia + grupo y marcar qué parciales puede editar (P1, P2, P3)
- **Sección 3 — Permisos Activos:** tabla con todos los permisos configurados, mostrando si cada parcial está habilitado o ya fue editado
- Botón "Resetear" para permitir que el catedrático vuelva a editar un parcial ya editado

---

### 12. Configuración (`/config`)
- **Quién accede:** SUPER_ADMIN, ADMIN_ACADEMICO
- Información institucional: nombre, dirección, teléfono, correo
- Configuración académica: ciclo actual, nota mínima de aprobación, máximo de materias, número de parciales
- Seguridad: tiempo de sesión, intentos máximos de login, bloqueo automático
- Notificaciones: preferencias de alertas por email

---

## Flujo Típico por Rol

### Flujo del SUPER_ADMIN / ADMIN_ACADEMICO
1. Crear períodos académicos en `/periodos`
2. Crear materias y grupos en `/subjects`
3. Crear usuarios docentes en `/users`
4. Asignar docentes a grupos en `/subjects`
5. Crear/importar estudiantes en `/estudiantes`
6. Inscribir estudiantes a grupos en `/inscripciones`
7. Habilitar permisos de notas a docentes en `/permisos`
8. Ver reportes en `/reports`

### Flujo del DOCENTE
1. Ingresar al sistema → ver dashboard con sus materias
2. Ir a `/academica` → ver sus grupos asignados
3. Seleccionar un grupo → ver estudiantes
4. Ingresar notas en los parciales habilitados por el admin
5. Guardar notas (individual o todo a la vez)

### Flujo de la SECRETARIA
1. Crear y gestionar usuarios en `/users`
2. Crear y gestionar estudiantes en `/estudiantes`
3. Ver reportes en `/reports`

---

## Control de Acceso (Permisos)

```
MANAGE_USERS    → SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA
MANAGE_SUBJECTS → SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE
MANAGE_GRADES   → SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE
VIEW_REPORTS    → Todos los roles del sistema web
SYSTEM_CONFIG   → SUPER_ADMIN, ADMIN_ACADEMICO
VIEW_STATS      → Todos los roles del sistema web
```

Cada página verifica el permiso al cargar. Si el usuario no tiene acceso, ve una pantalla de "Acceso Denegado" con botón para volver al dashboard.

---

## Tecnologías Utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend Web | Next.js 16, TypeScript, Tailwind CSS 4 |
| Frontend Móvil | Expo 54, React Native 0.81, React Navigation |
| Backend | Node.js, Express 5, JWT, bcryptjs |
| Base de Datos | PostgreSQL (esquemas: seguridad, academico, grupos, inscripciones, evaluaciones, docentes, estudiantes, personas, configuracion) |
| HTTP Client | Axios 1.15.2 |
| Estado del servidor | TanStack Query v5 |

---

## Endpoints Principales del Backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login web |
| GET | `/api/admin/usuarios` | Listar usuarios |
| POST | `/api/admin/usuarios` | Crear usuario |
| GET | `/api/grupos` | Listar grupos (filtra por rol) |
| GET | `/api/grupos/:id/estudiantes` | Estudiantes de un grupo |
| POST | `/api/grupos/notas` | Guardar notas (admin) |
| GET | `/api/catedratico/materias/:id` | Materias del catedrático |
| POST | `/api/catedratico/notas` | Guardar notas con control de permisos |
| GET | `/api/catedratico/permisos/:idCat/:idGrupo` | Permisos del catedrático |
| POST | `/api/admin/permisos-edicion` | Habilitar permiso de edición |
| GET | `/api/reportes/rendimiento` | Reporte de rendimiento |
| GET | `/api/reportes/estadisticas` | Estadísticas generales |
| GET | `/api/reportes/estudiante/:id` | Historial de un estudiante |
