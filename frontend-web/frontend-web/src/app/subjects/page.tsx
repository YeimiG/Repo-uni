/* materias ieproes */
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubjectsPage() {
  const [subjects] = useState([
    { id: 1, name: "Matemáticas I", code: "MAT101", credits: 4, teacher: "Dr. García", students: 45 },
    { id: 2, name: "Física General", code: "FIS201", credits: 5, teacher: "Dra. López", students: 38 },
    { id: 3, name: "Química Básica", code: "QUI101", credits: 4, teacher: "Dr. Martínez", students: 42 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-ieproes-dark">Gestión de Materias</h1>
            <Link href="/dashboard" className="btn-secondary">
              Volver Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-ieproes-dark">89</div>
            <div className="text-sm text-gray-600">Total Materias</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-success">76</div>
            <div className="text-sm text-gray-600">Activas</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-warning">13</div>
            <div className="text-sm text-gray-600">En Pausa</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-info">1,234</div>
            <div className="text-sm text-gray-600">Estudiantes</div>
          </div>
        </div>

        {/* acciones */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="btn-ieproes">
              Nueva Materia
            </button>
            <button className="btn-outline">
              Asignar Catedrático
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="input-ieproes max-w-xs">
              <option>Todos los semestres</option>
              <option>Semestre I</option>
              <option>Semestre II</option>
            </select>
            <input 
              type="search" 
              placeholder="Buscar materias..." 
              className="input-ieproes max-w-xs"
            />
          </div>
        </div>

        {/* grid materias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="card-ieproes hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-ieproes-primary rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <span className="badge-info">{subject.code}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Créditos:</span>
                  <span className="font-medium">{subject.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Catedrático:</span>
                  <span className="font-medium">{subject.teacher}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estudiantes:</span>
                  <span className="font-medium">{subject.students}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-ieproes flex-1 text-sm">
                  Ver Detalles
                </button>
                <button className="btn-secondary text-sm">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}