import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getMaterias(idUsuario: number, rol: string) {
  try {
    const { data } = await axios.get(`${API_URL}/api/grupos`, {
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
    const { data } = await axios.get(`${API_URL}/api/grupos/${idgrupo}/estudiantes`);
    return data;
  } catch (error) {
    console.error("Error obteniendo estudiantes:", error);
    return { success: false, estudiantes: [] };
  }
}

export async function guardarNotas(notasData: any) {
  try {
    const { data } = await axios.post(`${API_URL}/api/grupos/notas`, notasData);
    return data;
  } catch (error) {
    console.error("Error guardando notas:", error);
    return { success: false, message: "Error al guardar notas" };
  }
}
