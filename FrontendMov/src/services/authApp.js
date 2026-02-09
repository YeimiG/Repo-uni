import API from './api';

/**
 * Servicio exclusivo para la App Móvil
 * Apunta a la ruta independiente /api/app-mobile
 */
export const loginEstudiante = async (correo, clave) => {
  try {
    // Usamos la ruta que creamos para la App
    const response = await API.post('/app-mobile/login', { correo, clave });
    return response.data; 
  } catch (error) {
    // Capturamos el error para mostrarlo en la pantalla de la App
    throw error.response ? error.response.data : { message: "Error de conexión con el servidor" };
  }
};