import api from "@/services/api";

export async function getUsuarios() {
  try {
    const { data } = await api.get(`/api/admin/usuarios`);
    return data;
  } catch (error) {
    return { success: false, usuarios: [] };
  }
}

export async function getRoles() {
  try {
    const { data } = await api.get(`/api/admin/roles`);
    return data;
  } catch (error) {
    return { success: false, roles: [] };
  }
}

export async function crearUsuario(payload: {
  correo: string;
  clave: string;
  idrol: number;
}) {
  try {
    const { data } = await api.post(`/api/admin/usuarios`, payload);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear usuario",
    };
  }
}

export async function editarUsuario(
  idusuario: number,
  payload: {
    correo?: string;
    clave?: string;
    idrol?: number;
  },
) {
  try {
    const { data } = await api.put(`/api/admin/usuarios/${idusuario}`, payload);

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al editar usuario",
    };
  }
}

export async function toggleUsuario(idusuario: number) {
  try {
    const { data } = await api.patch(`/api/admin/usuarios/${idusuario}/toggle`);
    return data;
  } catch (error: any) {
    return { success: false, message: "Error al cambiar estado" };
  }
}

export async function getDocentes() {
  try {
    const { data } = await api.get(`/api/admin/docentes`);
    return data;
  } catch (error) {
    return { success: false, docentes: [] };
  }
}

export async function asignarDocente(idgrupo: number, iddocente: number) {
  try {
    const { data } = await api.put(
      `/api/admin/grupos/${idgrupo}/asignar-docente`,
      { iddocente },
    );
    return data;
  } catch (error) {
    return { success: false, message: "Error al asignar docente" };
  }
}

export async function moverEstudiante(
  idinscripcion: number,
  idgrupo_destino: number,
) {
  try {
    const { data } = await api.put(
      `/api/admin/inscripciones/${idinscripcion}/mover`,
      { idgrupo_destino },
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al mover estudiante",
    };
  }
}

export async function getGruposDisponibles(idmateria: number) {
  try {
    const { data } = await api.get(
      `/api/admin/materias/${idmateria}/grupos-disponibles`,
    );
    return data;
  } catch (error) {
    return { success: false, grupos: [] };
  }
}
