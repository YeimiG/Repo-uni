const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    // Contar estudiantes
    const estudiantes = await db.query(`
      SELECT COUNT(*) as total FROM academico.estudiante
    `);

    // Contar catedráticos/docentes
    const catedraticos = await db.query(`
      SELECT COUNT(*) as total FROM academico.docente
    `);

    // Contar materias
    const materias = await db.query(`
      SELECT COUNT(*) as total FROM academico.materia
    `);

    // Contar notas
    const notas = await db.query(`
      SELECT COUNT(*) as total FROM registro.notas
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

exports.getActividad = async (req, res) => {
  try {
    const actividades = [];

    // Últimas inscripciones
    const inscripciones = await db.query(`
      SELECT 
        i.fechainscripcion,
        e.nombre || ' ' || e.apellidos as estudiante,
        m.nombre as materia
      FROM registro.inscripcion i
      INNER JOIN academico.estudiante e ON i.idestudiante = e.idestudiante
      INNER JOIN academico.grupo g ON i.idgrupo = g.idgrupo
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      ORDER BY i.fechainscripcion DESC
      LIMIT 3
    `);

    inscripciones.rows.forEach(row => {
      actividades.push({
        tipo: 'inscripcion',
        mensaje: `${row.estudiante} se inscribió en ${row.materia}`,
        fecha: row.fechainscripcion,
        icono: 'info'
      });
    });

    // Últimas notas actualizadas
    const notasRecientes = await db.query(`
      SELECT 
        n.notafinal,
        e.nombre || ' ' || e.apellidos as estudiante,
        m.nombre as materia
      FROM registro.notas n
      INNER JOIN registro.inscripcion i ON n.idinscripcion = i.idinscripcion
      INNER JOIN academico.estudiante e ON i.idestudiante = e.idestudiante
      INNER JOIN academico.grupo g ON i.idgrupo = g.idgrupo
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      WHERE n.notafinal IS NOT NULL
      ORDER BY n.idnota DESC
      LIMIT 2
    `);

    notasRecientes.rows.forEach(row => {
      actividades.push({
        tipo: 'nota',
        mensaje: `Nota actualizada en ${row.materia}`,
        detalle: `${row.estudiante} - Nota: ${row.notafinal}`,
        icono: 'success'
      });
    });

    // Ordenar por más reciente
    actividades.sort((a, b) => {
      if (a.fecha && b.fecha) return new Date(b.fecha) - new Date(a.fecha);
      return 0;
    });

    res.json({
      success: true,
      actividades: actividades.slice(0, 5),
    });
  } catch (error) {
    console.error("ERROR ACTIVIDAD:", error);
    res.json({
      success: true,
      actividades: [],
    });
  }
};
