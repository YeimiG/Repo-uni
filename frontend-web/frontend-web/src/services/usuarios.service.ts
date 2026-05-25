/**
 * Servicio de Usuarios
 * Gestiona todas las operaciones CRUD de usuarios
 */

import type {
    ApiListResponse,
    ApiResponse,
    Rol,
    Usuario,
    UsuarioResponse,
} from "@/types";
import api from "./api";

// ────────────────────────────────────────────────────────────
// GET - Obtener todos los usuarios
// ────────────────────────────────────────────────────────────
export async function getUsuarios(filters?: {
  activo?: boolean;
  rol?: string;
  search?: string;
}): Promise<ApiListResponse<UsuarioResponse>> {
  try {
    const params = new URLSearchParams();
    if (filters?.activo !== undefined)
      params.append("activo", String(filters.activo));
    if (filters?.rol) params.append("rol", filters.rol);
    if (filters?.search) params.append("search", filters.search);

    const { data } = await api.get(
      `/api/usuarios${params.toString() ? "?" + params : ""}`,
    );
    return data;
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener usuarios",
      data: [],
    };
  }
}

// ────────────────────────────────────────────────────────────
// GET - Obtener usuario por ID
// ────────────────────────────────────────────────────────────
export async function getUsuarioById(
  id: number,
): Promise<ApiResponse<UsuarioResponse>> {
  try {
    const { data } = await api.get(`/api/usuarios/${id}`);
    return data;
  } catch (error: any) {
    console.error("Error al obtener usuario:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener usuario",
    };
  }
}

// ────────────────────────────────────────────────────────────
// POST - Crear nuevo usuario
// ────────────────────────────────────────────────────────────
export async function crearUsuario(
  usuario: Omit<Usuario, "idusuario" | "activo" | "fechacreacion">,
): Promise<ApiResponse<UsuarioResponse>> {
  try {
    const { data } = await api.post("/api/usuarios", usuario);
    return data;
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear usuario",
    };
  }
}

// ────────────────────────────────────────────────────────────
// PUT - Actualizar usuario
// ────────────────────────────────────────────────────────────
export async function actualizarUsuario(
  id: number,
  usuario: Partial<Usuario>,
): Promise<ApiResponse<UsuarioResponse>> {
  try {
    const { data } = await api.put(`/api/usuarios/${id}`, usuario);
    return data;
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar usuario",
    };
  }
}

// ────────────────────────────────────────────────────────────
// PATCH - Cambiar contraseña
// ────────────────────────────────────────────────────────────
export async function cambiarContrasena(
  id: number,
  claveActual: string,
  claveNueva: string,
): Promise<ApiResponse<any>> {
  try {
    const { data } = await api.patch(`/api/usuarios/${id}/cambiar-contrasena`, {
      claveActual,
      claveNueva,
    });
    return data;
  } catch (error: any) {
    console.error("Error al cambiar contraseña:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al cambiar contraseña",
    };
  }
}

// ────────────────────────────────────────────────────────────
// PATCH - Activar/Desactivar usuario
// ────────────────────────────────────────────────────────────
export async function toggleUsuario(
  id: number,
): Promise<ApiResponse<UsuarioResponse>> {
  try {
    const { data } = await api.patch(`/api/usuarios/${id}/toggle`);
    return data;
  } catch (error: any) {
    console.error("Error al cambiar estado de usuario:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al cambiar estado",
    };
  }
}

// ────────────────────────────────────────────────────────────
// GET - Obtener roles disponibles
// ────────────────────────────────────────────────────────────
export async function getRoles(): Promise<ApiListResponse<Rol>> {
  try {
    const { data } = await api.get("/api/usuarios/roles/list");
    return data;
  } catch (error: any) {
    console.error("Error al obtener roles:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener roles",
      data: [],
    };
  }
}

// ────────────────────────────────────────────────────────────
// GET - Verificar disponibilidad de correo
// ────────────────────────────────────────────────────────────
export async function verificarCorreo(
  correo: string,
): Promise<{ success: boolean; disponible: boolean }> {
  try {
    const { data } = await api.get("/api/usuarios/verificar/correo", {
      params: { correo },
    });
    return {
      success: data.success,
      disponible: data.disponible || false,
    };
  } catch (error: any) {
    console.error("Error al verificar correo:", error);
    return {
      success: false,
      disponible: false,
    };
  }
}
