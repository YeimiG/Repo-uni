"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";

interface StudentGrade {
  carnet: string;
  nombre: string;
  parcial1: number;
  lab1: number;
  parcial2: number;
  lab2: number;
  examenFinal: number;
}

interface Materia {
  id: string;
  nombre: string;
  codigo: string;
  grupo: string;
  horario: string;
  inscritos: number;
}

export default function GradesPage() {
  const { user } = useAuth();
  const [selectedMateria, setSelectedMateria] = useState("");
  
  // Materias según el rol
  const materiasAdmin: Materia[] = [
    { id: "1", nombre: "Matemáticas I", codigo: "MAT101", grupo: "A", horario: "Lun-Mie 8:00-10:00", inscritos: 35 },
    { id: "2", nombre: "Física General", codigo: "FIS201", grupo: "B", horario: "Mar-Jue 10:00-12:00", inscritos: 28 },
    { id: "3", nombre: "Química Básica", codigo: "QUI101", grupo: "A", horario: "Vie 14:00-18:00", inscritos: 42 },
  ];
  
  const materiasCatedratico: Materia[] = [
    { id: "1", nombre: "Matemáticas I", codigo: "MAT101", grupo: "A", horario: "Lun-Mie 8:00-10:00", inscritos: 35 },
  ];
  
  const materias = isAdmin(user?.rol) ? materiasAdmin : materiasCatedratico;
  
  const [students, setStudents] = useState<StudentGrade[]>([
    { carnet: "AA26I00", nombre: "Juan Pérez", parcial1: 0, lab1: 0, parcial2: 0, lab2: 0, examenFinal: 0 },
    { carnet: "GC26I00", nombre: "María García", parcial1: 0, lab1: 0, parcial2: 0, lab2: 0, examenFinal: 0 },
    { carnet: "GM26I00", nombre: "Carlos López", parcial1: 0, lab1: 0, parcial2: 0, lab2: 0, examenFinal: 0 },
  ]);

  const calcularNotaGlobal = (student: StudentGrade): string => {
    const promedioParciales = (student.parcial1 + student.lab1 + student.parcial2 + student.lab2) / 4;
    const notaGlobal = (promedioParciales * 0.6) + (student.examenFinal * 0.4);
    return notaGlobal.toFixed(2);
  };

  const handleGradeChange = (index: number, field: keyof StudentGrade, value: string) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: parseFloat(value) || 0 };
    setStudents(newStudents);
  };

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
              <select className="input-ieproes" value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)}>
                <option value="">Seleccionar materia...</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.codigo} - {materia.nombre} (Grupo {materia.grupo})
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
              <button className="btn-ieproes w-full">🔍 Buscar</button>
            </div>
          </div>
          
          {selectedMateria && (
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
              {materias.filter(m => m.id === selectedMateria).map(materia => (
                <div key={materia.id} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">Código:</span>
                    <p className="text-gray-900">{materia.codigo}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Grupo:</span>
                    <p className="text-gray-900">{materia.grupo}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Horario:</span>
                    <p className="text-gray-900">{materia.horario}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Inscritos:</span>
                    <p className="text-gray-900">{materia.inscritos} estudiantes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMateria && (
          <div className="card-ieproes">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Estudiantes Inscritos - {materias.find(m => m.id === selectedMateria)?.nombre}
              </h3>
              <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded">
                <span className="font-semibold">📊 Ponderación:</span> Parciales + Labs (60%) | Examen Final (40%)
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase" rowSpan={2}>Carnet</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase" rowSpan={2}>Estudiante</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-gray-300" colSpan={4}>60% de la Nota</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-gray-300" rowSpan={2}>Examen Final<br/>(40%)</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-gray-300" rowSpan={2}>Nota Global</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase" rowSpan={2}>Acciones</th>
                  </tr>
                  <tr>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase border-l border-gray-300">Parcial 1</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Lab 1</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Parcial 2</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Lab 2</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student.carnet} className="hover:bg-gray-50">
                      <td className="px-3 py-4 text-sm font-medium">{student.carnet}</td>
                      <td className="px-3 py-4 text-sm">{student.nombre}</td>
                      <td className="px-3 py-4 text-center border-l border-gray-200">
                        <input 
                          type="number" 
                          className="input-ieproes w-16 text-center" 
                          placeholder="0-10" 
                          step="0.1" 
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
                          step="0.1" 
                          min="0" 
                          max="10"
                          value={student.lab1 || ''}
                          onChange={(e) => handleGradeChange(index, 'lab1', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <input 
                          type="number" 
                          className="input-ieproes w-16 text-center" 
                          placeholder="0-10" 
                          step="0.1" 
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
                          step="0.1" 
                          min="0" 
                          max="10"
                          value={student.lab2 || ''}
                          onChange={(e) => handleGradeChange(index, 'lab2', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-4 text-center border-l border-gray-200">
                        <input 
                          type="number" 
                          className="input-ieproes w-16 text-center" 
                          placeholder="0-10" 
                          step="0.1" 
                          min="0" 
                          max="10"
                          value={student.examenFinal || ''}
                          onChange={(e) => handleGradeChange(index, 'examenFinal', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-4 text-center border-l border-gray-200">
                        <span className="text-lg font-bold text-ieproes-primary">
                          {calcularNotaGlobal(student)}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button className="btn-ieproes text-sm px-4">💾 Guardar</button>
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
                <li>• Promedio Parciales y Labs = (Parcial 1 + Lab 1 + Parcial 2 + Lab 2) / 4</li>
                <li>• Nota Global = (Promedio Parciales y Labs × 0.60) + (Examen Final × 0.40)</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
