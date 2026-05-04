import api from "@/services/api";

// ── FACULTADES ─────────────────────────────────────────────
export const getFacultades  = async () => { try { const { data } = await api.get("/api/academica/facultades"); return data; } catch { return { success: false, facultades: [] }; } };
export const crearFacultad  = async (p: any) => { try { const { data } = await api.post("/api/academica/facultades", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const editarFacultad = async (id: number, p: any) => { try { const { data } = await api.put(`/api/academica/facultades/${id}`, p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };

// ── ESCUELAS ───────────────────────────────────────────────
export const getEscuelas  = async () => { try { const { data } = await api.get("/api/academica/escuelas"); return data; } catch { return { success: false, escuelas: [] }; } };
export const crearEscuela  = async (p: any) => { try { const { data } = await api.post("/api/academica/escuelas", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const editarEscuela = async (id: number, p: any) => { try { const { data } = await api.put(`/api/academica/escuelas/${id}`, p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };

// ── CARRERAS ───────────────────────────────────────────────
export const getCarrerasAcademica = async () => { try { const { data } = await api.get("/api/academica/carreras"); return data; } catch { return { success: false, carreras: [] }; } };
export const crearCarrera  = async (p: any) => { try { const { data } = await api.post("/api/academica/carreras", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const editarCarrera = async (id: number, p: any) => { try { const { data } = await api.put(`/api/academica/carreras/${id}`, p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };

// ── PLANES DE ESTUDIO ──────────────────────────────────────
export const getPlanes          = async () => { try { const { data } = await api.get("/api/academica/planes"); return data; } catch { return { success: false, planes: [] }; } };
export const crearPlan          = async (p: any) => { try { const { data } = await api.post("/api/academica/planes", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const editarPlan         = async (id: number, p: any) => { try { const { data } = await api.put(`/api/academica/planes/${id}`, p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const togglePlan         = async (id: number) => { try { const { data } = await api.patch(`/api/academica/planes/${id}/toggle`); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const getMateriasDelPlan = async (id: number) => { try { const { data } = await api.get(`/api/academica/planes/${id}/materias`); return data; } catch { return { success: false, materias: [] }; } };
export const agregarMateriaAlPlan = async (id: number, p: any) => { try { const { data } = await api.post(`/api/academica/planes/${id}/materias`, p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const quitarMateriaDelPlan = async (idplanmateria: number) => { try { const { data } = await api.delete(`/api/academica/planes/materias/${idplanmateria}`); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };

// ── ROLES Y ESTADOS ────────────────────────────────────────
export const getRolesAcademica         = async () => { try { const { data } = await api.get("/api/academica/roles"); return data; } catch { return { success: false, roles: [] }; } };
export const crearRol                  = async (p: any) => { try { const { data } = await api.post("/api/academica/roles", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };
export const getEstadosAcademica       = async () => { try { const { data } = await api.get("/api/academica/estados-estudiante"); return data; } catch { return { success: false, estados: [] }; } };
export const crearEstadoEstudiante     = async (p: any) => { try { const { data } = await api.post("/api/academica/estados-estudiante", p); return data; } catch (e: any) { return { success: false, message: e.response?.data?.message || "Error" }; } };

// ── SEED STATUS ────────────────────────────────────────────
export const getSeedStatus = async () => { try { const { data } = await api.get("/api/academica/seed-status"); return data; } catch { return { success: false, conteos: null }; } };
