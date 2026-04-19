const router = require("express").Router();
const {
  getMaterias,
  getMateriaById,
//  crearMateria
} = require("../../controllers/controllersWeb/materiaController");

router.get("/", getMaterias);
router.get("/:id", getMateriaById);
//router.post("/", crearMateria);

module.exports = router;
