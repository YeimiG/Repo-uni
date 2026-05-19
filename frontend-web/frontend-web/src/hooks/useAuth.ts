import { getUser } from "@/services/auth.service";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  idUsuario: number;
  correo: string;
  rol: string;
  nombre: string;
  apellidos: string;
  primerLogin: boolean;
}

const PUBLIC_PATHS = ["/", "/login"];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setLoading(false);
    if (!u && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login");
    }
  }, [pathname]);

  return {
    isAuth: !!user,
    user,
    loading,
  };
}
