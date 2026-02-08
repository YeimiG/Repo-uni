"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { exportToCSV, exportToTXT } from "@/utils/export";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ReportsPage() {
  const { user } = useAuth();
  const [rendimiento, setRendimiento] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function cargarRendimiento() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/reportes/rendimiento`);
      if (data.success) setRendimiento(data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  async function descargarRendimiento(formato: 'csv' | 'txt') {
    if (rendimiento.length === 0) {
      alert('Primero genera el reporte');
      return;
    }
    
    if (formato === 'csv') {
      exportToCSV(rendimiento, 'rendimiento_academico');
    } else {
      const texto = rendimiento.map(r => 
        `${r.materia}: Promedio ${r.promedio}, Aprobados ${r.aprobados}, Reprobados ${r.reprobados}`
      ).join('\n');
      exportToTXT(texto, 'rendimiento_academico');
    }
  }

  async function descargarEstadisticas(formato: 'csv' | 'txt') {
    if (!estadisticas) {
      alert('Primero genera el reporte');
      return;
    }
    
    if (formato === 'csv') {
      exportToCSV([estadisticas], 'estadisticas_generales');
    } else {
      const texto = `Estudiantes: ${estadisticas.estudiantes}\nDocentes: ${estadisticas.docentes}\nMaterias: ${estadisticas.materias}\nAprobados: ${estadisticas.aprobados}\nReprobados: ${estadisticas.reprobados}\nPromedio General: ${estadisticas.promedio_general}`;
      exportToTXT(texto, 'estadisticas_generales');
    }
  }

  if (!hasPermission(user?.rol, PERMISSIONS.VIEW_REPORTS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para ver reportes</p>
          <Link href="/dashboard" className="btn-ieproes">Volver al Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-ieproes-dark">📊 Reportes</h1>
            <Link href="/dashboard" className="btn-secondary">Volver Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-ieproes text-center">
              <div className="text-3xl font-bold text-ieproes-primary">{estadisticas.estudiantes}</div>
              <div className="text-sm text-gray-600">Estudiantes</div>
            </div>
            <div className="card-ieproes text-center">
              <div className="text-3xl font-bold text-success">{estadisticas.aprobados}</div>
              <div className="text-sm text-gray-600">Aprobados</div>
            </div>
            <div className="card-ieproes text-center">
              <div className="text-3xl font-bold text-error">{estadisticas.reprobados}</div>
              <div className="text-sm text-gray-600">Reprobados</div>
            </div>
          </div>
        )}

        {estadisticas && (
          <div className="card-ieproes mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Estadísticas Generales</h3>
              <div className="flex space-x-2">
                <button onClick={() => descargarEstadisticas('csv')} className="btn-ieproes text-sm">
                  📥 Descargar CSV
                </button>
                <button onClick={() => descargarEstadisticas('txt')} className="btn-secondary text-sm">
                  📄 Descargar TXT
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer" onClick={cargarRendimiento}>
            <h3 className="text-lg font-semibold mb-2">📈 Rendimiento Académico</h3>
            <p className="text-sm text-gray-600 mb-4">Estadísticas de notas por materia</p>
            <button className="btn-ieproes w-full">{loading ? 'Cargando...' : 'Generar Reporte'}</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer" onClick={cargarEstadisticas}>
            <h3 className="text-lg font-semibold mb-2">📊 Estadísticas Generales</h3>
            <p className="text-sm text-gray-600 mb-4">Resumen general del sistema</p>
            <button className="btn-ieproes w-full">{loading ? 'Cargando...' : 'Generar Reporte'}</button>
          </div>
        </div>

        {rendimiento.length > 0 && (
          <div className="card-ieproes mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rendimiento por Materia</h3>
              <div className="flex space-x-2">
                <button onClick={() => descargarRendimiento('csv')} className="btn-ieproes text-sm">
                  📥 Descargar CSV
                </button>
                <button onClick={() => descargarRendimiento('txt')} className="btn-secondary text-sm">
                  📄 Descargar TXT
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aprobados</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Reprobados</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rendimiento.map((r, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm font-medium">{r.materia}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold">{r.promedio}</td>
                      <td className="px-6 py-4 text-center text-sm text-success">{r.aprobados}</td>
                      <td className="px-6 py-4 text-center text-sm text-error">{r.reprobados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
