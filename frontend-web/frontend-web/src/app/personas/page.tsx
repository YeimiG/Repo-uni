"use client";

import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import {
  actualizarPersona,
  crearPersona,
  getPersonas,
  getTiposDocumento,
  togglePersona,
} from "@/services/personas.service";
import type { TipoDocumento } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Persona {
  idpersona: number;
  primernombre: string;
  segundonombre?: string;
  primerapellido: string;
  segundoapellido?: string;
  numeroDocumento?: string;
  dui?: string;
  idTipoDocumento?: number;
  tipoDocumento?: string;
  telefono?: string;
  direccion?: string;
  fechanacimiento?: string;
  genero?: string;
  estadocivil?: string;
  activo?: boolean;
}

const EMPTY_FORM = {
  primernombre: "",
  segundonombre: "",
  primerapellido: "",
  segundoapellido: "",
  idTipoDocumento: 0,
  numeroDocumento: "",
  telefono: "",
  direccion: "",
  fechanacimiento: "",
  genero: "",
  estadocivil: "",
};

export default function PersonasPage() {
  const { toast, showToast, hideToast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Persona | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const cargarPersonas = async () => {
    setLoading(true);
    const res = await getPersonas();
    if (res.success) {
      setPersonas(res.data || []);
    } else {
      showToast(res.message || "Error al cargar personas", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPersonas();
    cargarTiposDocumento();
  }, []);

  const cargarTiposDocumento = async () => {
    try {
      const res = await getTiposDocumento();
      if (res.success) {
        setTiposDocumento(
          (res.data || res.tipos || []).map((t: any) => ({
            id: t.idtipodocumento ?? t.idTipoDocumento ?? t.id,
            nombre: t.nombre,
            abreviatura: t.abreviatura,
          })),
        );
        return;
      }
      showToast(res.message || "Error al cargar tipos de documento", "error");
    } catch (e) {
      // fallback a lista conocida (IDs 1-5)
      setTiposDocumento([
        { id: 1, nombre: "Documento Único de Identidad" },
        { id: 2, nombre: "Pasaporte" },
        { id: 3, nombre: "Carnet de Residente" },
        { id: 4, nombre: "Número de Identificación Tributaria" },
        { id: 5, nombre: "Carnet de Minoridad" },
      ]);
    }
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const abrirEditar = (persona: Persona) => {
    setEditando(persona);
    setForm({
      primernombre: persona.primernombre || "",
      segundonombre: persona.segundonombre || "",
      primerapellido: persona.primerapellido || "",
      segundoapellido: persona.segundoapellido || "",
      idTipoDocumento: persona.idTipoDocumento || 0,
      numeroDocumento: persona.numeroDocumento || persona.dui || "",
      telefono: persona.telefono || "",
      direccion: persona.direccion || "",
      fechanacimiento: persona.fechanacimiento || "",
      genero: persona.genero || "",
      estadocivil: persona.estadocivil || "",
    });
    setShowModal(true);
  };

  const handleGuardar = async () => {
    if (!form.primernombre || !form.primerapellido) {
      showToast("Nombre y apellido son obligatorios", "error");
      return;
    }
    if (!form.idTipoDocumento || !form.numeroDocumento) {
      showToast(
        "Tipo de documento y número de documento son obligatorios",
        "error",
      );
      return;
    }
    setSaving(true);
    try {
      const res = editando
        ? await actualizarPersona(editando.idpersona, form)
        : await crearPersona(form);

      if (res.success) {
        showToast(
          editando ? "Persona actualizada" : "Persona creada",
          "success",
        );
        setShowModal(false);
        cargarPersonas();
      } else {
        showToast(res.message || "Error al guardar persona", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error al guardar persona", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (persona: Persona) => {
    if (
      !confirm(
        `¿Desea ${persona.activo ? "desactivar" : "activar"} a ${persona.primernombre} ${persona.primerapellido}?`,
      )
    )
      return;
    const res = await togglePersona(persona.idpersona);
    if (res.success) {
      showToast(res.message || "Estado cambiado", "success");
      cargarPersonas();
    } else {
      showToast(res.message || "Error al cambiar estado", "error");
    }
  };

  const personasFiltradas = personas.filter((persona) => {
    const texto =
      `${persona.primernombre} ${persona.segundonombre || ""} ${persona.primerapellido} ${persona.segundoapellido || ""} ${persona.dui || ""}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            🧑 Gestión de Personas
          </h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
            ← Dashboard
          </Link>
        </header>

        <main className="flex-1 p-8">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <button onClick={abrirCrear} className="btn-ieproes">
              + Nueva Persona
            </button>
            <input
              type="search"
              placeholder="Buscar por nombre, apellido o DUI..."
              className="input-ieproes max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card-ieproes">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando personas...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        DUI
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Dirección
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {personasFiltradas.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-400"
                        >
                          No se encontraron personas
                        </td>
                      </tr>
                    ) : (
                      personasFiltradas.map((persona) => (
                        <tr
                          key={persona.idpersona}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-gray-900">
                            {persona.primernombre} {persona.segundonombre || ""}{" "}
                            {persona.primerapellido}{" "}
                            {persona.segundoapellido || ""}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {persona.dui || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {persona.telefono || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {persona.direccion || "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`badge-${persona.activo ? "success" : "error"}`}
                            >
                              {persona.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center space-x-1">
                            <button
                              onClick={() => abrirEditar(persona)}
                              className="btn-secondary text-xs px-2 py-1"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleToggle(persona)}
                              className={`text-xs px-2 py-1 rounded ${persona.activo ? "btn-outline" : "btn-ieproes"}`}
                            >
                              {persona.activo ? "🚫" : "✅"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editando ? "✏️ Editar Persona" : "➕ Nueva Persona"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Nombre *
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.primernombre}
                  onChange={(e) =>
                    setForm({ ...form, primernombre: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.segundonombre}
                  onChange={(e) =>
                    setForm({ ...form, segundonombre: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Apellido *
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.primerapellido}
                  onChange={(e) =>
                    setForm({ ...form, primerapellido: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.segundoapellido}
                  onChange={(e) =>
                    setForm({ ...form, segundoapellido: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 font-bold mb-1">
                  Tipo de Documento *
                </label>
                <select
                  className="input-ieproes border-2 border-red-400 focus:border-red-600"
                  value={form.idTipoDocumento || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      idTipoDocumento: parseInt(e.target.value, 10),
                    })
                  }
                >
                  <option value={0}>-- Selecciona tipo de documento --</option>
                  {tiposDocumento &&
                    tiposDocumento.length > 0 &&
                    tiposDocumento.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 font-bold mb-1">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  className="input-ieproes border-2 border-red-400 focus:border-red-600"
                  value={form.numeroDocumento}
                  placeholder={
                    form.idTipoDocumento
                      ? `Ej: Número de ${
                          tiposDocumento.find(
                            (t) => t.id === form.idTipoDocumento,
                          )?.nombre || "documento"
                        }`
                      : "Primero selecciona el tipo de documento"
                  }
                  disabled={!form.idTipoDocumento}
                  onChange={(e) =>
                    setForm({ ...form, numeroDocumento: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  className="input-ieproes"
                  value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil
                </label>
                <select
                  className="input-ieproes"
                  value={form.estadocivil}
                  onChange={(e) =>
                    setForm({ ...form, estadocivil: e.target.value })
                  }
                >
                  <option value="">Seleccionar...</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="Casado">Casado/a</option>
                  <option value="Divorciado">Divorciado/a</option>
                  <option value="Viudo">Viudo/a</option>
                  <option value="Union Libre">Unión Libre</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  className="input-ieproes"
                  value={form.direccion}
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  className="input-ieproes"
                  value={form.fechanacimiento}
                  onChange={(e) =>
                    setForm({ ...form, fechanacimiento: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="btn-ieproes flex-1"
              >
                {saving ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
