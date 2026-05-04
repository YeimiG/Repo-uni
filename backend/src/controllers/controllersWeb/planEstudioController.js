const db = require("../../config/db");

exports.getPlanes = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT p.idplanestudio, p.codigo, p.nombre, p.añovigencia, p.resolucion,
             p.activo, c.nombre as carrera, p.idcarrera,
             COUNT(pm.idplanmateria) as total_materias
      FROM academico.planestudio p
      INNER JOIN academico.carrera c ON p.idcarrera = c.idcarrera
      LEFT JOIN academico.planmateria pm ON p.idplanestudio = pm.idplanestudio
      GROUP BY p.idplanestudio, c.nombre
      ORDER BY c.nombre, p.añovigencia DESC`);
    res.json({ success: true, planes: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearPlan = async (req, res) => {
  const { codigo, nombre, añovigencia, resolucion, idcarrera } = req.body;
  try {
    if (!codigo || !nombre || !añovigencia || !idcarrera)
      return res.status(400).json({ success: false, message: "Código, nombre, año y carrera son obligatorios" });
    const r = await db.query(
      `INSERT INTO academico.planestudio (codigo, nombre, añovigencia, resolucion, idcarrera, activo)
       VALUES ($1,$2,$3,$4,$5,false) RETURNING idplanestudio`,
      [codigo, nombre, añovigencia, resolucion || null, idcarrera]
    );
    res.json({ success: true, message: "Plan de estudio creado", idplanestudio: r.rows[0].idplanestudio });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarPlan = async (req, res) => {
  const { id } = req.params;
  const { nombre, resolucion, activo } = req.body;
  try {
    await db.query(
      `UPDATE academico.planestudio SET nombre=COALESCE($1,nombre), resolucion=COALESCE($2,resolucion), activo=COALESCE($3,activo) WHERE idplanestudio=$4`,
      [nombre, resolucion, activo, id]
    );
    res.json({ success: true, message: "Plan actualizado" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.togglePlanActivo = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await db.query(`SELECT idcarrera, activo FROM academico.planestudio WHERE idplanestudio=$1`, [id]);
    if (plan.rows.length === 0) return res.status(404).json({ success: false, message: "Plan no encontrado" });
    // Si se va a activar, desactiva los demás de la misma carrera
    if (!plan.rows[0].activo) {
      await db.query(`UPDATE academico.planestudio SET activo=false WHERE idcarrera=$1`, [plan.rows[0].idcarrera]);
    }
    const r = await db.query(`UPDATE academico.planestudio SET activo=NOT activo WHERE idplanestudio=$1 RETURNING activo`, [id]);
    res.json({ success: true, activo: r.rows[0].activo, message: r.rows[0].activo ? "Plan activado" : "Plan desactivado" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getMateriasDelPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const r = await db.query(`
      SELECT pm.idplanmateria, pm.ciclo, pm.semestre, pm.esobligatoria,
             m.idmateria, m.codigo, m.nombre, m.unidadesvalorativas as uv, m.tipo
      FROM academico.planmateria pm
      INNER JOIN academico.materia m ON pm.idmateria = m.idmateria
      WHERE pm.idplanestudio=$1
      ORDER BY pm.ciclo, m.nombre`, [id]);
    res.json({ success: true, materias: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.agregarMateriaAlPlan = async (req, res) => {
  const { id } = req.params;
  const { idmateria, ciclo, semestre, esobligatoria } = req.body;
  try {
    if (!idmateria || !ciclo) return res.status(400).json({ success: false, message: "Materia y ciclo son obligatorios" });
    const existe = await db.query(`SELECT idplanmateria FROM academico.planmateria WHERE idplanestudio=$1 AND idmateria=$2`, [id, idmateria]);
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "La materia ya está en este plan" });
    await db.query(
      `INSERT INTO academico.planmateria (idplanestudio, idmateria, ciclo, semestre, esobligatoria) VALUES ($1,$2,$3,$4,$5)`,
      [id, idmateria, ciclo, semestre || null, esobligatoria !== false]
    );
    res.json({ success: true, message: "Materia agregada al plan" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.quitarMateriaDelPlan = async (req, res) => {
  const { idplanmateria } = req.params;
  try {
    await db.query(`DELETE FROM academico.planmateria WHERE idplanmateria=$1`, [idplanmateria]);
    res.json({ success: true, message: "Materia quitada del plan" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
