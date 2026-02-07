const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    // Contar estudiantes
    const estudiantes = await db.query(`
      SELECT COUNT(*) as total 
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      WHERE r.nombrerol IN ('Estudiante', 'ESTUDIANTE')
    `);

    // Contar catedráticos
    const catedraticos = await db.query(`
      SELECT COUNT(*) as total 
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      WHERE r.nombrerol = 'Catedrático'
    `);

    // Contar materias (asumiendo que existe tabla materia)
    const materias = await db.query(`
      SELECT COUNT(*) as total 
      FROM academico.materia
    `);

    // Contar notas (asumiendo que existe tabla nota)
    const notas = await db.query(`
      SELECT COUNT(*) as total 
      FROM academico.nota
    `);

    res.json({
      success: true,
      stats: {
        estudiantes: parseInt(estudiantes.rows[0].total) || 0,
        catedraticos: parseInt(catedraticos.rows[0].total) || 0,
        materias: parseInt(materias.rows[0].total) || 0,
        notas: parseInt(notas.rows[0].total) || 0,
      },
    });
  } catch (error) {
    console.error("ERROR STATS:", error);
    res.json({
      success: true,
      stats: {
        estudiantes: 0,
        catedraticos: 0,
        materias: 0,
        notas: 0,
      },
    });
  }
};
