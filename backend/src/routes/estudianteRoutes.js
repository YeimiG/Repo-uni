const router = require("express").Router();
const {
  getEstudiantes,
  getEstudianteById,
  getPerfilEstudiante // <--- Verifica que el nombre sea IDÉNTICO al del controller
} = require("../controllers/estudianteController");

// Ruta para la lista general
router.get("/", getEstudiantes);

// Ruta específica para el perfil (La que usará la App)
router.get("/perfil/:id", getPerfilEstudiante);

// Ruta por ID general
router.get("/:id", getEstudianteById);

module.exports = router;