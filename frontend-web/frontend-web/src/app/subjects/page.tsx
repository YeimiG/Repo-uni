"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS, isAdmin } from "@/utils/permissions";
import { getMaterias, getEstudiantesPorGrupo } from "@/services/materias.service";
import { getDocentes, asignarDocente, moverEstudiante, getGruposDisponibles } from "@/services/admin.service";
import { crearMateria, crearGrupo, getMateriasList } from "@/services/reportes.service";
import { getPeriodos } from "@/services/academico.service";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

interface Materia {
  idgrupo: number; idmateria: number; codigomateria: string;
  nombre: string; creditos: number; docente: string;
  cupomaximo: number; inscritos: number; ciclo: string;
}
interface MateriaBase { idmateria: number; codigo: string; nombre: string; }
interface Docente { iddocente: number; nombre: string; especialidad: string; grupos_asignados: number; }
interface Estudiante { idestudiante: number; carnet: string; nombre: string; idinscripcion: number; }
interface GrupoDisponible { idgrupo: number; cupomaximo: number; inscritos: number; ciclo: string; docente: string; }
interface Periodo { idperiodo: number; nombre: string; activo: boolean; }

const MATERIA_EMPTY = { codigo: "", nombre: "", descripcion: "", unidadesvalorativas: 3, horasteorias: 3, horaspracticas: 0, tipo: "OBLIGATORIA" };
const GRUPO_EMPTY   = { idmateria: 0, idperiodo: 0, iddocente: 0, numerogrupo: 1, cupomaximo: 30 };

