/* materias ieproes */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";
import { getMaterias, getEstudiantesPorGrupo } from "@/services/materias.service";
import { getDocentes, asignarDocente, moverEstudiante, getGruposDisponibles } from "@/services/admin.service";

interface Materia {
  idgrupo: number;
  idmateria: number;
  codigomateria: string;
  nombre: string;
  creditos: number;
  docente: string;
  cupomaximo: number;
  inscritos: number;
  ciclo: string;
}

interface Docente {
  iddocente: number;
  nombre: string;
  especialidad: string;
  grupos_asignados: number;
}

interface Estudiante {
  idestudiante: number;
  carnet: string;
  nombre: string;
  idinscripcion: number;
}

interface GrupoDisponible {
  idgrupo: number;
  cupomaximo: number;
  inscritos: number;
  ciclo: string;
  docente: string;
}

export default function SubjectsPage() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDocenteModal, setShowDocenteModal] = useState(false);
  const [showMoverModal, setShowMoverModal] = useState(false);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [gruposDisponibles, setGruposDisponibles] = useState<GrupoDisponible[]>([]);
  const [selectedDocente, setSelectedDocente] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [selectedGrupoDestino, setSelectedGrupoDestino] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterias = materias.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigomateria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.docente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function loadMaterias() {
      if (!user?.idUsuario) return;
      setLoading(true);
      const response = await getMaterias(user.idUsuario, user.rol);
      if (response.success) {
        setMaterias(response.materias);
      }
      setLoading(false);
    }
    loadMaterias();
  }, [user]);

  async function handleAsignarDocente() {
    if (!selectedMateria || !selectedDocente) return;
    const response = await asignarDocente(selectedMateria.idgrupo, parseInt(selectedDocente));
    if (response.success) {
      alert('✅ Docente asignado correctamente');
      setShowDocenteModal(false);
      if (user?.idUsuario) {
        const res = await getMaterias(user.idUsuario, user.rol);
        if (res.success) setMaterias(res.materias);
      }
    } else {
      alert('❌ Error al asignar docente');
    }
  }

  async function handleMoverEstudiante() {
    if (!selectedEstudiante || !selectedGrupoDestino) return;
    const response = await moverEstudiante(selectedEstudiante.idinscripcion, parseInt(selectedGrupoDestino));
    if (response.success) {
      alert('✅ Estudiante movido correctamente');
      setShowMoverModal(false);
      setSelectedEstudiante(null);
    } else {
      alert('❌ ' + response.message);
    }
  }

  async function openDocenteModal(materia: Materia) {
    setSelectedMateria(materia);
    const response = await getDocentes();
    if (response.success) {
      setDocentes(response.docentes);
    }
    setShowDocenteModal(true);
  }

  async function openMoverModal(materia: Materia) {
    setSelectedMateria(materia);
    const [estudiantesRes, gruposRes] = await Promise.all([
      getEstudiantesPorGrupo(materia.idgrupo),
      getGruposDisponibles(materia.idmateria)
    ]);
    if (estudiantesRes.success) {
      setEstudiantes(estudiantesRes.estudiantes);
    }
    if (gruposRes.success) {
      setGruposDisponibles(gruposRes.grupos);
    }
    setShowMoverModal(true);
  }

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
            <div className="text-2xl font-bold text-ieproes-dark">{loading ? '...' : materias.length}</div>
            <div className="text-sm text-gray-600">{isAdmin(user?.rol) ? 'Total Grupos' : 'Mis Grupos'}</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-success">{loading ? '...' : materias.length}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-warning">0</div>
            <div className="text-sm text-gray-600">En Pausa</div>
          </div>
          <div className="card-ieproes text-center">
            <div className="text-2xl font-bold text-info">{loading ? '...' : materias.reduce((sum, m) => sum + parseInt(m.inscritos.toString()), 0)}</div>
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
            <input 
              type="search" 
              placeholder="Buscar materias..." 
              className="input-ieproes max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* grid materias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Cargando materias...</div>
          ) : filteredMaterias.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? 'No se encontraron materias' : 'No hay materias asignadas'}
            </div>
          ) : (
            filteredMaterias.map((materia) => (
              <div key={materia.idgrupo} className="card-ieproes hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-ieproes-primary rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <span className="badge-info">{materia.codigomateria}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{materia.nombre}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Créditos:</span>
                    <span className="font-medium">{materia.creditos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ciclo:</span>
                    <span className="font-medium">{materia.ciclo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catedrático:</span>
                    <span className="font-medium text-xs">{materia.docente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inscritos:</span>
                    <span className="font-medium">{materia.inscritos} / {materia.cupomaximo}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { setSelectedMateria(materia); setShowModal(true); }}
                    className="btn-ieproes flex-1 text-sm"
                  >
                    Ver Detalles
                  </button>
                  {isAdmin(user?.rol) && (
                    <>
                      <button 
                        onClick={() => openDocenteModal(materia)}
                        className="btn-secondary text-sm px-2"
                        title="Asignar docente"
                      >
                        👨🏫
                      </button>
                      <button 
                        onClick={() => openMoverModal(materia)}
                        className="btn-secondary text-sm px-2"
                        title="Mover estudiantes"
                      >
                        🔄
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de detalles */}
        {showModal && selectedMateria && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-ieproes-dark">{selectedMateria.nombre}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Código</p>
                  <p className="text-lg font-semibold">{selectedMateria.codigomateria}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Créditos</p>
                  <p className="text-lg font-semibold">{selectedMateria.creditos} UV</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Ciclo Académico</p>
                  <p className="text-lg font-semibold">{selectedMateria.ciclo}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Inscritos</p>
                  <p className="text-lg font-semibold">{selectedMateria.inscritos} / {selectedMateria.cupomaximo}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Catedrático Asignado</p>
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="font-semibold text-ieproes-dark">{selectedMateria.docente}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link href={`/grades?grupo=${selectedMateria.idgrupo}`} className="flex-1">
                  <button className="btn-ieproes w-full">📝 Gestionar Notas</button>
                </Link>
                {isAdmin(user?.rol) && (
                  <>
                    <button onClick={() => { setShowModal(false); openDocenteModal(selectedMateria); }} className="btn-secondary">👨🏫 Asignar Docente</button>
                    <button onClick={() => { setShowModal(false); openMoverModal(selectedMateria); }} className="btn-secondary">🔄 Mover Estudiantes</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal asignar docente */}
        {showDocenteModal && selectedMateria && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDocenteModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">👨🏫 Asignar Docente</h2>
              <p className="text-sm text-gray-600 mb-4">Materia: {selectedMateria.nombre}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Docente</label>
                <select 
                  className="input-ieproes"
                  value={selectedDocente}
                  onChange={(e) => setSelectedDocente(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {docentes.map(d => (
                    <option key={d.iddocente} value={d.iddocente}>
                      {d.nombre} - {d.especialidad} ({d.grupos_asignados} grupos)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button onClick={handleAsignarDocente} disabled={!selectedDocente} className="btn-ieproes flex-1">Asignar</button>
                <button onClick={() => setShowDocenteModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal mover estudiantes */}
        {showMoverModal && selectedMateria && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMoverModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">🔄 Mover Estudiante de Grupo</h2>
              <p className="text-sm text-gray-600 mb-4">Materia: {selectedMateria.nombre}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante</label>
                  <select 
                    className="input-ieproes"
                    value={selectedEstudiante?.idestudiante || ""}
                    onChange={(e) => {
                      const est = estudiantes.find(s => s.idestudiante === parseInt(e.target.value));
                      setSelectedEstudiante(est || null);
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {estudiantes.map(e => (
                      <option key={e.idestudiante} value={e.idestudiante}>
                        {e.carnet} - {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Destino</label>
                  <select 
                    className="input-ieproes"
                    value={selectedGrupoDestino}
                    onChange={(e) => setSelectedGrupoDestino(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {gruposDisponibles.map(g => (
                      <option key={g.idgrupo} value={g.idgrupo}>
                        {g.ciclo} - {g.docente} ({g.inscritos}/{g.cupomaximo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={handleMoverEstudiante} disabled={!selectedEstudiante || !selectedGrupoDestino} className="btn-ieproes flex-1">Mover</button>
                <button onClick={() => setShowMoverModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}