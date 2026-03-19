"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";
import { getMaterias, getEstudiantesPorGrupo, guardarNotas } from "@/services/materias.service";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface StudentGrade {
  idestudiante: number;
  carnet: string;
  nombre: string;
  parcial1: number;
  parcial2: number;
  parcial3: number;
  parcial4: number;
  parcial5: number;
  notafinal: number;
  idinscripcion?: number;
}

interface Materia { idgrupo: number; nombre: string; codigomateria: string; }

export default function GradesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { toast, showToast, hideToast } = useToast();

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedGrupo, setSelectedGrupo] = useState(searchParams?.get("grupo") || "");
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.idUsuario) return;
    getMaterias(user.idUsuario, user.rol).then((r) => { if (r.success) setMaterias(r.materias); });
  }, [user]);

  useEffect(() => { if (selectedGrupo) loadEstudiantes(); }, [selectedGrupo]);

  async function loadEstudiantes() {
    setLoading(true);
    const r = await getEstudiantesPorGrupo(parseInt(selectedGrupo));
    if (r.success) setStudents(r.estudiantes.map((e: any) => ({
      ...e,
      parcial1: e.parcial1 ?? 0,
      parcial2: e.parcial2 ?? 0,
      parcial3: e.parcial3 ?? 0,
      parcial4: e.parcial4 ?? 0,
      parcial5: e.parcial5 ?? 0,
    })));
    setLoading(false);
  }

  const calcNota = (s: StudentGrade) => {
    const vals = [s.parcial1, s.parcial2, s.parcial3, s.parcial4, s.parcial5].filter(v => v > 0);
    if (vals.length === 0) return "0.00";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };

  const handleChange = (idx: number, field: keyof StudentGrade, val: string) => {
    const n = parseFloat(val);
    if (val && (isNaN(n) || n < 0 || n > 10)) return;
    setStudents(prev => prev.map((s, i) => i === idx ? { ...s, [field]: n || 0 } : s));
  };

  async function handleSave(student: StudentGrade, idx: number) {
    if (!confirm(`¿Guardar notas de ${student.nombre}?`)) return;
    setSaving(idx);
    const r = await guardarNotas({
      idinscripcion: student.idinscripcion,
      primero: student.parcial1,
      segundo: student.parcial2,
      tercero: student.parcial3,
      cuarto: student.parcial4,
      quinto: student.parcial5,
    });
    if (r.success) { showToast("Notas guardadas", "success"); loadEstudiantes(); }
    else showToast(r.message || "Error al guardar", "error");
    setSaving(null);
  }

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_GRADES)) {
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
          <h1 className="text-2xl font-bold text-gray-800">📝 Gestión de Notas</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          {!isAdmin(user?.rol) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              👨🏫 Solo ves y gestionas las materias que te han sido asignadas.
            </div>
          )}

          {/* selector de grupo */}
          <div className="card-ieproes mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia / Grupo</label>
                <select className="input-ieproes" value={selectedGrupo} onChange={(e) => setSelectedGrupo(e.target.value)}>
                  <option value="">Seleccionar materia...</option>
                  {materias.map((m) => (
                    <option key={m.idgrupo} value={m.idgrupo}>{m.codigomateria} - {m.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={loadEstudiantes} disabled={!selectedGrupo} className="btn-ieproes w-full py-2">
                  🔍 Cargar Estudiantes
                </button>
              </div>
            </div>
          </div>

          {/* tabla de notas */}
          {selectedGrupo && (
            <div className="card-ieproes">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {materias.find(m => m.idgrupo.toString() === selectedGrupo)?.nombre}
                </h3>
                <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded">
                  Escala: 0 – 10 | Aprobado ≥ 6
                </span>
              </div>

              {loading ? (
                <div className="text-center py-10 text-gray-400">Cargando estudiantes...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No hay estudiantes inscritos en este grupo</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carnet</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                        {["P1","P2","P3","P4","P5"].map(p => (
                          <th key={p} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">{p}</th>
                        ))}
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((s, idx) => {
                        const prom = parseFloat(calcNota(s));
                        return (
                          <tr key={s.idestudiante} className="hover:bg-gray-50">
                            <td className="px-3 py-3 font-medium text-gray-700">{s.carnet}</td>
                            <td className="px-3 py-3 text-gray-800">{s.nombre}</td>
                            {(["parcial1","parcial2","parcial3","parcial4","parcial5"] as (keyof StudentGrade)[]).map(field => (
                              <td key={field} className="px-2 py-3 text-center">
                                <input
                                  type="number" min="0" max="10" step="0.01"
                                  className="w-14 text-center border border-gray-300 rounded px-1 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                  value={(s[field] as number) || ""}
                                  placeholder="—"
                                  onChange={(e) => handleChange(idx, field, e.target.value)}
                                />
                              </td>
                            ))}
                            <td className="px-3 py-3 text-center">
                              <span className={`font-bold text-base ${prom >= 6 ? "text-green-600" : "text-red-500"}`}>
                                {calcNota(s)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <button
                                onClick={() => handleSave(s, idx)}
                                disabled={saving === idx}
                                className="btn-ieproes text-xs py-1 px-3"
                              >
                                {saving === idx ? "⏳" : "💾"} Guardar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
