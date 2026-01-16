import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

export const login = async (correo, clave) => {
  const response = await API.post('/auth/login', { correo, clave });
  return response.data;
};

export const getMateriasCatedratico = async (idCatedratico) => {
  const response = await API.get(`/catedratico/materias/${idCatedratico}`);
  return response.data;
};

export const getEstudiantesGrupo = async (idGrupo) => {
  const response = await API.get(`/catedratico/estudiantes/${idGrupo}`);
  return response.data;
};

export const ingresarNotas = async (data) => {
  const response = await API.post('/catedratico/notas', data);
  return response.data;
};

export const getUsuarios = async () => {
  const response = await API.get('/admin/usuarios');
  return response.data;
};

export const crearUsuario = async (data) => {
  const response = await API.post('/admin/usuarios', data);
  return response.data;
};

export const crearEstudiante = async (data) => {
  const response = await API.post('/admin/estudiantes', data);
  return response.data;
};

export const crearCatedratico = async (data) => {
  const response = await API.post('/admin/catedraticos', data);
  return response.data;
};

export const crearMateria = async (data) => {
  const response = await API.post('/admin/materias', data);
  return response.data;
};

export default API;
