# 📋 IEPROES — DOCUMENTO MAESTRO DEL PROYECTO
> Última actualización: Marzo 2026 | DB: DB_UNI_II | Puerto PG: 5433

---

## 🗂️ ÍNDICE
1. [Estado del Proyecto](#estado)
2. [Arquitectura](#arquitectura)
3. [Base de Datos DB_UNI_II](#base-de-datos)
4. [Credenciales](#credenciales)
5. [Backend — Lo que está hecho](#backend-hecho)
6. [Frontend Web — Lo que está hecho](#frontend-web-hecho)
7. [App Móvil — Lo que está hecho](#movil-hecho)
8. [Pendientes](#pendientes)
9. [Endpoints completos](#endpoints)
10. [Inicio rápido](#inicio-rapido)
11. [Solución de problemas](#troubleshooting)

---

## 1. ESTADO DEL PROYECTO <a name="estado"></a>

| Componente | Estado | Notas |
|------------|--------|-------|
| Backend Web | ✅ Funcional | Todos los controladores apuntan a DB_UNI_II |
| Frontend Web | ✅ Funcional | Todas las páginas con Sidebar y roles |
| App Móvil | ✅ Funcional (básico) | Login + Perfil funcionando |
| Base de Datos | ⚠️ Datos mínimos | Solo 1 estudiante de prueba, sin grupos/materias |

---

## 2. ARQUITECTURA <a name="arquitectura"></a>

```
Repo-uni/
├── backend/                  ← API Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/      ← Lógica de negocio web
│   │   │   ├── controllersApp/  ← Lógica móvil (NO TOCAR)
│   │   ├── routes/           ← Rutas web
│   │   │   ├── routesMobile/ ← Rutas móvil (NO TOCAR)
│   │   └── config/db.js      ← Pool PostgreSQL
│   └── .env                  ← Variables de entorno
├── frontend-web/frontend-web/ ← Next.js 16 + Tailwind
│   └── src/
│       ├── app/              ← Páginas (login, dashboard, users, grades, subjects, reports, config)
│       ├── components/       ← Sidebar, Toast, Loading, Error, Navbar
│       ├── services/         ← Llamadas a la API
│       ├── hooks/            ← useAuth, useToast
│       └── utils/            ← permissions.ts, export.ts
└── Frontend-movl/            ← React Native + Expo
    └── src/
        ├── screens/          ← LoginScreen, PerfilScreen, ServiciosScreen
        ├── services/         ← api.js, loginApp.js
        └── navigation/       ← AppNavigator.js
```

---

## 3. BASE DE DATOS DB_UNI_II <a name="base-de-datos"></a>

### Conexión
```
Host:     localhost
Puerto:   5433  ← NO es el 5432 estándar
DB:       DB_UNI_II
Usuario:  postgres
Password: root  (cambiar según tu instalación)
```

### Schemas (13 en total)
| Schema | Uso |
|--------|-----|
| `seguridad` | Usuarios, roles, permisos ✅ igual que antes |
| `personas` | Datos personales (nombre, apellido) — NUEVO |
| `estudiantes` | Estudiantes, estados, becas — antes en `academico` |
| `docentes` | Docentes, contratos — antes en `academico` |
| `academico` | Carreras, materias, períodos, planes ✅ parcialmente igual |
| `grupos` | Grupos, horarios — antes en `academico` |
| `inscripciones` | Inscripciones — antes en `registro` |
| `evaluaciones` | Notas (nota1-nota5) — antes `registro.notas` con primero/segundo/tercero |
| `pagos` | Facturas, pagos |
| `asistencia` | Control de asistencia |
| `extension` | Actividades de extensión |
| `proyectos` | Proyectos de graduación |
| `public` | Vacío |

### Diferencias críticas con DB_UNI anterior
| Concepto | DB_UNI (anterior) | DB_UNI_II (actual) |
|----------|-------------------|---------------------|
| Estudiantes | `academico.estudiante` | `estudiantes.estudiante` |
| Docentes | `academico.docente` | `docentes.docente` |
| Grupos | `academico.grupo` | `grupos.grupo` |
| Inscripciones | `registro.inscripcion` | `inscripciones.inscripcion` |
| Notas | `registro.notas` (primero/segundo/tercero) | `evaluaciones.notafinal` (nota1..nota5) |
| Nombre/Apellido | Directo en la tabla | Via JOIN con `personas.persona` |
| Roles | `Administrador`, `Catedrático` | `SUPER_ADMIN`, `DOCENTE`, etc. |

### Tablas clave — estructura
```sql
-- Usuarios
seguridad.usuario: idusuario, correo, clave, idrol, activo, fechacreacion, bloqueado

-- Roles
seguridad.rol: idrol, nombrerol, niveljerarquico

-- Personas (nombre/apellido de todos)
personas.persona: idpersona, primernombre, primerapellido, segundonombre, segundoapellido, activo

-- Estudiantes
estudiantes.estudiante: idestudiante, idpersona, expediente, idcarrera, idplanestudio,
                        idestado, idusuario, indiceglobal, creditosacumulados, activo

-- Docentes
docentes.docente: iddocente, idpersona, codigodocente, especialidad, idusuario, activo

-- Grupos
grupos.grupo: idgrupo, codigo, idmateria, iddocente, idperiodo, cupomaximo, cupoactual, estado

-- Inscripciones
inscripciones.inscripcion: idinscripcion, idestudiante, idgrupo, fechainscripcion, estado

-- Notas (5 parciales)
evaluaciones.notafinal: idnotafinal, idinscripcion, nota1, nota2, nota3, nota4, nota5,
                        notapromedio, notafinal, letracalificacion, estado, fecharegistro

-- Períodos académicos
academico.periodoacademico: idperiodo, nombre, año, numeroperiodo, fechainicio, fechafin,
                            fechamaximasubirnotas, estado, activo

-- Materias
academico.materia: idmateria, codigo, nombre, unidadesvalorativas, activo

-- Carreras
academico.carrera: idcarrera, nombre, idescuela, activo
```

### Datos actuales en DB_UNI_II
| Tabla | Registros |
|-------|-----------|
| `seguridad.usuario` | 8 usuarios de prueba |
| `personas.persona` | 3 personas |
| `estudiantes.estudiante` | 1 (Miguel Vásquez, vinculado a idusuario=9) |
| `docentes.docente` | 0 |
| `academico.materia` | 0 |
| `grupos.grupo` | 0 |
| `inscripciones.inscripcion` | 0 |
| `evaluaciones.notafinal` | 0 |
| `academico.facultad` | 1 |
| `academico.escuela` | 1 |
| `academico.carrera` | 1 (Ingeniería en Sistemas) |
| `academico.planestudio` | 1 |
| `estudiantes.estadoestudiante` | 1 (Activo) |

---

## 4. CREDENCIALES <a name="credenciales"></a>

### DB_UNI_II — Usuarios del sistema
| Correo | Clave | Rol | Acceso |
|--------|-------|-----|--------|
| admin@sistema.edu.sv | Admin2026 | SUPER_ADMIN | Web ✅ |
| ana.guardado@uni.edu.sv | Academico2026 | ADMIN_ACADEMICO | Web ✅ |
| carlos.hernandez@uni.edu.sv | Finanzas2026 | ADMIN_FINANCIERO | Web ✅ |
| laura.martinez@uni.edu.sv | Coordina2026 | COORDINADOR | Web ✅ |
| julio.cesar@uni.edu.sv | Maestro2026 | DOCENTE | Web ✅ |
| karla.rivas@uni.edu.sv | Secre2026 | SECRETARIA | Web ✅ |
| miguel.vasquez@estudiante.edu.sv | Estudiante2026 | ESTUDIANTE | App Móvil ✅ |
| rosa.vasquez@tutor.edu.sv | Tutor2026 | TUTOR | ❌ Sin acceso |

### .env del backend
```env
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=DB_UNI_II
PG_PASSWORD=root
PG_PORT=5433
PORT=3000
JWT_SECRET=ieproes_secret_key_2024_sistema_academico
```
> ⚠️ Sin comentarios en la misma línea — ya corregido

### .env.local del frontend web
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 5. BACKEND — LO QUE ESTÁ HECHO <a name="backend-hecho"></a>

### Controladores web actualizados a DB_UNI_II
| Controlador | Estado | Funciones |
|-------------|--------|-----------|
| `loginController.js` | ✅ | Login con nombre real desde personas.persona, bloquea ESTUDIANTE/TUTOR |
| `adminController.js` | ✅ | getUsuarios, getDocentes, asignarDocente, moverEstudiante, getGruposDisponibles, getRoles, crearUsuario, editarUsuario, toggleUsuario, + permisos de notas |
| `dashboardController.js` | ✅ | getStats, getActividad |
| `materiasController.js` | ✅ | getMaterias (por rol), getEstudiantesPorGrupo (5 parciales), guardarNotas (nota1-nota5) |
| `reportesController.js` | ✅ | getRendimiento, getEstadisticas |
| `materiaController.js` | ✅ | academico.materia (minúsculas) |
| `estudianteController.js` | ✅ | estudiantes.estudiante + personas.persona |

### Controladores móviles (NO MODIFICAR)
| Controlador | Estado | Notas |
|-------------|--------|-------|
| `authMobileController.js` | ✅ | Login móvil con JOIN a estudiantes + personas, filtra solo ESTUDIANTE |
| `perfilController.js` | ✅ | Perfil con carrera y estado académico |
| `loginControllerApp.js` | ✅ | Alternativo, mismo resultado |

### Rutas disponibles
```
POST /api/auth/login
GET  /api/dashboard/stats
GET  /api/dashboard/actividad
GET  /api/grupos?idUsuario=X&rol=Y
GET  /api/grupos/:idgrupo/estudiantes
POST /api/grupos/notas
GET  /api/admin/usuarios
POST /api/admin/usuarios
PUT  /api/admin/usuarios/:id
PATCH /api/admin/usuarios/:id/toggle
GET  /api/admin/roles
GET  /api/admin/docentes
PUT  /api/admin/grupos/:idgrupo/asignar-docente
PUT  /api/admin/inscripciones/:idinscripcion/mover
GET  /api/admin/materias/:idmateria/grupos-disponibles
GET  /api/admin/periodos-notas
PUT  /api/admin/periodos-notas/:id
GET  /api/admin/permisos-edicion
POST /api/admin/permisos-edicion
PUT  /api/admin/permisos-edicion/:id/resetear
GET  /api/reportes/rendimiento
GET  /api/reportes/estadisticas
POST /api/app/login
GET  /api/app/perfil/:idUsuario
```

---

## 6. FRONTEND WEB — LO QUE ESTÁ HECHO <a name="frontend-web-hecho"></a>

### Páginas implementadas
| Página | Roles con acceso | Funciones |
|--------|-----------------|-----------|
| `/login` | Todos (empleados) | Login con show/hide password, badges de roles |
| `/dashboard` | Todos | Stats por rol, acciones rápidas contextuales, actividad reciente |
| `/users` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA | Tabla con estado, crear usuario (modal), editar, activar/desactivar, exportar CSV |
| `/subjects` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | Cards de materias, stats de cupos, asignar docente, mover estudiantes, ver detalles |
| `/grades` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | 5 parciales (P1-P5), promedio en verde/rojo, guardar por estudiante |
| `/reports` | Todos | Rendimiento por materia con barra de progreso, estadísticas generales, exportar CSV/TXT |
| `/config` | SUPER_ADMIN, ADMIN_ACADEMICO | Info institucional, config académica, seguridad, notificaciones |

### Permisos por rol
| Permiso | SUPER_ADMIN | ADMIN_ACADEMICO | ADMIN_FINANCIERO | COORDINADOR | DOCENTE | SECRETARIA |
|---------|:-----------:|:---------------:|:----------------:|:-----------:|:-------:|:----------:|
| MANAGE_USERS | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| MANAGE_SUBJECTS | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| MANAGE_GRADES | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| VIEW_REPORTS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SYSTEM_CONFIG | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Componentes
- `Sidebar` — Menú lateral dinámico según rol, nombre y rol del usuario
- `Toast` — Notificaciones de éxito/error/warning
- `Loading` — Spinner de carga
- `Error` — Pantalla de error con retry
- `Navbar` — Barra de navegación pública
- `ClientOnly` — Wrapper para evitar hydration errors

---

## 7. APP MÓVIL — LO QUE ESTÁ HECHO <a name="movil-hecho"></a>

### Pantallas
| Pantalla | Estado | Descripción |
|----------|--------|-------------|
| `LoginScreen` | ✅ | Login con correo/clave, navega a MainTabs |
| `PerfilScreen` | ✅ | Muestra nombre, expediente, carrera, estado académico |
| `ServiciosScreen` | ✅ | Menú principal con botón "Ver mi Perfil" |

### Configuración
- IP del backend en `src/services/api.js`: `http://192.168.1.11:3000/api/app`
- Cambiar IP si cambia la red WiFi
- Celular y PC deben estar en la misma red

### Flujo de navegación
```
Login → MainTabs (tabs: Principal, Notas) → Perfil
```

---

## 8. PENDIENTES <a name="pendientes"></a>

### 🔴 Alta prioridad
- [ ] Insertar datos reales en DB: materias, grupos, docentes, inscripciones
- [ ] Pantalla de Notas en app móvil (tab "Notas" apunta a ServiciosScreen como placeholder)
- [ ] Configuración persistente en DB (actualmente solo UI)

### 🟡 Media prioridad
- [ ] Paginación en tablas de usuarios y materias
- [ ] Filtros avanzados por ciclo académico
- [ ] Gestión de períodos académicos desde la UI web
- [ ] Interfaz web para gestión de permisos de notas (ya existe el backend)
- [ ] Validación de fechas máximas para subir notas (`fechamaximasubirnotas`)

### 🟢 Baja prioridad
- [ ] Gráficas en dashboard (Chart.js o similar)
- [ ] Exportar reportes a PDF
- [ ] Historial de auditoría de cambios en notas
- [ ] Notificaciones push en app móvil
- [ ] Encriptación de contraseñas (actualmente texto plano)
- [ ] Refresh tokens JWT
- [ ] Docker para despliegue

---

## 9. ENDPOINTS COMPLETOS <a name="endpoints"></a>

### Autenticación
```
POST /api/auth/login
  Body: { correo, clave }
  Response: { success, token, usuario: { idUsuario, correo, rol, nombre, apellidos } }
  Bloquea: ESTUDIANTE, TUTOR

POST /api/app/login  (móvil)
  Body: { correo, clave }
  Response: { success, token, usuario: { idUsuario, correo, rol, nombre, apellidos } }
  Solo permite: ESTUDIANTE
```

### Dashboard
```
GET /api/dashboard/stats
  Response: { success, stats: { estudiantes, catedraticos, materias, notas } }

GET /api/dashboard/actividad
  Response: { success, actividades: [{ tipo, mensaje, detalle, icono }] }
```

### Grupos / Materias
```
GET /api/grupos?idUsuario=X&rol=Y
  Response: { success, materias: [{ idgrupo, idmateria, codigomateria, nombre, creditos, docente, cupomaximo, inscritos, ciclo }] }

GET /api/grupos/:idgrupo/estudiantes
  Response: { success, estudiantes: [{ idestudiante, carnet, nombre, idinscripcion, parcial1..5, notafinal }] }

POST /api/grupos/notas
  Body: { idinscripcion, primero, segundo, tercero, cuarto, quinto }
  Response: { success, message, notafinal }
```

### Admin
```
GET  /api/admin/usuarios
POST /api/admin/usuarios        Body: { correo, clave, idrol, primernombre, primerapellido }
PUT  /api/admin/usuarios/:id    Body: { correo?, clave?, primernombre?, primerapellido? }
PATCH /api/admin/usuarios/:id/toggle
GET  /api/admin/roles
GET  /api/admin/docentes
PUT  /api/admin/grupos/:idgrupo/asignar-docente   Body: { iddocente }
PUT  /api/admin/inscripciones/:idinscripcion/mover  Body: { idgrupo_destino }
GET  /api/admin/materias/:idmateria/grupos-disponibles
```

### Reportes
```
GET /api/reportes/rendimiento
  Response: { success, data: [{ materia, total_notas, promedio, aprobados, reprobados }] }

GET /api/reportes/estadisticas
  Response: { success, data: { estudiantes, docentes, materias, aprobados, reprobados, promedio_general } }
```

### App Móvil
```
POST /api/app/login
GET  /api/app/perfil/:idUsuario
  Response: { success, perfil: { nombre, apellidos, expediente, estadoAcademico, nombreCarrera } }
```

---

## 10. INICIO RÁPIDO <a name="inicio-rapido"></a>

### Backend
```bash
cd C:\Users\Kike\Documents\Repo-uni\backend
npm run dev
# Debe mostrar: "Conectado a PostgreSQL correctamente" y "Server running on port 3000"
```

### Frontend Web
```bash
cd C:\Users\Kike\Documents\Repo-uni\frontend-web\frontend-web
npm run dev
# Disponible en: http://localhost:3001
```

### App Móvil
```bash
cd C:\Users\Kike\Documents\Repo-uni\Frontend-movl
npx expo start
# Escanear QR con Expo Go (celular en misma red WiFi)
```

### Si el backend se apaga al cerrar terminal
```bash
npm install -g pm2
cd backend
pm2 start index.js --name backend-ieproes
pm2 save
```

### Solución de problemas comunes
```bash
# Puerto ocupado
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Limpiar caché npm
npm cache clean --force
rm -rf node_modules
npm install

# Ver IP para app móvil
ipconfig | findstr "IPv4"
# Actualizar en Frontend-movl/src/services/api.js
```

---

## 11. REGLAS CRÍTICAS DEL PROYECTO <a name="troubleshooting"></a>

1. **NUNCA modificar** `controllersApp/` ni `routesMobile/` — son del backend móvil
2. **El .env NO debe tener comentarios en la misma línea** que los valores
3. **Puerto PostgreSQL es 5433**, no 5432
4. **Contraseñas en texto plano** — no hay bcrypt implementado aún
5. **TUTOR y ESTUDIANTE** no tienen acceso al frontend web
6. **La DB está casi vacía** — necesita datos reales para funcionar completamente
7. **IP del móvil** debe actualizarse en `api.js` si cambia la red

---

*Documento generado automáticamente — Sistema IEPROES v1.0 — DB_UNI_II*
