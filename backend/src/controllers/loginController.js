// backend/src/controllers/authController.js
const db = require("../config/db");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const query = `
      SELECT u.idUsuario, u.correo, r.nombreRol, r.idRol,
             e.idEstudiante, e.nombre as nombreEstudiante, e.apellidos as apellidosEstudiante,
             c.idCatedratico, c.nombre as nombreCatedratico, c.apellidos as apellidosCatedratico
      FROM seguridad.Usuario u
      INNER JOIN seguridad.Rol r ON u.idRol = r.idRol
      LEFT JOIN academico.Estudiante e ON u.idUsuario = e.idUsuario
      LEFT JOIN academico.Catedratico c ON u.idUsuario = c.idUsuario
      WHERE u.correo = $1 AND u.clave = $2
    `;

    const result = await db.query(query, [correo, clave]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        usuario: {
          idUsuario: user.idusuario,
          correo: user.correo,
          rol: user.nombrerol,
          idRol: user.idrol,
          idEstudiante: user.idestudiante,
          idCatedratico: user.idcatedratico,
          nombre: user.nombreestudiante || user.nombrecatedratico,
          apellidos: user.apellidosestudiante || user.apellidoscatedratico
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};