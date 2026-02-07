"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";

export default function ConfigPage() {
  const { user } = useAuth();

  if (!hasPermission(user?.rol, PERMISSIONS.SYSTEM_CONFIG)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Solo administradores pueden acceder a la configuración</p>
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
            <h1 className="text-2xl font-bold text-ieproes-dark">⚙️ Configuración del Sistema</h1>
            <Link href="/dashboard" className="btn-secondary">Volver Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-ieproes">
            <h3 className="text-lg font-semibold mb-4">🏫 Información Institucional</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Institución</label>
                <input type="text" className="input-ieproes" defaultValue="IEPROES" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input type="text" className="input-ieproes" placeholder="Dirección completa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input type="tel" className="input-ieproes" placeholder="+503 0000-0000" />
              </div>
              <button className="btn-ieproes w-full">Guardar Cambios</button>
            </div>
          </div>

          <div className="card-ieproes">
            <h3 className="text-lg font-semibold mb-4">📅 Configuración Académica</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciclo Actual</label>
                <select className="input-ieproes">
                  <option>Ciclo I - 2024</option>
                  <option>Ciclo II - 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota Mínima Aprobación</label>
                <input type="number" className="input-ieproes" defaultValue="6.0" step="0.1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo Materias por Ciclo</label>
                <input type="number" className="input-ieproes" defaultValue="6" />
              </div>
              <button className="btn-ieproes w-full">Guardar Cambios</button>
            </div>
          </div>

          <div className="card-ieproes">
            <h3 className="text-lg font-semibold mb-4">🔐 Seguridad</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Autenticación de dos factores</span>
                <button className="btn-secondary text-sm">Activar</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Backup automático</span>
                <button className="btn-ieproes text-sm">Configurar</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Logs del sistema</span>
                <button className="btn-secondary text-sm">Ver Logs</button>
              </div>
            </div>
          </div>

          <div className="card-ieproes">
            <h3 className="text-lg font-semibold mb-4">📧 Notificaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Email notificaciones</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">SMS alertas</span>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Notificaciones push</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <button className="btn-ieproes w-full">Guardar Preferencias</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
