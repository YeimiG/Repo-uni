const router = require("express").Router();
const docenteController = require("../../controllers/controllersWeb/docenteController");
const {
  verificarToken,
  soloAdmin,
} = require("../../middlewares/authMiddleware");

router.use(verificarToken);

// GET - Listar docentes (con filtros opcionales)
router.get("/", docenteController.getDocentes);

// GET - Obtener docente por ID
router.get("/:id", docenteController.getDocenteById);

// GET - Obtener grupos asignados al docente
router.get("/:id/grupos", docenteController.getGruposDocente);

// POST - Crear nuevo docente (admin)
router.post("/", soloAdmin, docenteController.crearDocente);

// PUT - Actualizar docente (admin)
router.put("/:id", soloAdmin, docenteController.actualizarDocente);

// PATCH - Activar/Desactivar docente (admin)
router.patch("/:id/toggle", soloAdmin, docenteController.toggleDocente);

module.exports = router;
