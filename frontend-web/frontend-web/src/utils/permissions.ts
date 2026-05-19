// Control de acceso por roles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_ACADEMICO: 'ADMIN_ACADEMICO',
  ADMIN_FINANCIERO: 'ADMIN_FINANCIERO',
  COORDINADOR: 'COORDINADOR',
  DOCENTE: 'DOCENTE',
  SECRETARIA: 'SECRETARIA',
  ESTUDIANTE: 'ESTUDIANTE',
};

// Admins con control académico completo
const ADMINS = ['SUPER_ADMIN', 'ADMIN_ACADEMICO', 'COORDINADOR'];
const DOCENTES = ['DOCENTE'];
const TODOS = [...ADMINS, ...DOCENTES, 'ADMIN_FINANCIERO', 'SECRETARIA'];

export const PERMISSIONS = {
  // Crear/editar usuarios y estudiantes
  MANAGE_USERS:    [...ADMINS, 'SECRETARIA'],
  // Ver y gestionar materias/grupos (admin crea, docente solo ve los suyos)
  MANAGE_SUBJECTS: [...ADMINS, ...DOCENTES],
  // Ingresar y ver notas
  MANAGE_GRADES:   [...ADMINS, ...DOCENTES],
  // Ver reportes (todos los roles web)
  VIEW_REPORTS:    [...TODOS],
  // Configuración del sistema: períodos, permisos de notas
  SYSTEM_CONFIG:   ['SUPER_ADMIN', 'ADMIN_ACADEMICO'],
  // Ver estadísticas del dashboard
  VIEW_STATS:      [...TODOS],
  // Funciones financieras: pagos, aranceles
  MANAGE_FINANCE:  ['SUPER_ADMIN', 'ADMIN_FINANCIERO'],
};

export function hasPermission(userRole: string | undefined, permission: string[]): boolean {
  if (!userRole) return false;
  return permission.includes(userRole);
}

export function isAdmin(userRole: string | undefined): boolean {
  return ADMINS.includes(userRole ?? '');
}

export function isDocente(userRole: string | undefined): boolean {
  return userRole === ROLES.DOCENTE;
}

export function isFinanciero(userRole: string | undefined): boolean {
  return userRole === ROLES.ADMIN_FINANCIERO;
}

export function isSecretaria(userRole: string | undefined): boolean {
  return userRole === ROLES.SECRETARIA;
}
