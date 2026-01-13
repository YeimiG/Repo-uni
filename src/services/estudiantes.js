import API from './api';

export const getEstudiantes = async () => {
  const response = await API.get('/estudiantes');
  return response.data;
};

export const getEstudianteById = async (id) => {
  const response = await API.get(`/estudiantes/${id}`);
  return response.data;
};