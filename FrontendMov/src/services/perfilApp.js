import API from './api';

export const obtenerDatosPerfil = async (idUsuario) => {
  try {
    // Llamamos a tu ruta independiente
    const response = await API.get(`/app-mobile/perfil/${idUsuario}`);
    return response.data; // Retorna { success: true, perfil: {...} }
  } catch (error) {
    throw error.response ? error.response.data : { message: "Error al obtener perfil" };
  }
};