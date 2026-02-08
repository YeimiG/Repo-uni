const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");

router.get("/rendimiento", reportesController.getRendimiento);
router.get("/estadisticas", reportesController.getEstadisticas);

module.exports = router;
