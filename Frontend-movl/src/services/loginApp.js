import API from './api-movil';

export const loginEstudiante = async (correo, clave) => {
  try {
    // Como el baseURL ya tiene /api/app, aquí solo pedimos /login
    const response = await API.post('/login', { correo, clave });
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "Error de conexión" };
  }
};