# 📋 IEPROES — DOCUMENTO MAESTRO DEL PROYECTO
> Última actualización: Junio 2025 | DB: DB_UNI_II | Puerto PG: 5433

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
11. [Reglas críticas](#troubleshooting)

---

## 1. ESTADO DEL PROYECTO <a name="estado"></a>

| Componente | Estado | Notas |
|------------|--------|-------|
| Backend Web | ✅ Funcional | Corriendo con pm2, se reinicia solo |
| Frontend Web | ✅ Funcional | Todas las páginas operativas con roles |
| App Móvil | ✅ Funcional | Login + Perfil + Notas del ciclo activo |
| Base de Datos | ✅ Con datos | Materias, grupos, docente, 2 estudiantes, inscripciones y notas |

---

## 2. ARQUITECTURA <a name="arquitectura"></a>

```
Repo-uni/
├── backend/                  ← API Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── controllersApp/  ← Lógica móvil
│   │   │   └── controllersWeb/  ← Lógica web
│   │   ├── routes/
│   │   │   ├── routesMobile/    ← Rutas móvil
│   │   │   └── routesWeb/       ← Rutas web
│   │   ├── middlewares/authMiddleware.js
│   │   └── config/db.js
│   ├── fix_db.sql            ← Script de correcciones DB (ejecutar 1 vez)
│   ├── add_ana_estrada.sql   ← Inserta estudiante Ana Estrada con notas
│   ├── start-backend.bat     ← Script para arrancar con pm2
│   └── .env
├── frontend-web/frontend-web/ ← Next.js + Tailwind
│   └── src/
│       ├── app/              ← Páginas
│       ├── components/       ← Sidebar, Toast, Loading, Error, Navbar, ClientOnly
│       ├── services/         ← Llamadas a la API (via proxy Next.js)
│       ├── hooks/            ← useAuth (con redirect), useToast
│       └── utils/            ← permissions.ts, export.ts
└── Frontend-movl/            ← React Native + Expo
    └── src/
        ├── screens/          ← LoginScreen, PerfilScreen, ServiciosScreen, NotasScreen
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
Password: root
```

### Schemas
| Schema | Uso |
|--------|-----|
| `seguridad` | Usuarios, roles, permisos |
| `personas` | Datos personales (nombre, apellido) |
| `estudiantes` | Estudiantes, estados |
| `docentes` | Docentes, contratos |
| `academico` | Carreras, materias, períodos, planes |
| `grupos` | Grupos con `numerogrupo` y `cupoactual` |
| `inscripciones` | Inscripciones — estado: `INSCRITO` / `RETIRADO` |
| `evaluaciones` | Notas (nota1-nota5) con UNIQUE en idinscripcion |
| `configuracion` | periodos_notas, permisos_edicion (creado por fix_db.sql) |
| `pagos` | Facturas, pagos |
| `asistencia` | Control de asistencia |
| `extension` | Actividades de extensión |
| `proyectos` | Proyectos de graduación |

### Tablas clave — estructura
```sql
-- Usuarios
seguridad.usuario: idusuario, correo, clave, idrol, activo, fechacreacion

-- Personas
personas.persona: idpersona, primernombre, primerapellido, segundonombre, segundoapellido, activo

-- Estudiantes
estudiantes.estudiante: idestudiante, idpersona, expediente, idcarrera, idplanestudio,
                        idestado, idusuario, indiceglobal, porcentajeavance, activo

-- Docentes
docentes.docente: iddocente, idpersona, codigodocente, idusuario, activo

-- Grupos
grupos.grupo: idgrupo, codigo, numerogrupo, idmateria, iddocente, idperiodo,
              cupomaximo, cupoactual, estado

-- Inscripciones
inscripciones.inscripcion: idinscripcion, idestudiante, idgrupo, fechainscripcion,
                           estado ('INSCRITO'|'RETIRADO'), fecharetiro, motivoretiro

-- Notas (5 parciales)
evaluaciones.notafinal: idnotafinal, idinscripcion, nota1, nota2, nota3, nota4, nota5,
                        notapromedio, notafinal, estado, fecharegistro
                        UNIQUE(idinscripcion)

-- Períodos académicos
academico.periodoacademico: idperiodo, nombre, año, numeroperiodo, fechainicio, fechafin,
                            fechainicioinscripciones, fechafininscripciones, estado, activo

-- Materias
academico.materia: idmateria, codigo, nombre, unidadesvalorativas, horasteoricas,
                   horaspracticas, tipo, activo

-- Permisos de notas (catedráticos)
configuracion.periodos_notas: idPeriodo, nombreperiodo, fechaInicio, fechaFin, activo
configuracion.permisos_edicion: idPermiso, idCatedratico, idMateria, idGrupo,
                                puedeEditarNota1/2/3, editadoNota1/2/3, habilitadoPor
```

### Datos actuales en DB_UNI_II
| Tabla | Registros |
|-------|-----------|
| `seguridad.usuario` | 8+ usuarios |
| `personas.persona` | 5+ personas |
| `estudiantes.estudiante` | 2 (Miguel Vásquez + Ana Estrada) |
| `docentes.docente` | 1 (Julio César) |
| `academico.materia` | 4 (MAT101, PRG101, BD101, FIS101) |
| `grupos.grupo` | 4 (uno por materia, período activo) |
| `inscripciones.inscripcion` | 4+ (Ana Estrada inscrita en todos los grupos) |
| `evaluaciones.notafinal` | 4+ (notas de Ana: 8.5, 7.0, 9.0) |
| `academico.periodoacademico` | 1 activo (Ciclo I 2025) |
| `configuracion.periodos_notas` | 3 (Parcial 1 activo, 2 y 3 inactivos) |

### Scripts SQL disponibles
| Archivo | Propósito |
|---------|-----------|
| `fix_db.sql` | Elimina trigger roto, crea schema configuracion, agrega columnas faltantes, inserta datos base |
| `add_ana_estrada.sql` | Crea estudiante Ana Estrada con inscripciones y notas de ejemplo |
| `setup_db.sql` | Setup completo alternativo |

---

## 4. CREDENCIALES <a name="credenciales"></a>

### Usuarios del sistema
| Correo | Clave | Rol | Acceso |
|--------|-------|-----|--------|
| admin@sistema.edu.sv | Admin2026 | SUPER_ADMIN | Web ✅ |
| ana.guardado@uni.edu.sv | Academico2026 | ADMIN_ACADEMICO | Web ✅ |
| carlos.hernandez@uni.edu.sv | Finanzas2026 | ADMIN_FINANCIERO | Web ✅ |
| laura.martinez@uni.edu.sv | Coordina2026 | COORDINADOR | Web ✅ |
| julio.cesar@uni.edu.sv | Maestro2026 | DOCENTE | Web ✅ |
| karla.rivas@uni.edu.sv | Secre2026 | SECRETARIA | Web ✅ |
| miguel.vasquez@estudiante.edu.sv | Estudiante2026 | ESTUDIANTE | App Móvil ✅ |
| ana.estrada@estudiante.edu.sv | Ana2026 | ESTUDIANTE | App Móvil ✅ |
| rosa.vasquez@tutor.edu.sv | Tutor2026 | TUTOR | ❌ Sin acceso |

### .env del backend
```env
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=DB_UNI_II
PG_PASSWORD=root
PG_PORT=5433
PORT=3001
JWT_SECRET=ieproes_secret_key_2024_sistema_academico
```

### .env.local del frontend web
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
> El frontend usa el proxy de Next.js (`next.config.ts`) para redirigir `/api/*` al backend en 3001. El `auth.service.ts` usa la instancia `api` (no axios directo) para pasar por el proxy.

---

## 5. BACKEND — LO QUE ESTÁ HECHO <a name="backend-hecho"></a>

### Controladores web
| Controlador | Estado | Funciones |
|-------------|--------|-----------|
| `loginController.js` | ✅ | Login con bcrypt + texto plano (legacy), bloquea ESTUDIANTE/TUTOR |
| `adminController.js` | ✅ | CRUD usuarios, docentes, permisos de notas, periodos_notas |
| `dashboardController.js` | ✅ | getStats, getActividad |
| `materiasController.js` | ✅ | getMaterias por rol, getEstudiantesPorGrupo (5 parciales), guardarNotas |
| `materiaController.js` | ✅ | CRUD materias, crearGrupo |
| `estudianteController.js` | ✅ | CRUD estudiantes, getCarreras, getEstados |
| `inscripcionController.js` | ✅ | getInscripciones, inscribir (+cupoactual), retirar (-cupoactual), getGruposParaInscribir |
| `periodoController.js` | ✅ | CRUD períodos académicos, toggleActivo |
| `catedraticoController.js` | ✅ | getMateriasCatedratico, getEstudiantesGrupo (con idinscripcion), ingresarNotas con permisos |
| `reportesController.js` | ✅ | getRendimiento, getEstadisticas, getHistorialEstudiante |
| `academicaController.js` | ✅ | Facultades, escuelas, carreras, planes de estudio, catálogos |

### Controladores móviles
| Controlador | Estado | Notas |
|-------------|--------|-------|
| `authMobileController.js` | ✅ | Login solo ESTUDIANTE, devuelve token JWT |
| `perfilController.js` | ✅ | Perfil con carrera, CUM, avance, estado |
| `notasController.js` | ✅ | Notas del ciclo activo — filtra `estado = 'INSCRITO'` |

### Proceso del backend
```bash
# Está corriendo con pm2 — NO usar npm run dev
pm2 list                          # ver estado
pm2 logs backend-ieproes          # ver logs
pm2 restart backend-ieproes       # reiniciar
pm2 stop backend-ieproes          # detener
pm2 start index.js --name backend-ieproes  # arrancar si está detenido
```

---

## 6. FRONTEND WEB — LO QUE ESTÁ HECHO <a name="frontend-web-hecho"></a>

### Páginas implementadas
| Página | Roles con acceso | Funciones |
|--------|-----------------|-----------|
| `/login` | Todos (empleados) | Login, redirige a /dashboard |
| `/dashboard` | Todos | Stats, acciones rápidas por rol, actividad reciente |
| `/users` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA | CRUD usuarios, exportar CSV |
| `/estudiantes` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, SECRETARIA | CRUD estudiantes |
| `/inscripciones` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | Inscribir/retirar estudiantes, filtro por período |
| `/subjects` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | Cards de grupos, crear materia/grupo, asignar docente, mover estudiantes |
| `/academica` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | Notas por grupo — admin acceso total, docente según permisos |
| `/grades` | SUPER_ADMIN, ADMIN_ACADEMICO, COORDINADOR, DOCENTE | 5 parciales, guardar por estudiante o todos |
| `/periodos` | SUPER_ADMIN, ADMIN_ACADEMICO | CRUD períodos académicos, activar período |
| `/permisos` | SUPER_ADMIN, ADMIN_ACADEMICO | Períodos de notas, habilitar/resetear permisos por catedrático |
| `/reports` | Todos | Rendimiento por materia, estadísticas, exportar CSV/TXT |
| `/config` | SUPER_ADMIN, ADMIN_ACADEMICO | Configuración institucional |

### Correcciones aplicadas
- `auth.service.ts` — usa instancia `api` (proxy) en lugar de axios directo
- `api.ts` — baseURL vacío en browser para que el proxy de Next.js funcione
- `useAuth.ts` — redirige automáticamente a `/login` si no hay sesión
- `grades/page.tsx` — `useSearchParams` envuelto en `Suspense` (Next.js 13+)

### Permisos por rol
| Permiso | SUPER_ADMIN | ADMIN_ACADEMICO | ADMIN_FINANCIERO | COORDINADOR | DOCENTE | SECRETARIA |
|---------|:-----------:|:---------------:|:----------------:|:-----------:|:-------:|:----------:|
| MANAGE_USERS | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| MANAGE_SUBJECTS | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| MANAGE_GRADES | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| VIEW_REPORTS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SYSTEM_CONFIG | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 7. APP MÓVIL — LO QUE ESTÁ HECHO <a name="movil-hecho"></a>

### Pantallas
| Pantalla | Estado | Descripción |
|----------|--------|-------------|
| `LoginScreen` | ✅ | Login con correo/clave, guarda token en AsyncStorage |
| `ServiciosScreen` | ✅ | Menú principal — Mi Perfil, Notas, Horarios (próx.), Pagos (próx.) |
| `PerfilScreen` | ✅ | Nombre, expediente, carrera, CUM, avance, estado académico |
| `NotasScreen` | ✅ | Materias del ciclo activo con nota final + resumen UV/CUM |

### Correcciones aplicadas
- `notasController.js` — filtro corregido de `'ACTIVA'` a `'INSCRITO'`
- `NotasScreen.js` — lee `idUsuario` desde AsyncStorage si no llega por params del tab
- `NotasScreen.js` — usa `useIsFocused` para recargar al entrar al tab
- `PerfilScreen.js` — lee `idUsuario` desde AsyncStorage como fallback (no crashea si params es undefined)

### Configuración
```js
// Frontend-movl/src/services/api.js
baseURL: "http://<TU_IP_LOCAL>:3001/api/app"
```
> Cambiar la IP si cambia la red WiFi. Ver IP con `ipconfig | findstr "IPv4"`

### Flujo de navegación
```
Login → MainTabs
          ├── Tab "Servicios" (ServiciosScreen)
          │     ├── → Perfil (PerfilScreen)
          │     └── → Notas (tab)
          └── Tab "Notas" (NotasScreen)
```

---

## 8. PENDIENTES <a name="pendientes"></a>

### 🟡 Media prioridad
- [ ] Paginación en tablas de usuarios, estudiantes y materias
- [ ] Filtros avanzados por ciclo académico en inscripciones y notas
- [ ] Validación de `fechamaximasubirnotas` al guardar notas
- [ ] Encriptación de contraseñas con bcrypt (actualmente texto plano)

### 🟢 Baja prioridad
- [ ] Gráficas en dashboard (Chart.js o Recharts)
- [ ] Exportar reportes a PDF
- [ ] Historial de auditoría de cambios en notas
- [ ] Notificaciones push en app móvil
- [ ] Pantalla de Horarios en app móvil
- [ ] Pantalla de Pagos en app móvil
- [ ] Refresh tokens JWT
- [ ] Tarea programada de Windows para arrancar pm2 al reiniciar PC
- [ ] Docker para despliegue

---

## 9. ENDPOINTS COMPLETOS <a name="endpoints"></a>

### Autenticación
```
POST /api/auth/login          Body: { correo, clave }   → Web (bloquea ESTUDIANTE/TUTOR)
POST /api/app/login           Body: { correo, clave }   → Móvil (solo ESTUDIANTE)
```

### Dashboard
```
GET /api/dashboard/stats
GET /api/dashboard/actividad
```

### Estudiantes
```
GET    /api/estudiantes
POST   /api/estudiantes
PUT    /api/estudiantes/:id
PATCH  /api/estudiantes/:id/toggle
GET    /api/estudiantes/carreras
GET    /api/estudiantes/estados
GET    /api/estudiantes/perfil/:id
```

### Inscripciones
```
GET    /api/inscripciones               ?idgrupo=X&idperiodo=Y
POST   /api/inscripciones               Body: { idestudiante, idgrupo }  → actualiza cupoactual
GET    /api/inscripciones/grupos        grupos disponibles (período activo, con cupo)
PATCH  /api/inscripciones/:id/retirar   Body: { motivoRetiro? }  → actualiza cupoactual
```

### Materias / Grupos
```
GET    /api/materias
POST   /api/materias                    Body: { codigo, nombre, unidadesvalorativas, ... }
PUT    /api/materias/:id
POST   /api/materias/grupos             Body: { idmateria, idperiodo, iddocente?, numerogrupo, cupomaximo }
GET    /api/grupos?idUsuario=X&rol=Y
GET    /api/grupos/:idgrupo/estudiantes
POST   /api/grupos/notas                Body: { idinscripcion, primero, segundo, tercero, cuarto, quinto }
```

### Períodos
```
GET    /api/periodos
POST   /api/periodos
PUT    /api/periodos/:id
PATCH  /api/periodos/:id/activar
```

### Admin
```
GET    /api/admin/usuarios
POST   /api/admin/usuarios
PUT    /api/admin/usuarios/:id
PATCH  /api/admin/usuarios/:id/toggle
GET    /api/admin/roles
GET    /api/admin/docentes
PUT    /api/admin/grupos/:idgrupo/asignar-docente
PUT    /api/admin/inscripciones/:idinscripcion/mover
GET    /api/admin/materias/:idmateria/grupos-disponibles
GET    /api/admin/periodos-notas
PUT    /api/admin/periodos-notas/:id
GET    /api/admin/permisos-edicion
POST   /api/admin/permisos-edicion
PUT    /api/admin/permisos-edicion/:id/resetear
```

### Catedrático
```
GET    /api/catedratico/materias/:idCatedratico
GET    /api/catedratico/estudiantes/:idGrupo
POST   /api/catedratico/notas
GET    /api/catedratico/permisos/:idCatedratico/:idGrupo
```

### Reportes
```
GET    /api/reportes/rendimiento
GET    /api/reportes/estadisticas
GET    /api/reportes/estudiante/:id
```

### App Móvil
```
POST   /api/app/login
GET    /api/app/perfil/:idUsuario
GET    /api/app/actuales/:idUsuario     notas del ciclo activo
GET    /api/app/horarios/:idUsuario
GET    /api/app/pagos/:idUsuario
GET    /api/app/historial/:idUsuario
POST   /api/app/logout
```

---

## 10. INICIO RÁPIDO <a name="inicio-rapido"></a>

### Backend (pm2 — ya configurado)
```bash
pm2 list                                    # verificar que está corriendo
pm2 start index.js --name backend-ieproes   # si está detenido
pm2 logs backend-ieproes                    # ver logs
```

### Frontend Web
```bash
cd C:\Users\Kike\Documents\Curso\Repo-uni\frontend-web\frontend-web
npm run dev
# Disponible en: http://localhost:3000 (Next.js)
# Proxy redirige /api/* → http://localhost:3001
```

### App Móvil
```bash
cd C:\Users\Kike\Documents\Curso\Repo-uni\Frontend-movl
npx expo start
# Escanear QR con Expo Go — celular y PC en la misma red WiFi
# Actualizar IP en src/services/api.js si cambia la red
```

### Primera vez — preparar la DB
```sql
-- 1. Ejecutar en pgAdmin contra DB_UNI_II:
--    backend/fix_db.sql
-- 2. Luego:
--    backend/add_ana_estrada.sql
```

### Arrancar todo al reiniciar PC
1. Abrir terminal → `pm2 start index.js --name backend-ieproes` (en carpeta backend)
2. Abrir terminal → `npm run dev` (en carpeta frontend-web/frontend-web)
3. Abrir terminal → `npx expo start` (en carpeta Frontend-movl)

---

## 11. REGLAS CRÍTICAS DEL PROYECTO <a name="troubleshooting"></a>

1. **Backend corre en puerto 3001** — el .env tiene `PORT=3001`
2. **El proxy de Next.js** redirige `/api/*` al backend — no cambiar `next.config.ts`
3. **Puerto PostgreSQL es 5433**, no 5432
4. **Estado de inscripción es `'INSCRITO'`**, no `'ACTIVA'` — crítico para la app móvil
5. **`cupoactual`** se actualiza automáticamente al inscribir (+1) y retirar (-1)
6. **UNIQUE constraint** en `evaluaciones.notafinal(idinscripcion)` — necesario para ON CONFLICT
7. **TUTOR y ESTUDIANTE** no tienen acceso al frontend web
8. **Contraseñas en texto plano** — loginController soporta bcrypt y texto plano (legacy)
9. **IP del móvil** debe actualizarse en `api.js` si cambia la red WiFi
10. **El .env NO debe tener comentarios en la misma línea** que los valores
11. **pm2** mantiene el backend vivo — no usar `npm run dev` en producción

---

*Sistema IEPROES v1.1 — DB_UNI_II — Junio 2025*
