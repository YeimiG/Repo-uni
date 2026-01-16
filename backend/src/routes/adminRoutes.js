const router = require("express").Router();
const {
  crearUsuario,
  crearEstudiante,
  crearCatedratico,
  getUsuarios,
  crearMateria
} = require("../controllers/adminController");

router.post("/usuarios", crearUsuario);
router.post("/estudiantes", crearEstudiante);
router.post("/catedraticos", crearCatedratico);
router.get("/usuarios", getUsuarios);
router.post("/materias", crearMateria);

module.exports = router;
