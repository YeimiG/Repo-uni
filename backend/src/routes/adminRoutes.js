const router = require("express").Router();
const {
  crearUsuario,
  crearEstudiante,
  crearCatedratico,
  getUsuarios,
  crearMateria
} = require("../controllers/adminController");

router.get("/usuarios", getUsuarios);
router.post("/usuarios", crearUsuario);
router.post("/estudiantes", crearEstudiante);
router.post("/catedraticos", crearCatedratico);
router.post("/materias", crearMateria);

module.exports = router;
