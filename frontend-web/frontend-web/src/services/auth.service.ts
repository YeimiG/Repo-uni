/* auth service para web sin token JWT */
import api from "@/services/api";

interface LoginResponse {
  success: boolean;
  message?: string;
  usuario: {
    idUsuario: number;
    correo: string;
    rol: string;
    nombre: string;
    apellidos: string;
    primerLogin: boolean;
  };
}

export async function login(correo: string, clave: string) {
  const response = await api.post<LoginResponse>(`/api/auth/login`, {
    correo,
    clave,
  });

  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.usuario));
    return response.data;
  }

  throw new Error(response.data.message || "Login fallido");
}

export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function getUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}
