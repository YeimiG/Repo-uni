const db = require("../../config/db");

// Obtener todas las inscripciones con info completa
exports.getInscripciones = async (req, res) => {
  try {
    const { idgrupo, idperiodo } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    let idx = 1;
    if (idgrupo)   { where += ` AND i.idgrupo = $${idx++}`;   params.push(idgrupo); }
    if (idperiodo) { where += ` AND g.idperiodo = $${idx++}`; params.push(idperiodo); }

    const result = await db.query(`
      SELECT
        i.idinscripcion, i.estado, i.fechainscripcion,
        e.idestudiante, e.expediente,
        p.primernombre || ' ' || p.primerapellido as estudiante,
        m.nombre as materia, m.codigo as codigomateria,
        g.idgrupo, g.numerogrupo,
        per.nombre || '-' || per.numeroperiodo as ciclo,
        COALESCE(nf.notafinal, null) as notafinal,
        COALESCE(nf.estado, null) as estadonota
      FROM inscripciones.inscripcion i
      INNER JOIN estudiantes.estudiante e ON i.idestudiante = e.idestudiante
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN grupos.grupo g ON i.idgrupo = g.idgrupo
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      INNER JOIN academico.periodoacademico per ON g.idperiodo = per.idperiodo
      LEFT JOIN evaluaciones.notafinal nf ON i.idinscripcion = nf.idinscripcion
      ${where}
      ORDER BY per.año DESC, per.numeroperiodo DESC, p.primerapellido
    `, params);

    res.json({ success: true, inscripciones: result.rows });
  } catch (error) {
    console.error("ERROR GET INSCRIPCIONES:", error);
    res.status(500).json({ success: false, message: "Error al obtener inscripciones" });
  }
};

// Inscribir estudiante a un grupo
exports.inscribir = async (req, res) => {
  const { idestudiante, idgrupo } = req.body;
  try {
    // Verificar que no esté ya inscrito
    const existe = await db.query(
      `SELECT idinscripcion FROM inscripciones.inscripcion WHERE idestudiante = $1 AND idgrupo = $2`,
      [idestudiante, idgrupo]
    );
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "El estudiante ya está inscrito en este grupo" });

    // Verificar cupo (cupoActual vs cupoMaximo)
    const grupo = await db.query(
      `SELECT cupoactual, cupomaximo FROM grupos.grupo WHERE idgrupo = $1`, [idgrupo]
    );
    if (grupo.rows.length === 0) return res.status(404).json({ success: false, message: "Grupo no encontrado" });
    const { cupoactual, cupomaximo } = grupo.rows[0];
    if (cupoactual >= cupomaximo) return res.status(400).json({ success: false, message: "El grupo no tiene cupo disponible" });

    const result = await db.query(
      `INSERT INTO inscripciones.inscripcion (idestudiante, idgrupo, estado, fechainscripcion)
       VALUES ($1, $2, 'INSCRITO', NOW()) RETURNING idinscripcion`,
      [idestudiante, idgrupo]
    );

    res.json({ success: true, message: "Estudiante inscrito correctamente", idinscripcion: result.rows[0].idinscripcion });
  } catch (error) {
    console.error("ERROR INSCRIBIR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retirar inscripción
exports.retirar = async (req, res) => {
  const { idinscripcion } = req.params;
  const { motivoRetiro } = req.body;
  try {
    await db.query(
      `UPDATE inscripciones.inscripcion SET estado = 'RETIRADO', fecharetiro = NOW(), motivoretiro = $1 WHERE idinscripcion = $2`,
      [motivoRetiro || "Retiro administrativo", idinscripcion]
    );
    res.json({ success: true, message: "Inscripción retirada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al retirar inscripción" });
  }
};

// Obtener grupos disponibles para inscribir (con cupo y periodo activo)
exports.getGruposParaInscribir = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        g.idgrupo, g.numerogrupo, g.cupomaximo, g.cupoactual,
        m.nombre as materia, m.codigo as codigomateria, m.unidadesvalorativas as uv,
        COALESCE(pd.primernombre || ' ' || pd.primerapellido, 'Sin asignar') as docente,
        per.nombre || '-' || per.numeroperiodo as ciclo, per.idperiodo
      FROM grupos.grupo g
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      INNER JOIN academico.periodoacademico per ON g.idperiodo = per.idperiodo
      LEFT JOIN docentes.docente d ON g.iddocente = d.iddocente
      LEFT JOIN personas.persona pd ON d.idpersona = pd.idpersona
      WHERE per.activo = true
        AND g.cupoactual < g.cupomaximo
        AND g.estado = 'ACTIVO'
      ORDER BY m.nombre, g.numerogrupo
    `);
    res.json({ success: true, grupos: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener grupos" });
  }
};
