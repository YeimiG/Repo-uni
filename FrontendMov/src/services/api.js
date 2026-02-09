import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.213:3000/api', // Reemplaza XX con tu IP
  timeout: 5000,
});

export default API;