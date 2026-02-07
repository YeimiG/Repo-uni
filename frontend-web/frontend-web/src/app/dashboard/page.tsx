"use client";

import ClientOnly from "@/components/ClientOnly";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";
import { getDashboardStats } from "@/services/dashboard.service";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  estudiantes: number;
  catedraticos: number;
  materias: number;
  notas: number;
}

export default function DashboardPage() {
  const { isAuth, user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    estudiantes: 0,
    catedraticos: 0,
    materias: 0,
    notas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.stats);
      }
      setLoading(false);
    }

    if (isAuth) {
      loadStats();
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

          {/* acciones */}
          <div className="card-ieproes">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>

            <div className="space-y-3">
              {hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS) && (
                <Link href="/users">
                  <button className="w-full text-left p-3 rounded-lg border">
                    👥 Gestionar Usuarios
                  </button>
                </Link>
              )}

              {hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS) && (
                <Link href="/subjects">
                  <button className="w-full text-left p-3 rounded-lg border">
                    📚 Administrar Materias
                  </button>
                </Link>
              )}

              {hasPermission(user?.rol, PERMISSIONS.MANAGE_GRADES) && (
                <Link href="/grades">
                  <button className="w-full text-left p-3 rounded-lg border">
                    📝 Gestionar Notas
                  </button>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </ClientOnly>
  );
}
