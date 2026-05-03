const express = require("express");
const router = express.Router();
const { getPeriodos, crearPeriodo, editarPeriodo, toggleActivo } = require("../../controllers/controllersWeb/periodoController");
const { verificarToken, soloAdmin } = require("../../middlewares/authMiddleware");

router.use(verificarToken);
router.get("/", getPeriodos);
router.post("/", soloAdmin, crearPeriodo);
router.put("/:id", soloAdmin, editarPeriodo);
router.patch("/:id/activar", soloAdmin, toggleActivo);

module.exports = router;
