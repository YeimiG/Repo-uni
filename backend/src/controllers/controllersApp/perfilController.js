const db = require("../../config/db");

exports.obtenerPerfilEstudiante = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const result = await db.query(
            `SELECT e.nombre, e.apellidos, e.expediente, c.nombreCarrera
             FROM academico.estudiante e
             INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
             WHERE e.idusuario = $1`,
            [idUsuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Datos de estudiante no encontrados" });
        }

        res.json({
            success: true,
            perfil: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener perfil" });
    }
};