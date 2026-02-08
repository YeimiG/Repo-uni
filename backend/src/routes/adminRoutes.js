const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/usuarios", adminController.getUsuarios);
router.get("/docentes", adminController.getDocentes);
router.put("/grupos/:idgrupo/asignar-docente", adminController.asignarDocente);
router.put("/inscripciones/:idinscripcion/mover", adminController.moverEstudiante);
router.get("/materias/:idmateria/grupos-disponibles", adminController.getGruposDisponibles);

module.exports = router;
