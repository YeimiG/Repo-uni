const db = require("../../config/db");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const query = `
      SELECT 
        u.idusuario, 
        u.correo, 
        r.nombrerol AS "nombreRol", 
        e.idestudiante, 
        p.primernombre AS nombre,
        p.primerapellido AS apellido
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      INNER JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      WHERE u.correo = $1 
        AND u.clave = $2 
        AND u.idrol = 6 -- Filtro para estudiante
        AND u.activo = TRUE;
    `;

    // IMPORTANTE: Asegúrate de que 'db.query' esté recibiendo los parámetros correctamente
    const result = await db.query(query, [correo, clave]);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        usuario: result.rows[0]
      });
    } else {
      // Si llega aquí, es porque el correo/clave no coinciden exactamente
      // o el idrol no es 6.
      res.status(401).json({ 
        success: false, 
        message: "Credenciales incorrectas o el usuario no es un estudiante activo." 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};