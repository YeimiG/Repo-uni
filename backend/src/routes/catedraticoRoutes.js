const router = require("express").Router();
const {
  getMateriasCatedratico,
  getEstudiantesGrupo,
  ingresarNotas,
  getPermisosEdicion
} = require("../controllers/catedraticoController");

router.get("/materias/:idCatedratico", getMateriasCatedratico);
router.get("/estudiantes/:idGrupo", getEstudiantesGrupo);
router.post("/notas", ingresarNotas);
router.get("/permisos/:idCatedratico/:idGrupo", getPermisosEdicion);

module.exports = router;
