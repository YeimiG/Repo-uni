const db = require("../../config/db");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const query = `
      SELECT u.idUsuario, u.correo, e.nombre, e.apellidos, e.idEstudiante, r.nombreRol
      FROM seguridad.Usuario u
      INNER JOIN academico.Estudiante e ON u.idUsuario = e.idUsuario
      INNER JOIN seguridad.Rol r ON u.idRol = r.idRol
      WHERE u.correo = $1 AND u.clave = $2
    `;
    const result = await db.query(query, [correo, clave]);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        usuario: result.rows[0]
      });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};