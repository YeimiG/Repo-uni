import api from "@/services/api";

export async function getPeriodosNotas() {
  try {
    const { data } = await api.get(`/api/admin/periodos-notas`);
    return data;
  } catch {
    return { success: false, periodos: [] };
  }
}

export async function actualizarPeriodo(idPeriodo: number, payload: {
  fechaInicio: string; fechaFin: string; activo: boolean;
}) {
  try {
    const { data } = await api.put(`/api/admin/periodos-notas/${idPeriodo}`, payload);
    return data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Error al actualizar período" };
  }
}

export async function getPermisosEdicion() {
  try {
    const { data } = await api.get(`/api/admin/permisos-edicion`);
    return data;
  } catch {
    return { success: false, permisos: [] };
  }
}

export async function habilitarPermiso(payload: {
  idCatedratico: number; idMateria: number; idGrupo: number;
  nota1: boolean; nota2: boolean; nota3: boolean; idAdmin: number;
}) {
  try {
    const { data } = await api.post(`/api/admin/permisos-edicion`, payload);
    return data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Error al habilitar permiso" };
  }
}

export async function resetearEdicion(idPermiso: number, payload: {
  nota1: boolean; nota2: boolean; nota3: boolean;
}) {
  try {
    const { data } = await api.put(`/api/admin/permisos-edicion/${idPermiso}/resetear`, payload);
    return data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || "Error al resetear" };
  }
}

