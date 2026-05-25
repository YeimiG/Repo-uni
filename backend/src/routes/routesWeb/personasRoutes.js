const router = require("express").Router();
const personaController = require("../../controllers/controllersWeb/personaController");
const {
  verificarToken,
  soloAdmin,
} = require("../../middlewares/authMiddleware");

router.use(verificarToken);

// GET - Listar personas (con filtros opcionales)
router.get("/", personaController.getPersonas);

// GET - Obtener personas disponibles para asignar
router.get("/disponibles/:tipo", personaController.getPersonasDisponibles);

// GET - Obtener persona por ID
router.get("/:id", personaController.getPersonaById);

// POST - Crear nueva persona (admin)
router.post("/", soloAdmin, personaController.crearPersona);

// PUT - Actualizar persona (admin)
router.put("/:id", soloAdmin, personaController.actualizarPersona);

// PATCH - Desactivar/Activar persona (admin)
router.patch("/:id/toggle", soloAdmin, personaController.desactivarPersona);

module.exports = router;
