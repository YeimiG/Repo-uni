"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";

export default function ReportsPage() {
  const { user } = useAuth();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">📈 Rendimiento Académico</h3>
            <p className="text-sm text-gray-600 mb-4">Estadísticas de notas por materia</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">👥 Asistencia</h3>
            <p className="text-sm text-gray-600 mb-4">Control de asistencia estudiantil</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">📚 Materias</h3>
            <p className="text-sm text-gray-600 mb-4">Resumen de materias ofertadas</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">🎓 Graduados</h3>
            <p className="text-sm text-gray-600 mb-4">Listado de estudiantes graduados</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">📋 Inscripciones</h3>
            <p className="text-sm text-gray-600 mb-4">Reporte de inscripciones por ciclo</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>

          <div className="card-ieproes hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">💰 Pagos</h3>
            <p className="text-sm text-gray-600 mb-4">Estado de pagos y cuotas</p>
            <button className="btn-ieproes w-full">Generar Reporte</button>
          </div>
        </div>
      </main>
    </div>
  );
}
