const router = require("express").Router();
const {
  getEstudiantes, getEstudianteById, crearEstudiante,
  editarEstudiante, toggleEstudiante,
  getCarreras, getEstadosEstudiante, getPerfilEstudiante
} = require("../../controllers/controllersWeb/estudianteController");

router.get("/", getEstudiantes);
router.post("/", crearEstudiante);
router.get("/carreras", getCarreras);
router.get("/estados", getEstadosEstudiante);
router.get("/perfil/:id", getPerfilEstudiante);
router.get("/:id", getEstudianteById);
router.put("/:id", editarEstudiante);
router.patch("/:id/toggle", toggleEstudiante);

module.exports = router;
