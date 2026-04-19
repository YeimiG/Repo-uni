const express = require("express");
const router = express.Router();
const {
  getInscripciones, inscribir, retirar, getGruposParaInscribir
} = require("../../controllers/controllersWeb/inscripcionController");

router.get("/", getInscripciones);
router.post("/", inscribir);
router.get("/grupos", getGruposParaInscribir);
router.patch("/:idinscripcion/retirar", retirar);

module.exports = router;
