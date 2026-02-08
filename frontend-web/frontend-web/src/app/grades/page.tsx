"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";
import { getMaterias, getEstudiantesPorGrupo, guardarNotas } from "@/services/materias.service";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface StudentGrade {
  idestudiante: number;
  carnet: string;
  nombre: string;
  parcial1: number;
  parcial2: number;
  examenfinal: number;
  notafinal: number;
  idinscripcion?: number;
}

interface Materia {
  idgrupo: number;
  nombre: string;
  codigomateria: string;
}

export default function GradesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const grupoParam = searchParams?.get('grupo');
  const { toast, showToast, hideToast } = useToast();
  
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedGrupo, setSelectedGrupo] = useState(grupoParam || "");
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function loadMaterias() {
      if (!user?.idUsuario) return;
      const response = await getMaterias(user.idUsuario, user.rol);
      if (response.success) {
        setMaterias(response.materias);
      }
    }
    loadMaterias();
  }, [user]);

  useEffect(() => {
    if (selectedGrupo) {
      loadEstudiantes();
    }
  }, [selectedGrupo]);

  async function loadEstudiantes() {
    setLoading(true);
    const response = await getEstudiantesPorGrupo(parseInt(selectedGrupo));
    if (response.success) {
      setStudents(response.estudiantes);
    }
    setLoading(false);
  }

  const calcularNotaGlobal = (student: StudentGrade): string => {
    const promedioParciales = (student.parcial1 + student.parcial2) / 2;
    const notaGlobal = (promedioParciales * 0.6) + (student.examenfinal * 0.4);
    return notaGlobal.toFixed(2);
  };

  const handleGradeChange = (index: number, field: keyof StudentGrade, value: string) => {
    const numValue = parseFloat(value);
    
    // Validación: solo números entre 0 y 10 con máximo 2 decimales
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
      return;
    }
    
    // Validar máximo 2 decimales
    if (value.includes('.') && value.split('.')[1]?.length > 2) {
      return;
    }
    
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: numValue || 0 };
    setStudents(newStudents);
  };

  async function handleSaveGrade(student: StudentGrade, index: number) {
    // Validación antes de guardar
    if (student.parcial1 < 0 || student.parcial1 > 10 ||
        student.parcial2 < 0 || student.parcial2 > 10 ||
        student.examenfinal < 0 || student.examenfinal > 10) {
      showToast('Las notas deben estar entre 0 y 10', 'error');
      return;
    }
    
    if (!confirm(`¿Guardar notas de ${student.nombre}?`)) {
      return;
    }
    
    setSaving(index);
    const response = await guardarNotas({
      idinscripcion: student.idinscripcion,
      primero: student.parcial1,
      segundo: student.parcial2,
      tercero: student.examenfinal,
    });
    
    if (response.success) {
      showToast('Notas guardadas correctamente', 'success');
      await loadEstudiantes();
    } else {
      showToast('Error al guardar notas', 'error');
    }
    setSaving(null);
  }

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_GRADES)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para gestionar notas</p>
          <Link href="/dashboard" className="btn-ieproes">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-ieproes-dark">📝 Gestión de Notas</h1>
            <Link href="/dashboard" className="btn-secondary">
              Volver Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Info del usuario */}
        {!isAdmin(user?.rol) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">👨‍🏫 Catedrático:</span> Solo puedes ver y gestionar las materias que te han sido asignadas.
            </p>
          </div>
        )}
        
        <div className="card-ieproes mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materia Asignada</label>
              <select className="input-ieproes" value={selectedGrupo} onChange={(e) => setSelectedGrupo(e.target.value)}>
                <option value="">Seleccionar materia...</option>
                {materias.map((materia) => (
                  <option key={materia.idgrupo} value={materia.idgrupo}>
                    {materia.codigomateria} - {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
              <select className="input-ieproes">
                <option>Ciclo I - 2024</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={loadEstudiantes} className="btn-ieproes w-full" disabled={!selectedGrupo}>🔍 Buscar</button>
            </div>
          </div>
        </div>

        {selectedGrupo && (
          <div className="card-ieproes">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Estudiantes Inscritos - {materias.find(m => m.idgrupo.toString() === selectedGrupo)?.nombre}
              </h3>
              <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded">
                <span className="font-semibold">📊 Ponderación:</span> Parciales (60%) | Examen Final (40%)
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Cargando estudiantes...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay estudiantes inscritos</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carnet</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Parcial 1<br/>(30%)</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Parcial 2<br/>(30%)</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Examen Final<br/>(40%)</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nota Global</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={student.idestudiante} className="hover:bg-gray-50">
                          <td className="px-3 py-4 text-sm font-medium">{student.carnet}</td>
                          <td className="px-3 py-4 text-sm">{student.nombre}</td>
                          <td className="px-3 py-4 text-center">
                            <input 
                              type="number" 
                              className="input-ieproes w-16 text-center" 
                              placeholder="0-10" 
                              step="0.01" 
                              min="0" 
                              max="10"
                              value={student.parcial1 || ''}
                              onChange={(e) => handleGradeChange(index, 'parcial1', e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input 
                              type="number" 
                              className="input-ieproes w-16 text-center" 
                              placeholder="0-10" 
                              step="0.01" 
                              min="0" 
                              max="10"
                              value={student.parcial2 || ''}
                              onChange={(e) => handleGradeChange(index, 'parcial2', e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input 
                              type="number" 
                              className="input-ieproes w-16 text-center" 
                              placeholder="0-10" 
                              step="0.01" 
                              min="0" 
                              max="10"
                              value={student.examenfinal || ''}
                              onChange={(e) => handleGradeChange(index, 'examenfinal', e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <span className="text-lg font-bold text-ieproes-primary">
                              {calcularNotaGlobal(student)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-center">
                            <button 
                              onClick={() => handleSaveGrade(student, index)}
                              disabled={saving === index}
                              className="btn-ieproes text-sm px-4"
                            >
                              {saving === index ? '⏳' : '💾'} Guardar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">📌 Fórmula de cálculo:</span>
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Promedio Parciales = (Parcial 1 + Parcial 2) / 2</li>
                    <li>• Nota Global = (Promedio Parciales × 0.60) + (Examen Final × 0.40)</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </div>
  );
}
