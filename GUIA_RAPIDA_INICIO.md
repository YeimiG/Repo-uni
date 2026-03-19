# 🚀 GUÍA RÁPIDA - SISTEMA DE PERMISOS

## ✅ TODO LISTO - QUÉ SE HIZO

### 1. ❌ Backend Móvil SIN MODIFICAR
- Revertidos todos los cambios en controllersApp
- Rutas móviles en su estado original
- Solo se modificó backend web

### 2. ✅ Sistema de Permisos Implementado
- Tabla `configuracion.periodos_notas` - Control de fechas
- Tabla `configuracion.permisos_edicion` - Control de ediciones
- Catedráticos solo pueden editar UNA VEZ cada nota
- Admin puede resetear ediciones

### 3. ✅ Errores Corregidos
- ✅ Error "cargarEstadisticas is not defined" - CORREGIDO
- ✅ Botón mostrar/ocultar contraseña - IMPLEMENTADO
- ✅ Tabla registro.notas - ACTUALIZADO

---

## 🎯 PASOS PARA INICIAR

### Paso 1: Crear Tablas en la Base de Datos
```bash
cd backend
psql -U postgres -d DB_UNI -f schema_permisos.sql
```

O ejecuta manualmente en pgAdmin:
```sql
-- Copia el contenido de schema_permisos.sql
```

### Paso 2: Iniciar Backend
```bash
cd backend
npm run dev
```
Debe estar en: http://localhost:3000

### Paso 3: Iniciar Frontend Web
```bash
cd frontend-web/frontend-web
npm run dev
```
Debe estar en: http://localhost:3001

### Paso 4: Probar Login
```
URL: http://localhost:3001/login
Usuario: AA26I00@uni.edu
Clave: 310870
```
✅ Ahora verás el botón de mostrar/ocultar contraseña

### Paso 5: Probar Reportes
```
URL: http://localhost:3001/reports
```
✅ Ya no debe dar error "cargarEstadisticas is not defined"

---

## 🔧 CÓMO USAR EL SISTEMA DE PERMISOS

### Como ADMINISTRADOR:

#### 1. Configurar Períodos (API)
```bash
# Ver períodos
curl http://localhost:3000/api/admin/periodos-notas

# Activar Parcial 1
curl -X PUT http://localhost:3000/api/admin/periodos-notas/1 \
  -H "Content-Type: application/json" \
  -d '{"fechaInicio":"2024-01-15","fechaFin":"2024-03-15","activo":true}'
```

#### 2. Habilitar Permiso a Catedrático
```bash
curl -X POST http://localhost:3000/api/admin/permisos-edicion \
  -H "Content-Type: application/json" \
  -d '{
    "idCatedratico": 1,
    "idMateria": 1,
    "idGrupo": 1,
    "nota1": true,
    "nota2": false,
    "nota3": false,
    "idAdmin": 1
  }'
```

#### 3. Ver Todos los Permisos
```bash
curl http://localhost:3000/api/admin/permisos-edicion
```

#### 4. Resetear Edición (Permitir editar nuevamente)
```bash
curl -X PUT http://localhost:3000/api/admin/permisos-edicion/1/resetear \
  -H "Content-Type: application/json" \
  -d '{"nota1": true, "nota2": false, "nota3": false}'
```

### Como CATEDRÁTICO:

#### 1. Ver Mis Permisos
```bash
curl http://localhost:3000/api/catedratico/permisos/1/1
# Respuesta:
# {
#   "puedeEditarNota1": true,
#   "editadoNota1": false,
#   ...
# }
```

#### 2. Ingresar Nota
```bash
curl -X POST http://localhost:3000/api/catedratico/notas \
  -H "Content-Type: application/json" \
  -d '{
    "idInscripcion": 1,
    "nota1": 8.5,
    "nota2": null,
    "nota3": null,
    "idCatedratico": 1,
    "idGrupo": 1
  }'
```

#### 3. Intentar Editar Nuevamente (Debe Fallar)
```bash
curl -X POST http://localhost:3000/api/catedratico/notas \
  -H "Content-Type: application/json" \
  -d '{
    "idInscripcion": 1,
    "nota1": 9.0,
    "idCatedratico": 1,
    "idGrupo": 1
  }'
# Respuesta:
# {"error": "No puede editar Nota 1 o ya fue editada"}
```

---

## 📋 ENDPOINTS DISPONIBLES

