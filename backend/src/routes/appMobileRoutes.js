const express = require("express");
const router = express.Router();
const authMobile = require("../controllers/controllersApp/authMobileController");
const perfilMobile = require("../controllers/controllersApp/perfilController");

// Ruta de Login
router.post("/login", authMobile.loginMobile);

// Ruta de Perfil
router.get("/perfil/:idUsuario", perfilMobile.obtenerPerfilEstudiante);

module.exports = router;