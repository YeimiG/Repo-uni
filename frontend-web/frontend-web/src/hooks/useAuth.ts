import { getUser } from "@/services/auth.service";
import { useState } from "react";

export interface User {
  idUsuario: number;
  correo: string;
  rol: string;
  nombre: string;
  apellidos: string;
  primerLogin: boolean;
}

export function useAuth() {
  const [user] = useState<User | null>(() => getUser());

  return {
    isAuth: !!user,
    user,
  };
}
