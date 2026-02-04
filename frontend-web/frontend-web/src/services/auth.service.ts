/* auth service */
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function login(email: string, password: string) {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  localStorage.setItem("token", data.token);
}

export async function register(email: string, password: string) {
  await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
}

export function logout() {
  localStorage.removeItem("token");
}
