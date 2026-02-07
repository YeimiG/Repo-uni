/* materias ieproes */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";

interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  teacher: string;
  students: number;
  grupo: string;
  horario: string;
}

export default function SubjectsPage() {
  const { user } = useAuth();
  
  // Materias completas para admin
  const allSubjects: Subject[] = [
    { id: 1, name: "Matemáticas I", code: "MAT101", credits: 4, teacher: "Dr. García", students: 45, grupo: "A", horario: "Lun-Mie 8:00-10:00" },
    { id: 2, name: "Física General", code: "FIS201", credits: 5, teacher: "Dra. López", students: 38, grupo: "B", horario: "Mar-Jue 10:00-12:00" },
    { id: 3, name: "Química Básica", code: "QUI101", credits: 4, teacher: "Dr. Martínez", students: 42, grupo: "A", horario: "Vie 14:00-18:00" },
  ];
  
  // Materias asignadas al catedrático (simulado - debería venir del backend)
  const mySubjects: Subject[] = [
    { id: 1, name: "Matemáticas I", code: "MAT101", credits: 4, teacher: user?.nombre || "Catedrático", students: 45, grupo: "A", horario: "Lun-Mie 8:00-10:00" },
  ];
  
  const subjects = isAdmin(user?.rol) ? allSubjects : mySubjects;

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card-ieproes text-center">
          <h2 className="text-xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para gestionar materias</p>
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
            <h1 className="text-2xl font-bold text-ieproes-dark">Gestión de Materias</h1>
            <Link href="/dashboard" className="btn-secondary">
              Volver Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Mensaje para catedráticos */}
        {!isAdmin(user?.rol) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">👨🏫 Mis Materias Asignadas:</span> Solo puedes ver y gestionar las materias que te han sido asignadas.
            </p>
          </div>
        )}
        
        {/* estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-ieproes-dark">{subjects.length}</div>
            <div className="text-sm text-gray-600">{isAdmin(user?.rol) ? 'Total Materias' : 'Mis Materias'}</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-success">{subjects.length}</div>
            <div className="text-sm text-gray-600">Activas</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-warning">0</div>
            <div className="text-sm text-gray-600">En Pausa</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-info">{subjects.reduce((sum, s) => sum + s.students, 0)}</div>
            <div className="text-sm text-gray-600">Estudiantes</div>
          </div>
        </div>

        {/* acciones */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            {isAdmin(user?.rol) && (
              <>
                <button className="btn-ieproes">Nueva Materia</button>
                <button className="btn-outline">Asignar Catedrático</button>
              </>
            )}
          </div>
          <div className="flex space-x-2">
            {isAdmin(user?.rol) && (
              <select className="input-ieproes max-w-xs">
                <option>Todos los semestres</option>
                <option>Semestre I</option>
                <option>Semestre II</option>
              </select>
            )}
            <input type="search" placeholder="Buscar materias..." className="input-ieproes max-w-xs" />
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
                  <span>Grupo:</span>
                  <span className="font-medium">{subject.grupo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horario:</span>
                  <span className="font-medium text-xs">{subject.horario}</span>
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
                {isAdmin(user?.rol) && (
                  <button className="btn-secondary text-sm">
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}