### Admin
```
GET  /api/admin/periodos-notas
PUT  /api/admin/periodos-notas/:id
GET  /api/admin/permisos-edicion
POST /api/admin/permisos-edicion
PUT  /api/admin/permisos-edicion/:id/resetear
```

### Catedrático
```
GET  /api/catedratico/permisos/:idCatedratico/:idGrupo
POST /api/catedratico/notas
```

---

## 🧪 PRUEBAS RÁPIDAS

### 1. Verificar Tablas
```sql
SELECT * FROM configuracion.periodos_notas;
SELECT * FROM configuracion.permisos_edicion;
```

### 2. Probar Flujo Completo
```bash
# 1. Admin habilita permiso
curl -X POST http://localhost:3000/api/admin/permisos-edicion \
  -H "Content-Type: application/json" \
  -d '{"idCatedratico":1,"idMateria":1,"idGrupo":1,"nota1":true,"nota2":false,"nota3":false,"idAdmin":1}'

# 2. Catedrático ingresa nota
curl -X POST http://localhost:3000/api/catedratico/notas \
  -H "Content-Type: application/json" \
  -d '{"idInscripcion":1,"nota1":8.5,"idCatedratico":1,"idGrupo":1}'

# 3. Catedrático intenta editar (debe fallar)
curl -X POST http://localhost:3000/api/catedratico/notas \
  -H "Content-Type: application/json" \
  -d '{"idInscripcion":1,"nota1":9.0,"idCatedratico":1,"idGrupo":1}'

# 4. Admin resetea
curl -X PUT http://localhost:3000/api/admin/permisos-edicion/1/resetear \
  -H "Content-Type: application/json" \
  -d '{"nota1":true,"nota2":false,"nota3":false}'

# 5. Catedrático edita nuevamente (ahora sí funciona)
curl -X POST http://localhost:3000/api/catedratico/notas \
  -H "Content-Type: application/json" \
  -d '{"idInscripcion":1,"nota1":9.0,"idCatedratico":1,"idGrupo":1}'
```

---

## 📁 ARCHIVOS IMPORTANTES

```
backend/
├── schema_permisos.sql          ← Ejecutar primero
├── test_permisos.sql            ← Pruebas SQL
├── src/controllers/
│   ├── catedraticoController.js ← Sistema de permisos
│   └── adminController.js       ← Gestión de permisos

frontend-web/
└── src/app/
    ├── login/page.tsx           ← Botón mostrar/ocultar
    └── reports/page.tsx         ← Error corregido
```

---

## ⚠️ IMPORTANTE

1. ✅ Backend móvil NO fue modificado
2. ✅ Solo se modificó backend web
3. ✅ Ejecuta `schema_permisos.sql` antes de usar
4. ✅ Los IDs en los ejemplos son de prueba, ajusta según tu DB

---

## 🎓 FLUJO TÍPICO

```
DÍA 1 - PARCIAL 1:
1. Admin activa "Parcial 1" (15/01 - 15/03)
2. Admin habilita Nota1 para todos los catedráticos
3. Catedráticos ingresan Nota1 (solo una vez)
4. Si hay error, admin resetea y catedrático corrige

DÍA 30 - PARCIAL 2:
1. Admin desactiva "Parcial 1"
2. Admin activa "Parcial 2" (16/03 - 15/05)
3. Admin habilita Nota2 para todos los catedráticos
4. Catedráticos ingresan Nota2
5. Nota final se recalcula automáticamente

DÍA 60 - PARCIAL 3:
1. Admin activa "Parcial 3" (16/05 - 15/07)
2. Admin habilita Nota3
3. Catedráticos ingresan Nota3
4. Nota final = (Nota1 + Nota2 + Nota3) / 3
```

---

## ✅ CHECKLIST

- [ ] Ejecutar `schema_permisos.sql`
- [ ] Iniciar backend (puerto 3000)
- [ ] Iniciar frontend (puerto 3001)
- [ ] Probar login con botón mostrar/ocultar
- [ ] Probar reportes (sin error)
- [ ] Crear períodos de notas
- [ ] Habilitar permisos a catedráticos
- [ ] Probar ingreso de notas
- [ ] Probar restricción de una sola edición
- [ ] Probar reseteo por admin

---

**🎉 ¡Sistema completamente funcional!**

Para más detalles, ver: `SISTEMA_PERMISOS_COMPLETO.md`
