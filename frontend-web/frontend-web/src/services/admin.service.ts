import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getUsuarios() {
  try {
    const { data } = await axios.get(`${API_URL}/api/admin/usuarios`);
    return data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return { success: false, usuarios: [] };
  }
}

export async function getDocentes() {
  try {
    const { data } = await axios.get(`${API_URL}/api/admin/docentes`);
    return data;
  } catch (error) {
    console.error("Error obteniendo docentes:", error);
    return { success: false, docentes: [] };
  }
}

export async function asignarDocente(idgrupo: number, iddocente: number) {
  try {
    const { data } = await axios.put(`${API_URL}/api/admin/grupos/${idgrupo}/asignar-docente`, {
      iddocente,
    });
    return data;
  } catch (error) {
    console.error("Error asignando docente:", error);
    return { success: false, message: "Error al asignar docente" };
  }
}

export async function moverEstudiante(idinscripcion: number, idgrupo_destino: number) {
  try {
    const { data } = await axios.put(`${API_URL}/api/admin/inscripciones/${idinscripcion}/mover`, {
      idgrupo_destino,
    });
    return data;
  } catch (error: any) {
    console.error("Error moviendo estudiante:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error al mover estudiante" 
    };
  }
}

export async function getGruposDisponibles(idmateria: number) {
  try {
    const { data } = await axios.get(`${API_URL}/api/admin/materias/${idmateria}/grupos-disponibles`);
    return data;
  } catch (error) {
    console.error("Error obteniendo grupos disponibles:", error);
    return { success: false, grupos: [] };
  }
}
