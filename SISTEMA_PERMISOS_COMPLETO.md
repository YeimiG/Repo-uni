# 🔐 SISTEMA DE PERMISOS Y GESTIÓN DE NOTAS - IEPROES

## ✅ CAMBIOS IMPLEMENTADOS

### 1. 📊 Base de Datos - Nuevas Tablas

#### `configuracion.periodos_notas`
Control de períodos habilitados para ingreso de notas:
```sql
- idPeriodo (PK)
- nombrePeriodo ('Parcial 1', 'Parcial 2', 'Parcial 3')
- fechaInicio (DATE)
- fechaFin (DATE)
- activo (BOOLEAN) -- Solo un período activo a la vez
- creadoPor (FK a usuario)
- fechaCreacion (TIMESTAMP)
```

#### `configuracion.permisos_edicion`
Control de permisos de edición por catedrático:
```sql
- idPermiso (PK)
- idCatedratico (FK)
- idMateria (FK)
- idGrupo (FK)
- puedeEditarNota1 (BOOLEAN) -- Habilitado por admin
- puedeEditarNota2 (BOOLEAN)
- puedeEditarNota3 (BOOLEAN)
- editadoNota1 (BOOLEAN) -- Ya usó su única edición
- editadoNota2 (BOOLEAN)
- editadoNota3 (BOOLEAN)
- habilitadoPor (FK a usuario admin)
- fechaHabilitacion (TIMESTAMP)
```

### 2. 🔧 Backend - Controladores Actualizados

#### `catedraticoController.js`
**Función: ingresarNotas** (MODIFICADA)
- ✅ Verifica permisos antes de permitir edición
- ✅ Valida que el catedrático tenga permiso para la nota específica
- ✅ Valida que no haya editado ya esa nota
- ✅ Marca la nota como editada después de guardar
- ✅ Calcula nota final automáticamente
- ✅ Usa tabla `registro.notas`

**Función: getPermisosEdicion** (NUEVA)
- ✅ Obtiene permisos del catedrático para un grupo específico
- ✅ Endpoint: GET `/api/catedratico/permisos/:idCatedratico/:idGrupo`

#### `adminController.js`
**Funciones Nuevas:**

1. **getPeriodosNotas**
   - Obtiene todos los períodos de notas
   - Endpoint: GET `/api/admin/periodos-notas`

2. **actualizarPeriodo**
   - Actualiza fechas y estado de un período
   - Endpoint: PUT `/api/admin/periodos-notas/:idPeriodo`

3. **getPermisosEdicion**
   - Lista todos los permisos con información de catedrático, materia y grupo
   - Endpoint: GET `/api/admin/permisos-edicion`

4. **habilitarPermiso**
   - Habilita permisos de edición para un catedrático
   - Puede habilitar nota1, nota2, nota3 individualmente
   - Endpoint: POST `/api/admin/permisos-edicion`

5. **resetearEdicion**
   - Permite que el catedrático edite nuevamente una nota
   - Solo el admin puede resetear
   - Endpoint: PUT `/api/admin/permisos-edicion/:idPermiso/resetear`

### 3. 🛣️ Rutas Actualizadas

#### `adminRoutes.js`
```javascript
GET  /api/admin/periodos-notas
PUT  /api/admin/periodos-notas/:idPeriodo
GET  /api/admin/permisos-edicion
POST /api/admin/permisos-edicion
PUT  /api/admin/permisos-edicion/:idPermiso/resetear
```

#### `catedraticoRoutes.js`
```javascript
GET /api/catedratico/permisos/:idCatedratico/:idGrupo
```

### 4. 🌐 Frontend Web - Correcciones

#### `reports/page.tsx`
- ✅ Agregada función `cargarEstadisticas` que faltaba
- ✅ Corregido error: "cargarEstadisticas is not defined"

#### `login/page.tsx`
- ✅ Botón mostrar/ocultar contraseña implementado
- ✅ Iconos SVG de ojo abierto/cerrado

### 5. ❌ Cambios Revertidos

