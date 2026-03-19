const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;
    try {
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
            WHERE e.idusuario = $1
        `;
        const result = await db.query(query, [idUsuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Perfil no encontrado" });
        }

        res.json({
            success: true,
            perfil: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};