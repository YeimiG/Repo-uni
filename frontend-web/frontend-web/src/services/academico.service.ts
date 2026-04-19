import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ── INSCRIPCIONES ──────────────────────────────────────────
export async function getInscripciones(params?: { idgrupo?: number; idperiodo?: number }) {
  try {
    const { data } = await axios.get(`${API_URL}/api/inscripciones`, { params });
    return data;
  } catch { return { success: false, inscripciones: [] }; }
}

export async function inscribir(payload: { idestudiante: number; idgrupo: number }) {
  try {
    const { data } = await axios.post(`${API_URL}/api/inscripciones`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al inscribir" };
  }
}

export async function retirarInscripcion(idinscripcion: number, motivoRetiro?: string) {
  try {
    const { data } = await axios.patch(`${API_URL}/api/inscripciones/${idinscripcion}/retirar`, { motivoRetiro });
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al retirar" };
  }
}

export async function getGruposParaInscribir() {
  try {
    const { data } = await axios.get(`${API_URL}/api/inscripciones/grupos`);
    return data;
  } catch { return { success: false, grupos: [] }; }
}

// ── PERÍODOS ───────────────────────────────────────────────
export async function getPeriodos() {
  try {
    const { data } = await axios.get(`${API_URL}/api/periodos`);
    return data;
  } catch { return { success: false, periodos: [] }; }
}

export async function crearPeriodo(payload: {
  nombre: string; año: number; numeroperiodo: number;
  fechainicio: string; fechafin: string;
  fechainicioinscripciones?: string; fechafininscripciones?: string;
}) {
  try {
    const { data } = await axios.post(`${API_URL}/api/periodos`, payload);
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
    const { data } = await axios.put(`${API_URL}/api/periodos/${id}`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al editar período" };
  }
}

export async function activarPeriodo(id: number) {
  try {
    const { data } = await axios.patch(`${API_URL}/api/periodos/${id}/activar`);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al activar período" };
  }
}
