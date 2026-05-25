# ✅ CHECKLIST DE IMPLEMENTACIÓN - SISTEMA UNIVERSITARIO

## 📊 RESUMEN EJECUTIVO

Este documento resume todos los cambios realizados en el sistema universitario web para corregir la arquitectura relacional y mejorar la integración backend-frontend SIN cambiar la interfaz visual.

**Estado Global**: 🟡 60% Completado (Backend: ✅ 90%, Frontend: 🔄 50%)

---

## ✅ COMPLETADO

### Backend (90%)

#### Controladores Nuevos

- ✅ **personaController.js** - CRUD completo de Personas
  - getPersonas() - Listar con filtros
  - getPersonaById() - Obtener por ID
  - crearPersona() - Crear nueva
  - actualizarPersona() - Actualizar
  - desactivarPersona() - Soft delete
  - getPersonasDisponibles() - Personas sin especialización

- ✅ **usuarioController.js** - CRUD completo de Usuarios
  - getUsuarios() - Listar con filtros
  - getUsuarioById() - Obtener por ID
  - crearUsuario() - Crear nueva (con encriptación bcrypt)
  - actualizarUsuario() - Actualizar
  - cambiarContrasena() - Cambio seguro
  - toggleUsuario() - Activar/Desactivar
  - getRoles() - Listar roles
  - verificarCorreo() - Verificar disponibilidad

- ✅ **docenteController.js** - CRUD completo de Docentes (MEJORADO)
  - getDocentes() - Listar con relaciones
  - getDocenteById() - Obtener por ID
  - crearDocente() - Crear con validaciones
  - actualizarDocente() - Actualizar
  - toggleDocente() - Activar/Desactivar
  - getGruposDocente() - Obtener grupos asignados

#### Controladores Modificados

- ✅ **estudianteController.js** - MODIFICADO
  - crearEstudiante() - Nuevo parámetro: idpersona + idusuario (antes: nombres + correo + clave)
  - Validaciones mejoradas
  - Mejor manejo de errores

#### Rutas Nuevas

- ✅ **personasRoutes.js** - Rutas para CRUD de personas
  - GET /api/personas
  - GET /api/personas/disponibles/:tipo
  - GET /api/personas/:id
  - POST /api/personas
  - PUT /api/personas/:id
  - PATCH /api/personas/:id/toggle

- ✅ **usuariosRoutes.js** - Rutas para CRUD de usuarios
  - GET /api/usuarios
  - GET /api/usuarios/roles/list
  - GET /api/usuarios/verificar/correo
  - GET /api/usuarios/:id
  - POST /api/usuarios
  - PUT /api/usuarios/:id
  - PATCH /api/usuarios/:id/cambiar-contrasena
  - PATCH /api/usuarios/:id/toggle

- ✅ **docentesRoutes.js** - Rutas para CRUD de docentes
  - GET /api/docentes
  - GET /api/docentes/:id
  - GET /api/docentes/:id/grupos
  - POST /api/docentes
  - PUT /api/docentes/:id
  - PATCH /api/docentes/:id/toggle

#### Actualización de app.js

- ✅ Registradas nuevas rutas
- ✅ Orden lógico de rutas

---

### Frontend (60%)

#### Tipos (100%)

- ✅ **src/types/index.ts** - Tipos completos
  - Persona (mejorado con DUI)
  - Usuario (con relación a Persona)
  - Rol
  - Estudiante (con relaciones)
  - Docente (con relaciones)
  - Carrera
  - Materia
  - Período
  - Grupo
  - Inscripción
  - Nota
  - Tipos de respuesta API

#### Servicios (100%)

- ✅ **personas.service.ts** - Servicio completo
  - getPersonas()
  - getPersonaById()
  - crearPersona()
  - actualizarPersona()
  - togglePersona()
  - getPersonasDisponibles()

- ✅ **usuarios.service.ts** - Servicio completo
  - getUsuarios()
  - getUsuarioById()
  - crearUsuario()
  - actualizarUsuario()
  - cambiarContrasena()
  - toggleUsuario()
  - getRoles()
  - verificarCorreo()

- ✅ **estudiantes.service.ts** - Servicio MODIFICADO
  - crearEstudiante() - Nuevo parámetro: idpersona + idusuario
  - getEstudiantes()
  - editarEstudiante()
  - toggleEstudiante()
  - getCarreras()
  - getEstadosEstudiante()

#### Hooks (100%)

- ✅ **useStudentCreation.ts** - Hook para flujo 3 pasos
  - Estado: paso, loading, error
  - Datos: idpersonaCreada, idusuarioCreado, personasDisponibles, rolesDisponibles
  - Funciones: cargarPersonasDisponibles(), cargarRoles()
  - Funciones: procesarStep1(), procesarStep2(), procesarStep3()
  - Funciones: irAlPaso(), resetear()

