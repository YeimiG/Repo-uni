// Control de acceso por roles
export const ROLES = {
  ADMIN: 'Administrador',
  CATEDRATICO: 'Catedrático',
};

export const PERMISSIONS = {
  // Administrador: acceso total
  MANAGE_USERS: [ROLES.ADMIN],
  MANAGE_SUBJECTS: [ROLES.ADMIN, ROLES.CATEDRATICO],
  MANAGE_GRADES: [ROLES.ADMIN, ROLES.CATEDRATICO],
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.CATEDRATICO],
  SYSTEM_CONFIG: [ROLES.ADMIN],
  VIEW_STATS: [ROLES.ADMIN, ROLES.CATEDRATICO],
};

export function hasPermission(userRole: string | undefined, permission: string[]): boolean {
  if (!userRole) return false;
  return permission.includes(userRole);
}

export function isAdmin(userRole: string | undefined): boolean {
  return userRole === ROLES.ADMIN;
}

export function isCatedratico(userRole: string | undefined): boolean {
  return userRole === ROLES.CATEDRATICO;
}
