const express = require("express");
const router = express.Router();
const { getPeriodos, crearPeriodo, editarPeriodo, toggleActivo } = require("../../controllers/controllersWeb/periodoController");

router.get("/", getPeriodos);
router.post("/", crearPeriodo);
router.put("/:id", editarPeriodo);
router.patch("/:id/activar", toggleActivo);

module.exports = router;
