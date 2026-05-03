const db = require("../../config/db");

exports.obtenerHorarios = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const result = await db.query(`
            SELECT
                m.nombre AS materia,
                m.codigo AS codigo,
                h.diasemana,
                TO_CHAR(h.horainicio, 'HH12:MI AM') AS hora_inicio,
                TO_CHAR(h.horafin, 'HH12:MI AM') AS hora_fin,
                h.tipo,
                s.nombre AS salon,
                s.ubicacion,
                COALESCE(p.primernombre || ' ' || p.primerapellido, 'Sin asignar') AS docente
            FROM inscripciones.inscripcion i
            INNER JOIN grupos.grupo g ON i.idgrupo = g.idgrupo
            INNER JOIN academico.materia m ON g.idmateria = m.idmateria
            INNER JOIN academico.periodoacademico per ON g.idperiodo = per.idperiodo
            INNER JOIN grupos.grupohorario gh ON g.idgrupo = gh.idgrupo
            INNER JOIN grupos.horario h ON gh.idhorario = h.idhorario
            LEFT JOIN grupos.salon s ON gh.idsalon = s.idsalon
            LEFT JOIN docentes.docente d ON g.iddocente = d.iddocente
            LEFT JOIN personas.persona p ON d.idpersona = p.idpersona
            WHERE i.idestudiante = (SELECT idestudiante FROM estudiantes.estudiante WHERE idusuario = $1)
              AND per.activo = true
              AND i.estado = 'INSCRITO'
            ORDER BY h.diasemana, h.horainicio
        `, [idUsuario]);

        res.json({ success: true, horarios: result.rows });
    } catch (error) {
        console.error("Error horarios:", error);
        res.status(500).json({ success: false, message: "Error al obtener horarios" });
    }
};
