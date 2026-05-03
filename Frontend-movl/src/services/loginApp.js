import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const loginEstudiante = async (correo, clave) => {
  try {
    const response = await API.post("/login", { correo, clave });
    const data = response.data;

    if (data.success && data.token) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));
    }

    return data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Error de conexión" };
  }
};

export const logoutEstudiante = async () => {
  try {
    await API.post("/logout");
  } catch {}
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("usuario");
};