#### Documentación (100%)

- ✅ **ARQUITECTURA_MEJORADA.md** - Documentación completa
  - Resumen de cambios
  - Nueva arquitectura relacional
  - Backend - Nuevos controladores
  - Frontend - Tipos y servicios
  - Flujo de creación de estudiantes
  - Flujo de creación de docentes
  - Ejemplos de uso
  - Migraciones SQL

---

## 🔄 EN PROGRESO / PENDIENTE

### Frontend - Páginas (40%)

#### Estudiantes

- 🔄 **src/app/estudiantes/page.tsx** - PENDIENTE ACTUALIZAR
  - [ ] Implementar useStudentCreation hook
  - [ ] Modal con 3 pasos
  - [ ] Paso 1: Crear/Seleccionar Persona
  - [ ] Paso 2: Crear Usuario
  - [ ] Paso 3: Crear Estudiante
  - [ ] Mantener mismo diseño visual
  - [ ] Mantener misma tabla
  - [ ] Mantener mismo flujo UI/UX

#### Docentes (SI EXISTE)

- 🔄 **src/app/docentes/page.tsx** - SIMILAR A ESTUDIANTES
  - [ ] Crear si no existe
  - [ ] Implementar flujo similar
  - [ ] 3 pasos: Persona → Usuario (rol DOCENTE) → Docente

#### Empleados (SI EXISTE)

- 🔄 **src/app/empleados/page.tsx** - SIMILAR A ESTUDIANTES
  - [ ] Crear si no existe
  - [ ] Implementar flujo similar
  - [ ] 3 pasos: Persona → Usuario → Empleado

#### Usuarios (Admin)

- 🔄 **Página de Gestión de Usuarios** - PENDIENTE
  - [ ] Listar usuarios
  - [ ] Crear usuario
  - [ ] Editar usuario
  - [ ] Cambiar contraseña
  - [ ] Activar/Desactivar

#### Personas (Admin)

- 🔄 **Página de Gestión de Personas** - PENDIENTE
  - [ ] Listar personas
  - [ ] Crear persona
  - [ ] Editar persona
  - [ ] Ver relaciones (estudiante/docente/empleado)
  - [ ] Activar/Desactivar

---

### Backend - Arreglos Faltantes (50%)

#### Controladores

- 🔄 **empleadoController.js** - PENDIENTE
  - [ ] getEmpleados()
  - [ ] getEmpleadoById()
  - [ ] crearEmpleado()
  - [ ] actualizarEmpleado()
  - [ ] toggleEmpleado()

- 🔄 **grupoController.js** - MEJORADO NECESARIO
  - [ ] Validar relaciones con Materias, Docentes, Períodos
  - [ ] Validar cupos
  - [ ] Relación con Horarios (si existe)
  - [ ] Relación con Salones (si existe)

#### Rutas

- 🔄 **empleadosRoutes.js** - PENDIENTE

#### Migraciones SQL

- [ ] Verificar que personas.persona tenga columnas: dui, fechanacimiento
- [ ] Verificar que seguridad.usuario tenga columna: idpersona
- [ ] Crear índices para búsquedas
- [ ] Crear triggers de validación (opcional)

---

## 🛠️ INSTRUCCIONES POR TAREA

### Tarea 1: Actualizar página de Estudiantes

**Archivo**: `frontend-web/frontend-web/src/app/estudiantes/page.tsx`

**Cambios Necesarios**:

1. Importar `useStudentCreation` hook
2. En modal de crear, usar hook en lugar de form directo
3. Mostrar 3 pasos en el modal
4. Mantener exactamente el mismo diseño visual

**Pseudocódigo**:

```typescript
export default function EstudiantesPage() {
  const creation = useStudentCreation();
  const [showModal, setShowModal] = useState(false);

  // Cuando se abre el modal, cargar datos
  useEffect(() => {
    if (showModal) {
      if (creation.paso === 1) creation.cargarPersonasDisponibles();
      if (creation.paso === 2) creation.cargarRoles();
    }
  }, [showModal, creation.paso]);

  // Renderizar 3 pasos
  return (
    <>
      <Sidebar />
      {/* ... header igual ... */}

      {showModal && (
        <Modal>
          {creation.paso === 1 && <Step1Component {...creation} />}
          {creation.paso === 2 && <Step2Component {...creation} />}
          {creation.paso === 3 && <Step3Component {...creation} />}
        </Modal>
      )}
    </>
  );
}
```

---

### Tarea 2: Crear Página de Docentes (Opcional)

**Archivo**: `frontend-web/frontend-web/src/app/docentes/page.tsx`

**Base**: Copiar de `estudiantes/page.tsx` y adaptar
**Cambios**: Usar hook similar pero con `crearDocente` al final

---

### Tarea 3: Arreglar CRUD de Grupos

