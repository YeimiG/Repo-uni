const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        // CORRECCIÓN: Cambiamos academico.estudiante por estudiantes.estudiante
        const query = `
            SELECT 
                p.primernombre AS nombre,
                p.primerapellido AS apellidos,
                e.expediente,
                ee.nombre AS "estadoAcademico",
                c.nombre AS "nombreCarrera"
            FROM estudiantes.estudiante e
            INNER JOIN personas.persona p ON e.idpersona = p.idpersona
            INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
            INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
            WHERE e.idusuario = $1;
        `;

        const result = await db.query(query, [idUsuario]);

        if (result.rows.length > 0) {
            res.json({
                success: true,
                perfil: result.rows[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No se encontró el perfil para el ID proporcionado."
            });
        }
    } catch (error) {
        console.error("Error en SQL:", error.message);
        res.status(500).json({
            success: false,
            error: error.message // Aquí es donde te salía el error de la relación
        });
    }
};