"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { isDocente, isAdmin } from "@/utils/permissions";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import {
  getMateriasCatedratico,
  getEstudiantesGrupoCatedratico,
  getPermisosCatedratico,
  ingresarNotasCatedratico,
} from "@/services/catedratico.service";
import { getMaterias, getEstudiantesPorGrupo, guardarNotas } from "@/services/materias.service";

interface MateriaDoc {
  idmateria: number; codigomateria: string; nombremateria: string;
  idgrupo: number; numerogrupo: number; ciclo: string;
}
interface Estudiante {
  idestudiante: number; expediente: string; nombre: string; apellidos: string;
  nota1: number | null; nota2: number | null; nota3: number | null; notafinal: number | null;
  idinscripcion?: number;
  parcial1?: number; parcial2?: number; parcial3?: number; parcial4?: number; parcial5?: number;
}
interface Permisos {
  puedeeditarnota1: boolean; puedeeditarnota2: boolean; puedeeditarnota3: boolean;
  editadonota1: boolean; editadonota2: boolean; editadonota3: boolean;
}

export default function AcademicaPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [materias, setMaterias]         = useState<MateriaDoc[]>([]);
  const [selectedGrupo, setSelectedGrupo] = useState<MateriaDoc | null>(null);
  const [estudiantes, setEstudiantes]   = useState<Estudiante[]>([]);
  const [permisos, setPermisos]         = useState<Permisos | null>(null);
  const [notas, setNotas]               = useState<Record<number, { n1: string; n2: string; n3: string }>>({});
  const [loadingMat, setLoadingMat]     = useState(true);
  const [loadingEst, setLoadingEst]     = useState(false);
  const [saving, setSaving]             = useState<number | null>(null);
  const [savingAll, setSavingAll]       = useState(false);

  const esDocente = isDocente(user?.rol);
  const esAdmin   = isAdmin(user?.rol);

  // Cargar materias según rol
  useEffect(() => {
    if (!user?.idUsuario) return;
    async function load() {
      setLoadingMat(true);
      if (esDocente) {
        // Buscar iddocente del usuario — el backend de catedrático usa iddocente, no idusuario
        // Usamos el endpoint de grupos que ya filtra por idusuario/rol
        const r = await getMaterias(user!.idUsuario, user!.rol);
        if (r.success) {
          // Mapear al formato MateriaDoc
          setMaterias(r.materias.map((m: any) => ({
            idmateria: m.idmateria,
            codigomateria: m.codigomateria,
            nombremateria: m.nombre,
            idgrupo: m.idgrupo,
            numerogrupo: m.idgrupo,
            ciclo: m.ciclo,
          })));
        }
      } else {
        const r = await getMaterias(user!.idUsuario, user!.rol);
        if (r.success) {
          setMaterias(r.materias.map((m: any) => ({
            idmateria: m.idmateria,
            codigomateria: m.codigomateria,
            nombremateria: m.nombre,
            idgrupo: m.idgrupo,
            numerogrupo: m.idgrupo,
            ciclo: m.ciclo,
          })));
        }
      }
      setLoadingMat(false);
    }
    load();
  }, [user]);

  async function seleccionarGrupo(m: MateriaDoc) {
    setSelectedGrupo(m);
    setEstudiantes([]);
    setNotas({});
    setPermisos(null);
    setLoadingEst(true);

    if (esDocente) {
      // Usar endpoint de catedrático que incluye notas y permisos
      const [eRes, pRes] = await Promise.all([
        getEstudiantesGrupoCatedratico(m.idgrupo),
        // Para permisos necesitamos iddocente — lo obtenemos del primer estudiante o usamos idusuario como fallback
        getPermisosCatedratico(user!.idUsuario, m.idgrupo),
      ]);
      if (eRes.success) {
        setEstudiantes(eRes.estudiantes);
        const init: Record<number, { n1: string; n2: string; n3: string }> = {};
        eRes.estudiantes.forEach((e: Estudiante) => {
          init[e.idestudiante] = {
            n1: e.nota1?.toString() ?? "",
            n2: e.nota2?.toString() ?? "",
            n3: e.nota3?.toString() ?? "",
          };
        });
        setNotas(init);
      }
      if (pRes.success) setPermisos(pRes.permisos);
    } else {
      // Admin: usar endpoint genérico con 5 parciales
      const eRes = await getEstudiantesPorGrupo(m.idgrupo);
      if (eRes.success) {
        setEstudiantes(eRes.estudiantes);
        const init: Record<number, { n1: string; n2: string; n3: string }> = {};
        eRes.estudiantes.forEach((e: any) => {
          init[e.idestudiante] = {
            n1: (e.parcial1 ?? e.nota1 ?? "").toString(),
            n2: (e.parcial2 ?? e.nota2 ?? "").toString(),
            n3: (e.parcial3 ?? e.nota3 ?? "").toString(),
          };
        });
        setNotas(init);
      }
    }
    setLoadingEst(false);
  }

  function validarNota(val: string): boolean {
    if (val === "") return true;
    const n = parseFloat(val);
    return !isNaN(n) && n >= 0 && n <= 10;
  }

  async function handleGuardarEstudiante(e: Estudiante) {
    if (!selectedGrupo) return;
    const n = notas[e.idestudiante];
    if (!n) return;

    if (!validarNota(n.n1) || !validarNota(n.n2) || !validarNota(n.n3)) {
      showToast("Las notas deben estar entre 0 y 10", "error"); return;
    }

    setSaving(e.idestudiante);

    if (esDocente) {
      const res = await ingresarNotasCatedratico({
        idInscripcion: e.idinscripcion ?? e.idestudiante,
        nota1: n.n1 !== "" ? parseFloat(n.n1) : null,
        nota2: n.n2 !== "" ? parseFloat(n.n2) : null,
        nota3: n.n3 !== "" ? parseFloat(n.n3) : null,
        idCatedratico: user!.idUsuario,
        idGrupo: selectedGrupo.idgrupo,
        esAdmin: false,
      });
      if (res.success) { showToast("Notas guardadas", "success"); seleccionarGrupo(selectedGrupo); }
      else showToast(res.message || "Error al guardar", "error");
    } else {
      // Admin usa endpoint genérico de 5 parciales
      const res = await guardarNotas({
        idinscripcion: e.idinscripcion ?? e.idestudiante,
        primero: n.n1 !== "" ? parseFloat(n.n1) : 0,
        segundo: n.n2 !== "" ? parseFloat(n.n2) : 0,
        tercero: n.n3 !== "" ? parseFloat(n.n3) : 0,
        cuarto: 0, quinto: 0,
      });
      if (res.success) { showToast("Notas guardadas", "success"); seleccionarGrupo(selectedGrupo); }
      else showToast(res.message || "Error al guardar", "error");
    }
    setSaving(null);
  }

  async function handleGuardarTodo() {
    if (!selectedGrupo || estudiantes.length === 0) return;
    if (!confirm(`¿Guardar notas de todos los ${estudiantes.length} estudiantes?`)) return;
    setSavingAll(true);
    let ok = 0; let err = 0;
    for (const e of estudiantes) {
      const n = notas[e.idestudiante];
      if (!n) continue;
      let res;
      if (esDocente) {
        res = await ingresarNotasCatedratico({
          idInscripcion: e.idinscripcion ?? e.idestudiante,
          nota1: n.n1 !== "" ? parseFloat(n.n1) : null,
          nota2: n.n2 !== "" ? parseFloat(n.n2) : null,
          nota3: n.n3 !== "" ? parseFloat(n.n3) : null,
          idCatedratico: user!.idUsuario,
          idGrupo: selectedGrupo.idgrupo,
          esAdmin: false,
        });
      } else {
        res = await guardarNotas({
          idinscripcion: e.idinscripcion ?? e.idestudiante,
          primero: n.n1 !== "" ? parseFloat(n.n1) : 0,
          segundo: n.n2 !== "" ? parseFloat(n.n2) : 0,
          tercero: n.n3 !== "" ? parseFloat(n.n3) : 0,
          cuarto: 0, quinto: 0,
        });
      }
      if (res.success) ok++; else err++;
    }
    setSavingAll(false);
    if (err === 0) { showToast(`${ok} notas guardadas`, "success"); seleccionarGrupo(selectedGrupo); }
    else showToast(`${ok} guardadas, ${err} con error`, "error");
  }

  // Determinar si un parcial está habilitado para edición
  function parcialHabilitado(parcial: 1 | 2 | 3): boolean {
    if (esAdmin) return true;
    if (!permisos) return false;
    const map = {
      1: permisos.puedeeditarnota1 && !permisos.editadonota1,
      2: permisos.puedeeditarnota2 && !permisos.editadonota2,
      3: permisos.puedeeditarnota3 && !permisos.editadonota3,
    };
    return map[parcial];
  }

  function calcPromedio(e: Estudiante, n: { n1: string; n2: string; n3: string }): string {
    const vals = [n.n1, n.n2, n.n3].filter(v => v !== "").map(parseFloat).filter(v => !isNaN(v));
    if (vals.length === 0) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  }

  if (authLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!esDocente && !esAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <Link href="/dashboard" className="btn-ieproes">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b-2 border-blue-400 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {esDocente ? "👨🏫 Mis Materias y Notas" : "📚 Gestión Académica"}
            </h1>
            <p className="text-sm text-gray-500">
              {esDocente ? "Ingresa notas según los permisos habilitados por el administrador" : "Vista académica completa"}
            </p>
          </div>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8 flex gap-6">
          {/* Panel izquierdo: lista de materias */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 text-sm">
                  {esDocente ? "Mis Grupos Asignados" : "Todos los Grupos"}
                </h3>
              </div>
              {loadingMat ? (
                <div className="p-6 text-center text-gray-400 text-sm">Cargando...</div>
              ) : materias.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  {esDocente ? "No tienes grupos asignados en el período activo" : "No hay grupos disponibles"}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {materias.map(m => (
                    <li key={m.idgrupo}>
                      <button
                        onClick={() => seleccionarGrupo(m)}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                          selectedGrupo?.idgrupo === m.idgrupo ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="text-xs font-semibold text-blue-600">{m.codigomateria}</div>
                        <div className="text-sm font-medium text-gray-800 leading-tight mt-0.5">{m.nombremateria}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{m.ciclo}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Panel derecho: estudiantes y notas */}
          <div className="flex-1">
            {!selectedGrupo ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="text-lg font-medium">Selecciona una materia</p>
                  <p className="text-sm mt-1">para ver los estudiantes y gestionar notas</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Header del grupo */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{selectedGrupo.nombremateria}</h2>
                    <p className="text-sm text-gray-500">{selectedGrupo.codigomateria} · {selectedGrupo.ciclo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Indicadores de permisos para docente */}
                    {esDocente && permisos && (
                      <div className="flex gap-2">
                        {([1, 2, 3] as const).map(p => {
                          const hab = parcialHabilitado(p);
                          const editado = [permisos.editadonota1, permisos.editadonota2, permisos.editadonota3][p - 1];
                          const puede = [permisos.puedeeditarnota1, permisos.puedeeditarnota2, permisos.puedeeditarnota3][p - 1];
                          return (
                            <span key={p} className={`text-xs px-2 py-1 rounded font-semibold ${
                              !puede ? "bg-gray-100 text-gray-400" :
                              editado ? "bg-gray-100 text-gray-500" :
                              "bg-green-100 text-green-700"
                            }`}>
                              P{p}: {!puede ? "Bloqueado" : editado ? "Editado" : "Habilitado"}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {esAdmin && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                        Admin — acceso total
                      </span>
                    )}
                    {estudiantes.length > 0 && (
                      <button onClick={handleGuardarTodo} disabled={savingAll} className="btn-ieproes text-xs py-1.5 px-4">
                        {savingAll ? "⏳ Guardando..." : "💾 Guardar Todo"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabla de notas */}
                {loadingEst ? (
                  <div className="p-10 text-center text-gray-400">Cargando estudiantes...</div>
                ) : estudiantes.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">No hay estudiantes inscritos en este grupo</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expediente</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                          {[1, 2, 3].map(p => (
                            <th key={p} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                              Parcial {p}
                              {esDocente && permisos && (
                                <span className={`ml-1 ${parcialHabilitado(p as 1|2|3) ? "text-green-500" : "text-gray-300"}`}>
                                  {parcialHabilitado(p as 1|2|3) ? "✓" : "🔒"}
                                </span>
                              )}
                            </th>
                          ))}
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {estudiantes.map(e => {
                          const n = notas[e.idestudiante] ?? { n1: "", n2: "", n3: "" };
                          const prom = calcPromedio(e, n);
                          const promNum = parseFloat(prom);
                          return (
                            <tr key={e.idestudiante} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-mono text-gray-600 text-xs">{e.expediente}</td>
                              <td className="px-4 py-3 font-medium text-gray-800">{e.nombre} {e.apellidos}</td>
                              {([1, 2, 3] as const).map(p => {
                                const field = `n${p}` as "n1" | "n2" | "n3";
                                const habilitado = parcialHabilitado(p);
                                return (
                                  <td key={p} className="px-3 py-3 text-center">
                                    <input
                                      type="number" min="0" max="10" step="0.01"
                                      disabled={!habilitado}
                                      className={`w-16 text-center border rounded px-1 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                        habilitado
                                          ? "border-gray-300 bg-white"
                                          : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                      }`}
                                      value={n[field]}
                                      placeholder="—"
                                      onChange={ev => {
                                        const val = ev.target.value;
                                        setNotas(prev => ({
                                          ...prev,
                                          [e.idestudiante]: { ...prev[e.idestudiante], [field]: val },
                                        }));
                                      }}
                                    />
                                  </td>
                                );
                              })}
                              <td className="px-3 py-3 text-center">
                                <span className={`font-bold ${!isNaN(promNum) ? (promNum >= 6 ? "text-green-600" : "text-red-500") : "text-gray-400"}`}>
                                  {prom}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => handleGuardarEstudiante(e)}
                                  disabled={saving === e.idestudiante || (!esAdmin && !permisos)}
                                  className="btn-ieproes text-xs py-1 px-3"
                                >
                                  {saving === e.idestudiante ? "⏳" : "💾"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Aviso para docente sin permisos */}
                {esDocente && permisos && !parcialHabilitado(1) && !parcialHabilitado(2) && !parcialHabilitado(3) && (
                  <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200 text-sm text-yellow-800">
                    ⚠️ No tienes permisos habilitados para editar notas en este grupo. Contacta al administrador.
                  </div>
                )}
                {esDocente && !permisos && !loadingEst && estudiantes.length > 0 && (
                  <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200 text-sm text-yellow-800">
                    ⚠️ No hay permisos configurados para este grupo. El administrador debe habilitarlos desde Permisos de Notas.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
