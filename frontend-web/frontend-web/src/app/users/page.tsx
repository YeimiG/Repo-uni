/* usuarios ieproes */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";

export default function UsersPage() {
  const { user } = useAuth();
  const [users] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@ieproes.edu", role: "Estudiante", status: "Activo" },
    { id: 2, name: "María García", email: "maria@ieproes.edu", role: "Catedrático", status: "Activo" },
    { id: 3, name: "Carlos López", email: "carlos@ieproes.edu", role: "Administrador", status: "Activo" },
  ]);

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
            <button className="btn-ieproes">
              Nuevo Usuario
            </button>
            <button className="btn-outline">
              Importar CSV
            </button>
          </div>
          <div className="flex space-x-2">
            <input 
              type="search" 
              placeholder="Buscar usuarios..." 
              className="input-ieproes max-w-xs"
            />
          </div>
        </div>

        {/* tabla usuarios */}
        <div className="card-ieproes">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
                          <div className="w-5 h-5 bg-white rounded-full"></div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge-${
                        user.role === 'Estudiante' ? 'info' : 
                        user.role === 'Catedrático' ? 'success' : 'warning'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge-success">{user.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-ieproes-primary hover:text-ieproes-dark">
                          Editar
                        </button>
                        <button className="text-error hover:text-red-700">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}