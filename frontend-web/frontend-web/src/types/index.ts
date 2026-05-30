/* ==================== TIPOS PRINCIPALES ==================== */

// Enumeraciones
export type RolType =
  | "SUPER_ADMIN"
  | "ADMIN_ACADEMICO"
  | "ADMIN_FINANCIERO"
  | "COORDINADOR"
  | "DOCENTE"
  | "SECRETARIA"
  | "ESTUDIANTE";
export type EstadoEstudiante =
  | "ACTIVO"
  | "INACTIVO"
  | "SUSPENDIDO"
  | "EGRESADO"
  | "DESERTOR";
export type EstadoGrupo = "ACTIVO" | "CANCELADO" | "SUSPENDIDO";

/* ==================== PERSONAS ==================== */
export interface Persona {
  idpersona?: number;
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  dui?: string;
  numeroDocumento?: string;
  idTipoDocumento?: number;
  tipoDocumento?: string;
  telefono?: string;
  direccion?: string;
  fechanacimiento?: string;
  activo?: boolean;
}

export interface PersonaResponse {
  idpersona: number;
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  dui?: string;
  numeroDocumento?: string;
  idTipoDocumento?: number;
  tipoDocumento?: string;
  telefono?: string;
  direccion?: string;
  nombre_completo?: string;
}

export interface TipoDocumento {
  idTipoDocumento: number;
  nombre: string;
  abreviatura?: string;
  paisOrigen?: string;
  activo?: boolean;
}

/* ==================== USUARIOS ==================== */
export interface Usuario {
  idusuario?: number;
  correo: string;
  clave?: string;
  idrol: number;
  idpersona?: number;
  activo?: boolean;
  fechacreacion?: string;
}

export interface UsuarioResponse {
  idusuario: number;
  correo: string;
  idrol: number;
  rol: RolType;
  idpersona?: number;
  persona?: PersonaResponse;
  nombre?: string;
  activo: boolean;
  fechacreacion?: string;
}

export interface UsuarioFull extends UsuarioResponse {
  persona: PersonaResponse;
}

/* ==================== ROLES ==================== */
export interface Rol {
  idrol: number;
  nombrerol: RolType;
  descripcion?: string;
  activo?: boolean;
}

/* ==================== ESTUDIANTES ==================== */
export interface Estudiante {
  idestudiante: number;
  idpersona: number;
  idusuario: number;
  expediente: string;
  idcarrera: number;
  idplanestudio?: number;
  idestado: number;
  fechaingreso: string;
  indiceglobal?: number;
  porcentajeavance?: number;
  activo: boolean;
  // Datos relacionados
  persona?: PersonaResponse;
  usuario?: UsuarioResponse;
  carrera?: Carrera;
  estado?: { idestado: number; nombre: string };
  correo?: string;
}

export interface EstudianteForm {
  primernombre: string;
  primerapellido: string;
  dui?: string;
  telefono?: string;
  direccion?: string;
  correo: string;
  clave: string;
  expediente: string;
  idcarrera: number;
  fechaingreso?: string;
}

/* ==================== DOCENTES ==================== */
export interface Docente {
  iddocente: number;
  idpersona: number;
  idusuario: number;
  especialidad?: string;
  activo: boolean;
  // Datos relacionados
  persona?: PersonaResponse;
  usuario?: UsuarioResponse;
  nombre?: string;
  correo?: string;
  grupos_asignados?: number;
}

export interface DocenteForm {
  primernombre: string;
  primerapellido: string;
  dui?: string;
  telefono?: string;
  direccion?: string;
  correo: string;
  clave: string;
  especialidad?: string;
}

/* ==================== CARRERAS ==================== */
export interface Carrera {
  idcarrera: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
}

/* ==================== MATERIAS ==================== */
export interface Materia {
  idmateria: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidadesvalorativas: number;
  horasteorias: number;
  horaspracticas: number;
  tipo: "OBLIGATORIA" | "ELECTIVA" | "OPTATIVA";
  activo?: boolean;
}

/* ==================== PERÍODOS ==================== */
export interface PeriodoAcademico {
  idperiodo: number;
  nombre: string;
  numeroperiodo?: number;
  fechainicio?: string;
  fechafin?: string;
  activo?: boolean;
}

/* ==================== GRUPOS ==================== */
export interface Grupo {
  idgrupo: number;
  codigo?: string;
  numerogrupo: number;
  cupomaximo: number;
  cupoactual?: number;
  idmateria: number;
  iddocente?: number;
  idperiodo: number;
  estado?: EstadoGrupo;
  activo?: boolean;
  // Datos relacionados
  materia?: Materia;
  docente?: Docente;
  periodo?: PeriodoAcademico;
  nombre?: string;
  codigomateria?: string;
  inscritos?: number;
  ciclo?: string;
}

export interface GrupoForm {
  idmateria: number;
  iddocente?: number;
  idperiodo: number;
  numerogrupo: number;
  cupomaximo: number;
}

/* ==================== INSCRIPCIONES ==================== */
export interface Inscripcion {
  idinscripcion: number;
  idestudiante: number;
  idgrupo: number;
  fechainscripcion?: string;
  estado?: string;
  // Datos relacionados
  estudiante?: Estudiante;
  grupo?: Grupo;
}

/* ==================== NOTAS ==================== */
export interface Nota {
  idnotafinal: number;
  idinscripcion: number;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  nota5: number;
  notapromedio: number;
  notafinal: number;
}

/* ==================== API RESPONSES ==================== */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

/* ==================== USUARIO AUTENTICADO ==================== */
export interface User {
  idUsuario: number;
  correo: string;
  rol: RolType;
  nombre: string;
  apellidos: string;
  primerLogin?: boolean;
}

/* ==================== ESTADO DE LA APLICACIÓN ==================== */
export interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}
