const express = require("express");
const router = express.Router();
const { getInscripciones, inscribir, retirar, getGruposParaInscribir } = require("../../controllers/controllersWeb/inscripcionController");
const { verificarToken } = require("../../middlewares/authMiddleware");

router.use(verificarToken);
router.get("/", getInscripciones);
router.post("/", inscribir);
router.get("/grupos", getGruposParaInscribir);
router.patch("/:idinscripcion/retirar", retirar);

module.exports = router;
