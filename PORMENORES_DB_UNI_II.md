# 📋 PORMENORES - BASE DE DATOS DB_UNI_II
> Revisión: Solo lectura, sin modificaciones al backend

---

## 🔌 CONEXIÓN
- Host: localhost / 127.0.0.1
- Puerto: 5433
- Base de datos: DB_UNI_II
- Usuario: postgres

---

## 🗂️ SCHEMAS (13 en total)

| Schema | Descripción |
|--------|-------------|
| `academico` | Carreras, materias, planes de estudio, períodos |
| `asistencia` | Control de asistencia |
| `docentes` | Docentes, contratos, títulos, evaluaciones |
| `estudiantes` | Estudiantes, becas, tutores, historial |
| `evaluaciones` | Notas, calificaciones, recuperaciones |
| `extension` | Actividades de extensión |
| `grupos` | Grupos, horarios, salones, edificios |
| `inscripciones` | Inscripciones, preinscripciones, lista de espera |
| `pagos` | Facturas, pagos, descuentos, becas |
| `personas` | Datos personales, direcciones, contactos |
| `proyectos` | Proyectos de graduación |
| `seguridad` | Usuarios, roles, permisos, sesiones, auditoría |
| `public` | (vacío) |

---

## ⚠️ DIFERENCIAS CRÍTICAS CON LA DB ANTERIOR

### La nueva DB tiene schemas COMPLETAMENTE DISTINTOS:

| Concepto | DB anterior (DB_UNI) | DB nueva (DB_UNI_II) |
|----------|----------------------|----------------------|
| Estudiantes | `academico.estudiante` | `estudiantes.estudiante` |
| Docentes | `academico.docente` | `docentes.docente` |
| Grupos | `academico.grupo` | `grupos.grupo` |
| Inscripciones | `registro.inscripcion` | `inscripciones.inscripcion` |
| Notas | `registro.notas` (primero/segundo/tercero) | `evaluaciones.notafinal` (nota1..nota5) |
| Materias | `academico.materia` | `academico.materia` ✅ igual |
| Usuarios | `seguridad.usuario` | `seguridad.usuario` ✅ igual |
| Roles | `seguridad.rol` | `seguridad.rol` ✅ igual |

---

## 🔐 USUARIOS Y CREDENCIALES

| Correo | Clave | Rol |
|--------|-------|-----|
| admin@sistema.edu.sv | Admin2026 | SUPER_ADMIN |
| ana.guardado@uni.edu.sv | Academico2026 | ADMIN_ACADEMICO |
| carlos.hernandez@uni.edu.sv | Finanzas2026 | ADMIN_FINANCIERO |
| laura.martinez@uni.edu.sv | Coordina2026 | COORDINADOR |
| julio.cesar@uni.edu.sv | Maestro2026 | DOCENTE |
| miguel.vasquez@estudiante.edu.sv | Estudiante2026 | ESTUDIANTE |
| karla.rivas@uni.edu.sv | Secre2026 | SECRETARIA |
| rosa.vasquez@tutor.edu.sv | Tutor2026 | TUTOR |

> ⚠️ Los roles ya NO son "Administrador" / "Catedrático" — ahora son SUPER_ADMIN, DOCENTE, etc.

---

## 📊 DATOS ACTUALES

| Tabla | Registros |
|-------|-----------|
| `estudiantes.estudiante` | 0 |
| `docentes.docente` | 0 |
| `academico.materia` | 0 |
| `grupos.grupo` | 0 |
| `inscripciones.inscripcion` | 0 |
| `evaluaciones.notafinal` | 0 |

> ⚠️ La base de datos está VACÍA de datos académicos. Solo tiene los 8 usuarios de seguridad.

---

## 📐 ESTRUCTURA DE TABLAS CLAVE

### `seguridad.usuario`
```
idusuario, correo, clave, fechacreacion, ultimoacceso,
intentosfallidos, bloqueado, fechabloqueo,
requierecambioclave, tokenrecuperacion, expiraciontoken,
idrol, activo
```

### `seguridad.rol`
```
idrol, nombrerol, descripcion, niveljerarquico, esdefault, activo
```

### `personas.persona`
```
idpersona, primernombre, segundonombre, primerapellido, segundoapellido,
fechanacimiento, genero, estadocivil, fotografia,
idtipodocumento, numerodocumento, iddireccion, idcontacto,
activo, fecharegistro
```

### `estudiantes.estudiante`
```
idestudiante, idpersona, expediente, fechaingreso,
idcarrera, idplanestudio, idestado, idtipoingreso,
colegioprocedencia, añoegresocolegio, promedioingreso,
cantidadmateriasaprobadas, cantidadmateriasreprobadas,
indiceglobal, indiceperiodo, creditosacumulados,
creditostotales, porcentajeavance, idusuario, activo
```

