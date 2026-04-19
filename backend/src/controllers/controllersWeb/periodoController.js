const db = require("../../config/db");

exports.getPeriodos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT idperiodo, nombre, año, numeroperiodo, fechainicio, fechafin,
             fechainicioinscripciones, fechafininscripciones, estado, activo
      FROM academico.periodoacademico
      ORDER BY año DESC, numeroperiodo DESC
    `);
    res.json({ success: true, periodos: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener períodos" });
  }
};

exports.crearPeriodo = async (req, res) => {
  const { nombre, año, numeroperiodo, fechainicio, fechafin, fechainicioinscripciones, fechafininscripciones } = req.body;
  try {
    const existe = await db.query(
      `SELECT idperiodo FROM academico.periodoacademico WHERE año = $1 AND numeroperiodo = $2`,
      [año, numeroperiodo]
    );
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "Ya existe un período para ese año y número" });

    const result = await db.query(`
      INSERT INTO academico.periodoacademico
        (nombre, año, numeroperiodo, fechainicio, fechafin, fechainicioinscripciones, fechafininscripciones, estado, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PLANIFICADO', false)
      RETURNING idperiodo
    `, [nombre, año, numeroperiodo, fechainicio, fechafin, fechainicioinscripciones || null, fechafininscripciones || null]);

    res.json({ success: true, message: "Período creado correctamente", idperiodo: result.rows[0].idperiodo });
  } catch (error) {
    console.error("ERROR CREAR PERIODO:", error);
    res.status(500).json({ success: false, message: "Error al crear período" });
  }
};

exports.editarPeriodo = async (req, res) => {
  const { id } = req.params;
  const { nombre, fechainicio, fechafin, fechainicioinscripciones, fechafininscripciones, estado } = req.body;
  try {
    await db.query(`
      UPDATE academico.periodoacademico
      SET nombre = COALESCE($1, nombre),
          fechainicio = COALESCE($2, fechainicio),
          fechafin = COALESCE($3, fechafin),
          fechainicioinscripciones = COALESCE($4, fechainicioinscripciones),
          fechafininscripciones = COALESCE($5, fechafininscripciones),
          estado = COALESCE($6, estado)
      WHERE idperiodo = $7
    `, [nombre, fechainicio, fechafin, fechainicioinscripciones, fechafininscripciones, estado, id]);
    res.json({ success: true, message: "Período actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al editar período" });
  }
};

exports.toggleActivo = async (req, res) => {
  const { id } = req.params;
  try {
    // Solo un período puede estar activo a la vez
    await db.query(`UPDATE academico.periodoacademico SET activo = false`);
    const result = await db.query(
      `UPDATE academico.periodoacademico SET activo = true, estado = 'ACTIVO' WHERE idperiodo = $1 RETURNING activo`,
      [id]
    );
    res.json({ success: true, message: "Período activado correctamente", activo: result.rows[0].activo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al activar período" });
  }
};
