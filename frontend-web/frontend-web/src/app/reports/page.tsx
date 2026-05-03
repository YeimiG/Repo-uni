"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { getRendimiento, getEstadisticas, getHistorialEstudiante } from "@/services/reportes.service";
import { getEstudiantes } from "@/services/estudiantes.service";
import { exportToCSV, exportToTXT } from "@/utils/export";
import Sidebar from "@/components/Sidebar";

interface Estudiante { idestudiante: number; expediente: string; primernombre: string; primerapellido: string; }

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rendimiento, setRendimiento]     = useState<any[]>([]);
  const [estadisticas, setEstadisticas]   = useState<any>(null);
  const [historial, setHistorial]         = useState<any[]>([]);
  const [estudiantes, setEstudiantes]     = useState<Estudiante[]>([]);
  const [selectedEst, setSelectedEst]     = useState<number>(0);
  const [loadingR, setLoadingR]           = useState(false);
  const [loadingE, setLoadingE]           = useState(false);
  const [loadingH, setLoadingH]           = useState(false);
  const [loadingEst, setLoadingEst]       = useState(false);
  const [tabActiva, setTabActiva]         = useState<"rendimiento"|"estadisticas"|"historial">("rendimiento");

  async function cargarRendimiento() {
    setLoadingR(true);
    const r = await getRendimiento();
    if (r.success) setRendimiento(r.data);
    setLoadingR(false);
  }

  async function cargarEstadisticas() {
    setLoadingE(true);
    const r = await getEstadisticas();
    if (r.success) setEstadisticas(r.data);
    setLoadingE(false);
  }

  async function cargarEstudiantes() {
    if (estudiantes.length > 0) return;
    setLoadingEst(true);
    const r = await getEstudiantes();
    if (r.success) setEstudiantes(r.estudiantes);
    setLoadingEst(false);
  }

  async function cargarHistorial() {
    if (!selectedEst) return;
    setLoadingH(true);
    const r = await getHistorialEstudiante(selectedEst);
    if (r.success) setHistorial(r.data);
    setLoadingH(false);
  }

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasPermission(user?.rol, PERMISSIONS.VIEW_REPORTS)) {
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
          <h1 className="text-2xl font-bold text-gray-800">📊 Reportes</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          {/* tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {([
              { key: "rendimiento",  label: "📈 Rendimiento" },
              { key: "estadisticas", label: "📊 Estadísticas" },
              { key: "historial",    label: "🎓 Historial Estudiante" },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTabActiva(t.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === t.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB: Rendimiento */}
          {tabActiva === "rendimiento" && (
            <div>
              <div className="flex gap-2 mb-4">
                <button onClick={cargarRendimiento} disabled={loadingR} className="btn-ieproes text-sm py-2 px-4">
                  {loadingR ? "Cargando..." : "Generar Reporte"}
                </button>
                {rendimiento.length > 0 && (
                  <>
                    <button onClick={() => exportToCSV(rendimiento, "rendimiento")} className="btn-secondary text-sm py-2 px-3">📤 CSV</button>
                    <button onClick={() => exportToTXT(rendimiento.map(r => `${r.materia}: Prom ${r.promedio} | ✅${r.aprobados} ❌${r.reprobados}`).join("\n"), "rendimiento")} className="btn-secondary text-sm py-2 px-3">📄 TXT</button>
                  </>
                )}
              </div>
              {rendimiento.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Materia","Total","Promedio","Aprobados","Reprobados","% Aprobación"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rendimiento.map((r, i) => {
                        const pct = r.total_notas > 0 ? Math.round((r.aprobados / r.total_notas) * 100) : 0;
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{r.materia}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{r.total_notas}</td>
                            <td className="px-4 py-3 text-center font-bold text-blue-600">{r.promedio}</td>
                            <td className="px-4 py-3 text-center text-green-600 font-medium">{r.aprobados}</td>
                            <td className="px-4 py-3 text-center text-red-500 font-medium">{r.reprobados}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div className={`h-2 rounded-full ${pct >= 60 ? "bg-green-500" : "bg-red-400"}`} style={{ width: `${pct}%` }}></div>
                                </div>
                                <span className="text-xs font-medium">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {rendimiento.length === 0 && !loadingR && (
                <div className="text-center py-12 text-gray-400">Presiona "Generar Reporte" para ver los datos</div>
              )}
            </div>
          )}

          {/* TAB: Estadísticas */}
          {tabActiva === "estadisticas" && (
            <div>
              <div className="flex gap-2 mb-6">
                <button onClick={cargarEstadisticas} disabled={loadingE} className="btn-ieproes text-sm py-2 px-4">
                  {loadingE ? "Cargando..." : "Generar Estadísticas"}
                </button>
                {estadisticas && (
                  <>
                    <button onClick={() => exportToCSV([estadisticas], "estadisticas")} className="btn-secondary text-sm py-2 px-3">📤 CSV</button>
                    <button onClick={() => exportToTXT(
                      `Estudiantes: ${estadisticas.estudiantes}\nDocentes: ${estadisticas.docentes}\nMaterias: ${estadisticas.materias}\nAprobados: ${estadisticas.aprobados}\nReprobados: ${estadisticas.reprobados}\nPromedio: ${estadisticas.promedio_general}`,
                      "estadisticas"
                    )} className="btn-secondary text-sm py-2 px-3">📄 TXT</button>
                  </>
                )}
              </div>
              {estadisticas && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: "Estudiantes", value: estadisticas.estudiantes, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Docentes",    value: estadisticas.docentes,    color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Materias",    value: estadisticas.materias,    color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Aprobados",   value: estadisticas.aprobados,   color: "text-green-600", bg: "bg-green-50" },
                    { label: "Reprobados",  value: estadisticas.reprobados,  color: "text-red-500", bg: "bg-red-50" },
                    { label: "Promedio",    value: estadisticas.promedio_general ?? "—", color: "text-yellow-600", bg: "bg-yellow-50" },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 p-5 text-center`}>
                      <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {!estadisticas && !loadingE && (
                <div className="text-center py-12 text-gray-400">Presiona "Generar Estadísticas" para ver los datos</div>
              )}
            </div>
          )}

          {/* TAB: Historial Estudiante */}
          {tabActiva === "historial" && (
            <div>
              <div className="flex gap-3 mb-6 flex-wrap items-end">
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                  <select className="input-ieproes" value={selectedEst}
                    onChange={e => setSelectedEst(parseInt(e.target.value))}
                    onFocus={cargarEstudiantes}>
                    <option value={0}>{loadingEst ? "Cargando..." : "Seleccionar estudiante..."}</option>
                    {estudiantes.map(e => (
                      <option key={e.idestudiante} value={e.idestudiante}>
                        {e.expediente} - {e.primernombre} {e.primerapellido}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={cargarHistorial} disabled={!selectedEst || loadingH} className="btn-ieproes text-sm py-2 px-4">
                  {loadingH ? "Cargando..." : "Ver Historial"}
                </button>
                {historial.length > 0 && (
                  <button onClick={() => exportToCSV(historial, "historial")} className="btn-secondary text-sm py-2 px-3">📤 CSV</button>
                )}
              </div>

              {historial.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Ciclo","Código","Materia","UV","P1","P2","P3","P4","P5","Final","Resultado"].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {historial.map((h, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-500">{h.ciclo}</td>
                          <td className="px-3 py-2 font-mono text-xs text-blue-700">{h.codigomateria}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">{h.materia}</td>
                          <td className="px-3 py-2 text-center text-gray-600">{h.uv}</td>
                          {[h.nota1, h.nota2, h.nota3, h.nota4, h.nota5].map((n, j) => (
                            <td key={j} className="px-3 py-2 text-center text-gray-600">{n ?? "—"}</td>
                          ))}
                          <td className="px-3 py-2 text-center font-bold">
                            <span className={parseFloat(h.promedio_final) >= 6 ? "text-green-600" : "text-red-500"}>
                              {h.promedio_final ?? "—"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {h.resultado ? (
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${h.resultado === "APROBADO" ? "bg-green-100 text-green-700" : h.resultado === "REPROBADO" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                                {h.resultado}
                              </span>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {historial.length === 0 && !loadingH && (
                <div className="text-center py-12 text-gray-400">Selecciona un estudiante y presiona "Ver Historial"</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
