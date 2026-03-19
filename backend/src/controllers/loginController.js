const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const result = await db.query(
      `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol,
              COALESCE(pd.primernombre, pe.primernombre, u.correo) as nombre,
              COALESCE(pd.primerapellido, pe.primerapellido, '') as apellidos
       FROM seguridad.usuario u
       INNER JOIN seguridad.rol r ON u.idrol = r.idrol
       LEFT JOIN docentes.docente d ON u.idusuario = d.idusuario
       LEFT JOIN personas.persona pd ON d.idpersona = pd.idpersona
       LEFT JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
       LEFT JOIN personas.persona pe ON e.idpersona = pe.idpersona
       WHERE u.correo = $1`,
      [correo],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const usuario = result.rows[0];

    if (usuario.rol === "ESTUDIANTE" || usuario.rol === "TUTOR") {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    if (clave !== usuario.clave) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { idUsuario: usuario.idusuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      success: true,
      token,
      usuario: {
        idUsuario: usuario.idusuario,
        correo: usuario.correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        primerLogin: false,
      },
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
