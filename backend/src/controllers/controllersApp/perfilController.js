const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;

    console.log("========== PERFIL ==========");
    console.log("ID RECIBIDO:", idUsuario);

    try {
        const query = `
            SELECT 
                p.primernombre AS nombre, 
                p.primerapellido AS apellidos, 
                c.nombre AS "nombreCarrera", 
                e.expediente, 
                e.indiceglobal AS cum, 
                e.porcentajeavance AS "porcentajeAvance",
                ee.nombre AS "estadoAcademico"
            FROM estudiantes.estudiante e
            INNER JOIN personas.persona p ON e.idpersona = p.idpersona
            INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
            INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
            WHERE e.idusuario = $1
        `;

        const result = await db.query(query, [idUsuario]);

        console.log("RESULTADO:", result.rows);

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