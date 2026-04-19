import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getEstudiantes() {
  try {
    const { data } = await axios.get(`${API_URL}/api/estudiantes`);
    return data;
  } catch { return { success: false, estudiantes: [] }; }
}

export async function crearEstudiante(payload: {
  primernombre: string; primerapellido: string; correo: string;
  clave: string; expediente: string; idcarrera: number; fechaingreso?: string;
}) {
  try {
    const { data } = await axios.post(`${API_URL}/api/estudiantes`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al crear estudiante" };
  }
}

export async function editarEstudiante(id: number, payload: {
  primernombre?: string; primerapellido?: string; correo?: string;
  idcarrera?: number; idestado?: number;
}) {
  try {
    const { data } = await axios.put(`${API_URL}/api/estudiantes/${id}`, payload);
    return data;
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message || "Error al editar" };
  }
}

export async function toggleEstudiante(id: number) {
  try {
    const { data } = await axios.patch(`${API_URL}/api/estudiantes/${id}/toggle`);
    return data;
  } catch { return { success: false, message: "Error al cambiar estado" }; }
}

export async function getCarreras() {
  try {
    const { data } = await axios.get(`${API_URL}/api/estudiantes/carreras`);
    return data;
  } catch { return { success: false, carreras: [] }; }
}

export async function getEstadosEstudiante() {
  try {
    const { data } = await axios.get(`${API_URL}/api/estudiantes/estados`);
    return data;
  } catch { return { success: false, estados: [] }; }
}
