/* usuarios ieproes */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { getUsuarios } from "@/services/admin.service";
import { exportToCSV } from "@/utils/export";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

interface Usuario {
  idusuario: number;
  correo: string;
  rol: string;
  nombre: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    async function loadUsuarios() {
      setLoading(true);
      const response = await getUsuarios();
      if (response.success) {
        setUsuarios(response.usuarios);
      }
      setLoading(false);
    }
    loadUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleExportCSV() {
    if (filteredUsuarios.length === 0) {
      showToast('No hay usuarios para exportar', 'warning');
      return;
    }
    exportToCSV(filteredUsuarios, 'usuarios_ieproes');
    showToast('Usuarios exportados correctamente', 'success');
  }

  function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        showToast(`Archivo leído: ${lines.length - 1} registros`, 'info');
      } catch (error) {
        showToast('Error al leer el archivo CSV', 'error');
      }
    };
    reader.readAsText(file);
  }

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Solo administradores pueden gestionar usuarios</p>
          <Link href="/dashboard" className="btn-ieproes">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-ieproes-dark">Gestión de Usuarios</h1>
            <Link href="/dashboard" className="btn-secondary">
              Volver Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* acciones */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="btn-ieproes">Nuevo Usuario</button>
            <label className="btn-outline cursor-pointer">
              📥 Importar CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
            <button onClick={handleExportCSV} className="btn-outline">
              📤 Exportar CSV
            </button>
          </div>
          <div className="flex space-x-2">
            <input 
              type="search" 
              placeholder="Buscar usuarios..." 
              className="input-ieproes max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* tabla usuarios */}
        <div className="card-ieproes">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.idusuario} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.correo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge-${
                          usuario.rol.includes('Estudiante') ? 'info' : 
                          usuario.rol === 'Catedrático' ? 'success' : 'warning'
                        }`}>
                          {usuario.rol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}