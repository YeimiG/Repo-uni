"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

export default function ConfigPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [saving, setSaving] = useState(false);

  if (!hasPermission(user?.rol, PERMISSIONS.SYSTEM_CONFIG)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-gray-500 text-sm mb-4">Solo SUPER_ADMIN y ADMIN_ACADÉMICO pueden acceder</p>
          <Link href="/dashboard" className="btn-ieproes">Volver</Link>
        </div>
      </div>
    );
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast("Configuración guardada", "success"); }, 800);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">⚙️ Configuración del Sistema</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información institucional */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">🏫 Información Institucional</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Institución</label>
                  <input type="text" className="input-ieproes" defaultValue="IEPROES" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input type="text" className="input-ieproes" placeholder="Dirección completa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" className="input-ieproes" placeholder="+503 0000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
                  <input type="email" className="input-ieproes" placeholder="info@ieproes.edu.sv" />
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-ieproes w-full">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>

            {/* Configuración académica */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📅 Configuración Académica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo Actual</label>
                  <select className="input-ieproes">
                    <option>Ciclo I - 2025</option>
                    <option>Ciclo II - 2025</option>
                    <option>Ciclo I - 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nota Mínima de Aprobación</label>
                  <input type="number" className="input-ieproes" defaultValue="6.0" step="0.1" min="0" max="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Materias por Ciclo</label>
                  <input type="number" className="input-ieproes" defaultValue="6" min="1" max="12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Parciales</label>
                  <select className="input-ieproes" defaultValue="5">
                    <option value="3">3 Parciales</option>
                    <option value="5">5 Parciales</option>
                  </select>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-ieproes w-full">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">🔐 Seguridad</h3>
              <div className="space-y-3">
                {[
                  { label: "Tiempo de sesión (horas)", type: "number", default: "8" },
                  { label: "Intentos máximos de login", type: "number", default: "5" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} className="input-ieproes" defaultValue={f.default} />
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Bloqueo automático de usuarios</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-500" defaultChecked />
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-ieproes w-full">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📧 Notificaciones</h3>
              <div className="space-y-3">
                {[
                  { label: "Notificaciones por email", checked: true },
                  { label: "Alertas de notas ingresadas", checked: true },
                  { label: "Alertas de nuevos usuarios", checked: false },
                  { label: "Reportes automáticos semanales", checked: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{n.label}</span>
                    <input type="checkbox" className="w-5 h-5 accent-blue-500" defaultChecked={n.checked} />
                  </div>
                ))}
                <button onClick={handleSave} disabled={saving} className="btn-ieproes w-full">
                  {saving ? "Guardando..." : "Guardar Preferencias"}
                </button>
              </div>
            </div>
          </div>

          {/* info de acceso */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            ⚠️ Solo <strong>SUPER_ADMIN</strong> y <strong>ADMIN_ACADÉMICO</strong> pueden modificar la configuración del sistema.
            Actualmente conectado como: <strong>{user?.rol}</strong>
          </div>
        </main>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
