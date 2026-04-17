const db = require("../../config/db");

exports.obtenerNotasActuales = async (req, res) => {
    // Recibimos el idUsuario (el del login)
    const { idUsuario } = req.params;

    try {
        // La consulta que validamos en pgAdmin con el filtro 'ACTIVA'
        const query = `
            SELECT 
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                m.unidadesValorativas AS uv,
                nf.nota1, nf.nota2, nf.nota3, nf.nota4, nf.nota5,
                nf.notaFinal AS promedio_actual,
                nf.estado AS estado_nota,
                ( (CASE WHEN nf.nota1 IS NOT NULL THEN 1 ELSE 0 END +
                   CASE WHEN nf.nota2 IS NOT NULL THEN 1 ELSE 0 END +
                   CASE WHEN nf.nota3 IS NOT NULL THEN 1 ELSE 0 END +
                   CASE WHEN nf.nota4 IS NOT NULL THEN 1 ELSE 0 END +
                   CASE WHEN nf.nota5 IS NOT NULL THEN 1 ELSE 0 END) * 20 ) AS porcentaje_completado
            FROM inscripciones.Inscripcion i
            INNER JOIN grupos.Grupo g ON i.idGrupo = g.idGrupo
            INNER JOIN academico.Materia m ON g.idMateria = m.idMateria
            LEFT JOIN evaluaciones.NotaFinal nf ON i.idInscripcion = nf.idInscripcion
            WHERE i.idEstudiante = (SELECT idEstudiante FROM estudiantes.Estudiante WHERE idUsuario = $1)
              AND i.estado ILIKE 'ACTIVA';
        `;

        const result = await db.query(query, [idUsuario]);
        const notas = result.rows;

        // --- LÓGICA DE CÁLCULOS PARA EL RESUMEN INFERIOR ---
        let totalUV = 0;
        let sumaPonderada = 0;

        notas.forEach(materia => {
            const uv = parseInt(materia.uv || 0);
            const nota = parseFloat(materia.promedio_actual || 0);
            
            totalUV += uv;
            sumaPonderada += (nota * uv);
        });

        const cumCiclo = totalUV > 0 ? (sumaPonderada / totalUV).toFixed(2) : "0.0";

        // Enviamos todo en un solo paquete
        res.json({
            success: true,
            data: {
                notas,
                resumen: {
                    totalUV: totalUV.toFixed(1),
                    notaUV: sumaPonderada.toFixed(1),
                    cumCiclo: cumCiclo
                }
            }
        });

    } catch (error) {
        console.error("Error en obtenerNotasActuales:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las calificaciones del ciclo."
        });
    }
};