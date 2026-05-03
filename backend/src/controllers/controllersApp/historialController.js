const db = require("../../config/db");

exports.obtenerHistorial = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const result = await db.query(`
            SELECT
                per.nombre || '-' || per.numeroperiodo AS ciclo,
                per.año,
                m.codigo AS materia_codigo,
                m.nombre AS materia_nombre,
                m.unidadesvalorativas AS uv,
                nf.nota1, nf.nota2, nf.nota3, nf.nota4, nf.nota5,
                nf.notafinal AS promedio_final,
                nf.estado AS resultado
            FROM inscripciones.inscripcion i
            INNER JOIN grupos.grupo g ON i.idgrupo = g.idgrupo
            INNER JOIN academico.materia m ON g.idmateria = m.idmateria
            INNER JOIN academico.periodoacademico per ON g.idperiodo = per.idperiodo
            LEFT JOIN evaluaciones.notafinal nf ON i.idinscripcion = nf.idinscripcion
            WHERE i.idestudiante = (SELECT idestudiante FROM estudiantes.estudiante WHERE idusuario = $1)
              AND per.activo = false
            ORDER BY per.año DESC, per.numeroperiodo DESC, m.nombre
        `, [idUsuario]);

        // Agrupar por ciclo
        const porCiclo = {};
        result.rows.forEach(row => {
            const key = row.ciclo;
            if (!porCiclo[key]) porCiclo[key] = { ciclo: key, año: row.año, materias: [] };
            porCiclo[key].materias.push(row);
        });

        res.json({ success: true, historial: Object.values(porCiclo) });
    } catch (error) {
        console.error("Error historial:", error);
        res.status(500).json({ success: false, message: "Error al obtener historial" });
    }
};
