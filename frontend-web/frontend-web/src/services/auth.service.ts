/* auth service */
import api from "@/services/api";

interface LoginResponse {
  success: boolean;
  token: string;
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
  const { data } = await api.post<LoginResponse>(`/api/auth/login`, { correo, clave });

  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.usuario));
    localStorage.setItem("token", data.token);
    return data;
  }

  throw new Error("Login fallido");
}

export function logout() {
  localStorage.removeItem("token");
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
