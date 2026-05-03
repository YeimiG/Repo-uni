import api from "@/services/api";

export async function getDashboardStats() {
  try {
    const { data } = await api.get(`/api/dashboard/stats`);
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
    const { data } = await api.get(`/api/dashboard/actividad`);
    return data;
  } catch (error) {
    console.error("Error obteniendo actividad:", error);
    return {
      success: false,
      actividades: [],
    };
  }
}