export default function SubjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [materias, setMaterias]               = useState<Materia[]>([]);
  const [materiasBase, setMateriasBase]       = useState<MateriaBase[]>([]);
  const [docentes, setDocentes]               = useState<Docente[]>([]);
  const [periodos, setPeriodos]               = useState<Periodo[]>([]);
  const [estudiantes, setEstudiantes]         = useState<Estudiante[]>([]);
  const [gruposDisponibles, setGruposDisponibles] = useState<GrupoDisponible[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [searchTerm, setSearchTerm]           = useState("");
  const [saving, setSaving]                   = useState(false);

  // modales
  const [selectedMateria, setSelectedMateria]         = useState<Materia | null>(null);
  const [showDetalleModal, setShowDetalleModal]       = useState(false);
  const [showDocenteModal, setShowDocenteModal]       = useState(false);
  const [showMoverModal, setShowMoverModal]           = useState(false);
  const [showNuevaMateriaModal, setShowNuevaMateriaModal] = useState(false);
  const [showNuevoGrupoModal, setShowNuevoGrupoModal] = useState(false);

  const [selectedDocente, setSelectedDocente]         = useState("");
  const [selectedEstudiante, setSelectedEstudiante]   = useState<Estudiante | null>(null);
  const [selectedGrupoDestino, setSelectedGrupoDestino] = useState("");
  const [formMateria, setFormMateria]                 = useState(MATERIA_EMPTY);
  const [formGrupo, setFormGrupo]                     = useState(GRUPO_EMPTY);

  async function loadMaterias() {
    if (!user?.idUsuario) return;
    setLoading(true);
    const r = await getMaterias(user.idUsuario, user.rol);
    if (r.success) setMaterias(r.materias);
    setLoading(false);
  }

  useEffect(() => { loadMaterias(); }, [user]);

  const filtered = materias.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigomateria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.docente || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function openDocenteModal(m: Materia) {
    setSelectedMateria(m);
    const r = await getDocentes();
    if (r.success) setDocentes(r.docentes);
    setShowDocenteModal(true);
  }

  async function openMoverModal(m: Materia) {
    setSelectedMateria(m);
    const [eRes, gRes] = await Promise.all([getEstudiantesPorGrupo(m.idgrupo), getGruposDisponibles(m.idmateria)]);
    if (eRes.success) setEstudiantes(eRes.estudiantes);
    if (gRes.success) setGruposDisponibles(gRes.grupos);
    setShowMoverModal(true);
  }

  async function openNuevoGrupoModal() {
    const [mRes, dRes, pRes] = await Promise.all([getMateriasList(), getDocentes(), getPeriodos()]);
    if (mRes.success) setMateriasBase(mRes.materias);
    if (dRes.success) setDocentes(dRes.docentes);
    if (pRes.success) setPeriodos(pRes.periodos);
    setFormGrupo(GRUPO_EMPTY);
    setShowNuevoGrupoModal(true);
  }

  async function handleAsignarDocente() {
    if (!selectedMateria || !selectedDocente) return;
    setSaving(true);
    const r = await asignarDocente(selectedMateria.idgrupo, parseInt(selectedDocente));
    setSaving(false);
    if (r.success) { showToast("Docente asignado", "success"); setShowDocenteModal(false); loadMaterias(); }
    else showToast("Error al asignar docente", "error");
  }

  async function handleMoverEstudiante() {
    if (!selectedEstudiante || !selectedGrupoDestino) return;
    setSaving(true);
    const r = await moverEstudiante(selectedEstudiante.idinscripcion, parseInt(selectedGrupoDestino));
    setSaving(false);
    if (r.success) { showToast("Estudiante movido", "success"); setShowMoverModal(false); setSelectedEstudiante(null); }
    else showToast(r.message || "Error al mover", "error");
  }

  async function handleCrearMateria() {
    if (!formMateria.codigo || !formMateria.nombre || !formMateria.unidadesvalorativas) {
      showToast("Código, nombre y UV son obligatorios", "error"); return;
    }
    setSaving(true);
    const r = await crearMateria(formMateria);
    setSaving(false);
    if (r.success) { showToast("Materia creada correctamente", "success"); setShowNuevaMateriaModal(false); loadMaterias(); }
    else showToast(r.message || "Error al crear materia", "error");
  }

  async function handleCrearGrupo() {
    if (!formGrupo.idmateria || !formGrupo.idperiodo || !formGrupo.cupomaximo) {
      showToast("Materia, período y cupo son obligatorios", "error"); return;
    }
    setSaving(true);
    const r = await crearGrupo({ ...formGrupo, iddocente: formGrupo.iddocente || undefined });
    setSaving(false);
    if (r.success) { showToast("Grupo creado correctamente", "success"); setShowNuevoGrupoModal(false); loadMaterias(); }
    else showToast(r.message || "Error al crear grupo", "error");
  }

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!hasPermission(user?.rol, PERMISSIONS.MANAGE_SUBJECTS)) {
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
          <h1 className="text-2xl font-bold text-gray-800">📚 {isAdmin(user?.rol) ? "Gestión de Materias" : "Mis Materias"}</h1>
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">← Dashboard</Link>
        </header>

        <main className="flex-1 p-8">
          {!isAdmin(user?.rol) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              👨🏫 Mostrando solo las materias asignadas a ti.
            </div>
          )}

          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: isAdmin(user?.rol) ? "Total Grupos" : "Mis Grupos", value: materias.length, color: "text-blue-600" },
              { label: "Total Inscritos", value: materias.reduce((s, m) => s + parseInt(m.inscritos?.toString() ?? "0"), 0), color: "text-green-600" },
              { label: "Materias Distintas", value: [...new Set(materias.map(m => m.idmateria))].length, color: "text-indigo-600" },
              { label: "Cupos Disponibles", value: materias.reduce((s, m) => s + (m.cupomaximo - parseInt(m.inscritos?.toString() ?? "0")), 0), color: "text-yellow-600" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{loading ? "..." : s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* buscador y acciones */}
          <div className="flex justify-between items-center mb-4">
            <input type="search" placeholder="Buscar materia, código o docente..." className="input-ieproes max-w-sm"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            {isAdmin(user?.rol) && (
              <div className="flex gap-2">
                <button onClick={() => { setFormMateria(MATERIA_EMPTY); setShowNuevaMateriaModal(true); }} className="btn-ieproes text-sm py-2 px-4">
                  + Nueva Materia
                </button>
                <button onClick={openNuevoGrupoModal} className="btn-outline text-sm py-2 px-4">
                  + Nuevo Grupo
                </button>
              </div>
            )}
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-400">Cargando materias...</div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-400">No se encontraron materias</div>
            ) : filtered.map(m => (
              <div key={m.idgrupo} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">{m.codigomateria}</span>
                  <span className="text-xs text-gray-400">{m.ciclo}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3">{m.nombre}</h3>
                <div className="space-y-1 text-xs text-gray-600 mb-4">
                  <div className="flex justify-between"><span>Créditos:</span><span className="font-medium">{m.creditos} UV</span></div>
                  <div className="flex justify-between"><span>Docente:</span><span className="font-medium text-right">{m.docente || "Sin asignar"}</span></div>
                  <div className="flex justify-between">
                    <span>Inscritos:</span>
                    <span className={`font-medium ${parseInt(m.inscritos?.toString()) >= m.cupomaximo ? "text-red-500" : "text-green-600"}`}>
                      {m.inscritos} / {m.cupomaximo}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => { setSelectedMateria(m); setShowDetalleModal(true); }} className="btn-ieproes text-xs py-1 px-3 flex-1">
                    Ver Detalles
                  </button>
                  <Link href={`/grades?grupo=${m.idgrupo}`} className="flex-1">
                    <button className="btn-secondary text-xs py-1 px-3 w-full">📝 Notas</button>
                  </Link>
                  {isAdmin(user?.rol) && (
                    <>
                      <button onClick={() => openDocenteModal(m)} className="btn-secondary text-xs py-1 px-2" title="Asignar docente">👨🏫</button>
                      <button onClick={() => openMoverModal(m)} className="btn-secondary text-xs py-1 px-2" title="Mover estudiantes">🔄</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal detalles */}
      {showDetalleModal && selectedMateria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDetalleModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedMateria.nombre}</h2>
              <button onClick={() => setShowDetalleModal(false)} className="text-gray-400 text-2xl leading-none">&times;</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Código", selectedMateria.codigomateria], ["Créditos", `${selectedMateria.creditos} UV`], ["Ciclo", selectedMateria.ciclo], ["Inscritos", `${selectedMateria.inscritos} / ${selectedMateria.cupomaximo}`]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="font-semibold text-gray-800">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500">Docente Asignado</p>
              <p className="font-semibold text-gray-800">{selectedMateria.docente || "Sin asignar"}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/grades?grupo=${selectedMateria.idgrupo}`} className="flex-1">
                <button className="btn-ieproes w-full text-sm">📝 Gestionar Notas</button>
              </Link>
              {isAdmin(user?.rol) && (
                <>
                  <button onClick={() => { setShowDetalleModal(false); openDocenteModal(selectedMateria); }} className="btn-secondary text-sm px-3">👨🏫</button>
                  <button onClick={() => { setShowDetalleModal(false); openMoverModal(selectedMateria); }} className="btn-secondary text-sm px-3">🔄</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva materia */}
      {showNuevaMateriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNuevaMateriaModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📚 Nueva Materia</h2>
              <button onClick={() => setShowNuevaMateriaModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input type="text" className="input-ieproes" placeholder="Ej: MAT101"
                    value={formMateria.codigo} onChange={e => setFormMateria({ ...formMateria, codigo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UV *</label>
                  <input type="number" className="input-ieproes" min={1} max={12}
                    value={formMateria.unidadesvalorativas} onChange={e => setFormMateria({ ...formMateria, unidadesvalorativas: parseInt(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" className="input-ieproes" placeholder="Nombre completo de la materia"
                  value={formMateria.nombre} onChange={e => setFormMateria({ ...formMateria, nombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea className="input-ieproes" rows={2} placeholder="Descripción opcional"
                  value={formMateria.descripcion} onChange={e => setFormMateria({ ...formMateria, descripcion: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas Teóricas</label>
                  <input type="number" className="input-ieproes" min={0}
                    value={formMateria.horasteorias} onChange={e => setFormMateria({ ...formMateria, horasteorias: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas Prácticas</label>
                  <input type="number" className="input-ieproes" min={0}
                    value={formMateria.horaspracticas} onChange={e => setFormMateria({ ...formMateria, horaspracticas: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="input-ieproes" value={formMateria.tipo} onChange={e => setFormMateria({ ...formMateria, tipo: e.target.value })}>
                    <option value="OBLIGATORIA">Obligatoria</option>
                    <option value="OPTATIVA">Optativa</option>
                    <option value="LIBRE">Libre</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCrearMateria} disabled={saving} className="btn-ieproes flex-1">{saving ? "Guardando..." : "Crear Materia"}</button>
              <button onClick={() => setShowNuevaMateriaModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo grupo */}
      {showNuevoGrupoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNuevoGrupoModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">➕ Nuevo Grupo</h2>
              <button onClick={() => setShowNuevoGrupoModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materia *</label>
                <select className="input-ieproes" value={formGrupo.idmateria} onChange={e => setFormGrupo({ ...formGrupo, idmateria: parseInt(e.target.value) })}>
                  <option value={0}>Seleccionar materia...</option>
                  {materiasBase.map(m => <option key={m.idmateria} value={m.idmateria}>{m.codigo} - {m.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período *</label>
                <select className="input-ieproes" value={formGrupo.idperiodo} onChange={e => setFormGrupo({ ...formGrupo, idperiodo: parseInt(e.target.value) })}>
                  <option value={0}>Seleccionar período...</option>
                  {periodos.map(p => <option key={p.idperiodo} value={p.idperiodo}>{p.nombre}{p.activo ? " ✓ Activo" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                <select className="input-ieproes" value={formGrupo.iddocente} onChange={e => setFormGrupo({ ...formGrupo, iddocente: parseInt(e.target.value) })}>
                  <option value={0}>Sin asignar</option>
                  {docentes.map(d => <option key={d.iddocente} value={d.iddocente}>{d.nombre}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° Grupo *</label>
                  <input type="number" className="input-ieproes" min={1}
                    value={formGrupo.numerogrupo} onChange={e => setFormGrupo({ ...formGrupo, numerogrupo: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cupo Máximo *</label>
                  <input type="number" className="input-ieproes" min={1}
                    value={formGrupo.cupomaximo} onChange={e => setFormGrupo({ ...formGrupo, cupomaximo: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCrearGrupo} disabled={saving} className="btn-ieproes flex-1">{saving ? "Guardando..." : "Crear Grupo"}</button>
              <button onClick={() => setShowNuevoGrupoModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal asignar docente */}
      {showDocenteModal && selectedMateria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDocenteModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">👨🏫 Asignar Docente</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedMateria.nombre}</p>
            <select className="input-ieproes mb-4" value={selectedDocente} onChange={e => setSelectedDocente(e.target.value)}>
              <option value="">Seleccionar docente...</option>
              {docentes.map(d => <option key={d.iddocente} value={d.iddocente}>{d.nombre} ({d.grupos_asignados} grupos)</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAsignarDocente} disabled={!selectedDocente || saving} className="btn-ieproes flex-1">{saving ? "Asignando..." : "Asignar"}</button>
              <button onClick={() => setShowDocenteModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal mover estudiante */}
      {showMoverModal && selectedMateria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMoverModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">🔄 Mover Estudiante</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedMateria.nombre}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                <select className="input-ieproes" value={selectedEstudiante?.idestudiante || ""} onChange={e => setSelectedEstudiante(estudiantes.find(s => s.idestudiante === parseInt(e.target.value)) || null)}>
                  <option value="">Seleccionar...</option>
                  {estudiantes.map(e => <option key={e.idestudiante} value={e.idestudiante}>{e.carnet} - {e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Destino</label>
                <select className="input-ieproes" value={selectedGrupoDestino} onChange={e => setSelectedGrupoDestino(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {gruposDisponibles.map(g => <option key={g.idgrupo} value={g.idgrupo}>{g.ciclo} - {g.docente} ({g.inscritos}/{g.cupomaximo})</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleMoverEstudiante} disabled={!selectedEstudiante || !selectedGrupoDestino || saving} className="btn-ieproes flex-1">{saving ? "Moviendo..." : "Mover"}</button>
              <button onClick={() => setShowMoverModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
