const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/usuarios", adminController.getUsuarios);
router.get("/docentes", adminController.getDocentes);
router.put("/grupos/:idgrupo/asignar-docente", adminController.asignarDocente);
router.put("/inscripciones/:idinscripcion/mover", adminController.moverEstudiante);
router.get("/materias/:idmateria/grupos-disponibles", adminController.getGruposDisponibles);

// Rutas de permisos y períodos
router.get("/periodos-notas", adminController.getPeriodosNotas);
router.put("/periodos-notas/:idPeriodo", adminController.actualizarPeriodo);
router.get("/permisos-edicion", adminController.getPermisosEdicion);
router.post("/permisos-edicion", adminController.habilitarPermiso);
router.put("/permisos-edicion/:idPermiso/resetear", adminController.resetearEdicion);

module.exports = router;
