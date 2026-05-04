const db = require("../../config/db");

exports.getRoles = async (req, res) => {
  try {
    const r = await db.query(`SELECT idrol, nombrerol, descripcion, niveljerarquico, activo FROM seguridad.rol ORDER BY niveljerarquico`);
    res.json({ success: true, roles: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearRol = async (req, res) => {
  const { nombrerol, descripcion, niveljerarquico } = req.body;
  try {
    if (!nombrerol) return res.status(400).json({ success: false, message: "El nombre del rol es obligatorio" });
    const r = await db.query(
      `INSERT INTO seguridad.rol (nombrerol, descripcion, niveljerarquico, activo) VALUES ($1,$2,$3,true) RETURNING idrol`,
      [nombrerol.toUpperCase(), descripcion || null, niveljerarquico || 0]
    );
    res.json({ success: true, message: "Rol creado", idrol: r.rows[0].idrol });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarRol = async (req, res) => {
  const { id } = req.params;
  const { descripcion, niveljerarquico, activo } = req.body;
  try {
    await db.query(
      `UPDATE seguridad.rol SET descripcion=COALESCE($1,descripcion), niveljerarquico=COALESCE($2,niveljerarquico), activo=COALESCE($3,activo) WHERE idrol=$4`,
      [descripcion, niveljerarquico, activo, id]
    );
    res.json({ success: true, message: "Rol actualizado" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getEstadosEstudiante = async (req, res) => {
  try {
    const r = await db.query(`SELECT idestado, nombre, descripcion, activo FROM estudiantes.estadoestudiante ORDER BY nombre`);
    res.json({ success: true, estados: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearEstadoEstudiante = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    const r = await db.query(
      `INSERT INTO estudiantes.estadoestudiante (nombre, descripcion, activo) VALUES ($1,$2,true) RETURNING idestado`,
      [nombre.toUpperCase(), descripcion || null]
    );
    res.json({ success: true, message: "Estado creado", idestado: r.rows[0].idestado });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarEstadoEstudiante = async (req, res) => {
  const { id } = req.params;
  const { descripcion, activo } = req.body;
  try {
    await db.query(
      `UPDATE estudiantes.estadoestudiante SET descripcion=COALESCE($1,descripcion), activo=COALESCE($2,activo) WHERE idestado=$3`,
      [descripcion, activo, id]
    );
    res.json({ success: true, message: "Estado actualizado" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getSeedStatus = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM seguridad.rol)                    as roles,
        (SELECT COUNT(*) FROM seguridad.usuario)                as usuarios,
        (SELECT COUNT(*) FROM personas.persona)                 as personas,
        (SELECT COUNT(*) FROM estudiantes.estadoestudiante)     as estados_estudiante,
        (SELECT COUNT(*) FROM estudiantes.estudiante)           as estudiantes,
        (SELECT COUNT(*) FROM docentes.docente)                 as docentes,
        (SELECT COUNT(*) FROM academico.facultad)               as facultades,
        (SELECT COUNT(*) FROM academico.escuela)                as escuelas,
        (SELECT COUNT(*) FROM academico.carrera)                as carreras,
        (SELECT COUNT(*) FROM academico.planestudio)            as planes,
        (SELECT COUNT(*) FROM academico.materia)                as materias,
        (SELECT COUNT(*) FROM grupos.grupo)                     as grupos,
        (SELECT COUNT(*) FROM inscripciones.inscripcion)        as inscripciones,
        (SELECT COUNT(*) FROM evaluaciones.notafinal)           as notas
    `);
    res.json({ success: true, conteos: r.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
