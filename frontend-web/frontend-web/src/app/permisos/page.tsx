"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import {
  getPeriodosNotas, actualizarPeriodo,
  getPermisosEdicion, habilitarPermiso, resetearEdicion,
} from "@/services/permisos.service";
import { getDocentes } from "@/services/admin.service";
import { getMaterias } from "@/services/materias.service";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Periodo {
  idperiodo: number; nombreperiodo: string;
  fechainicio: string; fechafin: string; activo: boolean;
}
interface Permiso {
  idpermiso: number; idcatedratico: number; idmateria: number; idgrupo: number;
  puedeeditarnota1: boolean; puedeeditarnota2: boolean; puedeeditarnota3: boolean;
  editadonota1: boolean; editadonota2: boolean; editadonota3: boolean;
  nombrecatedratico: string; nombremateria: string; codigomateria: string; numerogrupo: number;
}
interface Docente { iddocente: number; nombre: string; }
interface Materia { idgrupo: number; idmateria: number; nombre: string; codigomateria: string; }

export default function PermisosPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);

  // form nuevo permiso
  const [form, setForm] = useState({
    idCatedratico: 0, idMateria: 0, idGrupo: 0,
    nota1: false, nota2: false, nota3: false,
  });
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [p, pe, d, m] = await Promise.all([
      getPeriodosNotas(),
      getPermisosEdicion(),
      getDocentes(),
      getMaterias(user?.idUsuario ?? 0, "SUPER_ADMIN"),
    ]);
    if (p.success)  setPeriodos(p.periodos);
    if (pe.success) setPermisos(pe.permisos);
    if (d.success)  setDocentes(d.docentes);
    if (m.success)  setMaterias(m.materias);
    setLoading(false);
  }

  useEffect(() => { if (user?.idUsuario) loadAll(); }, [user]);

  // grupos filtrados según materia seleccionada
  const gruposFiltrados = materias.filter(m => m.idmateria === form.idMateria);

  async function handleTogglePeriodo(p: Periodo) {
    const res = await actualizarPeriodo(p.idperiodo, {
      fechaInicio: p.fechainicio,
      fechaFin: p.fechafin,
      activo: !p.activo,
    });
    if (res.success) { showToast("Período actualizado", "success"); loadAll(); }
    else showToast(res.message || "Error", "error");
  }

  async function handleHabilitar() {
    if (!form.idCatedratico || !form.idMateria || !form.idGrupo) {
      showToast("Selecciona catedrático, materia y grupo", "error"); return;
    }
    setSaving(true);
    const res = await habilitarPermiso({ ...form, idAdmin: user?.idUsuario ?? 0 });
    setSaving(false);
    if (res.success) { showToast("Permiso habilitado", "success"); loadAll(); }
    else showToast(res.message || "Error", "error");
  }

  async function handleResetear(p: Permiso) {
    const res = await resetearEdicion(p.idpermiso, { nota1: true, nota2: true, nota3: true });
    if (res.success) { showToast("Edición reseteada", "success"); loadAll(); }
    else showToast(res.message || "Error", "error");
  }

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasPermission(user?.rol, PERMISSIONS.SYSTEM_CONFIG)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <Link href="/dashboard" className="btn-ieproes">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🔐 Permisos de Notas</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8 space-y-8">

          {/* PERÍODOS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📅 Períodos de Ingreso de Notas</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Cargando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {periodos.map(p => (
                      <tr key={p.idperiodo} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{p.nombreperiodo}</td>
                        <td className="px-4 py-3 text-gray-600">{p.fechainicio?.split("T")[0]}</td>
                        <td className="px-4 py-3 text-gray-600">{p.fechafin?.split("T")[0]}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleTogglePeriodo(p)}
                            className={`text-xs px-3 py-1 rounded ${p.activo ? "btn-outline" : "btn-ieproes"}`}
                          >
                            {p.activo ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* HABILITAR PERMISO */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">➕ Habilitar Permiso de Edición</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catedrático</label>
                <select className="input-ieproes" value={form.idCatedratico}
                  onChange={e => setForm({ ...form, idCatedratico: parseInt(e.target.value), idMateria: 0, idGrupo: 0 })}>
                  <option value={0}>Seleccionar...</option>
                  {docentes.map(d => <option key={d.iddocente} value={d.iddocente}>{d.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                <select className="input-ieproes" value={form.idMateria}
                  onChange={e => setForm({ ...form, idMateria: parseInt(e.target.value), idGrupo: 0 })}>
                  <option value={0}>Seleccionar...</option>
                  {[...new Map(materias.map(m => [m.idmateria, m])).values()].map(m => (
                    <option key={m.idmateria} value={m.idmateria}>{m.codigomateria} - {m.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                <select className="input-ieproes" value={form.idGrupo}
                  onChange={e => setForm({ ...form, idGrupo: parseInt(e.target.value) })}>
                  <option value={0}>Seleccionar...</option>
                  {gruposFiltrados.map(g => (
                    <option key={g.idgrupo} value={g.idgrupo}>Grupo {g.idgrupo}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-6 mb-4">
              {(["nota1", "nota2", "nota3"] as const).map((n, i) => (
                <label key={n} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-blue-500"
                    checked={form[n]}
                    onChange={e => setForm({ ...form, [n]: e.target.checked })} />
                  Parcial {i + 1}
                </label>
              ))}
            </div>
            <button onClick={handleHabilitar} disabled={saving} className="btn-ieproes">
              {saving ? "Guardando..." : "Habilitar Permiso"}
            </button>
          </div>

          {/* PERMISOS ACTIVOS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📋 Permisos Activos</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Cargando...</div>
            ) : permisos.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No hay permisos configurados</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catedrático</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P1</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P2</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P3</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Resetear</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {permisos.map(p => (
                      <tr key={p.idpermiso} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{p.nombrecatedratico}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-1">{p.codigomateria}</span>
                          {p.nombremateria}
                        </td>
                        {(["puedeeditarnota1","puedeeditarnota2","puedeeditarnota3"] as const).map((k, i) => {
                          const editado = [p.editadonota1, p.editadonota2, p.editadonota3][i];
                          return (
                            <td key={k} className="px-4 py-3 text-center">
                              {p[k] ? (
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${editado ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}>
                                  {editado ? "Editado" : "Habilitado"}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleResetear(p)} className="btn-secondary text-xs px-3 py-1">
                            🔄 Resetear
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
