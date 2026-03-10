const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;

    console.log("📌 ID recibido en la API:", idUsuario);

    try {

        // Verificamos primero si el estudiante existe
        const testQuery = `
            SELECT *
            FROM academico.estudiante
            WHERE idusuario = $1
        `;

        const testResult = await db.query(testQuery, [idUsuario]);

        console.log("🔎 Resultado estudiante:", testResult.rows);

        if (testResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No existe estudiante con ese idUsuario"
            });
        }

        // Consulta completa con carrera
        const query = `
            SELECT 
                e.nombre,
                e.apellidos,
                e.expediente,
                e.estadoacademico AS "estadoAcademico",
                c.nombrecarrera AS "nombreCarrera"
            FROM academico.estudiante e
            LEFT JOIN academico.carrera c
            ON e.idcarrera = c.idcarrera
            WHERE e.idusuario = $1
        `;

        const result = await db.query(query, [idUsuario]);

        console.log("✅ Resultado final perfil:", result.rows);

        res.json({
            success: true,
            perfil: result.rows[0]
        });

    } catch (error) {

        console.error("❌ ERROR EN PERFIL:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};