**Archivo**: `backend/src/controllers/controllersWeb/grupoController.js`

**Validaciones Necesarias**:

- Verificar que Materia existe
- Verificar que Docente existe (si se asigna)
- Verificar que Período existe
- Verificar que no existe grupo duplicado
- Validar cupos
- Si existe tabla grupoHorario, validar relaciones

---

### Tarea 4: Crear CRUD de Empleados

**Archivos**:

- `backend/src/controllers/controllersWeb/empleadoController.js`
- `backend/src/routes/routesWeb/empleadosRoutes.js`
- `frontend-web/frontend-web/src/services/empleados.service.ts`

**Flujo**: Igual a Estudiantes y Docentes (3 pasos)

---

## 🗄️ MIGRACIONES SQL NECESARIAS

```sql
-- Ejecutar en orden:

-- 1. Agregar columnas faltantes
ALTER TABLE personas.persona ADD COLUMN IF NOT EXISTS dui VARCHAR(20) UNIQUE;
ALTER TABLE personas.persona ADD COLUMN IF NOT EXISTS fechanacimiento DATE;
ALTER TABLE seguridad.usuario ADD COLUMN IF NOT EXISTS idpersona INTEGER REFERENCES personas.persona(idpersona);

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS idx_personas_dui ON personas.persona(dui);
CREATE INDEX IF NOT EXISTS idx_personas_nombre ON personas.persona(primerapellido, primernombre);
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON seguridad.usuario(correo);
CREATE INDEX IF NOT EXISTS idx_usuario_persona ON seguridad.usuario(idpersona);
CREATE INDEX IF NOT EXISTS idx_estudiante_expediente ON estudiantes.estudiante(expediente);
CREATE INDEX IF NOT EXISTS idx_docente_persona ON docentes.docente(idpersona);

-- 3. Triggers de validación (opcional)
CREATE OR REPLACE FUNCTION validar_usuario_persona() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.idpersona IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM personas.persona WHERE idpersona = NEW.idpersona) THEN
      RAISE EXCEPTION 'Persona no existe: %', NEW.idpersona;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuario_persona ON seguridad.usuario;
CREATE TRIGGER trg_usuario_persona
BEFORE INSERT OR UPDATE ON seguridad.usuario
FOR EACH ROW EXECUTE FUNCTION validar_usuario_persona();
```

---

## 📋 PRÓXIMAS PRIORIDADES

### 🔴 CRÍTICO (Hazlo primero)

1. [ ] Actualizar `estudiantes/page.tsx` con nuevo flujo
2. [ ] Ejecutar migraciones SQL
3. [ ] Probar creación de estudiantes end-to-end

### 🟡 IMPORTANTE (Hazlo pronto)

4. [ ] Crear página de Docentes (si no existe)
5. [ ] Arreglar CRUD de Grupos
6. [ ] Crear página de Empleados

### 🟢 OPCIONAL (Hazlo después)

7. [ ] Crear página de administración de Personas
8. [ ] Crear página de administración de Usuarios
9. [ ] Mejorar reportes

---

## 💡 NOTAS IMPORTANTES

### ✅ LO QUE SE MANTIENE IGUAL

- ✅ Diseño visual (colores, layout, componentes)
- ✅ Sidebar actual
- ✅ Tablas existentes
- ✅ Navegación
- ✅ Estilos CSS/Tailwind
- ✅ Backend móvil (NO TOCADO)

### ✅ LO QUE CAMBIA

- ✅ Lógica interna de CRUDs
- ✅ Flujo de datos (3 pasos en lugar de 1)
- ✅ Relaciones de BD
- ✅ Arquitectura backend
- ✅ Tipos TypeScript

### ⚠️ VALIDACIONES IMPORTANTES

- ⚠️ Verificar que todas las personas tengan correo único
- ⚠️ Verificar que no haya expedientes duplicados
- ⚠️ Verificar integridad referencial en BD
- ⚠️ Testar flujo completo de 3 pasos

---

## 🔗 REFERENCIAS

- **Arquitectura**: [ARQUITECTURA_MEJORADA.md](./ARQUITECTURA_MEJORADA.md)
- **Tipos**: [src/types/index.ts](./frontend-web/frontend-web/src/types/index.ts)
- **Controllers**: `backend/src/controllers/controllersWeb/`
- **Servicios**: `frontend-web/frontend-web/src/services/`
- **Hooks**: `frontend-web/frontend-web/src/hooks/`

---

## 📞 SOPORTE

Si encuentras problemas:

1. Verifica que los CORs esté habilitado
2. Verifica que la BD tenga las columnas necesarias
3. Revisa los logs del backend en `backend/`
4. Verifica que bcrypt esté instalado (`npm install bcryptjs`)
5. Valida tipos TypeScript con `tsc --noEmit`
