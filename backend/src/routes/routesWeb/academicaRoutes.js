const express = require("express");
const router = express.Router();
const c = require("../../controllers/controllersWeb/academicaController");
const { verificarToken, soloAdmin } = require("../../middlewares/authMiddleware");

router.use(verificarToken);

// Seed status
router.get("/seed-status", c.getSeedStatus);

// Facultades
router.get("/facultades", c.getFacultades);
router.post("/facultades", soloAdmin, c.crearFacultad);
router.put("/facultades/:id", soloAdmin, c.editarFacultad);

// Escuelas
router.get("/escuelas", c.getEscuelas);
router.post("/escuelas", soloAdmin, c.crearEscuela);
router.put("/escuelas/:id", soloAdmin, c.editarEscuela);

// Carreras
router.get("/carreras", c.getCarreras);
router.post("/carreras", soloAdmin, c.crearCarrera);
router.put("/carreras/:id", soloAdmin, c.editarCarrera);

// Planes de estudio
router.get("/planes", c.getPlanes);
router.post("/planes", soloAdmin, c.crearPlan);
router.put("/planes/:id", soloAdmin, c.editarPlan);
router.patch("/planes/:id/toggle", soloAdmin, c.togglePlanActivo);
router.get("/planes/:id/materias", c.getMateriasDelPlan);
router.post("/planes/:id/materias", soloAdmin, c.agregarMateriaAlPlan);
router.delete("/planes/materias/:idplanmateria", soloAdmin, c.quitarMateriaDelPlan);

// Roles y estados
router.get("/roles", c.getRoles);
router.post("/roles", soloAdmin, c.crearRol);
router.get("/estados-estudiante", c.getEstadosEstudiante);
router.post("/estados-estudiante", soloAdmin, c.crearEstadoEstudiante);

module.exports = router;
