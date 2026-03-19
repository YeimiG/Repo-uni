"use client";

import ClientOnly from "@/components/ClientOnly";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";
import { getDashboardStats, getDashboardActividad } from "@/services/dashboard.service";
import { hasPermission, PERMISSIONS, isAdmin, isDocente } from "@/utils/permissions";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats { estudiantes: number; catedraticos: number; materias: number; notas: number; }
interface Actividad { tipo: string; mensaje: string; detalle?: string; icono: string; }

const ROL_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN_ACADEMICO: "Admin Académico",
  ADMIN_FINANCIERO: "Admin Financiero",
  COORDINADOR: "Coordinador",
  DOCENTE: "Docente",
  SECRETARIA: "Secretaría",
};

const ROL_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  ADMIN_ACADEMICO: "bg-blue-100 text-blue-800",
  ADMIN_FINANCIERO: "bg-green-100 text-green-800",
  COORDINADOR: "bg-yellow-100 text-yellow-800",
  DOCENTE: "bg-indigo-100 text-indigo-800",
  SECRETARIA: "bg-pink-100 text-pink-800",
};

export default function DashboardPage() {
  const { isAuth, user } = useAuth();
  const [stats, setStats] = useState<Stats>({ estudiantes: 0, catedraticos: 0, materias: 0, notas: 0 });
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) return;
    async function loadData() {
      setLoading(true);
      const [s, a] = await Promise.all([getDashboardStats(), getDashboardActividad()]);
      if (s.success) setStats(s.stats);
      if (a.success) setActividades(a.actividades);
      setLoading(false);
    }
    loadData();
  }, [isAuth]);

  return (
    <ClientOnly fallback={<div className="min-h-screen gradient-ieproes flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* header */}
          <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500">Bienvenido, {user?.nombre} {user?.apellidos}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROL_COLORS[user?.rol ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                {ROL_LABELS[user?.rol ?? ''] ?? user?.rol}
              </span>
              <button onClick={logout} className="btn-secondary text-sm py-2 px-4">Cerrar Sesión</button>
            </div>
          </header>

          <main className="flex-1 p-8">
            {/* stats — solo roles con VIEW_STATS */}
            {hasPermission(user?.rol, PERMISSIONS.VIEW_STATS) && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Estudiantes", value: stats.estudiantes, color: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: "🎓" },
                  { label: "Docentes", value: stats.catedraticos, color: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", icon: "👨‍🏫" },
                  { label: "Materias", value: stats.materias, color: "bg-green-50 border-green-200", text: "text-green-700", icon: "📚" },
                  { label: "Calificaciones", value: stats.notas, color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: "📝" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border-2 ${s.color} p-5`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`text-3xl font-bold ${s.text}`}>{loading ? "..." : s.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* acciones rápidas por rol */}
              <div className="card-ieproes">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">⚡ Acciones Rápidas</h3>
                <div className="space-y-2">
                  {hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS) && (
                    <Link href="/users">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="text-xl mr-3">👥</span>
                        <div>
                          <div className="font-medium text-gray-800">Gestionar Usuarios</div>
                          <div className="text-xs text-gray-500">
                            {user?.rol === 'SECRETARIA' ? 'Crear y editar usuarios del sistema' : 'Administrar todos los usuarios'}
                          </div>
                        </div>
                        <span className="ml-auto text-gray-400">→</span>
                      </div>
                    </Link>
                  )}
                  {hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS) && (
                    <Link href="/subjects">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="text-xl mr-3">📚</span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {isDocente(user?.rol) ? 'Mis Materias' : 'Administrar Materias'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isDocente(user?.rol) ? 'Ver materias asignadas' : 'Grupos, docentes e inscripciones'}
                          </div>
                        </div>
                        <span className="ml-auto text-gray-400">→</span>
                      </div>
                    </Link>
                  )}
                  {hasPermission(user?.rol, PERMISSIONS.MANAGE_GRADES) && (
                    <Link href="/grades">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="text-xl mr-3">📝</span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {isDocente(user?.rol) ? 'Ingresar Notas' : 'Gestionar Notas'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isDocente(user?.rol) ? 'Calificar estudiantes de tus grupos' : 'Ver y editar calificaciones'}
                          </div>
                        </div>
                        <span className="ml-auto text-gray-400">→</span>
                      </div>
                    </Link>
                  )}
                  {hasPermission(user?.rol, PERMISSIONS.VIEW_REPORTS) && (
                    <Link href="/reports">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="text-xl mr-3">📊</span>
                        <div>
                          <div className="font-medium text-gray-800">Reportes</div>
                          <div className="text-xs text-gray-500">Rendimiento académico y estadísticas</div>
                        </div>
                        <span className="ml-auto text-gray-400">→</span>
                      </div>
                    </Link>
                  )}
                  {hasPermission(user?.rol, PERMISSIONS.SYSTEM_CONFIG) && (
                    <Link href="/config">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="text-xl mr-3">⚙️</span>
                        <div>
                          <div className="font-medium text-gray-800">Configuración</div>
                          <div className="text-xs text-gray-500">Parámetros del sistema</div>
                        </div>
                        <span className="ml-auto text-gray-400">→</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* actividad reciente */}
              <div className="card-ieproes">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🕐 Actividad Reciente</h3>
                {loading ? (
                  <div className="text-center py-8 text-gray-400">Cargando...</div>
                ) : actividades.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Sin actividad reciente</div>
                ) : (
                  <div className="space-y-3">
                    {actividades.map((act, i) => (
                      <div key={i} className={`flex items-start p-3 rounded-lg border-l-4 ${
                        act.icono === 'success' ? 'bg-green-50 border-green-400' :
                        act.icono === 'info'    ? 'bg-blue-50 border-blue-400' :
                        'bg-yellow-50 border-yellow-400'
                      }`}>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{act.mensaje}</p>
                          {act.detalle && <p className="text-xs text-gray-500 mt-1">{act.detalle}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* info de rol */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tu rol:</span>{" "}
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ROL_COLORS[user?.rol ?? ''] ?? ''}`}>
                  {ROL_LABELS[user?.rol ?? ''] ?? user?.rol}
                </span>
                {" — "}
                {user?.rol === 'SUPER_ADMIN' && "Acceso total al sistema."}
                {user?.rol === 'ADMIN_ACADEMICO' && "Gestión académica completa."}
                {user?.rol === 'ADMIN_FINANCIERO' && "Acceso a reportes y estadísticas financieras."}
                {user?.rol === 'COORDINADOR' && "Coordinación de materias y docentes."}
                {user?.rol === 'DOCENTE' && "Gestión de tus materias y calificaciones."}
                {user?.rol === 'SECRETARIA' && "Gestión de usuarios y reportes."}
              </p>
            </div>
          </main>
        </div>
      </div>
    </ClientOnly>
  );
}
