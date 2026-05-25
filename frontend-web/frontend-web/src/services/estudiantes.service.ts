/**
 * Servicio de Estudiantes
 * Gestiona operaciones CRUD de estudiantes
 *
 * NOTA: La creación de estudiantes ahora sigue un flujo en 3 pasos:
 * 1. Crear/Seleccionar Persona (usar personas.service)
 * 2. Crear Usuario (usar usuarios.service)
 * 3. Crear Estudiante con idpersona e idusuario
 */

import api from "@/services/api";
import type { Carrera } from "@/types";

export async function getEstudiantes() {
  try {
    const { data } = await api.get(`/api/estudiantes`);
    return data;
  } catch {
    return { success: false, estudiantes: [] };
  }
}

/**
 * Crear estudiante - NUEVO FLUJO
 * Requiere: idpersona (persona ya creada/seleccionada)
 *           idusuario (usuario ya creado)
 */
export async function crearEstudiante(payload: {
  idpersona: number;
  idusuario: number;
  expediente: string;
  idcarrera: number;
  fechaingreso?: string;
}) {
  try {
    const { data } = await api.post(`/api/estudiantes`, payload);
    return data;
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || "Error al crear estudiante",
    };
  }
}

export async function editarEstudiante(
  id: number,
  payload: {
    primernombre?: string;
    primerapellido?: string;
    correo?: string;
    idcarrera?: number;
    idestado?: number;
  },
) {
  try {
    const { data } = await api.put(`/api/estudiantes/${id}`, payload);
    return data;
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || "Error al editar",
    };
  }
}

export async function toggleEstudiante(id: number) {
  try {
    const { data } = await api.patch(`/api/estudiantes/${id}/toggle`);
    return data;
  } catch {
    return { success: false, message: "Error al cambiar estado" };
  }
}

export async function getCarreras(): Promise<{
  success: boolean;
  carreras: Carrera[];
}> {
  try {
    const { data } = await api.get(`/api/estudiantes/carreras`);
    return data;
  } catch {
    return { success: false, carreras: [] };
  }
}

export async function getEstadosEstudiante() {
  try {
    const { data } = await api.get(`/api/estudiantes/estados`);
    return data;
  } catch {
    return { success: false, estados: [] };
  }
}
