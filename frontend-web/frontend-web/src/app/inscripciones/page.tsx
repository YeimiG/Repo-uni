"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { getInscripciones, inscribir, retirarInscripcion, getGruposParaInscribir } from "@/services/academico.service";
import { getEstudiantes } from "@/services/estudiantes.service";
import { getPeriodos } from "@/services/academico.service";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Inscripcion {
  idinscripcion: number; expediente: string; estudiante: string;
  materia: string; codigomateria: string; numerogrupo: number;
  ciclo: string; estado: string; notafinal: number | null; estadonota: string | null;
}
interface Grupo {
  idgrupo: number; numerogrupo: number; materia: string; codigomateria: string;
  docente: string; ciclo: string; cupomaximo: number; cupoactual: number; uv: number;
}
interface Estudiante { idestudiante: number; expediente: string; primernombre: string; primerapellido: string; }
interface Periodo { idperiodo: number; nombre: string; año: number; numeroperiodo: number; activo: boolean; }

export default function InscripcionesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [grupos, setGrupos]               = useState<Grupo[]>([]);
  const [estudiantes, setEstudiantes]     = useState<Estudiante[]>([]);
  const [periodos, setPeriodos]           = useState<Periodo[]>([]);
  const [loading, setLoading]             = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [search, setSearch]               = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState<number>(0);
  const [form, setForm]                   = useState({ idestudiante: 0, idgrupo: 0 });

  async function loadAll() {
    setLoading(true);
    const params = filtroPeriodo ? { idperiodo: filtroPeriodo } : {};
    const [ins, g, e, p] = await Promise.all([
      getInscripciones(params),
      getGruposParaInscribir(),
      getEstudiantes(),
      getPeriodos(),
    ]);
    if (ins.success) setInscripciones(ins.inscripciones);
    if (g.success)   setGrupos(g.grupos);
    if (e.success)   setEstudiantes(e.estudiantes);
    if (p.success)   setPeriodos(p.periodos);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, [filtroPeriodo]);

  const filtered = inscripciones.filter(i =>
    i.estudiante.toLowerCase().includes(search.toLowerCase()) ||
    i.expediente.toLowerCase().includes(search.toLowerCase()) ||
    i.materia.toLowerCase().includes(search.toLowerCase())
  );

  async function handleInscribir() {
    if (!form.idestudiante || !form.idgrupo) {
      showToast("Selecciona estudiante y grupo", "error"); return;
    }
    setSaving(true);
    const res = await inscribir(form);
    setSaving(false);
    if (res.success) { showToast("Estudiante inscrito correctamente", "success"); setShowModal(false); loadAll(); }
    else showToast(res.message || "Error al inscribir", "error");
  }

  async function handleRetirar(i: Inscripcion) {
    if (!confirm(`¿Retirar a ${i.estudiante} de ${i.materia}?`)) return;
    const res = await retirarInscripcion(i.idinscripcion);
    if (res.success) { showToast("Inscripción retirada", "success"); loadAll(); }
    else showToast(res.message || "Error", "error");
  }

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS)) {
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
          <h1 className="text-2xl font-bold text-gray-800">📋 Inscripciones</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total", value: inscripciones.length, color: "text-blue-600" },
              { label: "Inscritos", value: inscripciones.filter(i => i.estado === "INSCRITO").length, color: "text-green-600" },
              { label: "Retirados", value: inscripciones.filter(i => i.estado === "RETIRADO").length, color: "text-red-500" },
              { label: "Aprobados", value: inscripciones.filter(i => i.estadonota === "APROBADO").length, color: "text-indigo-600" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{loading ? "..." : s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* filtros y acciones */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setShowModal(true)} className="btn-ieproes">+ Nueva Inscripción</button>
              <select className="input-ieproes max-w-xs" value={filtroPeriodo}
                onChange={e => setFiltroPeriodo(parseInt(e.target.value))}>
                <option value={0}>Todos los períodos</option>
                {periodos.map(p => (
                  <option key={p.idperiodo} value={p.idperiodo}>
                    {p.nombre} {p.activo ? "✓" : ""}
                  </option>
                ))}
              </select>
            </div>
            <input type="search" placeholder="Buscar estudiante o materia..."
              className="input-ieproes max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* tabla */}
          <div className="card-ieproes">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando inscripciones...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expediente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ciclo</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nota</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400">No hay inscripciones</td></tr>
                    ) : filtered.map(i => (
                      <tr key={i.idinscripcion} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">{i.expediente}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{i.estudiante}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded mr-1">{i.codigomateria}</span>
                          {i.materia}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">{i.ciclo}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            i.estado === "INSCRITO" ? "bg-green-100 text-green-700" :
                            i.estado === "RETIRADO" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                          }`}>{i.estado}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {i.notafinal != null ? (
                            <span className={`font-bold ${parseFloat(i.notafinal.toString()) >= 6 ? "text-green-600" : "text-red-500"}`}>
                              {parseFloat(i.notafinal.toString()).toFixed(1)}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {i.estado === "INSCRITO" && (
                            <button onClick={() => handleRetirar(i)} className="btn-outline text-xs px-2 py-1 text-red-500 border-red-300 hover:bg-red-50">
                              Retirar
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

      {/* Modal nueva inscripción */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">➕ Nueva Inscripción</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                <select className="input-ieproes" value={form.idestudiante}
                  onChange={e => setForm({ ...form, idestudiante: parseInt(e.target.value) })}>
                  <option value={0}>Seleccionar estudiante...</option>
                  {estudiantes.map(e => (
                    <option key={e.idestudiante} value={e.idestudiante}>
                      {e.expediente} - {e.primernombre} {e.primerapellido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo / Materia (período activo)</label>
                <select className="input-ieproes" value={form.idgrupo}
                  onChange={e => setForm({ ...form, idgrupo: parseInt(e.target.value) })}>
                  <option value={0}>Seleccionar grupo...</option>
                  {grupos.map(g => (
                    <option key={g.idgrupo} value={g.idgrupo}>
                      {g.codigomateria} - {g.materia} | Grupo {g.numerogrupo} | {g.cupoactual}/{g.cupomaximo} inscritos
                    </option>
                  ))}
                </select>
              </div>
              {grupos.find(g => g.idgrupo === form.idgrupo) && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  Docente: {grupos.find(g => g.idgrupo === form.idgrupo)?.docente} |
                  UV: {grupos.find(g => g.idgrupo === form.idgrupo)?.uv} |
                  Ciclo: {grupos.find(g => g.idgrupo === form.idgrupo)?.ciclo}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleInscribir} disabled={saving} className="btn-ieproes flex-1">
                {saving ? "Inscribiendo..." : "Inscribir"}
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
