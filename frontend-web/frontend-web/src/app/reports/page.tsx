"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { exportToCSV, exportToTXT } from "@/utils/export";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ReportsPage() {
  const { user } = useAuth();
  const [rendimiento, setRendimiento] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loadingR, setLoadingR] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  async function cargarRendimiento() {
    setLoadingR(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/reportes/rendimiento`);
      if (data.success) setRendimiento(data.data);
    } catch {}
    setLoadingR(false);
  }

  async function cargarEstadisticas() {
    setLoadingE(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/reportes/estadisticas`);
      if (data.success) setEstadisticas(data.data);
    } catch {}
    setLoadingE(false);
  }

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
          {/* estadísticas generales */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: "Estudiantes", value: estadisticas.estudiantes, color: "text-blue-600" },
                { label: "Docentes",    value: estadisticas.docentes,    color: "text-indigo-600" },
                { label: "Materias",    value: estadisticas.materias,    color: "text-purple-600" },
                { label: "Aprobados",   value: estadisticas.aprobados,   color: "text-green-600" },
                { label: "Reprobados",  value: estadisticas.reprobados,  color: "text-red-500" },
                { label: "Promedio",    value: estadisticas.promedio_general ?? "—", color: "text-yellow-600" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* botones de reportes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-1">📈 Rendimiento Académico</h3>
              <p className="text-sm text-gray-500 mb-4">Promedio, aprobados y reprobados por materia</p>
              <div className="flex gap-2">
                <button onClick={cargarRendimiento} disabled={loadingR} className="btn-ieproes flex-1 text-sm py-2">
                  {loadingR ? "Cargando..." : "Generar"}
                </button>
                {rendimiento.length > 0 && (
                  <>
                    <button onClick={() => exportToCSV(rendimiento, "rendimiento")} className="btn-secondary text-sm py-2 px-3">CSV</button>
                    <button onClick={() => exportToTXT(rendimiento.map(r => `${r.materia}: Prom ${r.promedio} | ✅${r.aprobados} ❌${r.reprobados}`).join("\n"), "rendimiento")} className="btn-secondary text-sm py-2 px-3">TXT</button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-1">📊 Estadísticas Generales</h3>
              <p className="text-sm text-gray-500 mb-4">Resumen global del sistema académico</p>
              <div className="flex gap-2">
                <button onClick={cargarEstadisticas} disabled={loadingE} className="btn-ieproes flex-1 text-sm py-2">
                  {loadingE ? "Cargando..." : "Generar"}
                </button>
                {estadisticas && (
                  <>
                    <button onClick={() => exportToCSV([estadisticas], "estadisticas")} className="btn-secondary text-sm py-2 px-3">CSV</button>
                    <button onClick={() => exportToTXT(
                      `Estudiantes: ${estadisticas.estudiantes}\nDocentes: ${estadisticas.docentes}\nMaterias: ${estadisticas.materias}\nAprobados: ${estadisticas.aprobados}\nReprobados: ${estadisticas.reprobados}\nPromedio: ${estadisticas.promedio_general}`,
                      "estadisticas"
                    )} className="btn-secondary text-sm py-2 px-3">TXT</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* tabla rendimiento */}
          {rendimiento.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Rendimiento por Materia</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aprobados</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Reprobados</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Aprobación</th>
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
                            <div className="flex items-center justify-center gap-2">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
