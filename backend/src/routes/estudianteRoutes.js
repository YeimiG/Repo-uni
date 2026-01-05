const router = require("express").Router();
const {
  getEstudiantes,
  getEstudianteById,
//crearEstudiante
} = require("../controllers/estudianteController");

router.get("/", getEstudiantes);
router.get("/:id", getEstudianteById);
//router.post("/", crearEstudiante);

module.exports = router;
