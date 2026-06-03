const db = require("../../config/db");

exports.obtenerNotasActuales = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const query = `
            SELECT 
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                m.unidadesvalorativas AS uv,

                nf.nota1,
                nf.nota2,
                nf.nota3,
                nf.nota4,
                nf.nota5,

                nf.notafinal AS promedio_actual,
                nf.estado AS estado_nota

            FROM inscripciones.inscripcion i

            INNER JOIN grupos.grupo g
                ON i.idgrupo = g.idgrupo

            INNER JOIN academico.materia m
                ON g.idmateria = m.idmateria

            LEFT JOIN evaluaciones.notafinal nf
                ON i.idinscripcion = nf.idinscripcion

            WHERE i.idestudiante = (
                SELECT e.idestudiante
                FROM estudiantes.estudiante e
                WHERE e.idusuario = $1
            )
            AND i.estado = 'INSCRITO';
        `;

    const result = await db.query(query, [idUsuario]);

    // calcular resumen
    let totalUV = 0;
    let notaUV = 0;

    result.rows.forEach((m) => {
      const uv = parseFloat(m.uv || 0);
      const nota = parseFloat(m.promedio_actual || 0);

      totalUV += uv;
      notaUV += nota * uv;
    });

    const cumCiclo = totalUV > 0 ? (notaUV / totalUV).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        notas: result.rows,
        resumen: {
          totalUV: totalUV.toFixed(2),
          notaUV: notaUV.toFixed(2),
          cumCiclo,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo notas:", error);

    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
