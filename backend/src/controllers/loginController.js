const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const result = await db.query(
      `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol
       FROM seguridad.usuario u
       INNER JOIN seguridad.rol r ON u.idrol = r.idrol
       WHERE u.correo = $1`,
      [correo],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const usuario = result.rows[0];

    // 🚫 Bloquear estudiantes
    if (usuario.rol === "Estudiante" || usuario.rol === "ESTUDIANTE") {
      return res.status(403).json({
        success: false,
        message: "Acceso no autorizado",
      });
    }

    // 🔑 COMPARACIÓN DIRECTA (texto plano)
    if (clave !== usuario.clave) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    // 🔐 JWT
    const token = jwt.sign(
      {
        idUsuario: usuario.idusuario,
        rol: usuario.rol,
      },
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
        nombre: usuario.correo.split('@')[0],
        apellidos: '',
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
