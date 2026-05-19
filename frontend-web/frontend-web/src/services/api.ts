import axios from "axios";

const api = axios.create({
  baseURL: typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") : "",
  timeout: 10000,
});

// Agrega el token JWT en cada petición automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // El token puede estar guardado directo o dentro del objeto user
    const jwt = token || (user ? JSON.parse(user)?.token : null);
    if (jwt) config.headers["Authorization"] = `Bearer ${jwt}`;
  }
  return config;
});

// Si el token expira, redirige al login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
