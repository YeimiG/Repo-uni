// Consolida todos los controladores que necesita academicaRoutes.js

const facultad    = require("./facultadController");
const escuela     = require("./escuelaController");
const carrera     = require("./carreraController");
const plan        = require("./planEstudioController");
const catalogo    = require("./catalogoController");

// Seed status
exports.getSeedStatus = catalogo.getSeedStatus;

// Facultades
exports.getFacultades  = facultad.getFacultades;
exports.crearFacultad  = facultad.crearFacultad;
exports.editarFacultad = facultad.editarFacultad;

// Escuelas
exports.getEscuelas  = escuela.getEscuelas;
exports.crearEscuela = escuela.crearEscuela;
exports.editarEscuela = escuela.editarEscuela;

// Carreras
exports.getCarreras  = carrera.getCarreras;
exports.crearCarrera = carrera.crearCarrera;
exports.editarCarrera = carrera.editarCarrera;

// Planes de estudio
exports.getPlanes          = plan.getPlanes;
exports.crearPlan          = plan.crearPlan;
exports.editarPlan         = plan.editarPlan;
exports.togglePlanActivo   = plan.togglePlanActivo;
exports.getMateriasDelPlan = plan.getMateriasDelPlan;
exports.agregarMateriaAlPlan = plan.agregarMateriaAlPlan;
exports.quitarMateriaDelPlan = plan.quitarMateriaDelPlan;

// Roles y estados
exports.getRoles               = catalogo.getRoles;
exports.crearRol               = catalogo.crearRol;
exports.getEstadosEstudiante   = catalogo.getEstadosEstudiante;
exports.crearEstadoEstudiante  = catalogo.crearEstadoEstudiante;
