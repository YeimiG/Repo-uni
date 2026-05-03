import api from "@/services/api";

// ── INSCRIPCIONES ──────────────────────────────────────────
export async function getInscripciones(params?: { idgrupo?: number; idperiodo?: number }) {
  try {
    const { data } = await api.get(`/api/inscripciones`, { params });
    return data;
  } catch { return { success: false, inscripciones: [] }; }
}

export async function inscribir(payload: { idestudiante: number; idgrupo: number }) {
  try {
    const { data } = await api.post(`/api/inscripciones`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al inscribir" };
  }
}

export async function retirarInscripcion(idinscripcion: number, motivoRetiro?: string) {
  try {
    const { data } = await api.patch(`/api/inscripciones/${idinscripcion}/retirar`, { motivoRetiro });
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al retirar" };
  }
}

export async function getGruposParaInscribir() {
  try {
    const { data } = await api.get(`/api/inscripciones/grupos`);
    return data;
  } catch { return { success: false, grupos: [] }; }
}

// ── PERÍODOS ───────────────────────────────────────────────
export async function getPeriodos() {
  try {
    const { data } = await api.get(`/api/periodos`);
    return data;
  } catch { return { success: false, periodos: [] }; }
}

export async function crearPeriodo(payload: {
  nombre: string; año: number; numeroperiodo: number;
  fechainicio: string; fechafin: string;
  fechainicioinscripciones?: string; fechafininscripciones?: string;
}) {
  try {
    const { data } = await api.post(`/api/periodos`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al crear período" };
  }
}

export async function editarPeriodo(id: number, payload: {
  nombre?: string; fechainicio?: string; fechafin?: string;
  fechainicioinscripciones?: string; fechafininscripciones?: string; estado?: string;
}) {
  try {
    const { data } = await api.put(`/api/periodos/${id}`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al editar período" };
  }
}

export async function activarPeriodo(id: number) {
  try {
    const { data } = await api.patch(`/api/periodos/${id}/activar`);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al activar período" };
  }
}

