"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import {
  getEstudiantes, crearEstudiante, editarEstudiante,
  toggleEstudiante, getCarreras, getEstadosEstudiante
} from "@/services/estudiantes.service";
import { exportToCSV } from "@/utils/export";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Estudiante {
  idestudiante: number; expediente: string; primernombre: string;
  primerapellido: string; correo: string; carrera: string; estado: string; activo: boolean;
}
interface Carrera { idcarrera: number; nombre: string; }
interface Estado  { idestado: number; nombre: string; }

const FORM_EMPTY = {
  primernombre: "", primerapellido: "", correo: "", clave: "",
  expediente: "", idcarrera: 0, fechaingreso: "",
};

export default function EstudiantesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [carreras, setCarreras]       = useState<Carrera[]>([]);
  const [estados, setEstados]         = useState<Estado[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editando, setEditando]       = useState<Estudiante | null>(null);
  const [form, setForm]               = useState(FORM_EMPTY);
  const [saving, setSaving]           = useState(false);
  const [editForm, setEditForm]       = useState({ primernombre: "", primerapellido: "", correo: "", idcarrera: 0, idestado: 0 });

  async function loadAll() {
    setLoading(true);
    const [e, c, es] = await Promise.all([getEstudiantes(), getCarreras(), getEstadosEstudiante()]);
    if (e.success)  setEstudiantes(e.estudiantes);
    if (c.success)  setCarreras(c.carreras);
    if (es.success) setEstados(es.estados);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = estudiantes.filter(e =>
    `${e.primernombre} ${e.primerapellido}`.toLowerCase().includes(search.toLowerCase()) ||
    e.expediente.toLowerCase().includes(search.toLowerCase()) ||
    (e.correo || "").toLowerCase().includes(search.toLowerCase())
  );

  function abrirCrear() { setEditando(null); setForm(FORM_EMPTY); setShowModal(true); }
  function abrirEditar(e: Estudiante) {
    setEditando(e);
    setEditForm({ primernombre: e.primernombre, primerapellido: e.primerapellido, correo: e.correo, idcarrera: 0, idestado: 0 });
    setShowModal(true);
  }

  async function handleGuardar() {
    setSaving(true);
    let res;
    if (editando) {
      res = await editarEstudiante(editando.idestudiante, editForm);
    } else {
      if (!form.primernombre || !form.primerapellido || !form.correo || !form.clave || !form.expediente || !form.idcarrera) {
        showToast("Todos los campos son obligatorios", "error"); setSaving(false); return;
      }
      res = await crearEstudiante(form);
    }
    setSaving(false);
    if (res.success) {
      showToast(editando ? "Estudiante actualizado" : "Estudiante creado", "success");
      setShowModal(false); loadAll();
    } else {
      showToast(res.message || "Error al guardar", "error");
    }
  }

  async function handleToggle(e: Estudiante) {
    if (!confirm(`¿${e.activo ? "Desactivar" : "Activar"} a ${e.primernombre} ${e.primerapellido}?`)) return;
    const res = await toggleEstudiante(e.idestudiante);
    if (res.success) { showToast(res.message, "success"); loadAll(); }
    else showToast("Error al cambiar estado", "error");
  }

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS)) {
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
          <h1 className="text-2xl font-bold text-gray-800">🎓 Gestión de Estudiantes</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{loading ? "..." : estudiantes.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Estudiantes</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{loading ? "..." : estudiantes.filter(e => e.activo).length}</div>
              <div className="text-xs text-gray-500 mt-1">Activos</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{loading ? "..." : estudiantes.filter(e => !e.activo).length}</div>
              <div className="text-xs text-gray-500 mt-1">Inactivos</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{loading ? "..." : carreras.length}</div>
              <div className="text-xs text-gray-500 mt-1">Carreras</div>
            </div>
          </div>

          {/* acciones */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button onClick={abrirCrear} className="btn-ieproes">+ Nuevo Estudiante</button>
              <button onClick={() => { if (filtered.length === 0) return; exportToCSV(filtered, "estudiantes"); showToast("Exportado", "success"); }} className="btn-outline">📤 CSV</button>
            </div>
            <input type="search" placeholder="Buscar por nombre, expediente o correo..."
              className="input-ieproes max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* tabla */}
          <div className="card-ieproes">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando estudiantes...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expediente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">No se encontraron estudiantes</td></tr>
                    ) : filtered.map(e => (
                      <tr key={e.idestudiante} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-700">{e.expediente}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{e.primernombre} {e.primerapellido}</td>
                        <td className="px-4 py-3 text-gray-500">{e.correo || "—"}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{e.carrera}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`badge-${e.activo ? "success" : "error"}`}>
                            {e.estado || (e.activo ? "Activo" : "Inactivo")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center space-x-1">
                          <button onClick={() => abrirEditar(e)} className="btn-secondary text-xs px-2 py-1">✏️ Editar</button>
                          <button onClick={() => handleToggle(e)} className={`text-xs px-2 py-1 rounded ${e.activo ? "btn-outline" : "btn-ieproes"}`}>
                            {e.activo ? "🚫" : "✅"}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editando ? "✏️ Editar Estudiante" : "➕ Nuevo Estudiante"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>

            {editando ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                    <input type="text" className="input-ieproes" value={editForm.primernombre}
                      onChange={e => setEditForm({ ...editForm, primernombre: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
                    <input type="text" className="input-ieproes" value={editForm.primerapellido}
                      onChange={e => setEditForm({ ...editForm, primerapellido: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input type="email" className="input-ieproes" value={editForm.correo}
                    onChange={e => setEditForm({ ...editForm, correo: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                    <select className="input-ieproes" value={editForm.idcarrera}
                      onChange={e => setEditForm({ ...editForm, idcarrera: parseInt(e.target.value) })}>
                      <option value={0}>Sin cambiar</option>
                      {carreras.map(c => <option key={c.idcarrera} value={c.idcarrera}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select className="input-ieproes" value={editForm.idestado}
                      onChange={e => setEditForm({ ...editForm, idestado: parseInt(e.target.value) })}>
                      <option value={0}>Sin cambiar</option>
                      {estados.map(es => <option key={es.idestado} value={es.idestado}>{es.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                    <input type="text" className="input-ieproes" value={form.primernombre}
                      onChange={e => setForm({ ...form, primernombre: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                    <input type="text" className="input-ieproes" value={form.primerapellido}
                      onChange={e => setForm({ ...form, primerapellido: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expediente *</label>
                  <input type="text" className="input-ieproes" placeholder="Ej: 2025001" value={form.expediente}
                    onChange={e => setForm({ ...form, expediente: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input type="email" className="input-ieproes" value={form.correo}
                    onChange={e => setForm({ ...form, correo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                  <input type="password" className="input-ieproes" value={form.clave}
                    onChange={e => setForm({ ...form, clave: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrera *</label>
                    <select className="input-ieproes" value={form.idcarrera}
                      onChange={e => setForm({ ...form, idcarrera: parseInt(e.target.value) })}>
                      <option value={0}>Seleccionar...</option>
                      {carreras.map(c => <option key={c.idcarrera} value={c.idcarrera}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Ingreso</label>
                    <input type="date" className="input-ieproes" value={form.fechaingreso}
                      onChange={e => setForm({ ...form, fechaingreso: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={handleGuardar} disabled={saving} className="btn-ieproes flex-1">
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
