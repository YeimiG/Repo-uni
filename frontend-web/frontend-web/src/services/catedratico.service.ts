import api from "@/services/api";

export async function getMateriasCatedratico(idCatedratico: number) {
  try {
    const { data } = await api.get(`/api/catedratico/materias/${idCatedratico}`);
    return { success: true, materias: data };
  } catch { return { success: false, materias: [] }; }
}

export async function getEstudiantesGrupoCatedratico(idGrupo: number) {
  try {
    const { data } = await api.get(`/api/catedratico/estudiantes/${idGrupo}`);
    return { success: true, estudiantes: data };
  } catch { return { success: false, estudiantes: [] }; }
}

export async function getPermisosCatedratico(idCatedratico: number, idGrupo: number) {
  try {
    const { data } = await api.get(`/api/catedratico/permisos/${idCatedratico}/${idGrupo}`);
    return { success: true, permisos: data };
  } catch { return { success: false, permisos: null }; }
}

export async function ingresarNotasCatedratico(payload: {
  idInscripcion: number;
  nota1?: number | null;
  nota2?: number | null;
  nota3?: number | null;
  idCatedratico: number;
  idGrupo: number;
  esAdmin: boolean;
}) {
  try {
    const { data } = await api.post(`/api/catedratico/notas`, payload);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, message: e.response?.data?.error || "Error al guardar notas" };
  }
}
