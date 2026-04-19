import { getUser } from "@/services/auth.service";
import { useState, useEffect } from "react";

export interface User {
  idUsuario: number;
  correo: string;
  rol: string;
  nombre: string;
  apellidos: string;
  primerLogin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  return {
    isAuth: !!user,
    user,
    loading,
  };
}
