# 🎓 Sistema de Gestión Académica IEPROES - COMPLETO

## ✅ PROYECTO 100% FUNCIONAL

### 🚀 Inicio Rápido

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend-web/frontend-web
npm install
npm run dev
```

### 🔑 Credenciales

**Admin:** MP26I01@uni.edu / 160404
**Catedrático:** AA26I00@uni.edu / 310870

## ✅ Funcionalidades Completas

### Core (100%)
- ✅ Login con JWT
- ✅ Dashboard con estadísticas reales
- ✅ Gestión de materias (CRUD + asignaciones)
- ✅ Gestión de notas (validaciones completas)
- ✅ Gestión de usuarios
- ✅ Asignar docentes a grupos
- ✅ Mover estudiantes entre grupos
- ✅ Reportes con datos reales
- ✅ Sistema de notificaciones toast
- ✅ Búsqueda en tiempo real
- ✅ Control de acceso por roles

### Validaciones
- ✅ Notas: 0-10, máximo 2 decimales
- ✅ Confirmación antes de guardar
- ✅ Validación de cupo en grupos
- ✅ Mensajes de error claros

### UX
- ✅ Toast notifications
- ✅ Estados de carga
- ✅ Búsqueda instantánea
- ✅ Responsive design
- ✅ Animaciones suaves

## 📡 Endpoints (13)

```
POST /api/auth/login
GET  /api/dashboard/stats
GET  /api/dashboard/actividad
GET  /api/grupos
GET  /api/grupos/:id/estudiantes
POST /api/grupos/notas
GET  /api/admin/usuarios
GET  /api/admin/docentes
PUT  /api/admin/grupos/:id/asignar-docente
PUT  /api/admin/inscripciones/:id/mover
GET  /api/admin/materias/:id/grupos-disponibles
GET  /api/reportes/rendimiento
GET  /api/reportes/estadisticas
```

## 📊 Base de Datos

**Esquemas:** seguridad, academico, registro
**Tablas:** 11 tablas principales
**Relaciones:** Completamente normalizadas

## 🎯 Características Destacadas

1. **Cálculo automático de notas:** (P1+P2)/2 × 0.6 + Final × 0.4
2. **Validaciones robustas:** Frontend + Backend
3. **Notificaciones elegantes:** Toast auto-cierre
4. **Búsqueda instantánea:** Sin recargar página
5. **Reportes en tiempo real:** Desde base de datos
6. **Control granular:** Permisos por rol
7. **Responsive:** Funciona en móvil y desktop

## 📦 Tecnologías

**Backend:** Node.js, Express, PostgreSQL
**Frontend:** Next.js 16, React 19, TypeScript
**Estilos:** Tailwind CSS
**Auth:** JWT

## 🏆 Estado: PRODUCCIÓN READY

- ✅ Sin errores
- ✅ Validaciones completas
- ✅ Manejo de errores
- ✅ Código limpio
- ✅ Documentado
- ✅ Optimizado

**Desarrollado para IEPROES** 🎓
