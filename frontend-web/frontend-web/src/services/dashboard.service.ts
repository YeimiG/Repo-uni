import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getDashboardStats() {
  try {
    const { data } = await axios.get(`${API_URL}/api/dashboard/stats`);
    return data;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return {
      success: false,
      stats: {
        estudiantes: 0,
        catedraticos: 0,
        materias: 0,
        notas: 0,
      },
    };
  }
}

export async function getDashboardActividad() {
  try {
    const { data } = await axios.get(`${API_URL}/api/dashboard/actividad`);
    return data;
  } catch (error) {
    console.error("Error obteniendo actividad:", error);
    return {
      success: false,
      actividades: [],
    };
  }
}
