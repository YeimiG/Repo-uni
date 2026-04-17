import axios from 'axios';

const API = axios.create({
  // 1. Abre CMD en tu PC, escribe 'ipconfig' y busca "Dirección IPv4"
  // 2. NO USES LOCALHOST. Usa algo como: http://192.168.1.XX:3000/api/app
  baseURL: ' https://lark-passion-enroll.ngrok-free.dev/api/app',
  timeout: 10000,
});

export default API;