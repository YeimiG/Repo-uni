"use client";

import ClientOnly from "@/components/ClientOnly";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";
import { getDashboardStats, getDashboardActividad } from "@/services/dashboard.service";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  estudiantes: number;
  catedraticos: number;
  materias: number;
  notas: number;
}

interface Actividad {
  tipo: string;
  mensaje: string;
  detalle?: string;
  icono: string;
}

export default function DashboardPage() {
  const { isAuth, user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    estudiantes: 0,
    catedraticos: 0,
    materias: 0,
    notas: 0,
  });

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [statsRes, actividadRes] = await Promise.all([
        getDashboardStats(),
        getDashboardActividad()
      ]);
      
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (actividadRes.success) {
        setActividades(actividadRes.actividades);
      }
      setLoading(false);
    }

    if (isAuth) {
      loadData();
    }
  }, [isAuth]);

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-ieproes-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        {/* header dashboard */}
        <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </div>
                <h1 className="text-2xl font-bold text-ieproes-dark">
                  IEPROES Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.nombre
                    ? `Bienvenido, ${user.nombre} ${user.apellidos || ""} (${user.rol})`
                    : "Cargando usuario..."}
                </span>
                <button onClick={logout} className="btn-secondary text-sm">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* contenido principal */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* tarjetas estadisticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-ieproes hover:shadow-xl transition-shadow">
              <p className="text-sm font-medium text-gray-600">
                Estudiantes Activos
              </p>
              <p className="text-2xl font-bold text-ieproes-dark">
                {loading ? "..." : stats.estudiantes}
              </p>
            </div>

            <div className="card-ieproes hover:shadow-xl transition-shadow">
              <p className="text-sm font-medium text-gray-600">Catedráticos</p>
              <p className="text-2xl font-bold text-ieproes-dark">
                {loading ? "..." : stats.catedraticos}
              </p>
            </div>

            <div className="card-ieproes hover:shadow-xl transition-shadow">
              <p className="text-sm font-medium text-gray-600">
                Materias Ofertadas
              </p>
              <p className="text-2xl font-bold text-ieproes-dark">
                {loading ? "..." : stats.materias}
              </p>
            </div>

            <div className="card-ieproes hover:shadow-xl transition-shadow">
              <p className="text-sm font-medium text-gray-600">
                Calificaciones
              </p>
              <p className="text-2xl font-bold text-ieproes-dark">
                {loading ? "..." : stats.notas}
              </p>
            </div>
          </div>

          {/* acciones y actividad */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* acciones rapidas */}
            <div className="card-ieproes">
              <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>

              <div className="space-y-3">
                {hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS) && (
                  <Link href="/users">
                    <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                      <span className="font-medium">👥 Gestionar Usuarios</span>
                    </button>
                  </Link>
                )}

                {hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS) && (
                  <Link href="/subjects">
                    <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                      <span className="font-medium">📚 Administrar Materias</span>
                    </button>
                  </Link>
                )}

                {hasPermission(user?.rol, PERMISSIONS.MANAGE_GRADES) && (
                  <Link href="/grades">
                    <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                      <span className="font-medium">📝 Gestionar Notas</span>
                    </button>
                  </Link>
                )}

                {hasPermission(user?.rol, PERMISSIONS.VIEW_REPORTS) && (
                  <Link href="/reports">
                    <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                      <span className="font-medium">📊 Ver Reportes</span>
                    </button>
                  </Link>
                )}

                {hasPermission(user?.rol, PERMISSIONS.SYSTEM_CONFIG) && (
                  <Link href="/config">
                    <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                      <span className="font-medium">⚙️ Configuración</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* actividad reciente */}
            <div className="card-ieproes">
              <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Cargando actividad...</div>
              ) : actividades.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay actividad reciente</div>
              ) : (
                <div className="space-y-3">
                  {actividades.map((act, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start p-3 rounded-lg border-l-4 ${
                        act.icono === 'info' ? 'bg-blue-50 border-info' :
                        act.icono === 'success' ? 'bg-green-50 border-success' :
                        'bg-yellow-50 border-warning'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3 mt-1 ${
                        act.icono === 'info' ? 'bg-info' :
                        act.icono === 'success' ? 'bg-success' :
                        'bg-warning'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{act.mensaje}</p>
                        {act.detalle && (
                          <p className="text-xs text-gray-600 mt-1">{act.detalle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Sistema de Gestión Académica IEPROES - v1.0</p>
          </div>
        </main>
      </div>
    </ClientOnly>
  );
}
