const router = require("express").Router();
const { getMaterias, getMateriaById, crearMateria, editarMateria, crearGrupo } = require("../../controllers/controllersWeb/materiaController");
const { verificarToken, soloAdmin } = require("../../middlewares/authMiddleware");

router.get("/", getMaterias);
router.get("/:id", getMateriaById);
router.post("/", verificarToken, soloAdmin, crearMateria);
router.put("/:id", verificarToken, soloAdmin, editarMateria);
router.post("/grupos", verificarToken, soloAdmin, crearGrupo);

module.exports = router;