- ✅ Eliminado `notasController.js` de controllersApp (móvil)
- ✅ Revertidas rutas móviles a su estado original
- ✅ Backend móvil sin modificaciones

---

## 🎯 FLUJO DE TRABAJO

### Para el Administrador:

#### 1. Configurar Períodos de Notas
```
1. Ir a panel de administración
2. Configurar fechas de Parcial 1, 2 y 3
3. Activar el período actual
4. Solo un período puede estar activo
```

#### 2. Habilitar Permisos a Catedráticos
```
1. Seleccionar catedrático
2. Seleccionar materia y grupo
3. Habilitar qué notas puede editar (Nota1, Nota2, Nota3)
4. El catedrático solo puede editar UNA VEZ cada nota
```

#### 3. Resetear Ediciones (Si es necesario)
```
1. Ver lista de permisos
2. Seleccionar permiso a resetear
3. Elegir qué nota resetear (Nota1, Nota2, Nota3)
4. El catedrático podrá editar nuevamente
```

### Para el Catedrático:

#### 1. Verificar Permisos
```
GET /api/catedratico/permisos/:idCatedratico/:idGrupo

Respuesta:
{
  puedeEditarNota1: true,
  puedeEditarNota2: false,
  puedeEditarNota3: false,
  editadoNota1: false,
  editadoNota2: false,
  editadoNota3: false
}
```

#### 2. Ingresar Notas
```
POST /api/catedratico/notas

Body:
{
  idInscripcion: 1,
  nota1: 8.5,
  nota2: null,
  nota3: null,
  idCatedratico: 5,
  idGrupo: 10
}

Validaciones:
- ✅ Tiene permiso para editar esa nota
- ✅ No ha editado ya esa nota
- ✅ Período activo (opcional)
```

#### 3. Restricciones
```
❌ No puede editar si no tiene permiso
❌ No puede editar si ya editó esa nota
❌ Solo puede editar las notas habilitadas por el admin
```

---

## 📋 ENDPOINTS COMPLETOS

### Administrador

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/periodos-notas` | Listar períodos |
| PUT | `/api/admin/periodos-notas/:id` | Actualizar período |
| GET | `/api/admin/permisos-edicion` | Listar permisos |
| POST | `/api/admin/permisos-edicion` | Habilitar permiso |
| PUT | `/api/admin/permisos-edicion/:id/resetear` | Resetear edición |

### Catedrático

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/catedratico/materias/:id` | Materias del catedrático |
| GET | `/api/catedratico/estudiantes/:idGrupo` | Estudiantes del grupo |
| GET | `/api/catedratico/permisos/:idCat/:idGrupo` | Permisos de edición |
| POST | `/api/catedratico/notas` | Ingresar/actualizar notas |

---

## 🧪 EJEMPLOS DE USO

### 1. Admin Habilita Permiso para Nota 1
```javascript
POST /api/admin/permisos-edicion
{
  "idCatedratico": 5,
  "idMateria": 10,
  "idGrupo": 15,
  "nota1": true,
  "nota2": false,
  "nota3": false,
  "idAdmin": 1
}
```

### 2. Catedrático Ingresa Nota 1
```javascript
POST /api/catedratico/notas
{
  "idInscripcion": 100,
  "nota1": 8.5,
  "nota2": null,
  "nota3": null,
  "idCatedratico": 5,
  "idGrupo": 15
}

// Respuesta exitosa:
{
  "idInscripcion": 100,
  "nota1": 8.5,
  "nota2": null,
  "nota3": null,
  "notaFinal": 2.83
}

// El sistema marca editadoNota1 = true
```

### 3. Catedrático Intenta Editar Nuevamente
```javascript
POST /api/catedratico/notas
{
  "idInscripcion": 100,
  "nota1": 9.0,
  "idCatedratico": 5,
  "idGrupo": 15
}

// Respuesta error:
{
  "error": "No puede editar Nota 1 o ya fue editada"
}
```

