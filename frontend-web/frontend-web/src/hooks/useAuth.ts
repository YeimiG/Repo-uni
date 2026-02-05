/* auth hook */
import { useState } from "react";
import { getUser } from "@/services/auth.service";

interface User {
  idUsuario: number;
  correo: string;
  rol: string;
  nombre: string;
  apellidos: string;
}

export function useAuth() {
  const [token] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  
  const [user] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      return getUser();
    }
    return null;
  });

  return {
    isAuth: !!token,
    user,
    token,
  };
}
