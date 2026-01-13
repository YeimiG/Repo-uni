import API from './api';

export const login = async (correo, clave) => {
  try {
    // Enviamos correo y clave al endpoint de auth
    const response = await API.post('/auth/login', { correo, clave });
    return response.data;
  } catch (error) {
    // Si el backend devuelve un error (ej: 401), lo capturamos aquí
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};