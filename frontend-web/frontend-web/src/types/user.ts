/* user type */
export interface User {
  idUsuario: number;
  correo: string;
  rol: "Administrador" | "Catedrático" | "Estudiante";
  nombre: string;
  apellidos: string;
  primerLogin?: boolean;
}
