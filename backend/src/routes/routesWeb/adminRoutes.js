const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/controllersWeb/adminController");
const { verificarToken, soloAdmin } = require("../../middlewares/authMiddleware");

router.use(verificarToken);

router.get("/usuarios", adminController.getUsuarios);
router.get("/docentes", adminController.getDocentes);
router.put("/grupos/:idgrupo/asignar-docente", soloAdmin, adminController.asignarDocente);
router.put("/inscripciones/:idinscripcion/mover", soloAdmin, adminController.moverEstudiante);
router.get("/materias/:idmateria/grupos-disponibles", adminController.getGruposDisponibles);
router.get("/periodos-notas", adminController.getPeriodosNotas);
router.put("/periodos-notas/:idPeriodo", soloAdmin, adminController.actualizarPeriodo);
router.get("/permisos-edicion", adminController.getPermisosEdicion);
router.post("/permisos-edicion", soloAdmin, adminController.habilitarPermiso);
router.put("/permisos-edicion/:idPermiso/resetear", soloAdmin, adminController.resetearEdicion);
router.get("/roles", adminController.getRoles);
router.post("/usuarios", adminController.crearUsuario);
router.put("/usuarios/:idusuario", adminController.editarUsuario);
router.patch("/usuarios/:idusuario/toggle", adminController.toggleUsuario);

module.exports = router;
