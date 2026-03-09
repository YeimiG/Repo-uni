const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const query = `
            SELECT 
                e.nombre, 
                e.apellidos, 
                e.expediente, 
                e."estadoAcademico" AS "estadoAcademico", 
                c."nombreCarrera" AS "nombreCarrera"
            FROM academico."Estudiante" e
            INNER JOIN academico."Carrera" c ON e."idCarrera" = c."idCarrera"
            WHERE e."idUsuario" = $1
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