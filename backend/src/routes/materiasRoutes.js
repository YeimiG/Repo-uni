const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materiasController");

router.get("/", materiasController.getMaterias);
router.get("/:idgrupo/estudiantes", materiasController.getEstudiantesPorGrupo);
router.post("/notas", materiasController.guardarNotas);

module.exports = router;
