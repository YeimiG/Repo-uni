"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { getPeriodos, crearPeriodo, editarPeriodo, activarPeriodo } from "@/services/academico.service";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Periodo {
  idperiodo: number; nombre: string; año: number; numeroperiodo: number;
  fechainicio: string; fechafin: string; fechainicioinscripciones: string | null;
  fechafininscripciones: string | null; estado: string; activo: boolean;
}

const FORM_EMPTY = {
  nombre: "", año: new Date().getFullYear(), numeroperiodo: 1,
  fechainicio: "", fechafin: "", fechainicioinscripciones: "", fechafininscripciones: "",
};

export default function PeriodosPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [periodos, setPeriodos]   = useState<Periodo[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando]   = useState<Periodo | null>(null);
  const [form, setForm]           = useState(FORM_EMPTY);
  const [saving, setSaving]       = useState(false);

  async function loadAll() {
    setLoading(true);
    const res = await getPeriodos();
    if (res.success) setPeriodos(res.periodos);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  function abrirCrear() { setEditando(null); setForm(FORM_EMPTY); setShowModal(true); }
  function abrirEditar(p: Periodo) {
    setEditando(p);
    setForm({
      nombre: p.nombre, año: p.año, numeroperiodo: p.numeroperiodo,
      fechainicio: p.fechainicio?.split("T")[0] || "",
      fechafin: p.fechafin?.split("T")[0] || "",
      fechainicioinscripciones: p.fechainicioinscripciones?.split("T")[0] || "",
      fechafininscripciones: p.fechafininscripciones?.split("T")[0] || "",
    });
    setShowModal(true);
  }

  async function handleGuardar() {
    if (!form.nombre || !form.fechainicio || !form.fechafin) {
      showToast("Nombre y fechas son obligatorios", "error"); return;
    }
    setSaving(true);
    const payload = {
      nombre: form.nombre, año: form.año, numeroperiodo: form.numeroperiodo,
      fechainicio: form.fechainicio, fechafin: form.fechafin,
      fechainicioinscripciones: form.fechainicioinscripciones || undefined,
      fechafininscripciones: form.fechafininscripciones || undefined,
    };
    const res = editando
      ? await editarPeriodo(editando.idperiodo, payload)
      : await crearPeriodo(payload);
    setSaving(false);
    if (res.success) {
      showToast(editando ? "Período actualizado" : "Período creado", "success");
      setShowModal(false); loadAll();
    } else {
      showToast(res.message || "Error al guardar", "error");
    }
  }

  async function handleActivar(p: Periodo) {
    if (p.activo) return;
    if (!confirm(`¿Activar el período "${p.nombre}"? Esto desactivará el período actual.`)) return;
    const res = await activarPeriodo(p.idperiodo);
    if (res.success) { showToast("Período activado", "success"); loadAll(); }
    else showToast(res.message || "Error", "error");
  }

  const estadoColor: Record<string, string> = {
    ACTIVO: "bg-green-100 text-green-700",
    PLANIFICADO: "bg-blue-100 text-blue-700",
    CERRADO: "bg-gray-100 text-gray-500",
    FINALIZADO: "bg-gray-100 text-gray-500",
  };

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
          <h1 className="text-2xl font-bold text-gray-800">📅 Períodos Académicos</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <button onClick={abrirCrear} className="btn-ieproes">+ Nuevo Período</button>
            </div>
            {periodos.find(p => p.activo) && (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                Período activo: <strong>{periodos.find(p => p.activo)?.nombre}</strong>
              </div>
            )}
          </div>

          <div className="card-ieproes">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando períodos...</div>
            ) : periodos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No hay períodos registrados</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Año</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">N°</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscripciones</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {periodos.map(p => (
                      <tr key={p.idperiodo} className={`hover:bg-gray-50 ${p.activo ? "bg-green-50" : ""}`}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {p.activo && <span className="mr-1">✅</span>}{p.nombre}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{p.año}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{p.numeroperiodo}</td>
                        <td className="px-4 py-3 text-gray-600">{p.fechainicio?.split("T")[0]}</td>
                        <td className="px-4 py-3 text-gray-600">{p.fechafin?.split("T")[0]}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {p.fechainicioinscripciones
                            ? `${p.fechainicioinscripciones?.split("T")[0]} → ${p.fechafininscripciones?.split("T")[0]}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${estadoColor[p.estado] || "bg-gray-100 text-gray-500"}`}>
                            {p.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center space-x-1">
                          <button onClick={() => abrirEditar(p)} className="btn-secondary text-xs px-2 py-1">✏️</button>
                          {!p.activo && (
                            <button onClick={() => handleActivar(p)} className="btn-ieproes text-xs px-2 py-1">
                              Activar
                            </button>
                          )}
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
              <h2 className="text-xl font-bold">{editando ? "✏️ Editar Período" : "➕ Nuevo Período"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" className="input-ieproes" placeholder="Ej: Ciclo I 2025"
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                  <input type="number" className="input-ieproes" value={form.año}
                    onChange={e => setForm({ ...form, año: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Período *</label>
                  <select className="input-ieproes" value={form.numeroperiodo}
                    onChange={e => setForm({ ...form, numeroperiodo: parseInt(e.target.value) })}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                  <input type="date" className="input-ieproes" value={form.fechainicio}
                    onChange={e => setForm({ ...form, fechainicio: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin *</label>
                  <input type="date" className="input-ieproes" value={form.fechafin}
                    onChange={e => setForm({ ...form, fechafin: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inicio Inscripciones</label>
                  <input type="date" className="input-ieproes" value={form.fechainicioinscripciones}
                    onChange={e => setForm({ ...form, fechainicioinscripciones: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin Inscripciones</label>
                  <input type="date" className="input-ieproes" value={form.fechafininscripciones}
                    onChange={e => setForm({ ...form, fechafininscripciones: e.target.value })} />
                </div>
              </div>
            </div>
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
