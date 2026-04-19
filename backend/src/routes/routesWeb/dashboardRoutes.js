const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/controllersWeb/dashboardController");

router.get("/stats", dashboardController.getStats);
router.get("/actividad", dashboardController.getActividad);

module.exports = router;
