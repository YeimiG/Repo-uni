const express = require("express");
const router = express.Router();

// Importamos los controladores
const { login } = require("../controllers/controllersApp/loginControllerApp");
const { obtenerPerfilEstudiante } = require("../controllers/controllersApp/perfilController");

router.post("/login", login);


router.get("/perfil/:idUsuario", obtenerPerfilEstudiante);


module.exports = router;