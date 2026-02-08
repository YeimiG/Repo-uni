const db = require("../config/db");

exports.getRendimiento = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.nombre as materia,
        COUNT(n.idnota) as total_notas,
        ROUND(AVG(n.notafinal), 2) as promedio,
        COUNT(CASE WHEN n.notafinal >= 6 THEN 1 END) as aprobados,
        COUNT(CASE WHEN n.notafinal < 6 THEN 1 END) as reprobados
      FROM registro.notas n
      INNER JOIN registro.inscripcion i ON n.idinscripcion = i.idinscripcion
      INNER JOIN academico.grupo g ON i.idgrupo = g.idgrupo
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      WHERE n.notafinal IS NOT NULL
      GROUP BY m.nombre
      ORDER BY promedio DESC
    `;
    const result = await db.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("ERROR REPORTE:", error);
    res.status(500).json({ success: false, message: "Error al generar reporte" });
  }
};

exports.getEstadisticas = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM academico.estudiante) as estudiantes,
        (SELECT COUNT(*) FROM academico.docente) as docentes,
        (SELECT COUNT(*) FROM academico.materia) as materias,
        (SELECT COUNT(*) FROM registro.notas WHERE notafinal >= 6) as aprobados,
        (SELECT COUNT(*) FROM registro.notas WHERE notafinal < 6) as reprobados,
        (SELECT ROUND(AVG(notafinal), 2) FROM registro.notas WHERE notafinal IS NOT NULL) as promedio_general
    `);
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    console.error("ERROR ESTADISTICAS:", error);
    res.status(500).json({ success: false, message: "Error al obtener estadísticas" });
  }
};
