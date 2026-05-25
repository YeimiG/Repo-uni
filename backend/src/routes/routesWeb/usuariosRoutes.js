const router = require("express").Router();
const usuarioController = require("../../controllers/controllersWeb/usuarioController");
const {
  verificarToken,
  soloAdmin,
} = require("../../middlewares/authMiddleware");

router.use(verificarToken);

// GET - Listar usuarios (con filtros opcionales)
router.get("/", soloAdmin, usuarioController.getUsuarios);

// GET - Obtener roles disponibles
router.get("/roles/list", usuarioController.getRoles);

// GET - Verificar disponibilidad de correo
router.get("/verificar/correo", usuarioController.verificarCorreo);

// GET - Obtener usuario por ID
router.get("/:id", usuarioController.getUsuarioById);

// POST - Crear nuevo usuario (admin)
router.post("/", soloAdmin, usuarioController.crearUsuario);

// PUT - Actualizar usuario (admin)
router.put("/:id", soloAdmin, usuarioController.actualizarUsuario);

// PATCH - Cambiar contraseña
router.patch("/:id/cambiar-contrasena", usuarioController.cambiarContrasena);

// PATCH - Activar/Desactivar usuario (admin)
router.patch("/:id/toggle", soloAdmin, usuarioController.toggleUsuario);

module.exports = router;
