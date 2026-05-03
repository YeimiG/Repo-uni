const express = require("express");
const router = express.Router();
const authMobile    = require("../../controllers/controllersApp/authMobileController");
const perfilMobile  = require("../../controllers/controllersApp/perfilController");
const notasMobile   = require("../../controllers/controllersApp/notasController");
const horarios      = require("../../controllers/controllersApp/horariosController");
const pagos         = require("../../controllers/controllersApp/pagosController");
const historial     = require("../../controllers/controllersApp/historialController");
const { verificarToken } = require("../../middlewares/authMiddleware");

// ── Rutas públicas (sin token) ────────────────────────────
router.post("/login", authMobile.loginMobile);

// ── Rutas protegidas (requieren token) ───────────────────
router.use(verificarToken);

router.get("/perfil/:idUsuario",    perfilMobile.obtenerPerfilEstudiante);
router.get("/actuales/:idUsuario",  notasMobile.obtenerNotasActuales);
router.get("/horarios/:idUsuario",  horarios.obtenerHorarios);
router.get("/pagos/:idUsuario",     pagos.obtenerPagos);
router.get("/historial/:idUsuario", historial.obtenerHistorial);

// Logout — invalida el token del lado del cliente (stateless)
router.post("/logout", (req, res) => {
    res.json({ success: true, message: "Sesión cerrada correctamente" });
});

module.exports = router;