### `docentes.docente`
```
iddocente, idpersona, codigodocente, fechaingreso,
idcategoria, idtipocontrato, especialidad,
titulopregrado, titulopostgrado, horasasignadas,
disponibleparatutorias, idusuario, activo
```

### `grupos.grupo`
```
idgrupo, codigo, numerogrupo, cupomaximo, cupoactual,
idmateria, iddocente, idperiodo, idmodalidad,
enlaceclasevirtual, observaciones, estado
```

### `inscripciones.inscripcion`
```
idinscripcion, idestudiante, idgrupo, fechainscripcion,
tipoinscripcion, estado, fecharetiro, motivoretiro
```

### `evaluaciones.notafinal`
```
idnotafinal, idinscripcion,
nota1, nota2, nota3, nota4, nota5,
notarecuperacion, notapromedio, notafinal,
letracalificacion, estado,
fecharegistro, registradopor
```
> ⚠️ Tiene hasta 5 notas parciales, no 3 como antes.

### `evaluaciones.calificacion`
```
idcalificacion, idactividad, idinscripcion,
nota, fechacalificacion, retroalimentacion,
calificadopor, publicado
```

### `academico.periodoacademico`
```
idperiodo, nombre, año, numeroperiodo,
fechainicio, fechafin,
fechainicioinscripciones, fechafininscripciones,
fechainicioretiros, fechafinretiros,
fechamaximasubirnotas,   ← ⭐ campo clave para control de notas
estado, activo
```

---

## 🔑 PUNTOS IMPORTANTES PARA EL BACKEND

### 1. Login
- El campo de rol ahora es `nombrerol` en `seguridad.rol` ✅ (igual que antes)
- Pero los valores cambiaron: `SUPER_ADMIN`, `DOCENTE`, `ESTUDIANTE`, etc. (antes era `Administrador`, `Catedrático`)

### 2. Notas
- La tabla es `evaluaciones.notafinal` (antes `registro.notas`)
- Columnas: `nota1, nota2, nota3, nota4, nota5` (antes `primero, segundo, tercero`)
- Tiene `notapromedio` y `notafinal` separados
- Tiene `letracalificacion` y `estado`
- Tiene `fechamaximasubirnotas` en `academico.periodoacademico` para control de fechas

### 3. Estudiantes
- Ahora en schema `estudiantes` (antes `academico`)
- Se relaciona con `personas.persona` para nombre/apellido (antes tenía nombre directo)

### 4. Docentes
- Ahora en schema `docentes` (antes `academico`)
- También se relaciona con `personas.persona`

### 5. Inscripciones
- Ahora en schema `inscripciones` (antes `registro`)

### 6. Grupos
- Ahora en schema `grupos` (antes `academico`)
- Usa `idperiodo` → `academico.periodoacademico`

---

## 🚨 QUERIES QUE ESTÁN ROTAS EN EL BACKEND ACTUAL

| Controlador | Query rota | Razón |
|-------------|-----------|-------|
| `loginController.js` | JOIN con `academico.estudiante` / `academico.docente` | Tablas movidas a otros schemas |
| `adminController.js` | `academico.docente`, `registro.inscripcion` | Schemas cambiados |
| `catedraticoController.js` | `academico.Materia`, `academico.Grupo`, `registro.notas` | Schemas y nombres cambiados |
| `dashboardController.js` | `academico.estudiante`, `academico.docente`, `registro.notas`, `registro.inscripcion` | Todo cambió |
| `reportesController.js` | `registro.notas`, `registro.inscripcion` | Schemas cambiados |
| `materiasController.js` | `academico.grupo`, `academico.docente`, `registro.inscripcion`, `registro.notas` | Todo cambió |
| `perfilController.js` (app) | `academico."Estudiante"`, `academico."Carrera"` | Schemas cambiados |
| `loginControllerApp.js` | `academico.Estudiante` | Schema cambiado |

---

## ✅ LO QUE SÍ SIGUE IGUAL

- `seguridad.usuario` → mismo schema ✅
- `seguridad.rol` → mismo schema ✅
- `academico.materia` → mismo schema ✅
- `academico.carrera` → mismo schema ✅
- JWT_SECRET → sin cambios ✅

---

## 📌 RESUMEN EJECUTIVO

La nueva base de datos `DB_UNI_II` es una reestructuración completa.
Prácticamente **todos los controladores del backend necesitan actualizarse**
para apuntar a los nuevos schemas.

La prioridad sería:
1. `loginController.js` → para poder entrar al sistema
2. `materiasController.js` → para ver materias y notas
3. `dashboardController.js` → para el dashboard
4. `reportesController.js` → para reportes
5. `perfilController.js` + `loginControllerApp.js` → para la app móvil

---
*Archivo generado solo con lectura de la DB — sin modificaciones al backend*
