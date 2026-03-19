"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import { getUsuarios, getRoles, crearUsuario, editarUsuario, toggleUsuario } from "@/services/admin.service";
import { exportToCSV } from "@/utils/export";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import Sidebar from "@/components/Sidebar";

interface Usuario {
  idusuario: number;
  correo: string;
  rol: string;
  nombre: string;
  activo?: boolean;
}

interface Rol {
  idrol: number;
  nombrerol: string;
}

const FORM_EMPTY = {
  correo: "", clave: "", idrol: 0,
  primernombre: "", primerapellido: "",
};

export default function UsersPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState(FORM_EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  async function loadData() {
    setLoading(true);
    const [usuariosRes, rolesRes] = await Promise.all([getUsuarios(), getRoles()]);
    if (usuariosRes.success) setUsuarios(usuariosRes.usuarios);
    if (rolesRes.success) setRoles(rolesRes.roles);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function abrirCrear() {
    setEditando(null);
    setForm(FORM_EMPTY);
    setShowModal(true);
  }

  function abrirEditar(u: Usuario) {
    setEditando(u);
    const [primernombre = "", primerapellido = ""] = u.nombre.split(" ");
    setForm({ correo: u.correo, clave: "", idrol: 0, primernombre, primerapellido });
    setShowModal(true);
  }

  async function handleGuardar() {
    if (!editando && (!form.correo || !form.clave || !form.idrol || !form.primernombre || !form.primerapellido)) {
      showToast("Todos los campos son obligatorios", "error");
      return;
    }
    setSaving(true);
    let res;
    if (editando) {
      const payload: any = {};
      if (form.correo) payload.correo = form.correo;
      if (form.clave)  payload.clave  = form.clave;
      if (form.primernombre)   payload.primernombre   = form.primernombre;
      if (form.primerapellido) payload.primerapellido = form.primerapellido;
      res = await editarUsuario(editando.idusuario, payload);
    } else {
      res = await crearUsuario(form);
    }
    setSaving(false);
    if (res.success) {
      showToast(editando ? "Usuario actualizado" : "Usuario creado", "success");
      setShowModal(false);
      loadData();
    } else {
      showToast(res.message || "Error al guardar", "error");
    }
  }

  async function handleToggle(u: Usuario) {
    const accion = u.activo === false ? "activar" : "desactivar";
    if (!confirm(`¿${accion} al usuario ${u.nombre}?`)) return;
    const res = await toggleUsuario(u.idusuario);
    if (res.success) {
      showToast(res.message, "success");
      loadData();
    } else {
      showToast("Error al cambiar estado", "error");
    }
  }

  function handleExportCSV() {
    if (filteredUsuarios.length === 0) { showToast("No hay usuarios para exportar", "warning"); return; }
    exportToCSV(filteredUsuarios, "usuarios_ieproes");
    showToast("Usuarios exportados correctamente", "success");
  }

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Solo administradores y secretaría pueden gestionar usuarios</p>
          <Link href="/dashboard" className="btn-ieproes">Volver al Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
        <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
      </header>

      <main className="flex-1 p-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={abrirCrear} className="btn-ieproes">+ Nuevo Usuario</button>
            <button onClick={handleExportCSV} className="btn-outline">📤 Exportar CSV</button>
          </div>
          <input
            type="search"
            placeholder="Buscar usuarios..."
            className="input-ieproes max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="card-ieproes">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((u) => (
                    <tr key={u.idusuario} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.correo}</td>
                      <td className="px-6 py-4">
                        <span className={`badge-${
                          u.rol === 'SUPER_ADMIN' || u.rol === 'ADMIN_ACADEMICO' ? 'warning' :
                          u.rol === 'DOCENTE' ? 'success' :
                          u.rol === 'SECRETARIA' || u.rol === 'COORDINADOR' ? 'info' : 'info'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge-${u.activo === false ? 'error' : 'success'}`}>
                          {u.activo === false ? 'Inactivo' : 'Activo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button onClick={() => abrirEditar(u)} className="btn-secondary text-xs px-3 py-1">
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleToggle(u)}
                          className={`text-xs px-3 py-1 rounded ${u.activo === false ? 'btn-ieproes' : 'btn-outline'}`}
                        >
                          {u.activo === false ? '✅ Activar' : '🚫 Desactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal crear / editar */}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editando ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 text-2xl">&times;</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                  <input
                    type="text" className="input-ieproes"
                    value={form.primernombre}
                    onChange={(e) => setForm({ ...form, primernombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
                  <input
                    type="text" className="input-ieproes"
                    value={form.primerapellido}
                    onChange={(e) => setForm({ ...form, primerapellido: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email" className="input-ieproes"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editando ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                </label>
                <input
                  type="password" className="input-ieproes"
                  value={form.clave}
                  onChange={(e) => setForm({ ...form, clave: e.target.value })}
                />
              </div>

              {!editando && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    className="input-ieproes"
                    value={form.idrol}
                    onChange={(e) => setForm({ ...form, idrol: parseInt(e.target.value) })}
                  >
                    <option value={0}>Seleccionar rol...</option>
                    {roles.map((r) => (
                      <option key={r.idrol} value={r.idrol}>{r.nombrerol}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button onClick={handleGuardar} disabled={saving} className="btn-ieproes flex-1">
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    </div>
  );
}
