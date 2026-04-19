const express = require("express");
const router = express.Router();
const authMobile = require("../controllers/controllersApp/authMobileController");
const perfilMobile = require("../controllers/controllersApp/perfilController");
const notasMobile = require("../controllers/controllersApp/notasController");

// Ruta de Login
router.post("/login", authMobile.loginMobile);

// Ruta de Perfil
router.get("/perfil/:idUsuario", perfilMobile.obtenerPerfilEstudiante);

// Ruta de Notas (app móvil)
router.get("/actuales/:idUsuario", notasMobile.obtenerNotasActuales);

module.exports = router;