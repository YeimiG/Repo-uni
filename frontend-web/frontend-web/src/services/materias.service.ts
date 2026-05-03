import api from "@/services/api";

export async function getMaterias(idUsuario: number, rol: string) {
  try {
    const { data } = await api.get(`/api/grupos`, {
      params: { idUsuario, rol },
    });
    return data;
  } catch (error) {
    console.error("Error obteniendo materias:", error);
    return { success: false, materias: [] };
  }
}

export async function getEstudiantesPorGrupo(idgrupo: number) {
  try {
    const { data } = await api.get(`/api/grupos/${idgrupo}/estudiantes`);
    return data;
  } catch (error) {
    console.error("Error obteniendo estudiantes:", error);
    return { success: false, estudiantes: [] };
  }
}

export async function guardarNotas(notasData: any) {
  try {
    const { data } = await api.post(`/api/grupos/notas`, notasData);
    return data;
  } catch (error) {
    console.error("Error guardando notas:", error);
    return { success: false, message: "Error al guardar notas" };
  }
}

