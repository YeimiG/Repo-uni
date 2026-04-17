const express = require("express");
const router = express.Router();

// Importamos los controladores
const { login } = require("../controllers/controllersApp/loginControllerApp");
const { obtenerPerfilEstudiante } = require("../controllers/controllersApp/perfilController");
const {obtenerNotasActuales } = require("../controllers/notasController");

router.post("/login", login);


router.get("/perfil/:idUsuario", obtenerPerfilEstudiante);

router.get("/actuales/:idUsuario", obtenerNotasActuales);

module.exports = router;