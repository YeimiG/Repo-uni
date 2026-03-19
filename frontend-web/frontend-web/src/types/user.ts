/* user type */
export interface User {
  idUsuario: number;
  correo: string;
  rol: 'SUPER_ADMIN' | 'ADMIN_ACADEMICO' | 'ADMIN_FINANCIERO' | 'COORDINADOR' | 'DOCENTE' | 'SECRETARIA' | 'ESTUDIANTE';
  nombre: string;
  apellidos: string;
  primerLogin?: boolean;
}
