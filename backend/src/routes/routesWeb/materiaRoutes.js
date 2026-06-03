const router = require("express").Router();
const {
  getMaterias,
  getMateriaById,
  crearMateria,
  editarMateria,
  toggleMateriaActive,
  crearGrupo,
} = require("../../controllers/controllersWeb/materiaController");
const {
  verificarToken,
  soloAdmin,
} = require("../../middlewares/authMiddleware");

// Rutas sin param primero para evitar que /:id capture 'grupos'
router.get("/", getMaterias);
router.post("/", verificarToken, soloAdmin, crearMateria);
router.post("/grupos", verificarToken, soloAdmin, crearGrupo);
router.get("/:id", getMateriaById);
router.put("/:id", verificarToken, soloAdmin, editarMateria);
router.patch(
  "/:id/toggle-active",
  verificarToken,
  soloAdmin,
  toggleMateriaActive,
);

module.exports = router;
