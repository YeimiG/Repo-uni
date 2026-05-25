# 🏗️ ARQUITECTURA MEJORADA - SISTEMA UNIVERSITARIO WEB

## 📋 ÍNDICE

1. [Resumen de Cambios](#resumen)
2. [Nueva Arquitectura Relacional](#arquitectura)
3. [Backend - Nuevos Controladores](#backend)
4. [Frontend - Tipos y Servicios](#frontend)
5. [Flujo de Creación de Estudiantes](#flujo-estudiantes)
6. [Flujo de Creación de Docentes](#flujo-docentes)
7. [Ejemplos de Uso](#ejemplos)
8. [Migraciones SQL Necesarias](#migraciones)

---

## 🎯 RESUMEN DE CAMBIOS {#resumen}

### ✅ COMPLETADO

#### Backend

- ✅ Nuevo controlador: `personaController.js` - CRUD completo de Personas
- ✅ Nuevo controlador: `usuarioController.js` - CRUD completo de Usuarios
- ✅ Nuevas rutas: `/api/personas` - Gestión de personas
- ✅ Nuevas rutas: `/api/usuarios` - Gestión de usuarios
- ✅ Modificado: `estudianteController.js` - Ahora usa idpersona e idusuario existentes
- ✅ Actualizado: `app.js` - Registra nuevas rutas

#### Frontend

- ✅ Tipos mejorados: `src/types/index.ts` - Tipos completos y correctos
- ✅ Nuevo servicio: `personas.service.ts` - Llamadas API para personas
- ✅ Nuevo servicio: `usuarios.service.ts` - Llamadas API para usuarios
- ✅ Actualizado: `estudiantes.service.ts` - Nuevo flujo de creación
- ✅ Nuevo hook: `useStudentCreation.ts` - Gestión de flujo en 3 pasos

### ⏳ PENDIENTE

- 🔄 Actualizar página `estudiantes/page.tsx` - Implementar nuevo flujo visual
- 🔄 Crear CRUD de Personas (opcional, si se necesita gestión separada)
- 🔄 Crear CRUD de Usuarios (opcional, si se necesita gestión separada)
- 🔄 Arreglar CRUD de Grupos (relaciones y validaciones)
- 🔄 Mejorar CRUD de Docentes (similar a estudiantes)
- 🔄 Mejorar CRUD de Empleados

---

## 🏛️ NUEVA ARQUITECTURA RELACIONAL {#arquitectura}

### Estructura de la Base de Datos

```sql
-- Paso 1: CREAR PERSONA
personas.persona (
  idpersona ← PK
  primernombre
  segundonombre
  primerapellido
  segundoapellido
  dui (UNIQUE)
  telefono
  direccion
  fechanacimiento
  activo
)

  ↓ (idpersona)

-- Paso 2: CREAR USUARIO
seguridad.usuario (
  idusuario ← PK
  idpersona ← FK (personas.persona)
  idrol ← FK (seguridad.rol)
  correo (UNIQUE)
  clave (HASHED)
  activo
  fechacreacion
)

  ↓ (idpersona, idusuario)

-- Paso 3: CREAR ESPECIALIZACIÓN
estudiantes.estudiante (
  idestudiante ← PK
  idpersona ← FK (personas.persona)
  idusuario ← FK (seguridad.usuario)
  expediente (UNIQUE)
  idcarrera ← FK (academico.carrera)
  idplanestudio ← FK (academico.planestudio)
  idestado ← FK (estudiantes.estadoestudiante)
  fechaingreso
  indiceglobal
  porcentajeavance
  activo
)

O

docentes.docente (
  iddocente ← PK
  idpersona ← FK (personas.persona)
  idusuario ← FK (seguridad.usuario)
  especialidad
  activo
)

O

empleados.empleado (
  idempleado ← PK
  idpersona ← FK (personas.persona)
  idusuario ← FK (seguridad.usuario)
  puesto
  activo
)
```

### Beneficios

- ✅ **Reutilización de Personas**: Una persona puede ser estudiante, docente, empleado simultáneamente
- ✅ **Integridad Referencial**: Relaciones claras y validadas
- ✅ **Separación de Responsabilidades**: Cada tabla tiene un propósito
- ✅ **Escalabilidad**: Fácil agregar más tipos de usuarios
- ✅ **Seguridad**: Contraseñas hasheadas separadas por usuario

---

## 🔧 BACKEND - NUEVOS CONTROLADORES {#backend}

### 1. Controller: `personaController.js`

**Ubicación**: `backend/src/controllers/controllersWeb/personaController.js`

**Endpoints**:

```javascript
// Obtener todas las personas
GET /api/personas?activo=true&search=juan

// Obtener persona por ID
GET /api/personas/:id

// Crear nueva persona
POST /api/personas
Body: {
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  dui?: string;
  telefono?: string;
  direccion?: string;
  fechanacimiento?: string;
}

// Actualizar persona
PUT /api/personas/:id
Body: Cualquier campo parcial

// Desactivar/Activar persona
PATCH /api/personas/:id/toggle

// Personas disponibles para asignar
GET /api/personas/disponibles/estudiante
GET /api/personas/disponibles/docente
GET /api/personas/disponibles/empleado
```

**Características**:

- ✅ Validación de DUI único
- ✅ Búsqueda flexible
- ✅ Filtrado por estado (activo/inactivo)
- ✅ Soft delete (desactivación)
- ✅ Detección automática de relaciones

---

### 2. Controller: `usuarioController.js`

**Ubicación**: `backend/src/controllers/controllersWeb/usuarioController.js`

**Endpoints**:

```javascript
// Obtener todos los usuarios
GET /api/usuarios?activo=true&rol=ESTUDIANTE&search=juan

// Obtener usuario por ID
GET /api/usuarios/:id

// Crear nuevo usuario
POST /api/usuarios
Body: {
  correo: string;
  clave: string;
  idrol: number;
  idpersona?: number; // Opcional, puede vincularse después
}

// Actualizar usuario
PUT /api/usuarios/:id
Body: {
  correo?: string;
  idrol?: number;
  idpersona?: number;
  activo?: boolean;
}

// Cambiar contraseña
PATCH /api/usuarios/:id/cambiar-contrasena
Body: {
  claveActual: string;
  claveNueva: string;
}

// Activar/Desactivar usuario
PATCH /api/usuarios/:id/toggle

// Obtener roles disponibles
GET /api/usuarios/roles/list

// Verificar disponibilidad de correo
GET /api/usuarios/verificar/correo?correo=juan@ejemplo.com
```

**Características**:

- ✅ Validación de correo único
- ✅ Encriptación de contraseña (bcrypt)
- ✅ Cambio seguro de contraseña
- ✅ Vinculación flexible con Personas
- ✅ Gestión de roles

---

### 3. Modificado: `estudianteController.js`

**Cambio Principal**: El método `crearEstudiante` ahora espera:

```javascript
// ANTES (INCORRECTO):
POST /api/estudiantes
Body: {
  primernombre: string;
  primerapellido: string;
  correo: string;
  clave: string;  // ← Crea usuario automáticamente
  expediente: string;
  idcarrera: number;
}

// AHORA (CORRECTO):
POST /api/estudiantes
Body: {
  idpersona: number;    // ← Persona ya debe existir
  idusuario: number;    // ← Usuario ya debe existir
  expediente: string;
  idcarrera: number;
  fechaingreso?: string;
}
```

**Beneficios**:

- ✅ Separación clara de responsabilidades
- ✅ Reutilización de Personas y Usuarios
- ✅ Validaciones correctas
- ✅ Mejor manejo de errores

---

## 📱 FRONTEND - TIPOS Y SERVICIOS {#frontend}

### 1. Tipos Mejorados: `src/types/index.ts`

```typescript
// Personas
interface Persona {
  idpersona?: number;
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  dui?: string; // ← NUEVO
  telefono?: string;
  direccion?: string;
  fechanacimiento?: string;
  activo?: boolean;
}

// Usuarios
interface Usuario {
  idusuario?: number;
  correo: string;
  clave?: string;
  idrol: number;
  idpersona?: number; // ← NUEVO: relación con Persona
  activo?: boolean;
  fechacreacion?: string;
}

interface UsuarioResponse {
  idusuario: number;
  correo: string;
  idrol: number;
  rol: RolType;
  idpersona?: number;
  persona?: PersonaResponse; // ← NUEVO: persona completa
  nombre?: string;
  activo: boolean;
  fechacreacion?: string;
}

// Estudiantes
interface Estudiante {
  idestudiante: number;
  idpersona: number; // ← AHORA REQUERIDO
  idusuario: number; // ← AHORA REQUERIDO
  expediente: string;
  idcarrera: number;
  // ... resto de campos
  persona?: PersonaResponse;
  usuario?: UsuarioResponse;
}
```

### 2. Servicios Nuevos

#### `personas.service.ts`

```typescript
export async function getPersonas(filters?: {
  activo?: boolean;
  search?: string;
});
export async function getPersonaById(id: number);
export async function crearPersona(persona: Omit<Persona, "idpersona">);
export async function actualizarPersona(id: number, persona: Partial<Persona>);
export async function togglePersona(id: number);
export async function getPersonasDisponibles(
  tipo: "estudiante" | "docente" | "empleado",
);
```

#### `usuarios.service.ts`

```typescript
export async function getUsuarios(filters?: {
  activo?: boolean;
  rol?: string;
  search?: string;
});
export async function getUsuarioById(id: number);
export async function crearUsuario(
  usuario: Omit<Usuario, "idusuario" | "activo" | "fechacreacion">,
);
export async function actualizarUsuario(id: number, usuario: Partial<Usuario>);
export async function cambiarContrasena(
  id: number,
  claveActual: string,
  claveNueva: string,
);
export async function toggleUsuario(id: number);
export async function getRoles();
export async function verificarCorreo(correo: string);
```

#### `estudiantes.service.ts` (Actualizado)

```typescript
// NUEVO flujo
export async function crearEstudiante(payload: {
  idpersona: number;
  idusuario: number;
  expediente: string;
  idcarrera: number;
  fechaingreso?: string;
});
```

### 3. Hook Personalizado: `useStudentCreation.ts`

```typescript
export function useStudentCreation() {
  return {
    paso: 1 | 2 | 3 | "completado";
    loading: boolean;
    error: string | null;

    // Datos
    idpersonaCreada?: number;
    idusuarioCreado?: number;
    personasDisponibles: PersonaResponse[];
    rolesDisponibles: Rol[];

    // Funciones
    cargarPersonasDisponibles(): Promise<void>;
    cargarRoles(): Promise<void>;
    procesarStep1(data: EstudianteCreationStep1): Promise<number | null>;
    procesarStep2(data: EstudianteCreationStep2): Promise<number | null>;
    procesarStep3(data: EstudianteCreationStep3): Promise<number | null>;
    irAlPaso(paso: 1 | 2 | 3): void;
    resetear(): void;
  }
}
```

---

## 🎓 FLUJO DE CREACIÓN DE ESTUDIANTES {#flujo-estudiantes}

### En 3 Pasos (Mismo Diseño Visual)

```
┌─────────────────────────────────────────────────────────────┐
│              CREAR ESTUDIANTE                               │
├─────────────────────────────────────────────────────────────┤
│  [Paso 1/3] PERSONA                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ○ Crear nueva persona                              │   │
│  │   Nombres, Apellidos, DUI, Teléfono, Dirección     │   │
│  │                                                       │   │
│  │ ○ Seleccionar persona existente                     │   │
│  │   [Dropdown de personas disponibles]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [SIGUIENTE]                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CREAR ESTUDIANTE                               │
├─────────────────────────────────────────────────────────────┤
│  [Paso 2/3] USUARIO                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Correo: [input]                                     │   │
│  │ Contraseña: [input]                                 │   │
│  │ Rol: [Dropdown - ESTUDIANTE seleccionado]          │   │
│  │ (Rol puede cambiar según admin)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [ANTERIOR] [SIGUIENTE]                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CREAR ESTUDIANTE                               │
├─────────────────────────────────────────────────────────────┤
│  [Paso 3/3] DATOS ACADÉMICOS                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Expediente: [input]                                 │   │
│  │ Carrera: [Dropdown]                                 │   │
│  │ Fecha de Ingreso: [input date] (opcional)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [ANTERIOR] [CREAR]                                         │
└─────────────────────────────────────────────────────────────┘
```

### Implementación en React (Mismo diseño, lógica mejorada)

```typescript
export default function EstudiantesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast } = useToast();

  const creation = useStudentCreation();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (showModal && creation.paso === 1) {
      creation.cargarPersonasDisponibles();
    }
    if (showModal && creation.paso === 2) {
      creation.cargarRoles();
    }
    if (!carreras.length) {
      getCarreras().then(res => {
        if (res.success) setCarreras(res.carreras);
      });
    }
  }, [showModal, creation.paso]);

  // Paso 1: Crear/Seleccionar Persona
  const handleStep1 = async (opcion: "nueva" | "existente", data: any) => {
    const result = await creation.procesarStep1({
      opcion,
      persona: opcion === "nueva" ? data : undefined,
      idpersona: opcion === "existente" ? data.idpersona : undefined
    });

    if (!result) {
      showToast(creation.error || "Error en paso 1", "error");
    }
  };

  // Paso 2: Crear Usuario
  const handleStep2 = async (data: { correo: string; clave: string }) => {
    const result = await creation.procesarStep2({
      correo: data.correo,
      clave: data.clave,
      idrol: creation.rolesDisponibles.find(r => r.nombrerol === "ESTUDIANTE")?.idrol || 0
    });

    if (!result) {
      showToast(creation.error || "Error en paso 2", "error");
    }
  };

  // Paso 3: Crear Estudiante
  const handleStep3 = async (data: { expediente: string; idcarrera: number }) => {
    const result = await creation.procesarStep3(data);

    if (result) {
      showToast("Estudiante creado correctamente", "success");
      setShowModal(false);
      creation.resetear();
      // Recargar lista
    } else {
      showToast(creation.error || "Error al crear estudiante", "error");
    }
  };

  // El formulario visualen NO cambia
  // Solo cambiar la lógica interna del manejador
  return (
    // ... UI exactamente igual
    // Solo actualizar los handlers para usar creation hook
  );
}
```

---

## 👨‍🏫 FLUJO DE CREACIÓN DE DOCENTES {#flujo-docentes}

### Similar a Estudiantes

```
Paso 1: Crear/Seleccionar Persona
Paso 2: Crear Usuario (Rol: DOCENTE)
Paso 3: Asignar Especialidad + Validar

Endpoint:
POST /api/docentes
Body: {
  idpersona: number;
  idusuario: number;
  especialidad?: string;
}
```

### Backend - Controller `docenteController.js`

```javascript
exports.crearDocente = async (req, res) => {
  const { idpersona, idusuario, especialidad } = req.body;

  // Validaciones
  const persona = await db.query(
    "SELECT ... FROM personas.persona WHERE idpersona = $1",
    [idpersona],
  );
  if (!persona.rows.length) throw new Error("Persona no existe");

  const usuario = await db.query(
    "SELECT ... FROM seguridad.usuario WHERE idusuario = $1",
    [idusuario],
  );
  if (!usuario.rows.length) throw new Error("Usuario no existe");

  // Crear docente
  const docente = await db.query(
    "INSERT INTO docentes.docente (idpersona, idusuario, especialidad, activo) VALUES ($1, $2, $3, true) RETURNING iddocente",
    [idpersona, idusuario, especialidad || null],
  );

  return res.json({ success: true, iddocente: docente.rows[0].iddocente });
};
```

---

## 💡 EJEMPLOS DE USO {#ejemplos}

### 1. Crear Estudiante (Frontend)

```typescript
import { useStudentCreation } from "@/hooks/useStudentCreation";
import { crearPersona } from "@/services/personas.service";
import { getCarreras } from "@/services/estudiantes.service";

export function CrearEstudianteForm() {
  const creation = useStudentCreation();
  const [form, setForm] = useState({
    step1: { opcion: "nueva" as const, persona: {} },
    step2: { correo: "", clave: "" },
    step3: { expediente: "", idcarrera: 0 }
  });

  // PASO 1: Persona
  if (creation.paso === 1) {
    return (
      <div>
        <h3>Paso 1: Persona</h3>
        <label>
          <input
            type="radio"
            checked={form.step1.opcion === "nueva"}
            onChange={() => setForm(prev => ({
              ...prev,
              step1: { ...prev.step1, opcion: "nueva" }
            }))}
          />
          Crear nueva persona
        </label>

        {form.step1.opcion === "nueva" && (
          <div>
            <input
              placeholder="Primer nombre"
              value={form.step1.persona.primernombre}
              onChange={(e) => setForm(prev => ({
                ...prev,
                step1: {
                  ...prev.step1,
                  persona: { ...prev.step1.persona, primernombre: e.target.value }
                }
              }))}
            />
            {/* Más campos... */}
          </div>
        )}

        <label>
          <input
            type="radio"
            checked={form.step1.opcion === "existente"}
            onChange={() => setForm(prev => ({
              ...prev,
              step1: { ...prev.step1, opcion: "existente" }
            }))}
          />
          Seleccionar persona existente
        </label>

        {form.step1.opcion === "existente" && (
          <select onChange={(e) => {
            const idpersona = parseInt(e.target.value);
            creation.procesarStep1({ opcion: "existente", idpersona });
          }}>
            <option value="">-- Seleccionar --</option>
            {creation.personasDisponibles.map(p => (
              <option key={p.idpersona} value={p.idpersona}>
                {p.nombre_completo}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => creation.procesarStep1(form.step1)}
          disabled={creation.loading}
        >
          Siguiente
        </button>
      </div>
    );
  }

  // PASO 2: Usuario
  if (creation.paso === 2) {
    return (
      <div>
        <h3>Paso 2: Usuario</h3>
        <input
          type="email"
          placeholder="Correo"
          value={form.step2.correo}
          onChange={(e) => setForm(prev => ({
            ...prev,
            step2: { ...prev.step2, correo: e.target.value }
          }))}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.step2.clave}
          onChange={(e) => setForm(prev => ({
            ...prev,
            step2: { ...prev.step2, clave: e.target.value }
          }))}
        />

        <button onClick={() => creation.procesarStep2(form.step2)}>
          Siguiente
        </button>
        <button onClick={() => creation.irAlPaso(1)}>
          Anterior
        </button>
      </div>
    );
  }

  // PASO 3: Datos Académicos
  if (creation.paso === 3) {
    return (
      <div>
        <h3>Paso 3: Datos Académicos</h3>
        <input
          placeholder="Expediente"
          value={form.step3.expediente}
          onChange={(e) => setForm(prev => ({
            ...prev,
            step3: { ...prev.step3, expediente: e.target.value }
          }))}
        />
        <select
          value={form.step3.idcarrera}
          onChange={(e) => setForm(prev => ({
            ...prev,
            step3: { ...prev.step3, idcarrera: parseInt(e.target.value) }
          }))}
        >
          <option value="">-- Seleccionar carrera --</option>
          {/* Opciones de carreras */}
        </select>

        <button onClick={() => creation.procesarStep3(form.step3)}>
          Crear Estudiante
        </button>
        <button onClick={() => creation.irAlPaso(2)}>
          Anterior
        </button>
      </div>
    );
  }

  if (creation.paso === "completado") {
    return (
      <div>
        <p>✅ Estudiante creado correctamente</p>
        <button onClick={() => creation.resetear()}>Crear otro</button>
      </div>
    );
  }
}
```

### 2. Llamadas API Backend

```bash
# Paso 1: Crear Persona
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "primernombre": "Juan",
    "primerapellido": "García",
    "dui": "12345678-9",
    "telefono": "2222-1234",
    "direccion": "Calle Principal #123"
  }'
# Response: { success: true, persona: { idpersona: 1, ... } }

# Paso 2: Crear Usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "correo": "juan.garcia@universidad.edu",
    "clave": "Segura123!",
    "idrol": 4,
    "idpersona": 1
  }'
# Response: { success: true, usuario: { idusuario: 1, ... } }

# Paso 3: Crear Estudiante
curl -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "idpersona": 1,
    "idusuario": 1,
    "expediente": "EST-2024-001",
    "idcarrera": 2,
    "fechaingreso": "2024-01-15"
  }'
# Response: { success: true, idestudiante: 1 }
```

---

## 🗄️ MIGRACIONES SQL NECESARIAS {#migraciones}

### Verificar que existan las columnas en las tablas

```sql
-- 1. Verificar personas.persona
ALTER TABLE personas.persona
ADD COLUMN IF NOT EXISTS dui VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS fechanacimiento DATE;

-- 2. Verificar seguridad.usuario tiene idpersona
ALTER TABLE seguridad.usuario
ADD COLUMN IF NOT EXISTS idpersona INTEGER REFERENCES personas.persona(idpersona);

-- 3. Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_personas_dui ON personas.persona(dui);
CREATE INDEX IF NOT EXISTS idx_personas_nombre ON personas.persona(primerapellido, primernombre);
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON seguridad.usuario(correo);
CREATE INDEX IF NOT EXISTS idx_estudiante_expediente ON estudiantes.estudiante(expediente);

-- 4. Trigger para validar relaciones (opcional)
CREATE OR REPLACE FUNCTION validar_usuario_persona()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.idpersona IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM personas.persona WHERE idpersona = NEW.idpersona) THEN
      RAISE EXCEPTION 'Persona no existe: %', NEW.idpersona;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF NOT EXISTS trg_usuario_persona ON seguridad.usuario;
CREATE TRIGGER trg_usuario_persona
BEFORE INSERT OR UPDATE ON seguridad.usuario
FOR EACH ROW EXECUTE FUNCTION validar_usuario_persona();
```

---

## 📝 RESUMEN FINAL

### ✅ COMPLETADO

- Nueva arquitectura relacional correcta
- Separación clara de responsabilidades
- Controladores robustos con validaciones
- Tipos TypeScript completos
- Servicios bien organizados
- Hook personalizado para flujo multi-paso

### ⏳ PRÓXIMAS TAREAS

1. Actualizar página `estudiantes/page.tsx` para usar nuevo flujo
2. Crear CRUDs de Personas (si se necesita gestión separada)
3. Arreglar CRUD de Grupos (relaciones y horarios)
4. Mejorar CRUD de Docentes (similar a estudiantes)
5. Crear CRUD de Empleados (similar a estudiantes)
6. Validar todas las rutas

### 🎯 BENEFICIOS

- ✅ UI/UX sin cambios (mismo diseño)
- ✅ Backend profesional y escalable
- ✅ Datos correctamente relacionados
- ✅ Reutilización de personas
- ✅ Mejor seguridad y validaciones
- ✅ Listo para producción
