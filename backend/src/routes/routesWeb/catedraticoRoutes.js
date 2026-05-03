const router = require("express").Router();
const { getMateriasCatedratico, getEstudiantesGrupo, ingresarNotas, getPermisosEdicion } = require("../../controllers/controllersWeb/catedraticoController");
const { verificarToken } = require("../../middlewares/authMiddleware");

router.use(verificarToken);
router.get("/materias/:idCatedratico", getMateriasCatedratico);
router.get("/estudiantes/:idGrupo", getEstudiantesGrupo);
router.post("/notas", ingresarNotas);
router.get("/permisos/:idCatedratico/:idGrupo", getPermisosEdicion);

module.exports = router;
