const express = require("express");
const router = express.Router();
const { getRendimiento, getEstadisticas, getHistorialEstudiante } = require("../../controllers/controllersWeb/reportesController");
const { verificarToken } = require("../../middlewares/authMiddleware");

router.get("/rendimiento", verificarToken, getRendimiento);
router.get("/estadisticas", verificarToken, getEstadisticas);
router.get("/estudiante/:id", verificarToken, getHistorialEstudiante);

module.exports = router;
