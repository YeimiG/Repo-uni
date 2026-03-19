const db = require("../../config/db");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const query = `
      SELECT u.idusuario, u.correo, p.primernombre as nombre, p.primerapellido as apellidos,
             e.idestudiante, r.nombrerol as nombreRol
      FROM seguridad.usuario u
      INNER JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
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