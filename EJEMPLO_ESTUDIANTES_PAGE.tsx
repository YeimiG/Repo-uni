/**
 * EJEMPLO COMPLETO: Página de Estudiantes Actualizada
 * Mantiene el mismo diseño visual pero con nuevo flujo de creación
 *
 * Este es un ejemplo de cómo actualizar:
 * frontend-web/frontend-web/src/app/estudiantes/page.tsx
 */

"use client";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useStudentCreation } from "@/hooks/useStudentCreation";
import { useToast } from "@/hooks/useToast";
import {
    getCarreras,
    getEstadosEstudiante,
    getEstudiantes,
    toggleEstudiante,
} from "@/services/estudiantes.service";
import type { Carrera, Estudiante } from "@/types";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Estado {
  idestado: number;
  nombre: string;
}

const FORM_EMPTY = {
  // Paso 1: Persona
  opcion: "nueva" as const,
  persona: {
    primernombre: "",
    segundonombre: "",
    primerapellido: "",
    segundoapellido: "",
    dui: "",
    telefono: "",
    direccion: "",
  },
  idpersona: 0,

  // Paso 2: Usuario
  correo: "",
  clave: "",
  confirmarClave: "",

  // Paso 3: Estudiante
  expediente: "",
  idcarrera: 0,
  fechaingreso: "",
};

