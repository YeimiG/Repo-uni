import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = axios.create({
  baseURL: " https://lark-passion-enroll.ngrok-free.dev/api/app",

  timeout: 10000,
});

// Agrega el token en cada petición automáticamente
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  } catch {}
  return config;
});

export default API;
