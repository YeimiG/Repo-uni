import api from "@/services/api";

export async function getRendimiento() {
  try {
    const { data } = await api.get(`/api/reportes/rendimiento`);
    return data;
  } catch { return { success: false, data: [] }; }
}

export async function getEstadisticas() {
  try {
    const { data } = await api.get(`/api/reportes/estadisticas`);
    return data;
  } catch { return { success: false, data: null }; }
}

export async function getHistorialEstudiante(id: number) {
  try {
    const { data } = await api.get(`/api/reportes/estudiante/${id}`);
    return data;
  } catch { return { success: false, data: [] }; }
}

export async function crearMateria(payload: {
  codigo: string; nombre: string; descripcion?: string;
  unidadesvalorativas: number; horasteorias?: number;
  horaspracticas?: number; tipo?: string;
}) {
  try {
    const { data } = await api.post(`/api/materias`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al crear materia" };
  }
}

export async function editarMateria(id: number, payload: {
  nombre?: string; descripcion?: string; unidadesvalorativas?: number;
  horasteorias?: number; horaspracticas?: number; tipo?: string;
}) {
  try {
    const { data } = await api.put(`/api/materias/${id}`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al editar materia" };
  }
}

export async function crearGrupo(payload: {
  idmateria: number; idperiodo: number; iddocente?: number;
  numerogrupo: number; cupomaximo: number;
}) {
  try {
    const { data } = await api.post(`/api/materias/grupos`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al crear grupo" };
  }
}

export async function getMateriasList() {
  try {
    const { data } = await api.get(`/api/materias`);
    return { success: true, materias: data };
  } catch { return { success: false, materias: [] }; }
}
