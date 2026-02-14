const express = require("express");
const router = express.Router();
// Subimos dos niveles (../../) para llegar a controllers/controllersApp
const { login } = require("../../controllers/controllersApp/loginControllerApp.js");

router.post("/login", login);

module.exports = router;