### 4. Admin Resetea Edición
```javascript
PUT /api/admin/permisos-edicion/1/resetear
{
  "nota1": true,
  "nota2": false,
  "nota3": false
}

// Ahora editadoNota1 = false
// El catedrático puede editar nuevamente
```

---

## 🔒 VALIDACIONES IMPLEMENTADAS

### En ingresarNotas:
1. ✅ Verifica que exista permiso para el catedrático y grupo
2. ✅ Valida que tenga permiso para editar la nota específica
3. ✅ Valida que no haya editado ya esa nota
4. ✅ Calcula nota final automáticamente
5. ✅ Marca la nota como editada
6. ✅ Usa COALESCE para actualizar solo las notas enviadas

### En habilitarPermiso:
1. ✅ Usa ON CONFLICT para actualizar permisos existentes
2. ✅ Registra quién habilitó el permiso
3. ✅ Registra fecha de habilitación

### En resetearEdicion:
1. ✅ Solo resetea las notas especificadas
2. ✅ Mantiene el estado de las otras notas

---

## 📁 ARCHIVOS MODIFICADOS

```
backend/
├── schema_permisos.sql (NUEVO)
├── src/
│   ├── controllers/
│   │   ├── catedraticoController.js (MODIFICADO)
│   │   └── adminController.js (MODIFICADO)
│   └── routes/
│       ├── catedraticoRoutes.js (MODIFICADO)
│       └── adminRoutes.js (MODIFICADO)

frontend-web/
└── frontend-web/src/app/
    ├── login/page.tsx (MODIFICADO)
    └── reports/page.tsx (MODIFICADO - CORREGIDO)
```

---

## 🚀 INSTALACIÓN

### 1. Ejecutar Script SQL
```bash
cd backend
psql -U postgres -d DB_UNI -f schema_permisos.sql
```

### 2. Reiniciar Backend
```bash
cd backend
npm run dev
```

### 3. Reiniciar Frontend
```bash
cd frontend-web/frontend-web
npm run dev
```

---

## 🎓 CASOS DE USO

### Caso 1: Primer Parcial
```
1. Admin activa "Parcial 1" (fechas: 15/01 - 15/03)
2. Admin habilita Nota1 para todos los catedráticos
3. Catedráticos ingresan Nota1 (solo una vez)
4. Si hay error, admin resetea la edición
5. Catedrático corrige la nota
```

### Caso 2: Segundo Parcial
```
1. Admin desactiva "Parcial 1"
2. Admin activa "Parcial 2" (fechas: 16/03 - 15/05)
3. Admin habilita Nota2 para todos los catedráticos
4. Catedráticos ingresan Nota2
5. Nota final se recalcula automáticamente
```

### Caso 3: Corrección de Notas
```
1. Catedrático reporta error en Nota1
2. Admin verifica el error
3. Admin resetea editadoNota1 para ese catedrático/grupo
4. Catedrático corrige la nota
5. Sistema marca nuevamente como editado
```

---

## ✨ BENEFICIOS

1. ✅ **Control Total**: Admin controla quién y cuándo puede editar
2. ✅ **Auditoría**: Se registra quién habilitó y cuándo
3. ✅ **Seguridad**: Catedráticos solo editan una vez
4. ✅ **Flexibilidad**: Admin puede resetear si hay errores
5. ✅ **Períodos**: Control por fechas de parciales
6. ✅ **Granularidad**: Control individual por nota (1, 2, 3)

---

## 🐛 ERRORES CORREGIDOS

1. ✅ Error "cargarEstadisticas is not defined" en reports/page.tsx
2. ✅ Tabla de notas ahora usa `registro.notas`
3. ✅ Botón mostrar/ocultar contraseña en login
4. ✅ Backend móvil sin modificaciones (revertido)

---

## 📞 PRÓXIMOS PASOS

1. Crear interfaz web para gestión de permisos
2. Crear interfaz web para gestión de períodos
3. Agregar notificaciones cuando se habiliten permisos
4. Agregar validación de fechas de períodos
5. Crear reportes de auditoría de ediciones

---

**✅ Sistema de permisos completamente funcional!**
