/**
 * Servicio de Personas
 * Gestiona todas las operaciones CRUD de personas
 */

import type {
    ApiListResponse,
    ApiResponse,
    Persona,
    PersonaResponse,
} from "@/types";
import api from "./api";

// ────────────────────────────────────────────────────────────
// GET - Obtener todas las personas
// ────────────────────────────────────────────────────────────
export async function getPersonas(filters?: {
  activo?: boolean;
  search?: string;
}): Promise<ApiListResponse<PersonaResponse>> {
  try {
    const params = new URLSearchParams();
    if (filters?.activo !== undefined)
      params.append("activo", String(filters.activo));
    if (filters?.search) params.append("search", filters.search);

    const { data } = await api.get(
      `/api/personas${params.toString() ? "?" + params : ""}`,
    );
    return data;
  } catch (error: any) {
    console.error("Error al obtener personas:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener personas",
      data: [],
    };
  }
}

// ────────────────────────────────────────────────────────────
// GET - Obtener persona por ID
// ────────────────────────────────────────────────────────────
export async function getPersonaById(
  id: number,
): Promise<ApiResponse<PersonaResponse>> {
  try {
    const { data } = await api.get(`/api/personas/${id}`);
    return data;
  } catch (error: any) {
    console.error("Error al obtener persona:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener persona",
    };
  }
}

// ────────────────────────────────────────────────────────────
// POST - Crear nueva persona
// ────────────────────────────────────────────────────────────
export async function crearPersona(
  persona: Omit<Persona, "idpersona">,
): Promise<ApiResponse<PersonaResponse>> {
  try {
    const { data } = await api.post("/api/personas", persona);
    return data;
  } catch (error: any) {
    console.error("Error al crear persona:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear persona",
    };
  }
}

// ────────────────────────────────────────────────────────────
// PUT - Actualizar persona
// ────────────────────────────────────────────────────────────
export async function actualizarPersona(
  id: number,
  persona: Partial<Persona>,
): Promise<ApiResponse<PersonaResponse>> {
  try {
    const { data } = await api.put(`/api/personas/${id}`, persona);
    return data;
  } catch (error: any) {
    console.error("Error al actualizar persona:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar persona",
    };
  }
}

// ────────────────────────────────────────────────────────────
// PATCH - Desactivar/Activar persona
// ────────────────────────────────────────────────────────────
export async function togglePersona(
  id: number,
): Promise<ApiResponse<PersonaResponse>> {
  try {
    const { data } = await api.patch(`/api/personas/${id}/toggle`);
    return data;
  } catch (error: any) {
    console.error("Error al cambiar estado de persona:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al cambiar estado",
    };
  }
}

// ────────────────────────────────────────────────────────────
// GET - Obtener personas disponibles para asignar
// ────────────────────────────────────────────────────────────
export async function getPersonasDisponibles(
  tipo: "estudiante" | "docente" | "empleado",
): Promise<ApiListResponse<PersonaResponse>> {
  try {
    const { data } = await api.get(`/api/personas/disponibles/${tipo}`);
    return data;
  } catch (error: any) {
    console.error("Error al obtener personas disponibles:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al obtener personas disponibles",
      data: [],
    };
  }
}
