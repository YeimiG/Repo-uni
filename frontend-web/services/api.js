import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.213:3000/api',
  timeout: 5000,
});

export const login = async (correo, clave) => {
  const response = await API.post('/auth/login', { correo, clave });
  return response.data;
};

export const getMateriasCatedratico = async (idCatedratico) => {
  try {
    const response = await API.get(`/catedratico/materias/${idCatedratico}`);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible, usando datos de prueba');
    return [
      { idmateria: 1, codigomateria: 'MAT101', nombremateria: 'Matemática I', idgrupo: 1, numerogrupo: '01' },
      { idmateria: 2, codigomateria: 'ING101', nombremateria: 'Inglés I', idgrupo: 2, numerogrupo: '02' }
    ];
  }
};

export const getEstudiantesGrupo = async (idGrupo) => {
  try {
    const response = await API.get(`/catedratico/estudiantes/${idGrupo}`);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible, usando datos de prueba');
    return [
      { idestudiante: 1, expediente: 'E001', nombre: 'Juan', apellidos: 'Pérez', nota1: 8.5, nota2: 7.0, nota3: 9.0, notafinal: 8.17, idinscripcion: 1 },
      { idestudiante: 2, expediente: 'E002', nombre: 'María', apellidos: 'García', nota1: null, nota2: null, nota3: null, notafinal: null, idinscripcion: 2 }
    ];
  }
};

export const ingresarNotas = async (data) => {
  try {
    const response = await API.post('/catedratico/notas', data);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible');
    const notaFinal = ((data.nota1 + data.nota2 + data.nota3) / 3).toFixed(2);
    return { ...data, notafinal: notaFinal };
  }
};

export const getUsuarios = async () => {
  try {
    const response = await API.get('/admin/usuarios');
    return response.data;
  } catch (error) {
    console.log('Backend no disponible, usando datos de prueba');
    return [
      { idusuario: 1, correo: 'admin@ieproes.edu.sv', nombrerol: 'Administrador' },
      { idusuario: 2, correo: 'cate@ieproes.edu.sv', nombrerol: 'Catedrático' },
      { idusuario: 3, correo: 'est@ieproes.edu.sv', nombrerol: 'Estudiante' }
    ];
  }
};

export const crearUsuario = async (data) => {
  try {
    const response = await API.post('/admin/usuarios', data);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible');
    return { idusuario: Math.random(), ...data };
  }
};

export const crearEstudiante = async (data) => {
  try {
    const response = await API.post('/admin/estudiantes', data);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible');
    return { idestudiante: Math.random(), ...data };
  }
};

export const crearCatedratico = async (data) => {
  try {
    const response = await API.post('/admin/catedraticos', data);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible');
    return { idcatedratico: Math.random(), ...data };
  }
};

export const crearMateria = async (data) => {
  try {
    const response = await API.post('/admin/materias', data);
    return response.data;
  } catch (error) {
    console.log('Backend no disponible');
    return { idmateria: Math.random(), ...data };
  }
};

export default API;
