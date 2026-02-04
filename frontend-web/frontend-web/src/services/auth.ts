import api from "./api";

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};
