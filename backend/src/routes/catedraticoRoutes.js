const router = require("express").Router();
const {
  getMateriasCatedratico,
  getEstudiantesGrupo,
  ingresarNotas
} = require("../controllers/catedraticoController");

router.get("/materias/:idCatedratico", getMateriasCatedratico);
router.get("/estudiantes/:idGrupo", getEstudiantesGrupo);
router.post("/notas", ingresarNotas);

module.exports = router;
