const express = require("express");
const router = express.Router();
// Subimos dos niveles (../../) para llegar a controllers/controllersApp
const { login } = require("../../controllers/controllersApp/loginControllerApp.js");
const { obtenerPerfilEstudiante } = require("../../controllers/controllersApp/perfilController.js");

router.post("/login", login);
router.get("/perfil/:idUsuario", obtenerPerfilEstudiante);

module.exports = router;