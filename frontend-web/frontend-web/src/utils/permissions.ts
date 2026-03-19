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

const ADMINS = ['SUPER_ADMIN', 'ADMIN_ACADEMICO', 'COORDINADOR'];
const DOCENTES = ['DOCENTE'];
const TODOS = [...ADMINS, ...DOCENTES, 'ADMIN_FINANCIERO', 'SECRETARIA'];

export const PERMISSIONS = {
  MANAGE_USERS:    [...ADMINS, 'SECRETARIA'],
  MANAGE_SUBJECTS: [...ADMINS, ...DOCENTES],
  MANAGE_GRADES:   [...ADMINS, ...DOCENTES],
  VIEW_REPORTS:    [...TODOS],
  SYSTEM_CONFIG:   ['SUPER_ADMIN', 'ADMIN_ACADEMICO'],
  VIEW_STATS:      [...TODOS],
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
