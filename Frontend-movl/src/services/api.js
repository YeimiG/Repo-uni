import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://192.168.1.11:3000/api/app",
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