export default function EstudiantesPage() {
  // ──────────────────────────────────────────────────────────
  // HOOKS
  // ──────────────────────────────────────────────────────────
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const creation = useStudentCreation();

  // ──────────────────────────────────────────────────────────
  // ESTADO
  // ──────────────────────────────────────────────────────────
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(FORM_EMPTY);
  const [saving, setSaving] = useState(false);

  // ──────────────────────────────────────────────────────────
  // EFECTOS
  // ──────────────────────────────────────────────────────────

  // Cargar datos iniciales
  useEffect(() => {
    loadAll();
  }, []);

  // Cargar datos adicionales cuando se abre modal
  useEffect(() => {
    if (showModal) {
      if (creation.paso === 1) {
        creation.cargarPersonasDisponibles();
      }
      if (creation.paso === 2) {
        creation.cargarRoles();
      }
    }
  }, [showModal, creation.paso]);

  // ──────────────────────────────────────────────────────────
  // FUNCIONES DE CARGA
  // ──────────────────────────────────────────────────────────

  async function loadAll() {
    setLoading(true);
    const [estudRes, carRes, estRes] = await Promise.all([
      getEstudiantes(),
      getCarreras(),
      getEstadosEstudiante(),
    ]);

    if (estudRes.success) setEstudiantes(estudRes.estudiantes || []);
    if (carRes.success) setCarreras(carRes.carreras || []);
    if (estRes.success) setEstados(estRes.estados || []);
    setLoading(false);
  }

  // ──────────────────────────────────────────────────────────
  // FLUJO DE CREACIÓN - 3 PASOS
  // ──────────────────────────────────────────────────────────

  // PASO 1: Crear o Seleccionar Persona
  async function handleStep1() {
    if (form.opcion === "nueva") {
      // Validar campos de persona
      if (!form.persona.primernombre || !form.persona.primerapellido) {
        showToast("Nombre y apellido son obligatorios", "error");
        return;
      }

      setSaving(true);
      const result = await creation.procesarStep1({
        opcion: "nueva",
        persona: form.persona,
      });
      setSaving(false);

      if (!result) {
        showToast(creation.error || "Error al crear persona", "error");
      }
    } else {
      // Validar que persona está seleccionada
      if (!form.idpersona) {
        showToast("Debe seleccionar una persona", "error");
        return;
      }

      setSaving(true);
      const result = await creation.procesarStep1({
        opcion: "existente",
        idpersona: form.idpersona,
      });
      setSaving(false);

      if (!result) {
        showToast(creation.error || "Error al seleccionar persona", "error");
      }
    }
  }

  // PASO 2: Crear Usuario
  async function handleStep2() {
    // Validar campos de usuario
    if (!form.correo || !form.clave) {
      showToast("Correo y contraseña son obligatorios", "error");
      return;
    }

    if (form.clave !== form.confirmarClave) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    if (form.clave.length < 8) {
      showToast("La contraseña debe tener mínimo 8 caracteres", "error");
      return;
    }

    setSaving(true);
    const result = await creation.procesarStep2({
      correo: form.correo,
      clave: form.clave,
    });
    setSaving(false);

    if (!result) {
      showToast(creation.error || "Error al crear usuario", "error");
    }
  }

  // PASO 3: Crear Estudiante
  async function handleStep3() {
    // Validar campos de estudiante
    if (!form.expediente || !form.idcarrera) {
      showToast("Expediente y carrera son obligatorios", "error");
      return;
    }

    setSaving(true);
    const result = await creation.procesarStep3({
      expediente: form.expediente,
      idcarrera: form.idcarrera,
      fechaingreso: form.fechaingreso,
    });
    setSaving(false);

    if (result) {
      showToast("Estudiante creado correctamente", "success");
      setShowModal(false);
      resetForm();
      loadAll(); // Recargar lista
    } else {
      showToast(creation.error || "Error al crear estudiante", "error");
    }
  }

  // ──────────────────────────────────────────────────────────
  // FUNCIONES AUXILIARES
  // ──────────────────────────────────────────────────────────

  function abrirCrear() {
    setForm(FORM_EMPTY);
    creation.resetear();
    setShowModal(true);
  }

  function resetForm() {
    setForm(FORM_EMPTY);
    creation.resetear();
  }

  function cerrarModal() {
    setShowModal(false);
    resetForm();
  }

  const filtered = estudiantes.filter(
    (e) =>
      `${e.primernombre} ${e.primerapellido}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      e.expediente.toLowerCase().includes(search.toLowerCase()) ||
      (e.correo || "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleToggle(e: Estudiante) {
    if (
      !confirm(
        `¿${e.activo ? "Desactivar" : "Activar"} a ${e.primernombre} ${e.primerapellido}?`,
      )
    )
      return;
    const res = await toggleEstudiante(e.idestudiante);
    if (res.success) {
      showToast(res.message, "success");
      loadAll();
    } else {
      showToast("Error al cambiar estado", "error");
    }
  }

  // ──────────────────────────────────────────────────────────
  // RENDERIZADO
  // ──────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_USERS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Acceso Denegado
          </h2>
          <Link href="/dashboard" className="btn-ieproes">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Estudiantes
          </h1>
          <button
            onClick={abrirCrear}
            className="btn-ieproes bg-blue-600 hover:bg-blue-700"
          >
            + Nuevo Estudiante
          </button>
        </div>

        {/* BÚSQUEDA */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, expediente o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLA */}
        <div className="card-ieproes">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No hay estudiantes registrados
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-4">Nombre</th>
                    <th className="text-left p-4">Expediente</th>
                    <th className="text-left p-4">Correo</th>
                    <th className="text-left p-4">Carrera</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-left p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        {e.primernombre} {e.primerapellido}
                      </td>
                      <td className="p-4">{e.expediente}</td>
                      <td className="p-4">{e.correo}</td>
                      <td className="p-4">{e.carrera}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            e.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {e.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleToggle(e)}
                          className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          {e.activo ? "Desactivar" : "Activar"}
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

      {/* MODAL DE CREACIÓN - FLUJO 3 PASOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96 max-h-96 overflow-y-auto">
            {/* PASO 1: PERSONA */}
            {creation.paso === 1 && (
              <div>
                <h3 className="text-lg font-bold mb-4">Paso 1 de 3: Persona</h3>

                <div className="mb-4">
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={form.opcion === "nueva"}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, opcion: "nueva" }))
                      }
                      className="mr-2"
                    />
                    <span>Crear nueva persona</span>
                  </label>
                </div>

                {form.opcion === "nueva" && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <input
                      type="text"
                      placeholder="Primer nombre *"
                      value={form.persona.primernombre}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            primernombre: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Segundo nombre"
                      value={form.persona.segundonombre}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            segundonombre: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Primer apellido *"
                      value={form.persona.primerapellido}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            primerapellido: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Segundo apellido"
                      value={form.persona.segundoapellido}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            segundoapellido: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="DUI"
                      value={form.persona.dui}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: { ...prev.persona, dui: e.target.value },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={form.persona.telefono}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            telefono: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={form.persona.direccion}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          persona: {
                            ...prev.persona,
                            direccion: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={form.opcion === "existente"}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, opcion: "existente" }))
                      }
                      className="mr-2"
                    />
                    <span>Seleccionar persona existente</span>
                  </label>
                </div>

                {form.opcion === "existente" && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <select
                      value={form.idpersona}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          idpersona: parseInt(e.target.value),
                        }))
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value={0}>-- Seleccionar persona --</option>
                      {creation.personasDisponibles.map((p) => (
                        <option key={p.idpersona} value={p.idpersona}>
                          {p.nombre_completo}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {creation.error && (
                  <p className="text-red-600 text-sm mb-4">{creation.error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => cerrarModal()}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleStep1}
                    disabled={creation.loading || saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "..." : "Siguiente"}
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: USUARIO */}
            {creation.paso === 2 && (
              <div>
                <h3 className="text-lg font-bold mb-4">Paso 2 de 3: Usuario</h3>

                <input
                  type="email"
                  placeholder="Correo *"
                  value={form.correo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, correo: e.target.value }))
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="Contraseña *"
                  value={form.clave}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, clave: e.target.value }))
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña *"
                  value={form.confirmarClave}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmarClave: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded mb-4"
                />

                {creation.error && (
                  <p className="text-red-600 text-sm mb-4">{creation.error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => creation.irAlPaso(1)}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleStep2}
                    disabled={creation.loading || saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "..." : "Siguiente"}
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: ESTUDIANTE */}
            {creation.paso === 3 && (
              <div>
                <h3 className="text-lg font-bold mb-4">
                  Paso 3 de 3: Datos Académicos
                </h3>

                <input
                  type="text"
                  placeholder="Expediente *"
                  value={form.expediente}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, expediente: e.target.value }))
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <select
                  value={form.idcarrera}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      idcarrera: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value={0}>-- Seleccionar carrera --</option>
                  {carreras.map((c) => (
                    <option key={c.idcarrera} value={c.idcarrera}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={form.fechaingreso}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fechaingreso: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded mb-4"
                />

                {creation.error && (
                  <p className="text-red-600 text-sm mb-4">{creation.error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => creation.irAlPaso(2)}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleStep3}
                    disabled={creation.loading || saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? "..." : "Crear"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST DE NOTIFICACIONES */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
